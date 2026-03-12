---
title: Конфликт оффлайн функциональности и ленивой подгрузки
description: Когда нужно организовать работу в offline, то такое нефункциональное требование к веб-приложению порождает конфликт с механизмом оптимизации загрузки бандла путем разбиения его на чанки и последующей ленивой подгрузкой
date: 2026-03-12
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

## Критерии выбора критических чанков

- Основной функционал: страницы, без которых приложение не может выполнять свою основную задачу
- Первоочередные сценарии: действия, которые пользователь вероятнее всего будет выполнять в оффлайне
- Минимальный набор: чем меньше критических чанков, тем лучше для первоначальной загрузки

## Вывод

Баланс между производительностью и оффлайн-функциональностью достигается через осознанное разделение кода на критический и не-критический, с явным указанием webpack какие чанки должны быть сгруппированы вместе для оффлайн-доступности.

## Адаптация под Vite

Описанный выше подход родился в контексте webpack, где группировка чанков контролируется через магический комментарий webpackChunkName. При миграции на Vite (Rollup под капотом) механика меняется, но сам принцип остаётся.

### Проблема: нет webpackChunkName

Rollup не поддерживает магические комментарии webpack. Нельзя просто написать /_ webpackChunkName: "offline-critical" _/ и ожидать, что все импорты окажутся в одном чанке.

### Решение: группировка через модуль-агрегатор

Вместо аннотаций в комментариях мы полагаемся на естественное поведение Rollup: если несколько динамических импортов вызываются из одного модуля, Rollup склонен группировать их общие зависимости.
Файл offline-critical-chunk.ts остаётся агрегатором, но без магических комментариев (тут же пример, как импортировать компоненты без default-импортов):

```jsx
// offline-critical-chunk.ts
import React from 'react';

const RegistrationPage = React.lazy(() =>
  import('pages/RegistrationPage').then((module) => ({
    default: module.RegistrationPage,
  }))
);

const MainPage = React.lazy(() =>
  import('pages/MainPage').then((module) => ({ default: module.MainPage }))
);

const TaskPreview = React.lazy(() =>
  import('pages/TaskPreview').then((module) => ({
    default: module.TaskPreview,
  }))
);

const TaskStart = React.lazy(() =>
  import('pages/TaskStart').then((module) => ({ default: module.TaskStart }))
);

const SendingTask = React.lazy(() =>
  import('pages/SendingTaskPage').then((module) => ({
    default: module.SendingTaskPage,
  }))
);

const SendingSuccess = React.lazy(() =>
  import('pages/SendingSuccess').then((module) => ({
    default: module.SendingSuccess,
  }))
);

export { RegistrationPage, MainPage, TaskPreview, TaskStart, SendingTask, SendingSuccess };
```

Ключевое отличие — у каждого `React.lazy` используется `.then()` для извлечения именованного экспорта. Это связано с тем, что `React.lazy` ожидает модуль с default-экспортом, а в проекте принят паттерн именованных экспортов.
Прогрев чанка при старте
В webpack для предзагрузки использовался `/* webpackPrefetch: true */`. В Vite аналога нет, поэтому прогрев делается вручную — `void import()` в точке входа:

```ts
// main.tsx
serviceWorkerRegister();

try {
  // Прогреваем оффлайн-критичный чанк с ключевыми страницами,
  // чтобы при первом заходе как можно быстрее скачать их код.
  void import('./routes/offline-critical-chunk');
} catch {
  // Игнорируем ошибки
}
```

`void import()` запускает загрузку модуля в фоне, не блокируя рендеринг. Браузер скачает чанк в idle-время, и к моменту навигации на критическую страницу код уже будет в кэше.

### Многослойное кэширование в Service Worker

В webpack-версии достаточно было полагаться на precache манифест Workbox. При переходе на Vite с `vite-plugin-pwa` появляется возможность выстроить более гибкую стратегию.

#### Слой 1: Precache через injectManifest

`vite-plugin-pwa` со стратегией `injectManifest` на этапе сборки внедряет в service worker манифест со всеми статическими ассетами:

```ts
// vite.config.ts
VitePWA({
  strategies: 'injectManifest',
  srcDir: 'src',
  filename: 'service-worker.js',
  injectManifest: {
    globPatterns: ['**/*.{html,js,css}'],
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

Все HTML, JS и CSS файлы из билда попадают в precache при первой установке service worker. Это гарантирует, что оффлайн-критичные чанки будут доступны сразу.

#### Слой 2: Runtime-кэш для чанков

Precache покрывает текущую версию, но при обновлении приложения старые чанки удаляются из precache до того, как новые будут загружены. Для подстраховки добавляется отдельный runtime-кэш:

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

Это работает благодаря единому паттерну именования чанков в Vite-конфигурации:

```ts
// vite.config.ts
rollupOptions: {
  output: {
    chunkFileNames: 'chunks/[name]-[hash].js',
  },
}
```

Все чанки попадают в директорию `chunks/`, что позволяет перехватывать их одним регулярным выражением. CacheFirst-стратегия с 30-дневным TTL означает: однажды загруженный чанк не запрашивается с сервера повторно.

### Вывод

При миграции с webpack на Vite не нужно изобретать новые паттерны — достаточно адаптировать существующие под инструменты Rollup. Модуль-агрегатор выполняет ту же роль, что и webpackChunkName, а void import() заменяет webpackPrefetch. Многослойная стратегия кэширования в service worker делает оффлайн-доступность независимой от конкретного бандлера.

---

### Связанные заметки

- [[View Transitions в React — рабочий инструмент, который уже год в продакшене](/garden/view-transitions)]
- [[Настройка Workbox Background Sync для совместимости с iOS и Android WebView](/garden/workbox-background-sync)]
- [[Вычисление видимой части viewport](/garden/viewport)]
- [[Переход по DeepLink из Web](/garden/deeplink-web)]
- [[Улучшение просмотра изображений](/garden/zoom)]
