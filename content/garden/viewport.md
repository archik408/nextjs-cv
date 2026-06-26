---
title: Вычисление видимой части viewport
description: Meta viewport, interactive-widget, viewport-fit, dvh, safe-area и visualViewport API — как управлять видимой областью на мобильных
date: 2026-06-26
tags: [mobile, pwa, react, keyboard, viewport, css, safari, android]
---

## Полноценный скролл при открытой клавиатуре на мобильных устройствах

В мобильном вебе нативная клавиатура обычно перекрывает часть контента, предполагая временный характер ввода. Но иногда нужно сохранить всю область контента доступной для скролла даже с открытой клавиатурой — например, в чате, форме с длинным списком полей или PWA, где клавиатура открыта долго.

Чтобы выбрать правильный инструмент, полезно понимать, из каких «слоёв» состоит viewport и что именно настраивает `<meta name="viewport">`.

## Два viewport'а: layout и visual

Браузер на мобильном держит две связанные, но разные области:

- **Layout viewport** — «холст» страницы. Именно его размеры определяют `100vh`, `position: fixed` относительно документа и поведение скролла `document`.
- **Visual viewport** — реально видимая часть экрана. Когда появляется клавиатура, панель браузера или нативный UI, visual viewport сжимается или сдвигается, а layout viewport может остаться прежним.

Именно из-за этого `height: 100vh` на мобильном часто «вылезает» за видимую область: `vh` привязан к layout viewport, а пользователь видит меньше.

## `<meta name="viewport">` — базовая настройка

Тег задаёт, как мобильный браузер масштабирует и позиционирует страницу:

```html
<meta
  name="viewport"
  content="width=device-width, initial-scale=1, viewport-fit=cover, interactive-widget=resizes-content"
/>
```

Частые параметры:

| Параметр             | Зачем                                                                       |
| -------------------- | --------------------------------------------------------------------------- |
| `width=device-width` | Ширина layout viewport = ширине экрана, без «уменьшенной десктопной» версии |
| `initial-scale=1`    | Стартовый масштаб 1:1                                                       |
| `maximum-scale=1`    | Запрет зума (используйте осторожно — ломает доступность)                    |
| `viewport-fit`       | Как страница вписывается в экран с вырезами (см. ниже)                      |
| `interactive-widget` | Как виртуальная клавиатура влияет на viewport (см. ниже)                    |

Без этого тега мобильный Safari и Chrome отрисуют страницу как уменьшенный десктоп (~980px), и все CSS-решения для «видимой высоты» будут работать хуже.

## `interactive-widget` — реакция на виртуальную клавиатуру

Параметр описывает, что происходит с viewport, когда браузер показывает интерактивный виджет — чаще всего виртуальную клавиатуру. Три значения:

### `resizes-visual` (по умолчанию)

Сжимается только **visual viewport**. Layout viewport и размеры, посчитанные от `vh` / `100%` высоты документа, **не меняются**.

Поведение привычное для старых мобильных сайтов: клавиатура наезжает сверху, браузер может проскроллить к полю ввода, но «высота страницы» в CSS остаётся прежней. `100vh` по-прежнему считается от полного экрана без клавиатуры.

### `resizes-content`

Сжимается **layout viewport** — то есть «холст» страницы. Initial containing block тоже уменьшается, и **viewport-единицы (`vh`, `dvh`, `svh`, `lvh`) пересчитываются**.

Это то, что нужно, если хотите, чтобы flex/grid-раскладка и `height: 100%` реально подстраивались под область над клавиатурой без ручного JS. Контент «поднимается», а не прячется под клавиатурой.

```html
<meta name="viewport" content="width=device-width, interactive-widget=resizes-content" />
```

```css
.chat-layout {
  height: 100dvh; /* после resizes-content dvh совпадёт с видимой областью над клавиатурой */
  display: flex;
  flex-direction: column;
}
```

Поддержка: Chrome 108+, Firefox 132+, **Safari на iOS — пока нет** (в WebKit идёт разработка за feature flag, но в продакшене не работает).

### `overlays-content`

Ни layout, ни visual viewport **не меняют размер**. Клавиатура просто перекрывает страницу, как `position: fixed` оверлей.

Полезно, если вы сами управляете компоновкой через `visualViewport` или не хотите, чтобы браузер пересчитывал layout при каждом появлении клавиатуры. Минус — без дополнительной логики поле ввода может оказаться под клавиатурой.

### Сравнение

| Значение           | Layout viewport | Visual viewport | `vh`/`dvh` при клавиатуре | Типичный сценарий                |
| ------------------ | --------------- | --------------- | ------------------------- | -------------------------------- |
| `resizes-visual`   | без изменений   | сжимается       | не пересчитываются        | Классическое мобильное поведение |
| `resizes-content`  | сжимается       | сжимается       | пересчитываются           | Чат, форма, PWA на весь экран    |
| `overlays-content` | без изменений   | без изменений   | не пересчитываются        | Полный контроль через JS/CSS     |

## iOS: почему `visualViewport` всё ещё актуален

На Android с `interactive-widget=resizes-content` часто достаточно правильного meta-тега и `dvh`. На **iOS Safari и WebView параметр `interactive-widget` сейчас не поддерживается** — Safari по-прежнему ведёт себя как `resizes-visual`: сдвигает layout и сжимает visual viewport, но не даёт выбрать режим через meta.

Поэтому для кросс-платформенного PWA по-прежнему нужен ручной трекинг `window.visualViewport` — по сути полифилл для `resizes-content`.

## Решение через `visualViewport` API

