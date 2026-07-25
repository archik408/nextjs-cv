---
title: View Transitions в React — рабочий инструмент, который уже год в продакшене
description: View Transitions API уже год в продакшене мобильного WebView. Разбор интеграции, именованных групп и артефактов Safari — без ожидания React ViewTransition.
date: 2026-01-20
tags: [pwa, mobile, ssr, react, animation]
---

Когда React в экспериментальном канале анонсировал работу над [компонентом `ViewTransition`](https://react.dev/reference/react/ViewTransition), вокруг поднялся ажиотаж — и это понятно. Но [View Transitions API](https://developer.mozilla.org/en-US/docs/Web/API/View_Transition_API) к тому моменту уже не был новостью из будущего: больше года он живёт в продакшене моего гибридного PWA в WebView и на этом сайте.

Пока все обсуждают RFC и эксперименты, я и мои пользователи уже давно пользуемся плавными переходами между страницами. Ниже — не туториал «как сделать fade», а то, что пришлось выстрадать на реальных роутах: прослойка вокруг `navigate`, CSS для тёмной темы, изоляция хедера и таббара, артефакты Safari с `filter: blur`. React-обёртки упростят связку с навигацией; принципы останутся теми же.

## Реальная проблема и реальное решение

Моё рабочее приложение — гибридное PWA/SPA на React 18 с React Router внутри WebView. Задача была классической: уйти от резких, «дёрганых» переходов между роутами к чему-то плавному и целостному — чтобы ощущалось единое приложение, а не набор отдельных страниц.

**View Transitions API** [предлагает элегантную парадигму](https://developer.chrome.com/docs/web-platform/view-transitions?hl=ru): вы говорите браузеру — «вот текущее состояние DOM, вот новое, анимируй изменение между ними». Браузер делает тяжёлую работу: снимает кадры, накладывает их друг на друга и анимирует на GPU. Наша задача — вовремя вызвать `document.startViewTransition`, дождаться осмысленного нового кадра и не анимировать то, что должно стоять на месте.

## Интеграция в SPA: идея важнее листинга

В основе — хук-прослойка между вашим кодом и `navigate` из React Router: фоллбэк без API, защита от повторных кликов, короткая пауза после навигации (чтобы React успел отрисовать новый экран до снимка «нового» состояния), `skipTransition()` при ошибке ленивой загрузки роута.

```typescript
export const useTransitionNavigate = () => {
  const navigate = useNavigate();
  const isTransitioningRef = useRef(false);
  const isMountedRef = useRef(true);

  useEffect(
    () => () => {
      isMountedRef.current = false;
    },
    []
  );

  return useCallback(
    (to: To | number) => {
      if (!isMountedRef.current || isTransitioningRef.current) return;

      if (!document.startViewTransition) {
        navigate(to as To);
        return;
      }

      isTransitioningRef.current = true;

      const transition = document.startViewTransition(async () => {
        try {
          // Даём роутеру и React время отрисовать «новый» DOM
          await new Promise<void>((resolve) => {
            navigate(to as To);
            setTimeout(resolve, 100);
          });
        } catch (err) {
          transition.skipTransition();
          throw err;
        }
      });

      transition.ready.catch(() => {
        isTransitioningRef.current = false;
      });

      transition.finished.finally(() => {
        if (isMountedRef.current) isTransitioningRef.current = false;
      });
    },
    [navigate]
  );
};
```

На что смотреть в проде:

- **`isTransitioning` / `isMounted` через `ref`**, а не через state в зависимостях `useCallback` — иначе легко поймать устаревшее замыкание или лишние пересоздания колбэка.
- **`setTimeout` после `navigate`** — рабочий приём, а не «правильное API». Без него снимок нового состояния часто ловит пустой или скелетонный экран.
- **Прогрессивное улучшение** — без `startViewTransition` просто обычный переход. В старом WebView анимации нет, но и ничего не ломается.

На основе хука — ссылка, которая остаётся семантическим `<a href>` (важно для SEO и доступности), а клик уходит в нашу навигацию:

```tsx
const ViewTransitionLink = React.forwardRef<
  HTMLAnchorElement,
  { to: string; children: React.ReactNode; onClick?: () => void; 'aria-label'?: string }
>(function ViewTransitionLink({ to, children, onClick, ...props }, ref) {
  const navigate = useTransitionNavigate();

  return (
    <a
      ref={ref}
      href={to}
      {...props}
      onClick={(e) => {
        e.preventDefault();
        onClick?.();
        navigate(to);
      }}
    >
      {children}
    </a>
  );
});
```

## Next.js (App Router): сначала карта вариантов

Со Server-Side Rendering подход меняется. Навигация — прерогатива Next.js, поэтому «обернуть `navigate`» уже не всегда лучший путь.

Что есть сегодня:

1. **Встроенный путь Next** — флаг [`experimental.viewTransition`](https://nextjs.org/docs/app/api-reference/config/next-config-js/viewTransition) и [гайд по дизайну переходов](https://nextjs.org/docs/app/guides/view-transitions). Маршруты идут через React Transition, анимации задаются CSS и `<ViewTransition>`.
2. **Сторонние пакеты** вроде [`next-view-transitions`](https://github.com/shuding/next-view-transitions) — готовые `Link` и обёртки layout, если не хотите тащить экспериментальный флаг.
3. **Глобальный перехват кликов** — то, что у меня на личном сайте: просто, но топорно. Имеет смысл как запасной вариант и способ понять механику, не как «канон 2026».

Сжатая схема третьего варианта:

```tsx
'use client';

export function ViewTransitions({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const busy = useRef(false);

  useEffect(() => {
    if (!('startViewTransition' in document)) return;

    const onClick = (event: MouseEvent) => {
      const link = (event.target as HTMLElement).closest('a[href]') as HTMLAnchorElement | null;
      const href = link?.getAttribute('href');
      if (!link || !href) return;

      // Внешние ссылки, якоря, blank, модификаторы — не трогаем
      if (
        href.startsWith('http') ||
        href.includes('#') ||
        link.target === '_blank' ||
        event.metaKey ||
        event.ctrlKey
      ) {
        return;
      }

      if (busy.current) {
        event.preventDefault();
        return;
      }

      event.preventDefault();
      busy.current = true;

      document
        .startViewTransition(() => {
          router.push(href);
          return new Promise((r) => setTimeout(r, 50));
        })
        .finished.finally(() => {
          busy.current = false;
        });
    };

    document.addEventListener('click', onClick);
    return () => document.removeEventListener('click', onClick);
  }, [router]);

  return <>{children}</>;
}
```

Для нового Next-проекта я бы начинал с пункта 1 или 2. Дальше в статье важнее не обвязка навигации, а то, **что** анимировать.

## Магия в деталях: CSS для анимаций

Сам API отвечает за захват состояний, но финальный вид — дело CSS. Цель — спокойное появление и лёгкий сдвиг без белых вспышек на тёмном фоне:

```css
html::view-transition-old(root),
html::view-transition-new(root) {
  background: transparent; /* без белой подложки на стыке */
  mix-blend-mode: normal; /* текст не «мылится» смешиванием слоёв */
}

html::view-transition-group(*),
html::view-transition-image-pair(*) {
  isolation: auto;
}

html::view-transition-old(root) {
  animation: 0.3s ease-out both pageFadeOut;
}

html::view-transition-new(root) {
  animation: 0.4s ease-out both pageFadeIn;
}

@keyframes pageFadeIn {
  from {
    opacity: 0;
    transform: translateY(10px);
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
    transform: translateY(-10px);
  }
}
```

Разные длительности ухода и появления дают лёгкое перекрытие — переход ощущается естественнее, чем синхронный кроссфейд один к одному.

И сразу: `@media (prefers-reduced-motion: reduce)` должен гасить и `root`, и именованные группы (таббар и хедер). Иначе «статичная» оболочка вдруг поедет у тех, кто анимации отключил.

## А если я хочу анимировать только часть страницы при переходе?

По умолчанию View Transitions анимирует весь снимок страницы через `root`. Это хорошо для «целого» перехода, но в реальном приложении часто есть постоянный хедер и таббар. Их не нужно «дёргать» вместе с контентом на каждом роуте — наоборот, они должны ощущаться статичными.

А на отдельных экранах поведение может меняться: например, как на скриншоте ниже, при входе на карту таббар должен плавно уехать вниз за край экрана.

![Хедер остаётся на месте, таббар на карте уезжает вниз](/garden/view-transitions/tabbar-header.webp)

Хедер при этом тоже не должен смещаться вместе с `root`-анимацией. Но у него есть своя ловушка: заголовок меняется («Задания» → «Задания на карте»), и если оставить дефолтный morph без изоляции, старый и новый текст на долю секунды накладываются друг на друга и становятся нечитаемой кашей.

Решение одно и то же для всех таких кусков интерфейса: вынести их из общего снимка через изолированные `view-transition-name` и задать каждой группе свою анимацию (или вовсе отключить её).

### Изолируем через `view-transition-name`

Имена уникальны в пределах документа: одновременно не больше одного элемента с конкретным `view-transition-name`. В продакшене я вешаю их прямо на корневые классы хедера и таббара:

```scss
.header {
  view-transition-name: header;
}

.tabbar {
  view-transition-name: tabbar;
}
```

После этого браузер создаёт отдельные группы перехода — их можно стилизовать независимо от `root`.

### Таббар: статичен почти всегда, уезжает только когда исчезает

Если таббар есть и на старом, и на новом экране, нам не нужна анимация — просто «держим» его на месте. Анимация нужна только когда элемент появляется или исчезает целиком. Для этого удобен псевдокласс `:only-child` у `::view-transition-old` / `::view-transition-new`: он срабатывает, когда в паре снимков остался один (элемент ушёл из DOM или только появился).

```css
html::view-transition-group(tabbar) {
  z-index: var(--tabbar-layer-index);
}

/* Оба снимка есть → таббар статичен, не дёргается вместе с root */
html::view-transition-old(tabbar),
html::view-transition-new(tabbar) {
  animation: none;
}

/* Уход: на карте таббара нет → старый снимок уезжает вниз за экран */
html::view-transition-old(tabbar):only-child {
  animation: 0.3s ease-out both slideOut;
}

/* Появление: обратный переход с карты → новый снимок выезжает снизу */
html::view-transition-new(tabbar):only-child {
  animation: 0.3s ease-out both slideIn;
}

@keyframes slideOut {
  from {
    transform: translateY(0);
  }
  to {
    transform: translateY(100%);
  }
}

@keyframes slideIn {
  from {
    transform: translateY(100%);
  }
  to {
    transform: translateY(0);
  }
}
```

Так таббар «живёт своей жизнью»: на обычных переходах между вкладками он не участвует в появлении и сдвиге контента, а при уходе на полноэкранную карту — аккуратно съезжает вниз.

### Хедер: позиция стабильна, текст — отдельный fade

Хедер выносим в свою группу и вместо дефолтного morph даём простой кроссфейд. Сам блок остаётся на месте (не едет с `translateY` у `root`), а заголовки не наслаиваются буквой на букву:

```css
html::view-transition-group(header) {
  z-index: var(--header-layer-index);
}

html::view-transition-old(header) {
  animation: 0.3s ease-out both fadeOut;
}

html::view-transition-new(header) {
  animation: 0.3s ease-out both fadeIn;
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

@keyframes fadeOut {
  from {
    opacity: 1;
  }
  to {
    opacity: 0;
  }
}
```

Итоговая схема: `root` анимирует основной контент, постоянная оболочка экрана — отдельно, со своими правилами. Пользователь воспринимает приложение как одно целое, а не как набор мигающих страниц с прыгающим низом и верхом.

### Артефакты: когда CSS-фильтры «отваливаются» в снимке

Изоляция нужна не только для удобства, но и чтобы чинить артефакты. В примере ниже на реферальной странице фон сделан через градиентное размытие (`filter: blur(...)` на цветных кругах). В обычном состоянии всё выглядит мягко. Но в промежуточном кадре view transition Safari / iOS WebView часто **не запекает filter в растровый снимок** — и вместо размытого свечения вылезают сырые фиолетовые круги.

![Промежуточный кадр: filter:blur пропал, остались фиолетовые круги](/garden/view-transitions/blur-snapshot.webp)

Лечится тем же приёмом: вынести слой размытия из снимка `root` и для старого/нового состояния **выключить** анимацию (старое сразу спрятать, новое показать без задержки):

```scss
.blurWrapper {
  /* на iOS filter: blur часто не попадает в снимок перехода */
  view-transition-name: gradient-blur-bg;
}
```

```css
html::view-transition-old(gradient-blur-bg) {
  animation: none;
  opacity: 0;
}

html::view-transition-new(gradient-blur-bg) {
  animation: none;
}
```

Практика простая: если элемент в промежуточном состоянии «ломается» (фильтры, сложное смешивание слоёв, тяжёлые эффекты) — не тащите его через общий morph. Дайте `view-transition-name`, отключите анимацию группы и пусть он просто сменится мгновенно. Лучше честный кадр без эффекта на 300 ms, чем заметный глюк посреди перехода.

Именно этот слой работы — постоянная оболочка плюс обход артефактов — отличает «поставил fade на root» от ощущения нативного приложения. После него жалобы на «дёрганые» экраны в WebView ушли туда, куда и должны: в крайние случаи и старые контейнеры без API.

## Кастомные анимации для разных разделов

Вы спросите: а что если нужны не универсальные, а контекстно-зависимые переходы? Например, при входе в галерею — эффект затемнения, между настройками — горизонтальный сдвиг. Удобный рычаг — data-атрибут на `<html>` как селектор для CSS.

```typescript
export const TRANSITION_ATTR = 'data-custom-page-transition';

export const useTransitionAttribute = (value = 'active') => {
  useEffect(() => {
    document.documentElement.setAttribute(TRANSITION_ATTR, value);
    return () => {
      document.documentElement.removeAttribute(TRANSITION_ATTR);
    };
  }, [value]);
};
```

```css
html[data-custom-page-transition='gallery-mode']::view-transition-old(root) {
  animation: 0.5s ease-in both galleryFadeOut;
}

html[data-custom-page-transition='gallery-mode']::view-transition-new(root) {
  animation: 0.6s ease-out both galleryFadeIn;
}
```

Важный нюанс по времени: cleanup в `useEffect` снимает атрибут при размонтировании страницы. К моменту снимка нового состояния входящий экран может ещё не успеть выставить свой режим — и середина перехода уйдёт в дефолтный CSS. Надёжнее выставлять атрибут **до** `startViewTransition` (из обёртки навигации по целевому роуту) или держать его на layout, который переживает смену дочернего роута.

## Послесловие: что даст React `<ViewTransition>`

Экспериментальный [`ViewTransition`](https://react.dev/blog/2025/04/23/react-labs-view-transitions-activity-and-more) (и интеграция в Next) уберёт часть обвязки: меньше ручных `startViewTransition` и `setTimeout`, лучше стыковка с Suspense и Concurrent. API ещё меняется — ниже скорее направление, не контракт:

```tsx
import { ViewTransition } from 'react';

// Имена и типы переходов — декларативно; CSS остаётся вашим
<ViewTransition name="header" default="none">
  <AppHeader title={title} />
</ViewTransition>;
```

Смысл статьи от этого не меняется: **прогрессивное улучшение, изоляция постоянных элементов интерфейса, отдельные анимации для текста, обход артефактов Safari**. React сократит связку с навигацией; вкус перехода по-прежнему в CSS и в том, _что_ вы сознательно не анимируете.

А экосистема вокруг API уже обрастает утилитами — на Google I/O 2026 показали [View Transitions Toolkit](https://chrome.dev/view-transitions-toolkit/) (`npm i view-transitions-toolkit`). Похоже на ранний Workbox для Service Worker: не обязателен, но может стать удобным слоем над низкоуровневым API.

Пока стабильный `<ViewTransition>` дозревает, пользователи и клиент уже получают пользу от платформенного API. Это и есть рабочий инструмент, а не анонс из будущего.

---

### Связанные заметки

- [[Вычисление видимой части viewport](/garden/viewport)]
- [[Переход по DeepLink из Web](/garden/deeplink-web)]
- [[Конфликт оффлайн функциональности и ленивой подгрузки](/garden/offline-vs-lazy-loading)]
- [[Recovery и observability для PWA после сбоя загрузки](/garden/pwa-recovery-observability)]
- [[Настройка Workbox Background Sync для совместимости с iOS и Android WebView](/garden/workbox-background-sync)]
- [[Улучшение просмотра изображений](/garden/zoom)]
