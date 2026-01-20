---
title: View Transitions в React — рабочий инструмент, который уже год в продакшене
description: В восторге от компонента ViewTransition в React? А что если я скажу, что это работало и раньше.
date: 2026-01-20
tags: [pwa, mobile, ssr, react, animation]
---

Когда React в своем экспериментальном канале анонсировал работу над [компонентом `ViewTransition`](https://react.dev/reference/react/ViewTransition), коллеги активно начали делиться этой информацией и восторженно комментировать. Меня эти восторги слегка позабавили, ребята просто не умели видимо до этого готовить уже давно существующее API. Потому что [View Transitions API](https://developer.mozilla.org/en-US/docs/Web/API/View_Transition_API) — это не новость из будущего, а стабильное, работающее API, которое уже больше года живет в продакшене моего приложения, в современных браузерах и даже в WebView.

Пока все обсуждают RFC и эксперименты, я и мои пользователи уже давно пользуемся плавными, кинематографичными переходами между страницами. В этой статье я покажу, как организовал эту систему в продакшене для SPA на React 18 (речь про гибрид PWA в WebView) и для SSR-приложения на Next.js, разберу код и покажу, почему это работает уже сегодня, а не "когда-нибудь потом".

## Реальная проблема и реальное решение

Мое рабочее приложение — это гибридное PWA/SPA на React 18 с React Router. Задача была классической: уйти от резких, "дерганых" переходов между роутами к чему-то плавному, целостному, что создавало бы ощущение единого приложения, а не набора отдельных страниц.

**View Transitions API** [предлагает элегантную парадигму](https://developer.chrome.com/docs/web-platform/view-transitions?hl=ru): вы говорите браузеру — "вот текущее состояние DOM, вот новое, анимируй изменение между ними". Браузер делает всю тяжелую работу по захвату "снимков", их наложению и анимации на GPU. Наша задача — грамотно интегрировать это в систему маршрутизации.

## Интеграция в SPA (React Router)

В основе лежит хук `useTransitionNavigate`, который становится "прослойкой" между вашим кодом и стандартным navigate из React Router.

```typescript
import { useCallback, useEffect } from 'react';
import noop from 'lodash/noop';
import { To } from 'react-router';
import { useNavigate } from 'react-router-dom';

export const useTransitionNavigate = () => {
  const navigate = useNavigate();
  let isTransitioning = false;
  let isMounted = true;

  useEffect(() => {
    return () => {
      isMounted = false;
    };
  }, []);

  return useCallback(
    (to: To | number) => {
      // 1. Защита от вызовов после размонтирования
      if (!isMounted) {
        return;
      }
      // 2. Фоллбэк для браузеров без поддержки API
      if (!document.startViewTransition) {
        navigate(to as To);
        return;
      }
      // 3. Защита от повторных кликов
      if (isTransitioning) {
        return;
      }

      isTransitioning = true;
      // 4. Запуск нативной view transition
      const transition = document.startViewTransition(async () => {
        try {
          // 5. Навигация + микро-задержка для гарантии рендера
          await new Promise((resolve) => {
            navigate(to as To);
            setTimeout(resolve, 100);
          });
        } catch (err) {
          // 6. Отмена анимации при ошибке навигации
          transition.skipTransition();
          throw err;
        }
      });

      // 7. Чистка состояния в случае сбоя подготовки
      transition.ready.catch(() => {
        isTransitioning = false;
      });

      // 8. Гарантированный сброс флага после завершения
      transition.finished.catch(noop).finally(() => {
        if (isMounted) {
          isTransitioning = false;
        }
      });
    },
    [navigate, isMounted, isTransitioning]
  );
};
```

_Ключевые моменты реализации:_

- Фоллбэк и прогрессивное улучшение: Проверка `document.startViewTransition` — это святое. Наши пользователи в старых браузерах просто увидят мгновенный переход. Без сбоев.

- Защита от двойных кликов: Флаг `isTransitioning` критически важен. Без него быстрый пользователь мог бы "сломать" анимацию несколькими кликами подряд.

- Микро-оптимизация: `setTimeout(resolve, 100)` после `navigate()` дает React Router и вашему коду время отрисовать новый контент до того, как браузер сделает снимок "нового" состояния. Без этого можно поймать анимацию между полупустыми страницами.

- Управление ошибками: Если навигация выбросит ошибку (например, сетевую при lazy-загрузке), `transition.skipTransition()` мгновенно сбросит анимацию и покажет актуальное состояние.

На основе этого хука строится компонент-ссылка `ViewTransitionLink`, который заменяет стандартные `<Link>` из React Router.

```tsx
import React, { FC, ForwardedRef } from 'react';
import { useTransitionNavigate } from 'hooks/useTransitionNavigate';

export interface ViewTransitionLinkProps {
  to: string;
  tabIndex?: number;
  children: React.ReactNode | React.ReactNode[];
  onClick?: VoidFunction;
  className?: string;
  ariaLabel?: string;
}

const ViewTransitionLink: FC<ViewTransitionLinkProps> = React.forwardRef<
  HTMLAnchorElement,
  ViewTransitionLinkProps
>(({ to, children, onClick, ...props }, ref: ForwardedRef<HTMLAnchorElement>) => {
  const navigate = useTransitionNavigate();

  const handleClick = async (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault(); // Предотвращаем стандартное поведение браузера
    if (onClick) {
      onClick();
    }
    navigate(to); // Используем нашу улучшенную навигацию
  };

  return (
    <a ref={ref} href={to} onClick={handleClick} {...props}>
      {children}
    </a>
  );
});

ViewTransitionLink.displayName = 'ViewTransitionLink';

export default ViewTransitionLink;
```

Этот компонент соблюдает семантику (остается тегом `<a>` с href), что важно для SEO и доступности, но перехватывает клик для плавной навигации.

### Адаптация для Next.js (App Router)

С Server-Side Rendering (SSR) подход меняется. Здесь навигация — прерогатива Next.js, и нам нужно работать глобально, перехватывая клики по ссылкам.

Ниже реализация переходов для текущего моего личного веб-сайта. Тут я решил вопрос в лоб, менее элегантно и достаточно "топорно" в сравнении со своим рабочим клиентским проектом.

```tsx
'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useRef } from 'react';

export function ViewTransitions({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const isNavigatingRef = useRef(false);
  const supportsViewTransitionsRef = useRef(false);

  useEffect(() => {
    supportsViewTransitionsRef.current = 'startViewTransition' in document;

    if (!supportsViewTransitionsRef.current) {
      console.warn('View Transitions API not supported, using fallback');
      return;
    }

    // Функция "умного" префетча
    const prefetchInternal = (href: string) => {
      try {
        if (
          href &&
          !href.startsWith('http') && // Внешние ссылки
          !href.startsWith('mailto:') &&
          !href.startsWith('tel:') &&
          !href.includes('/resume') // Исключаем особые страницы
        ) {
          router.prefetch?.(href); // Используем встроенный префетч Next.js
        }
      } catch {}
    };

    // Префетч видимых ссылок после монтирования
    setTimeout(() => {
      const links = Array.from(document.querySelectorAll('a[href]')) as HTMLAnchorElement[];
      links.forEach((a) => {
        const href = a.getAttribute('href') || '';
        prefetchInternal(href);
        // Префетч при наведении для динамического контента
        a.addEventListener('mouseenter', () => prefetchInternal(href), { once: true });
      });
    }, 150);

    const handleLinkClick = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      const link = target.closest('a[href]') as HTMLAnchorElement;

      if (!link) return;

      const href = link.getAttribute('href');
      if (!href) return;

      // Фильтруем клики, которые не должны быть перехвачены
      if (
        href.startsWith('http') || // Внешние сайты
        href.startsWith('mailto:') ||
        href.startsWith('tel:') ||
        href.includes('#') || // Якорные ссылки
        href.includes('/resume') ||
        link.target === '_blank' ||
        event.ctrlKey || // Открытие в новой вкладке
        event.metaKey ||
        event.shiftKey
      ) {
        return;
      }

      // Защита от двойных кликов
      if (isNavigatingRef.current) {
        event.preventDefault();
        return;
      }

      // Перехват навигации
      event.preventDefault();
      isNavigatingRef.current = true;
      link.classList.add('transitioning'); // Класс для стилизации "активной" ссылки

      if (supportsViewTransitionsRef.current && document.startViewTransition) {
        document
          .startViewTransition(() => {
            return new Promise((resolve) => {
              prefetchInternal(href);
              router.push(href); // Навигация через Next.js Router
              setTimeout(resolve, 50); // Короткая задержка для App Router
            });
          })
          .finished.finally(() => {
            isNavigatingRef.current = false;
            link.classList.remove('transitioning');
          });
      } else {
        // Фоллбэк-навигация
        setTimeout(() => {
          prefetchInternal(href);
          router.push(href);
          isNavigatingRef.current = false;
          link.classList.remove('transitioning');
        }, 80);
      }
    };

    document.addEventListener('click', handleLinkClick);

    return () => {
      document.removeEventListener('click', handleLinkClick);
    };
  }, [router]);

  return <>{children}</>;
}
```

_Особенности Next.js реализации:_

- Глобальный перехватчик: Компонент-провайдер ViewTransitions оборачивает приложение и навешивает единый слушатель на document.

- "Умный" префетч: Мы уважаем логику Next.js, используя его `router.prefetch()`, но делаем это более агрессивно (при наведении), чтобы переход был мгновенным.

- Селективный перехват: Фильтрация по href критична. Мы не должны перехватывать клики по внешним ссылкам, якорям или при нажатии Ctrl/Cmd.

- Интеграция с App Router: Короткая задержка в `setTimeout(resolve, 50)` помогает App Router стабильно обработать навигацию перед захватом нового снимка.

## Магия в деталях: CSS для анимаций

Сам API отвечает за захват состояний, но финальный вид — дело CSS. Моя цель — неброские, целостные анимации, которые работают плавно и органично в темной теме.

```css
/*------APP VIEW TRANSITIONS-----------*/
/* 1. Базовый сброс для темной темы */
html::view-transition-old(root),
html::view-transition-new(root) {
  background: transparent; /* Убираем белые артефакты на стыке */
  mix-blend-mode: normal; /* Отключаем блендинг для четкости текста */
}

/* 2. Группировка и изоляция слоев */
html::view-transition-group(*),
html::view-transition-image-pair(*) {
  isolation: auto; /* Позволяет анимациям работать независимо */
}

/* 3. Анимация ухода старой страницы */
html::view-transition-old(root) {
  animation: 0.3s ease-out both pageFadeOut;
}

/* 4. Анимация появления новой страницы */
html::view-transition-new(root) {
  animation: 0.4s ease-out both pageFadeIn;
}

@keyframes pageFadeIn {
  from {
    opacity: 0;
    transform: translateY(10px); /* Легкое движение снизу */
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes pageFadeOut {
  from {
    opacity: 1;
    transform: translateY(0);
  }
  to {
    opacity: 0;
    transform: translateY(-10px); /* Легкое движение вверх */
  }
}
```

_Трюки для темной темы:_

- `background: transparent` решает проблему появления белой подложки или ореола вокруг анимируемых областей на темном фоне.

- `mix-blend-mode: normal` отключает смешивание слоев, которое по умолчанию может делать текст полупрозрачным и нечитаемым на сложном фоне.

- Разные длительности анимаций (0.3s и 0.4s) создают более естественное, "перекрывающееся" движение, имитирующее реальный переход.

## Кастомные анимации для разных разделов: управление через data-атрибуты

Вы спросите: а что если мне нужны не универсальные, а контекстно-зависимые переходы? Например, при входе в галерею изображений хочется эффекта затемнения, а при переходе между настройками — горизонтального сдвига. Глобальный CSS-код, который мы разбирали, не позволяет такой гибкости.

Моё текущее решение — использовать data-атрибуты как селекторы для CSS. Это даёт декларативный контроль над анимацией прямо из React-компонента страницы.

Создаём хук для управления атрибутом:

```typescript
export const TRANSITION_ATTR = 'data-custom-page-transition';

export const useTransitionAttribute = (value = 'active') => {
  useEffect(() => {
    // Устанавливаем атрибут на корневом элементе <html>
    document.documentElement.setAttribute(TRANSITION_ATTR, value);

    // Очищаем атрибут при размонтировании компонента (смене страницы)
    return () => {
      document.documentElement.removeAttribute(TRANSITION_ATTR);
    };
  }, [value]); // value можно менять динамически
};
```

Используем хук на целевых страницах:

```tsx
import { useTransitionAttribute } from '../hooks/useTransitionAttribute';

const GalleryPage = () => {
  // Эта страница получит кастомную анимацию
  useTransitionAttribute('gallery-mode');

  return <div>Контент галереи...</div>;
};
```

Создаём контекстно-зависимые CSS-анимации:

```css
/* Глобальные стили дополняем условными блоками */

/* Базовые анимации (как в основном примере) остаются */
html::view-transition-old(root),
html::view-transition-new(root) {
  background: transparent;
  mix-blend-mode: normal;
}

/* УНИВЕРСАЛЬНАЯ АНИМАЦИЯ: плавное появление */
html::view-transition-new(root) {
  animation: 0.4s ease-out both pageFadeIn;
}

/* КАСТОМНАЯ АНИМАЦИЯ 1: для галереи (затемнение) */
html[data-custom-page-transition='gallery-mode']::view-transition-old(root) {
  animation: 0.5s ease-in both galleryFadeOut;
}

html[data-custom-page-transition='gallery-mode']::view-transition-new(root) {
  animation: 0.6s ease-out both galleryFadeIn;
}

@keyframes galleryFadeIn {
  from {
    opacity: 0;
    filter: brightness(0.8);
    transform: scale(0.98);
  }
  to {
    opacity: 1;
    filter: brightness(1);
    transform: scale(1);
  }
}

@keyframes galleryFadeOut {
  from {
    opacity: 1;
    filter: brightness(1);
  }
  to {
    opacity: 0;
    filter: brightness(0.6);
  }
}
```

## Как это будет выглядеть с ViewTransition от React?

React [официально анонсировал](https://react.dev/blog/2025/04/23/react-labs-view-transitions-activity-and-more) экспериментальную поддержку View Transitions через специальный компонент еще в том году. Давайте посмотрим, как мой текущий production-код может эволюционировать с этой нативной интеграцией.

Будущий код с ViewTransition (по мотивам React Docs):

```tsx
import { ViewTransition, useViewTransition } from 'react';

function GalleryLink() {
  const { startViewTransition, isTransitioning } = useViewTransition();
  const navigate = useNavigate();

  const handleClick = () => {
    // React теперь управляет состоянием перехода
    startViewTransition(() => {
      navigate('/gallery');
    });
  };

  return (
    <button
      onClick={handleClick}
      disabled={isTransitioning} // React даёт состояние перехода "из коробки"
      aria-busy={isTransitioning}
    >
      {isTransitioning ? 'Переход...' : 'В галерею'}
    </button>
  );
}
```

Или ещё декларативнее — с компонентом-обёрткой:

```tsx
import { ViewTransition } from 'react';

function App() {
  return (
    <ViewTransition>
      {/* React будет автоматически применять анимации 
          при изменениях внутри этого компонента */}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/gallery" element={<Gallery />} />
      </Routes>
    </ViewTransition>
  );
}
```

_Ключевые отличия нативной интеграции React:_

- Декларативный подход вместо императивного вызова `document.startViewTransition()`.

- Встроенная координация с Concurrent Features — React сможет интеллектуально планировать анимации вместе с приостановкой (suspense) и другими обновлениями.

- Состояние "в процессе" из коробки — флаг `isTransitioning` доступен сразу, не нужно его реализовывать.

- Более тесная интеграция с рендер-циклом — потенциально меньше необходимости в искусственных задержках (`setTimeout`).

Нативная реализация React упростит базовое использование, но принципы, которые я использую уже год в продакшене (прогрессивное улучшение, управление состоянием перехода, CSS-кастомизация) останутся фундаментальными. Когда `<ViewTransition>` станет стабильным, перенести на него текущую логику будет прямой задачей. А пока — я, пользователи и клиент уже получаем все преимущества с текущим решением.

---

### Связанные заметки

- [[Настройка Workbox Background Sync для совместимости с iOS и Android WebView](/garden/workbox-background-sync)]
- [[Вычисление видимой части viewport](/garden/viewport)]
- [[Переход по DeepLink из Web](/garden/deeplink-web)]
- [[Конфликт оффлайн функциональности и ленивой подгрузки](/garden/offline-vs-lazy-loading)]
- [[Улучшение просмотра изображений](/garden/zoom)]
