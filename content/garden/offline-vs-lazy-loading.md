---
title: Конфликт оффлайн функциональности и ленивой подгрузки
description: Когда нужно организовать работу в offline, то такое нефункциональное требование к веб-приложению порождает конфликт с механизмом оптимизации загрузки бандла путем разбиения его на чанки и последующей ленивой подгрузкой
date: 2026-06-30
tags: [pwa, mobile, offline, react, webpack, vite, optimization]
---

## Проблема

При разработке веб-приложений с поддержкой offline-работы возникает конфликт между:

- **Функциональным требованием**: возможность работы приложения без интернет-соединения
- **Механизмом оптимизации**: разбиение бандла на чанки с ленивой подгрузкой

Ленивая загрузка предполагает, что неиспользуемые части приложения загружаются по мере необходимости, но в оффлайн-режиме это становится невозможным.

## Компромиссное решение

Четкое разделение чанков на две категории:

### 1. Критические для оффлайн-работы

Должны быть загружены после первого посещения приложения

### 2. Не-критические

Могут загружаться лениво, ими можно пожертвовать в оффлайн-режиме

## Реализация

Создаем отдельный файл для группировки критических чанков:

```typescript
// offline-critical-chunk.ts
import React from 'react';

const RegistrationPage = React.lazy(
  () => import(/* webpackChunkName: "offline-critical" */ 'pages/RegistrationPage')
);

const MainPage = React.lazy(
  () => import(/* webpackChunkName: "offline-critical" */ 'pages/MainPage')
);

const SendingSuccess = React.lazy(
  () => import(/* webpackChunkName: "offline-critical" */ 'pages/SendingSuccess')
);

const SendingTask = React.lazy(
  () => import(/* webpackChunkName: "offline-critical" */ 'pages/SendingTask')
);

const TaskPreview = React.lazy(
  () => import(/* webpackChunkName: "offline-critical" */ 'pages/TaskPreview')
);

const TaskStart = React.lazy(
  () => import(/* webpackChunkName: "offline-critical" */ 'pages/TaskStart')
);

export { RegistrationPage, MainPage, TaskPreview, TaskStart, SendingTask, SendingSuccess };
```

Использование в роутинге:

```jsx
// routes.ts
import {
  RegistrationPage,
  MainPage,
  TaskPreview,
  TaskStart,
  SendingTask,
  SendingSuccess,
} from './offline-critical-chunk';

// Не-критические страницы (ленивая загрузка)
const HistoryPage = React.lazy(() => import('pages/HistoryPage'));
const MapPage = React.lazy(() => import('pages/MapPage'));
const ProfilePage = React.lazy(() => import('pages/ProfilePage'));
const ReferralPage = React.lazy(() => import('pages/ReferralPage'));
const RatingPage = React.lazy(() => import('pages/RatingPage'));

// Пример роута для критической страницы
<Route
  path={Routes.REGISTRATION}
  element={
    <ErrorBoundary>
      <AuthWrapper>
        <Suspense fallback={<Loader />}>
          <RegistrationPage />
        </Suspense>
      </AuthWrapper>
    </ErrorBoundary>
  }
/>;
```

Точка входа пользователя — `RegistrationPage` или `MainPage`. Обе входят в чанк `offline-critical`, поэтому при первом заходе в приложение скачивается весь этот чанк целиком — вместе с остальными страницами, нужными для offline. Отдельный preload здесь не нужен: его роль выполняет сам entry-route.

## Критерии выбора критических чанков

- Основной функционал: страницы, без которых приложение не может выполнять свою основную задачу
- Первоочередные сценарии: действия, которые пользователь вероятнее всего будет выполнять в оффлайне
- Минимальный набор: чем меньше критических чанков, тем лучше для первоначальной загрузки

## Вывод

Баланс между производительностью и оффлайн-функциональностью достигается через осознанное разделение кода на критический и не-критический, с явным указанием webpack какие чанки должны быть сгруппированы вместе для оффлайн-доступности.

## Адаптация под Vite

Описанный выше подход родился в контексте webpack, где группировка чанков контролируется через магические комментарии. В Vite (Rollup/Rolldown) этот слой контроля другой, а главное — меняется поведение "прогрева" ленивых страниц.

### Что важно понимать в Vite + React.lazy

- `import('./routes/offline-critical-chunk')` прогревает только модуль-агрегатор.
- Если внутри агрегатора страницы описаны через `React.lazy(() => import('pages/...'))`, реальные page-chunks **не загружаются** до первого рендера компонента.
- Если агрегатор уже статически импортируется в роутере, динамический `import()` этого же файла становится неэффективным (bundler это обычно подсвечивает).

Именно поэтому прогрев нужно делать не агрегатором, а прямыми `import('pages/...')`.

### Корректный прогрев оффлайн-критичных страниц