Отслеживаем реальную высоту видимой области:

```javascript
import { useEffect, useState } from 'react';

const useVisualViewportHeight = () => {
  const [height, setHeight] = useState(window.innerHeight);

  const handleResize = () => {
    const newHeight = window.visualViewport ? window.visualViewport.height : window.innerHeight;
    setHeight(newHeight);
  };

  useEffect(() => {
    const viewport = window.visualViewport || window;
    handleResize();

    viewport.addEventListener('resize', handleResize);
    return () => viewport.removeEventListener('resize', handleResize);
  }, []);

  return height;
};
```

Как использовать:

```javascript
const Component = () => {
  const viewportHeight = useVisualViewportHeight();

  return (
    <div style={{ height: viewportHeight, overflowY: 'auto' }}>
      {/* Контент скроллится в пределах видимой области */}
    </div>
  );
};
```

_Особенности_

- `visualViewport.height` возвращает высоту области, не занятой клавиатурой
- Fallback на `window.innerHeight` для браузеров без `visualViewport`
- Автоматическое обновление при появлении/скрытии клавиатуры
- На iOS — основной рабочий инструмент; на Android — запасной вариант, если meta-тега недостаточно
- Протестировано на сотнях тысяч пользователей Android/iOS

_Преимущества_

- Контент остаётся доступным для взаимодействия
- Плавная адаптация под разные размеры клавиатуры
- Кросс-браузерная совместимость

## `viewport-fit` — экраны с вырезами и скруглениями

Параметр говорит, как вписать страницу в физический дисплей (iPhone с notch, Android с punch-hole, PWA в standalone):

```html
<meta name="viewport" content="width=device-width, viewport-fit=cover" />
```

| Значение  | Поведение                                                                              |
| --------- | -------------------------------------------------------------------------------------- |
| `auto`    | Страница рисуется в «безопасном» прямоугольнике, вырезы не затрагивают layout viewport |
| `contain` | Viewport вписан в наибольший вписанный прямоугольник внутри дисплея                    |
| `cover`   | Viewport растягивается на весь дисплей, включая области под notch и home indicator     |

`cover` — стандарт для полноэкранных PWA: фон и hero могут уходить под системные зоны, а важный контент отступает через safe area (см. ниже).

## `dvh` и `env(safe-area-inset-*)` — нативный UI, но не клавиатура

Эти инструменты решают **другую** задачу: вырезы, статус-бар, home indicator, жест «потянуть чтобы свернуть», нативные панели браузера. **С виртуальной клавиатурой они не помогают** (если только браузер не поддерживает `interactive-widget=resizes-content` и не пересчитывает `dvh` при появлении клавиатуры).

### `dvh` (dynamic viewport height)

```css
.app-shell {
  min-height: 100dvh;
}
```

- `svh` — small viewport height: минимальная видимая высота (панели браузера развёрнуты)
- `lvh` — large viewport height: максимальная (панели скрыты)
- `dvh` — **текущая** видимая высота, меняется при скрытии/показе адресной строки

На мобильном `100vh` часто равен `lvh` — страница оказывается выше видимой области. `100dvh` подстраивается под реальную высоту окна **без клавиатуры**.

### `safe-area-inset-*`

Когда стоит `viewport-fit=cover`, контент может залезть под notch или индикатор «домой». CSS-переменные окружения задают отступы от физических краёв:

```css
.header {
  padding-top: env(safe-area-inset-top);
}

.footer,
.floating-action {
  padding-bottom: env(safe-area-inset-bottom);
}

/* Удобный шорткат с fallback для старых браузеров */
.page {
  padding: max(16px, env(safe-area-inset-top)) max(16px, env(safe-area-inset-right))
    max(16px, env(safe-area-inset-bottom)) max(16px, env(safe-area-inset-left));
}
```

Типичные задачи:

- кнопка «Назад» / меню не попадает под статус-бар в standalone PWA;
- нижняя навигация не перекрывается home indicator;
- фиксированный CTA не оказывается в зоне системного жеста сворачивания;
- полноэкранный фон (`cover`) + читаемый контент в safe area.

## Что использовать когда

| Задача                                       | Инструмент                                          |
| -------------------------------------------- | --------------------------------------------------- |
| Клавиатура сжимает layout на Android         | `interactive-widget=resizes-content` + `dvh`        |
| Клавиатура на iOS / кросс-платформа          | `visualViewport` + JS-хук (как выше)                |
| Вырез, notch, home indicator                 | `viewport-fit=cover` + `env(safe-area-inset-*)`     |
| Адресная строка браузера прячется/появляется | `dvh` вместо `vh`                                   |
| Клавиатура не должна трогать layout          | `interactive-widget=overlays-content` + свой скролл |
| Полный контроль высоты контейнера            | `visualViewport.height` в state/style               |

На практике в PWA часто комбинируют: `viewport-fit=cover`, `safe-area-inset` для шапки и таббара, `dvh` для оболочки приложения и `visualViewport` (или `resizes-content` на Android) для экранов с длительным вводом.

---

### Связанные заметки

- [[View Transitions в React — рабочий инструмент, который уже год в продакшене](/garden/view-transitions)]
- [[Настройка Workbox Background Sync для совместимости с iOS и Android WebView](/garden/workbox-background-sync)]
- [[Переход по DeepLink из Web](/garden/deeplink-web)]
- [[Конфликт оффлайн функциональности и ленивой подгрузки](/garden/offline-vs-lazy-loading)]
- [[Улучшение просмотра изображений](/garden/zoom)]
