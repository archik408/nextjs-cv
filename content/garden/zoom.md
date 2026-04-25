---
title: Улучшение просмотра изображений
description: Основной принцип это максимизация области просмотра
date: 2025-12-30
tags: [javascript, typescript, zoom, a11y, programming]
---

## Основной принцип: максимизация области просмотра

Если в основе функционала вашего приложения, как и моего, лежит работа с изображениями, то для пользователей критически важно иметь возможность хорошо рассмотреть приложенные иллюстрации или фотографии.

Нужно делать изображение максимально большим, используя всё доступное пространство экрана. На первый взгляд, здесь нет никакой магии — достаточно базовых CSS-правил:

```css
height: auto;
width: auto;
max-width: 100%;
max-height: 100%;
object-fit: contain;
```

Однако на практике пользователи часто просят нетипичные, но важные функции.

## Исторический контекст: Art Direction как забытый подход

Прежде чем перейти к современным решениям, стоит вспомнить о подходе [Art Direction (художественное направление)](https://dev.to/marklchaves/what-is-art-direction-and-how-to-use-it-1o3n), который раньше был распространённой практикой в веб-разработке, но сейчас упоминается редко.

Суть подхода заключалась в том, что изображения не просто растягивали или сжимали для разных экранов, а использовали физически разные файлы, специально подготовленные для различных устройств:

- Для десктопов — горизонтальные (landscape) изображения, показывающие полную сцену, пейзаж, общий контекст
- Для мобильных — вертикальные (portrait) или кадрированные версии, сфокусированные на ключевом элементе, главном объекте или актёре

![Разные варианты одного и того же изображения для Art Direction](/garden/zoom/art-direction.webp)

Этот подход напоминает интересную параллель из кинематографа: несколько лет назад обсуждалась идея адаптации фильмов для мобильных устройств — не просто изменение соотношения сторон, а перекадрирование сцен так, чтобы на маленьком экране фокус смещался с общего плана на детали, эмоции актёров и ключевые элементы действия, сохраняя при этом повествовательную целостность.

Сегодня Art Direction в чистом виде используется реже из-за сложности поддержки (несколько версий каждого изображения) и распространения адаптивных CSS-решений. Однако его философия остаётся актуальной: контент должен быть не просто "резиновым", а осмысленно адаптированным под контекст потребления.

## Нетипичные, но реальные потребности

### 1. Лупа для десктопа

Казалось бы, в десктопных браузерах есть встроенный зум (Ctrl +/-, Ctrl + колесо мыши), но почему-то он подходит не всем пользователям. Иногда нужно более точное и контролируемое увеличение.

В таких случаях решением становится реализация экранной лупы. Ниже — пример компонента на React.js, основа которого была адаптирована с Codepen.

![Реализация экранной лупы в веб-десктоп приложении](/garden/zoom/zoom-desktop.webp)

Секрет реализации: загружаем одно и то же изображение дважды. Основное отображается как есть, а второе (увеличенное во много раз) используется как фон для лупы. При наведении на подложку мы показываем нужную область увеличенного фона.

```jsx
const PhotoPreview = ({ isOpen, onClose, preview }) => {
  const imageBoxRef = useRef(null);
  const imgRef = useRef(null);
  const zoomRef = useRef(null);

  // Устанавливаем размер фона для лупы при загрузке изображения
  useEffect(() => {
    if (imgRef.current && zoomRef.current) {
      const img = imgRef.current;
      const zoom = zoomRef.current;

      const handleImageLoad = () => {
        // Увеличиваем размер фона для сильного увеличения
        const scaledWidth = img.naturalWidth * ZOOM_SCALE;
        const scaledHeight = img.naturalHeight * ZOOM_SCALE;
        zoom.style.backgroundSize = `${scaledWidth}px ${scaledHeight}px`;
      };

      if (img.complete) {
        handleImageLoad();
      } else {
        img.addEventListener('load', handleImageLoad);
        return () => {
          img.removeEventListener('load', handleImageLoad);
        };
      }
    }
  }, []);

  const handleMouseMove = useCallback((event) => {
    if (!imgRef.current || !zoomRef.current || !imageBoxRef.current) {
      return;
    }

    const original = imgRef.current;
    const magnified = zoomRef.current;
    const imageBox = imageBoxRef.current;

    const boxRect = imageBox.getBoundingClientRect();
    const x = event.clientX - boxRect.left;
    const y = event.clientY - boxRect.top;

    const imgWidth = original.offsetWidth;
    const imgHeight = original.offsetHeight;

    let xperc = (x / imgWidth) * 100;
    let yperc = (y / imgHeight) * 100;

    // Позволяем прокручивать за края изображения
    if (x >= 0.01 * imgWidth) {
      xperc *= 1.15;
    }
    if (y >= 0.01 * imgHeight) {
      yperc *= 1.15;
    }

    magnified.style.backgroundPositionX = `${xperc - 9}%`;
    magnified.style.backgroundPositionY = `${yperc - 9}%`;

    // Позиционируем лупу
    magnified.style.left = `${x - ZOOM_OFFSET}px`;
    magnified.style.top = `${y - ZOOM_OFFSET}px`;
  }, []);

  return (
    <Dialog open={isOpen} onClose={onClose} fullScreen className={styles.wrapper}>
      <div className={styles.modal}>
        <div ref={imageBoxRef} onMouseMove={handleMouseMove}>
          <img ref={imgRef} src={preview} alt="Предпросмотр загруженного фото" />
          <div
            ref={zoomRef}
            style={{
              backgroundImage: `url(${preview})`,
            }}
          />
        </div>
      </div>
    </Dialog>
  );
};
```

### 2. Мобильный зум жестами (pinch-to-zoom)

На мобильных устройствах подход с лупой становится неудобным. Здесь мы сталкиваемся с парадоксом: современная практика стремится сделать веб-интерфейсы максимально близкими к нативным приложениям, но в нативных приложениях зум жестами часто отключают на веб-вью, чтобы избежать конфликтов жестов и случайных масштабирований.

```html
<meta
  name="viewport"
  content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no, shrink-to-fit=no"
/>
```

Для просмотра фотографий возможность зума жестами (pinch-to-zoom) — must-have. Важно также дать пользователю понять, что эта функция доступна, с помощью визуального онбординга.

![Реализация масштабирования жестами в веб-мобильном приложении](/garden/zoom/zoom-mobile.webp)

Ниже — упрощённая, но рабочая в продакшене реализация зума жестами на React:

```jsx
import React from 'react';
import { Modal, ModalOverlay } from '@chakra-ui/react';
import Box from 'shared/ui/Box';
import Text from 'shared/ui/Text';
import styles from './PhotoPreview.module.scss';
import useZoom from './useZoom';

const PhotoPreview = ({ isOpen, photo, onClose }) => {
  const {
    frameRef,
    mediaContainerRef,
    transformStyle,
    onPointerDown,
    onPointerMove,
    onPointerUpOrCancel,
    isOnboarding,
    closeOnboarding,
  } = useZoom({ maxScale: 5, wheelIntensity: 0.004 }, isOpen);

  const handleClick = (e) => {
    e.stopPropagation();
    closeOnboarding();
  };

  return (
    <Modal isOpen={isOpen || false} onClose={onClose}>
      <ModalOverlay />
      <Box className={styles.photoPreview} onClick={onClose}>
        <Box ref={frameRef} className={styles.frame}>
          <Box
            ref={mediaContainerRef}
            className={styles.mediaContainer}
            style={transformStyle}
            onPointerDown={onPointerDown}
            onPointerMove={onPointerMove}
            onPointerUp={onPointerUpOrCancel}
            onPointerCancel={onPointerUpOrCancel}
            onDoubleClick={handleClick}
            onClick={handleClick}
          >
            <Box
              visibility={isOnboarding ? 'visible' : 'hidden'}
              className={styles.onboard}
              role="status"
              aria-live="polite"
            >
              <Box className={styles.pointers}>
                <Box className={styles.pointerTop} />
                <Box className={styles.pointerBottom} />
              </Box>
              <Text variant="body-regular" className={styles.onboardText}>
                Увеличить фото можно движением пальцев
              </Text>
            </Box>
            <img className={styles.imgPreview} src={photo} alt="Просмотр фото" />
          </Box>
        </Box>
      </Box>
    </Modal>
  );
};

export default React.memo(PhotoPreview);
```

Полная реализация хука useZoom, обеспечивающего зум жестами, колесом мыши (для тестирования на симуляторе) и корректное ограничение области просмотра, довольно объемна, но её ключевые части — управление состоянием масштаба и сдвига, обработка мультитача и вычисление границ.

```javascript
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';

import isFunction from 'lodash/isFunction';
import { LS_KEYS } from 'constants/lsKeys';

import {
  clamp,
  getMidpoint,
  getDistance,
  SCALE_LIMITS,
  INIT_TRANSLATE,
  computeNextTranslateFromPinch,
} from './utils';

// Основной хук для реализации жестового зума на мобильных устройствах
const useZoom = (options, enabled) => {
  // Рефы для DOM-элементов
  const frameRef = useRef(null); // Внешний контейнер (рамка)
  const mediaContainerRef = useRef(null); // Контейнер для изображения

  // Кэш для активных указателей/касаний
  const pointerCacheRef = useRef(new Map()); // Для pointer-событий
  const touchCacheRef = useRef(new Map()); // Для touch-событий

  // Сохранение последнего состояния жеста для плавной анимации
  const lastGestureRef = useRef({ scale: 1, translateX: 0, translateY: 0 });

  // Размеры элементов для вычисления ограничений
  const baseSizeRef = useRef({ width: 0, height: 0 }); // Размер изображения
  const frameSizeRef = useRef({ width: 0, height: 0 }); // Размер контейнера

  // Состояние для отслеживания одного касания (для панорамирования)
  const lastSingleTouchRef = useRef(null);

  // Основное состояние: масштаб и смещение
  const [scale, setScale] = useState(1);
  const [translate, setTranslate] = useState(INIT_TRANSLATE);

  // CSS transform стиль, применяемый к контейнеру изображения
  const transformStyle = useMemo(
    () => ({
      transform: `translate3d(${translate.x}px, ${translate.y}px, 0) scale(${scale})`,
    }),
    [scale, translate.x, translate.y]
  );

  // Настройки масштабирования
  const limits = useMemo(
    () => ({
      min: options?.minScale ?? SCALE_LIMITS.min, // Минимальный зум (1x)
      max: options?.maxScale ?? SCALE_LIMITS.max, // Максимальный зум (4x по умолчанию)
    }),
    [options?.minScale, options?.maxScale]
  );

  // Интенсивность зума колесом мыши
  const wheelIntensity = useMemo(() => options?.wheelIntensity ?? 0.005, [options?.wheelIntensity]);

  const maxScale = limits.max;
  const minScale = limits.min;

  // Измерение размеров элементов (вызывается при ресайзе)
  const measureSizes = useCallback(() => {
    const frameEl = frameRef.current;
    const mediaEl = mediaContainerRef.current;
    if (!frameEl || !mediaEl) {
      return;
    }

    // Получаем размеры рамки
    const frameRect = frameEl.getBoundingClientRect();
    frameSizeRef.current = { width: frameRect.width, height: frameRect.height };

    // Получаем размеры самого изображения (не контейнера!)
    const inner = mediaEl.querySelector('img,canvas');
    if (inner) {
      baseSizeRef.current = {
        width: inner.offsetWidth,
        height: inner.offsetHeight,
      };
    }
  }, []);

  // Ограничение перемещения, чтобы изображение не уходило за границы
  const clampTranslate = useCallback((nextX, nextY, nextScale) => {
    const { width: frameW, height: frameH } = frameSizeRef.current;
    const { width: baseW, height: baseH } = baseSizeRef.current;

    if (!frameW || !frameH || !baseW || !baseH) {
      return { x: nextX, y: nextY };
    }

    // Рассчитываем размер контента после масштабирования
    const contentW = baseW * nextScale;
    const contentH = baseH * nextScale;

    // Вычисляем допустимые границы смещения
    const offsetX = Math.max(0, (contentW - frameW) / 2);
    const offsetY = Math.max(0, (contentH - frameH) / 2);

    const minX = -offsetX;
    const maxX = offsetX;
    const minY = -offsetY;
    const maxY = offsetY;

    // Ограничиваем значения в рамках допустимых границ
    return {
      x: clamp(nextX, minX, maxX),
      y: clamp(nextY, minY, maxY),
    };
  }, []);

  // Основная функция применения трансформации
  const applyTransform = useCallback(
    (nextScale, nextX, nextY) => {
      // Сначала ограничиваем позицию
      const clamped = clampTranslate(nextX, nextY, nextScale);

      // Обновляем состояние
      setScale(nextScale);
      setTranslate(clamped);

      // Сохраняем последнее состояние для плавных переходов
      lastGestureRef.current = {
        scale: nextScale,
        translateX: clamped.x,
        translateY: clamped.y,
      };
    },
    [clampTranslate]
  );

  // Хелпер для безопасного добавления обработчиков событий после монтирования DOM
  const attachWhenRefsReady = useCallback((setup) => {
    let rafId = 0;
    let cleanup;
    const tryAttach = () => {
      const frameEl = frameRef.current;
      const mediaEl = mediaContainerRef.current;
      if (!frameEl || !mediaEl) {
        // Если рефы ещё не готовы, ждём следующего кадра
        rafId = requestAnimationFrame(tryAttach);
        return;
      }
      cleanup = setup(frameEl, mediaEl);
    };
    tryAttach();
    return () => {
      if (rafId) {
        cancelAnimationFrame(rafId);
      }
      if (isFunction(cleanup)) {
        cleanup();
      }
    };
  }, []);

  // Эффект для подписки на события ресайза и измерения размеров
  useEffect(() => {
    measureSizes();
    const onResize = () => {
      measureSizes();
      const clamped = clampTranslate(translate.x, translate.y, scale);
      setTranslate(clamped);
    };

    window.addEventListener('resize', onResize);

    // Используем ResizeObserver для отслеживания изменений размеров элементов
    const cleanupObserver = attachWhenRefsReady((frame, media) => {
      if (typeof ResizeObserver === 'undefined') {
        return;
      }
      const inner = media.querySelector('img,canvas');
      const handleResizeObserve = () => {
        onResize();
      };
      const observer = new ResizeObserver(handleResizeObserve);
      observer.observe(frame);
      observer.observe(media);
      if (inner) {
        observer.observe(inner);
      }
      return () => observer.disconnect();
    });

    return () => {
      window.removeEventListener('resize', onResize);
      if (typeof cleanupObserver === 'function') {
        cleanupObserver();
      }
    };
  }, [measureSizes, scale, translate.x, translate.y, clampTranslate, enabled, attachWhenRefsReady]);

  // --- Онбординг (подсказка пользователю) ---
  const [isOnboarding, setOnboarding] = useState(false);
  const onboardingVisibleRef = useRef(false);
  const ignoreNextTouchMoveRef = useRef(false);

  // Показываем подсказку только первые 3 раза
  useEffect(() => {
    const onboardingCount = Number(localStorage.getItem(LS_KEYS.PHOTO_ZOOM_SHOW_LIMIT)) || 0;
    if (enabled && onboardingCount < 3) {
      onboardingVisibleRef.current = true;
      setOnboarding(true);
      localStorage.setItem(LS_KEYS.PHOTO_ZOOM_SHOW_LIMIT, String(onboardingCount + 1));
    }
  }, [enabled]);

  const closeOnboarding = useCallback(() => {
    if (!onboardingVisibleRef.current) {
      return;
    }
    onboardingVisibleRef.current = false;

    // Откладываем скрытие, чтобы не мешать текущему жесту
    requestAnimationFrame(() => setOnboarding(false));

    // Очищаем кэши жестов, чтобы следующий жест не считался продолжением текущего
    touchCacheRef.current.clear();
    pointerCacheRef.current.clear();
    lastSingleTouchRef.current = null;
    ignoreNextTouchMoveRef.current = true;
  }, []);

  // --- Вспомогательные функции для обработки касаний ---
  const getTouches = (e) => {
    const pts = [];
    for (let i = 0; i < e.touches.length; i++) {
      const t = e.touches.item(i);
      pts.push({ id: t.identifier, x: t.clientX, y: t.clientY });
    }
    return pts;
  };

  // Обработка начала касания (touchstart)
  const onTouchStart = (e) => {
    closeOnboarding();
    const frameEl = frameRef.current;
    if (!frameEl) {
      return;
    }

    const pts = getTouches(e);

    // Сохраняем все активные касания
    pts.forEach((p) => touchCacheRef.current.set(p.id, { x: p.x, y: p.y }));

    // Если одно касание - сохраняем для панорамирования
    if (touchCacheRef.current.size === 1) {
      const p = pts[0];
      lastSingleTouchRef.current = { x: p.x, y: p.y };
    }

    // Если два касания - начинаем жестовое масштабирование (pinch)
    if (touchCacheRef.current.size === 2) {
      const [id1, id2] = Array.from(touchCacheRef.current.keys());
      const p1 = touchCacheRef.current.get(id1);
      const p2 = touchCacheRef.current.get(id2);

      // Сохраняем начальные параметры для расчета жеста
      frameEl._initialPinchDistance = getDistance(p1, p2);
      frameEl._initialPinchMidpoint = getMidpoint(p1, p2);
      frameEl._initialPinchScale = scale;
      frameEl._initialTranslateX = translate.x;
      frameEl._initialTranslateY = translate.y;
    }
  };

  // Обработка движения касаний (touchmove)
  const onTouchMove = (e) => {
    const frameEl = frameRef.current;
    if (!frameEl) {
      return;
    }

    // Игнорируем первый move после закрытия онбординга
    if (ignoreNextTouchMoveRef.current) {
      ignoreNextTouchMoveRef.current = false;
      const ptsInit = getTouches(e);
      if (ptsInit.length === 1) {
        lastSingleTouchRef.current = { x: ptsInit[0].x, y: ptsInit[0].y };
      }
      return;
    }

    // Если два пальца - жест масштабирования
    if (touchCacheRef.current.size >= 2) {
      e.preventDefault(); // Предотвращаем скролл страницы
      const pts = getTouches(e);
      pts.forEach((p) => touchCacheRef.current.set(p.id, { x: p.x, y: p.y }));

      const [id1, id2] = Array.from(touchCacheRef.current.keys());
      const p1 = touchCacheRef.current.get(id1);
      const p2 = touchCacheRef.current.get(id2);

      const rect = frameEl.getBoundingClientRect();
      const midpoint = getMidpoint(p1, p2);

      // Получаем сохраненные начальные параметры
      const initialDistance = frameEl._initialPinchDistance;
      const initialScale = frameEl._initialPinchScale;
      const initialMidpoint = frameEl._initialPinchMidpoint;

      if (initialDistance == null || initialScale == null || !initialMidpoint) {
        return;
      }

      // Вычисляем новый масштаб на основе изменения расстояния между пальцами
      const currentDistance = getDistance(p1, p2);
      const nextScale = clamp(
        (currentDistance / initialDistance) * initialScale,
        minScale,
        maxScale
      );

      // Вычисляем новую позицию для плавного перемещения
      const next = computeNextTranslateFromPinch(
        initialScale,
        frameEl._initialTranslateX,
        frameEl._initialTranslateY,
        initialMidpoint,
        midpoint,
        rect,
        nextScale
      );

      applyTransform(nextScale, next.x, next.y);
    } else if (touchCacheRef.current.size === 1 && scale > 1) {
      // Если один палец и есть зум - панорамирование
      e.preventDefault();
      const pts = getTouches(e);
      if (pts.length !== 1 || !lastSingleTouchRef.current) {
        return;
      }

      const curr = pts[0];
      const dx = curr.x - lastSingleTouchRef.current.x;
      const dy = curr.y - lastSingleTouchRef.current.y;

      // Вычисляем новую позицию
      const nextX = lastGestureRef.current.translateX + dx;
      const nextY = lastGestureRef.current.translateY + dy;

      const clamped = clampTranslate(nextX, nextY, scale);
      setTranslate(clamped);

      // Обновляем состояние
      lastGestureRef.current = {
        scale,
        translateX: clamped.x,
        translateY: clamped.y,
      };
      lastSingleTouchRef.current = { x: curr.x, y: curr.y };
    }
  };

  // Обработка окончания касания
  const onTouchEnd = (e) => {
    // Удаляем завершившиеся касания из кэша
    for (let i = 0; i < e.changedTouches.length; i++) {
      const t = e.changedTouches.item(i);
      touchCacheRef.current.delete(t.identifier);
    }

    lastGestureRef.current = {
      scale,
      translateX: translate.x,
      translateY: translate.y,
    };

    // Если вернулись к исходному масштабу - сбрасываем позицию
    if (scale <= 1.01) {
      applyTransform(1, 0, 0);
    }

    // Обновляем последнее одиночное касание, если осталось одно
    if (touchCacheRef.current.size === 1) {
      const id = Array.from(touchCacheRef.current.keys())[0];
      const p = touchCacheRef.current.get(id);
      lastSingleTouchRef.current = { x: p.x, y: p.y };
    } else {
      lastSingleTouchRef.current = null;
    }
  };

  // Сброс состояния при закрытии/открытии модального окна
  useEffect(() => {
    if (!enabled) {
      return;
    }
    setScale(1);
    setTranslate(INIT_TRANSLATE);
    lastGestureRef.current = { scale: 1, translateX: 0, translateY: 0 };
  }, [enabled]);

  // Подписка на touch-события для мобильных устройств
  useEffect(() => {
    const win = typeof window !== 'undefined' ? window : undefined;
    const isTouchCapable = !!(win && ('ontouchstart' in win || navigator?.maxTouchPoints > 0));

    if (!isTouchCapable || !enabled) {
      return;
    }

    return attachWhenRefsReady((frame) => {
      frame.addEventListener('touchstart', onTouchStart, { passive: false });
      frame.addEventListener('touchmove', onTouchMove, { passive: false });
      frame.addEventListener('touchend', onTouchEnd, { passive: false });
      frame.addEventListener('touchcancel', onTouchEnd, { passive: false });

      return () => {
        frame.removeEventListener('touchstart', onTouchStart);
        frame.removeEventListener('touchmove', onTouchMove);
        frame.removeEventListener('touchend', onTouchEnd);
        frame.removeEventListener('touchcancel', onTouchEnd);
      };
    });
  }, [attachWhenRefsReady, onTouchStart, onTouchMove, onTouchEnd, enabled]);

  // Функция обновления трансформации для жеста pinch (pointer-события)
  const updateTransformForPinch = useCallback(() => {
    if (pointerCacheRef.current.size < 2) {
      return;
    }

    // Получаем два активных указателя
    const [firstId, secondId] = Array.from(pointerCacheRef.current.keys());
    const p1 = pointerCacheRef.current.get(firstId);
    const p2 = pointerCacheRef.current.get(secondId);

    const container = mediaContainerRef.current;
    if (!container) {
      return;
    }

    const frameEl = frameRef.current;
    const rect = (frameEl ?? container).getBoundingClientRect();
    const midpoint = getMidpoint(p1, p2);

    // Получаем начальные параметры жеста
    const baseEl = frameEl ?? container;
    const initialDistance = baseEl._initialPinchDistance;
    const initialScale = baseEl._initialPinchScale;
    const initialMidpoint = baseEl._initialPinchMidpoint;

    if (initialDistance == null || initialScale == null || !initialMidpoint) {
      return;
    }

    // Вычисляем масштаб и позицию аналогично touch-событиям
    const currentDistance = getDistance(p1, p2);
    const nextScale = clamp((currentDistance / initialDistance) * initialScale, minScale, maxScale);

    const next = computeNextTranslateFromPinch(
      initialScale,
      baseEl._initialTranslateX,
      baseEl._initialTranslateY,
      initialMidpoint,
      midpoint,
      rect,
      nextScale
    );

    applyTransform(nextScale, next.x, next.y);
  }, []);

  // --- Обработчики pointer-событий (поддерживаются на десктопе и мобильных) ---

  const onPointerDown = useCallback(
    (e) => {
      e.stopPropagation(); // Предотвращаем закрытие модального окна
      closeOnboarding();

      const target = e.currentTarget;
      target.setPointerCapture(e.pointerId);

      // Сохраняем указатель
      pointerCacheRef.current.set(e.pointerId, { x: e.clientX, y: e.clientY });

      // Если два указателя - начинаем жестовое масштабирование
      if (pointerCacheRef.current.size === 2) {
        const [id1, id2] = Array.from(pointerCacheRef.current.keys());
        const p1 = pointerCacheRef.current.get(id1);
        const p2 = pointerCacheRef.current.get(id2);

        target._initialPinchDistance = getDistance(p1, p2);
        target._initialPinchMidpoint = getMidpoint(p1, p2);
        target._initialPinchScale = scale;
        target._initialTranslateX = translate.x;
        target._initialTranslateY = translate.y;
      }
    },
    [scale, translate.x, translate.y, closeOnboarding]
  );

  const onPointerMove = useCallback(
    (e) => {
      if (!pointerCacheRef.current.has(e.pointerId)) {
        return;
      }

      pointerCacheRef.current.set(e.pointerId, { x: e.clientX, y: e.clientY });

      // Два указателя - жест масштабирования
      if (pointerCacheRef.current.size >= 2) {
        updateTransformForPinch();
      } else if (pointerCacheRef.current.size === 1 && scale > 1) {
        // Один указатель при зуме - панорамирование
        e.stopPropagation();
        const prev = lastGestureRef.current;
        const movementX = e.movementX ?? 0;
        const movementY = e.movementY ?? 0;

        const nextX = prev.translateX + movementX;
        const nextY = prev.translateY + movementY;

        const clamped = clampTranslate(nextX, nextY, scale);
        setTranslate(clamped);

        lastGestureRef.current = {
          scale,
          translateX: clamped.x,
          translateY: clamped.y,
        };
      }
    },
    [scale, updateTransformForPinch, clampTranslate]
  );

  const onPointerUpOrCancel = useCallback(
    (e) => {
      const target = e.currentTarget;
      try {
        target.releasePointerCapture(e.pointerId);
      } catch {
        // Игнорируем ошибки, если указатель уже освобожден
      }

      pointerCacheRef.current.delete(e.pointerId);
      lastGestureRef.current = {
        scale,
        translateX: translate.x,
        translateY: translate.y,
      };

      // Возврат к исходному состоянию при маленьком масштабе
      if (scale <= 1.01) {
        applyTransform(1, 0, 0);
      }
    },
    [scale, translate.x, translate.y, applyTransform]
  );

  // --- Обработка зума колесом мыши (Ctrl + колесо) ---
  useEffect(() => {
    if (!enabled) {
      return;
    }

    const onWheelNative = (e) => {
      closeOnboarding();

      // Работаем только с зажатым Ctrl (стандартный жест зума)
      if (!e.ctrlKey) {
        return;
      }

      e.preventDefault(); // Предотвращаем скролл страницы
      const frame = frameRef.current;
      if (!frame) {
        return;
      }

      const rect = frame.getBoundingClientRect();
      const delta = -e.deltaY; // Инвертируем направление
      const currentScale = lastGestureRef.current.scale;
      const currentX = lastGestureRef.current.translateX;
      const currentY = lastGestureRef.current.translateY;

      // Вычисляем новый масштаб
      const newScale = clamp(currentScale * (1 + delta * wheelIntensity), minScale, maxScale);

      const scaleDelta = newScale - currentScale;

      // Вычисляем точку зума (относительно центра)
      const originX = e.clientX - rect.left - rect.width / 2;
      const originY = e.clientY - rect.top - rect.height / 2;

      // Вычисляем новую позицию с учетом точки зума
      const nextX = currentX - scaleDelta * originX;
      const nextY = currentY - scaleDelta * originY;

      applyTransform(newScale, nextX, nextY);
    };

    return attachWhenRefsReady((frame, media) => {
      frame.addEventListener('wheel', onWheelNative, { passive: false });
      media.addEventListener('wheel', onWheelNative, { passive: false });

      return () => {
        frame.removeEventListener('wheel', onWheelNative);
        media.removeEventListener('wheel', onWheelNative);
      };
    });
  }, [
    closeOnboarding,
    attachWhenRefsReady,
    applyTransform,
    wheelIntensity,
    minScale,
    maxScale,
    enabled,
  ]);

  // Возвращаем API хука
  return useMemo(
    () => ({
      frameRef, // Реф на внешний контейнер
      mediaContainerRef, // Реф на контейнер изображения
      transformStyle, // CSS стиль для трансформации
      onPointerDown, // Обработчик начала pointer-события
      onPointerMove, // Обработчик движения pointer
      onPointerUpOrCancel, // Обработчик окончания pointer
      closeOnboarding, // Функция закрытия подсказки
      isOnboarding, // Состояние показа подсказки
    }),
    [
      transformStyle,
      onPointerDown,
      onPointerMove,
      onPointerUpOrCancel,
      isOnboarding,
      closeOnboarding,
    ]
  );
};

export default useZoom;
```

Основная сложность в реализации зума жестами — не в самом React-компоненте, а в математике, которая стоит за жестами. Вот самые важные функции:

```javascript
// Константы для ограничения масштабирования
// min: 1 (без увеличения), max: 4 (4-кратное увеличение)
export const SCALE_LIMITS = { min: 1, max: 4 };

// Начальная позиция трансляции (без смещения)
export const INIT_TRANSLATE = { x: 0, y: 0 };

/**
 * Вычисление расстояния между двумя точками в 2D-пространстве
 * Используется для определения расстояния между пальцами при pinch-жесте
 *
 * Формула: √((x₂ - x₁)² + (y₂ - y₁)²)
 * Используем Math.hypot для численной стабильности
 */
export const getDistance = (a, b) => {
  const dx = a.x - b.x; // Разница по оси X
  const dy = a.y - b.y; // Разница по оси Y
  return Math.hypot(dx, dy); // √(dx² + dy²)
};

/**
 * Вычисление средней точки между двумя точками
 * Используется для определения центра pinch-жеста
 *
 * Формула: x = (x₁ + x₂) / 2, y = (y₁ + y₂) / 2
 * Эта точка служит "центром масштабирования" для жеста
 */
export const getMidpoint = (a, b) => ({
  x: (a.x + b.x) / 2, // Среднее арифметическое по X
  y: (a.y + b.y) / 2, // Среднее арифметическое по Y
});

/**
 * Ограничение значения в заданных пределах
 * Гарантирует, что значение не выйдет за границы min и max
 *
 * Логика: если value < min → возвращаем min
 *         если value > max → возвращаем max
 *         иначе → возвращаем value
 *
 * Примеры:
 *   clamp(5, 1, 10) → 5
 *   clamp(0, 1, 10) → 1
 *   clamp(15, 1, 10) → 10
 */
export const clamp = (value, min, max) => Math.max(min, Math.min(max, value));

/**
 * Вычисление следующей позиции трансляции для pinch-жеста
 *
 * Эта функция отвечает за плавное перемещение изображения при жестовом масштабировании.
 * Без неё изображение "прыгало" бы при изменении масштаба.
 * Алгоритм вычисления:
 * 1. Вычисляем смещение средней точки: насколько палец переместился
 * 2. Вычисляем изменение масштаба (разницу между старым и новым)
 * 3. Вычисляем точку "привязки" (origin) относительно центра контейнера
 * 4. Комбинируем всё вместе для плавного перемещения
 *
 * Формула для X:
 *   initialTranslateX + dxMid - scaleDelta * originX
 *   где:
 *     - initialTranslateX: начальная позиция
 *     - dxMid: смещение средней точки по X
 *     - scaleDelta: изменение масштаба
 *     - originX: точка привязки относительно центра контейнера
 *
 * Пояснение компонентов:
 * 1. dxMid, dyMid: компенсирует движение пальцев (панорамирование)
 * 2. scaleDelta * originX/Y: компенсирует изменение масштаба относительно центра
 *
 * Визуально: при зуме мы хотим, чтобы точка под пальцами оставалась на месте,
 * а не прыгала в центр экрана.
 */
export const computeNextTranslateFromPinch = (
  initialScale,
  initialTranslateX,
  initialTranslateY,
  initialMidpoint,
  currentMidpoint,
  rect,
  nextScale
) => {
  // 1. Смещение средней точки жеста (панорамирование)
  const dxMid = currentMidpoint.x - initialMidpoint.x;
  const dyMid = currentMidpoint.y - initialMidpoint.y;

  // 2. Изменение масштаба (разница между старым и новым)
  const scaleDelta = nextScale - initialScale;

  // 3. Точка привязки относительно центра контейнера
  //    Это смещает "центр зума" к точке между пальцами
  const originX = currentMidpoint.x - rect.left - rect.width / 2;
  const originY = currentMidpoint.y - rect.top - rect.height / 2;

  // 4. Финальный расчёт новой позиции
  return {
    // Компенсация движения + компенсация изменения масштаба
    x: initialTranslateX + dxMid - scaleDelta * originX,
    y: initialTranslateY + dyMid - scaleDelta * originY,
  };
};
```

Что делает computeNextTranslateFromPinch и почему она так важна? Эта функция — сердце жестового зума. Без неё при увеличении изображения жестом pinch, картинка всегда масштабировалась бы к центру экрана, а не к точке между вашими пальцами. Представьте: вы хотите рассмотреть деталь в правом верхнем углу, начинаете жестовое увеличение, и вдруг — раз! — изображение прыгает, и нужная деталь оказывается в центре. Ужасно.

#### Что происходит на самом деле:

- Смещение средней точки (dxMid, dyMid): отслеживает, насколько ваши пальцы переместились по экрану. Это даёт эффект панорамирования — вы можете вести пальцами по экрану, и изображение будет следовать за ними.

- Изменение масштаба (scaleDelta): вычисляет, насколько вы увеличили или уменьшили изображение. Если раздвинули пальцы — scaleDelta положительный, если свели — отрицательный.

- Точка привязки (originX, originY): вот здесь магия! Эта часть вычисляет, где находится точка между вашими пальцами относительно центра экрана. Если пальцы в центре — originX/Y близки к нулю, масштабирование происходит из центра. Если пальцы в правом верхнем углу — originX положительный, originY отрицательный, и масштабирование происходит с учётом этого смещения.

> Итоговая формула:
> **новая*позиция = старая*позиция + смещение*пальцев - изменение*масштаба × точка_привязки**

Эта комбинация даёт тот самый плавный, интуитивно понятный зум, к которому мы привыкли в нативных приложениях. Изображение увеличивается именно там, где находятся ваши пальцы, а не прыгает по экрану.

#### Как это работает на практике:

- Вы ставите два пальца на изображение в том месте, которое хотите рассмотреть
- Начинаете раздвигать пальцы — функция вычисляет новое расстояние между ними
- Одновременно отслеживается, не сместились ли пальцы по экрану

Всё это комбинируется в одну плавную трансформацию: изображение увеличивается и при необходимости смещается, чтобы точка между пальцами оставалась под ними

Без этой математики мы бы получили тот же неуклюжий зум, что в старых браузерах, где всё масштабируется к центру. А с ней — плавный, предсказуемый интерфейс, который "просто работает" так, как ожидает пользователь.

### Ключевые инсайты

- Эволюция подходов: От Art Direction (разные изображения для разных устройств) → к адаптивному дизайну (одно изображение, меняющее размер) → к интерактивным возможностям (лупа, жестовый зум) как новому уровню адаптации под пользователя.
- Математика важнее кода: Самая сложная часть реализации — не React-компоненты, а математические функции вроде computeNextTranslateFromPinch. Без правильных расчётов даже самый красивый интерфейс будет работать плохо.
- Адаптивность под платформу: Решения для десктопа (лупа) и мобильных устройств (жесты) принципиально разные, но преследуют одну цель — дать контроль над просмотром, подобно тому, как Art Direction давал контроль над композицией.
- Обучение пользователя: На мобильных устройствах без визуального онбординга многие пользователи могут не догадаться о возможности зума жестами. Показываем подсказку ограниченное количество раз (контролируем через localStorage).
- Предотвращение конфликтов: При реализации зума важно корректно обрабатывать множественные касания, предотвращать скролл страницы и конфликты с другими жестами (используем preventDefault() и управление pointer-событиями).
- Возврат к исходному состоянию: После уменьшения масштаба до ~1.0 автоматически возвращаем изображение в исходную позицию — это соответствует пользовательским ожиданиям и делает интерфейс предсказуемым.

**Итог:** Хороший интерфейс просмотра изображений — это не просто img с max-width: 100%. Это продуманная система, которая учитывает контекст использования, платформу, ожидания пользователя и, что немаловажно, сложную математику жестов. Как и в кинематографе, где кадр перекадрируют для мобильных устройств, в вебе мы должны адаптировать не только размеры, но и само взаимодействие с контентом.

> И нет, я не так хорош в математике, поэтому эти формулы написал и нашел не я, с ними мне любезно помог мой ИИ-ассистент 🤖 🤓

---

### Связанные заметки

- [[View Transitions в React — рабочий инструмент, который уже год в продакшене](/garden/view-transitions)]
- [[Настройка Workbox Background Sync для совместимости с iOS и Android WebView](/garden/workbox-background-sync)]
- [[Вычисление видимой части viewport](/garden/viewport)]
- [[Переход по DeepLink из Web](/garden/deeplink-web)]
- [[Конфликт оффлайн функциональности и ленивой подгрузки](/garden/offline-vs-lazy-loading)]