```ts
// routes/offline-critical-chunk.ts
import React from 'react';

const loadRegistrationPage = () => import('pages/RegistrationPage');
const loadMainPage = () => import('pages/MainPage');
const loadTaskPreviewPage = () => import('pages/TaskPreview');
const loadTaskStartPage = () => import('pages/TaskStart');
const loadSendingTaskPage = () => import('pages/SendingTask');
const loadSendingSuccessPage = () => import('pages/SendingSuccess');

export function preloadOfflineCriticalPages(): Promise<void> {
  return Promise.allSettled([
    loadRegistrationPage(),
    loadMainPage(),
    loadTaskPreviewPage(),
    loadTaskStartPage(),
    loadSendingTaskPage(),
    loadSendingSuccessPage(),
  ]).then(() => undefined);
}

const RegistrationPage = React.lazy(() =>
  loadRegistrationPage().then((module) => ({ default: module.RegistrationPage }))
);

const MainPage = React.lazy(() => loadMainPage().then((module) => ({ default: module.MainPage })));

// ... остальные lazy-страницы по той же схеме
```

```ts
// main.tsx
import { preloadOfflineCriticalPages } from 'routes/offline-critical-chunk';

window.requestIdleCallback(() => {
  void preloadOfflineCriticalPages();
});
```

Так страницы остаются разрезанными на чанки, но их код начинает загружаться сразу после старта приложения.

### Кэширование в Service Worker

`preloadOfflineCriticalPages` скачивает критические page-chunks при старте. Чтобы они переживали повторный offline-заход, ответы должны попасть в Cache Storage: shell/main/index — через precache и настройку manifest, чанки из chunks/ — через runtime-кэш и прогрев.

#### Слой 1: Precache через injectManifest

`vite-plugin-pwa` со стратегией `injectManifest` на этапе сборки внедряет в Service Worker манифест со всеми статическими ассетами:

```ts
// vite.config.ts
VitePWA({
  strategies: 'injectManifest',
  srcDir: 'src',
  filename: 'service-worker.js',
  injectManifest: {
    globPatterns: ['**/*.{html,js,css}'],
    globIgnores: ['chunks/**', '**/node_modules/**'],
    maximumFileSizeToCacheInBytes: 20 * 1024 * 1024,
  },
});
```

```js
// service-worker.js
const manifest = self.__WB_MANIFEST;
precacheAndRoute(manifest, {
  ignoreURLParametersMatching: [/.*/],
});
```

Все HTML, JS и CSS файлы из билда попадают в precache при первой установке Service Worker. Исключение только чанки и библиотеки, которые будут загружаться по мере необходимости при навигации.
Оффлайн-критичные чанки будут доступны, так как прогреваются кодом через `preloadOfflineCriticalPages`.

#### Слой 2: Runtime-кэш для чанков

Чанки из chunks/ намеренно исключены из precache, чтобы не раздувать install-манифест. Их offline-доступность даёт runtime-кэш: всё, что скачали preload’ом или по ходу навигации, остаётся в chunk-cache:

```js
// service-worker.js
const chunkFileRegexp = /chunks\/.*\.js$/;

registerRoute(
  ({ request, url }) => {
    return (
      request.destination === 'script' &&
      chunkFileRegexp.test(url.pathname) &&
      !url.pathname.includes('hot-update')
    );
  },
  new CacheFirst({
    cacheName: 'chunk-cache',
    plugins: [
      new CacheableResponsePlugin({ statuses: [0, 200] }),
      new ExpirationPlugin({ maxAgeSeconds: 60 * 60 * 24 * 30 }),
    ],
  })
);
```

Дополнительно этот слой смягчает гонки при обновлении приложения, когда на экране ещё живут старые hash-URL.

Это работает благодаря единому паттерну именования чанков в Vite-конфигурации:

```ts
// vite.config.ts
rollupOptions: {
  output: {
    chunkFileNames: 'chunks/[name]-[hash].js',
  },
}
```

CacheFirst с TTL 30 дней означает: пока запись в кэше жива, повторный запрос того же URL идёт из кэша. После истечения TTL, вытеснения или очистки кэша снова нужна сеть. Для hashed-имён ([name]-[hash].js) это обычно приемлемо: новый деплой = новые URL.

### Вывод

При миграции с webpack на Vite не нужно изобретать новые паттерны — достаточно адаптировать существующие под инструменты Rollup/Rolldown.

В webpack `webpackChunkName` склеивает критические страницы в один файл. В Vite агрегатор не склеивает чанки — у каждой страницы свой `import()`, а роль "забрать критическое заранее" выполняет явный `preloadOfflineCriticalPages()`.

Многослойная стратегия кэширования в Service Worker делает оффлайн-доступность независимой от конкретного бандлера.

---

### Связанные заметки

- [[Recovery и observability для PWA после сбоя загрузки](/garden/pwa-recovery-observability)]
- [[View Transitions в React — рабочий инструмент, который уже год в продакшене](/garden/view-transitions)]
- [[Настройка Workbox Background Sync для совместимости с iOS и Android WebView](/garden/workbox-background-sync)]
- [[Вычисление видимой части viewport](/garden/viewport)]
- [[Переход по DeepLink из Web](/garden/deeplink-web)]
- [[Улучшение просмотра изображений](/garden/zoom)]
