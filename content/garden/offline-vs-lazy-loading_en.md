---
title: When offline support collides with lazy loading
description: Code splitting assumes the network will be there when the user navigates; offline support assumes it will not. How I split chunks into offline-critical and expendable, why the webpack trick does not survive the move to Vite, and the Service Worker layers that keep the critical code around.
date: 2026-06-30
tags: [pwa, mobile, offline, react, webpack, vite, optimization]
---

Two requirements that sound perfectly reasonable on their own turn out to contradict each other the moment you ship them together. The product wants the app to keep working without a connection. The performance budget wants the bundle split into chunks that are fetched only when someone actually walks into that part of the app. Both are correct, and they cannot both be true for the same chunk.

This note is about how I resolve that in a mobile PWA: which chunks earn the right to be downloaded eagerly, how the mechanics differ between webpack and Vite, and what the Service Worker has to do so the answer survives a second, offline visit.

## The conflict

In an app with offline support, these two pull in opposite directions:

- **The functional requirement**: the app has to work with no internet connection.
- **The optimization mechanism**: the bundle is split into chunks that load lazily.

Lazy loading is built on the assumption that whatever has not been loaded yet can be fetched later. Offline, "later" never arrives. A route the user has never visited is a route that does not exist, and `React.lazy` resolves into a failed dynamic `import()` instead of a page.

## The compromise

Stop treating all code as equally deferrable and split the chunks into two explicit categories.

### 1. Offline-critical

Must be on the device after the very first visit, whether or not the user has navigated there yet.

### 2. Expendable

Can load lazily, and can simply be unavailable offline. Losing them degrades the app; it does not break it.

The whole design comes down to keeping that first category deliberately small and being honest that the second one is a feature you are choosing to sacrifice.

## Implementation

Group the critical chunks in a file of their own. In webpack, [magic comments](https://webpack.js.org/api/module-methods/#magic-comments) let you name the target chunk, and pages that share a `webpackChunkName` end up in the same output file:

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

Wiring it into the router:

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

// Expendable pages (lazy loaded)
const HistoryPage = React.lazy(() => import('pages/HistoryPage'));
const MapPage = React.lazy(() => import('pages/MapPage'));
const ProfilePage = React.lazy(() => import('pages/ProfilePage'));
const ReferralPage = React.lazy(() => import('pages/ReferralPage'));
const RatingPage = React.lazy(() => import('pages/RatingPage'));

// A route for one of the critical pages
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

The user always enters through `RegistrationPage` or `MainPage`. Both live in the `offline-critical` chunk, so the first visit pulls that chunk down whole — including the other pages needed offline, which nobody has navigated to yet. No separate preload step is required here: the entry route does that job for free.

## Choosing what counts as critical

- **Core functionality**: the pages without which the app cannot do the thing it exists to do.
- **Most likely offline scenarios**: the actions a user realistically performs while disconnected, not the ones that merely could happen.
- **The smallest set that works**: every page you add to the critical chunk is weight on the very first load, for every user, on every device.

## Takeaway

The balance between performance and offline capability comes from splitting code deliberately rather than uniformly: critical versus expendable, with an explicit instruction to the bundler about which chunks belong together for offline availability.

## Adapting the approach to Vite

The approach above grew up in webpack, where chunk grouping is controlled through magic comments. Under Vite (Rollup/Rolldown) that layer of control is different — and more importantly, the way lazy pages get "warmed up" changes.

### What React.lazy actually warms up in Vite

- `import('./routes/offline-critical-chunk')` warms only the aggregator module itself.
- If the pages inside that aggregator are declared as `React.lazy(() => import('pages/...'))`, the real page chunks are **not** fetched until the component first renders.
- If the router already imports the aggregator statically, a dynamic `import()` of the same file is pointless — bundlers usually warn about exactly this mix of static and dynamic imports.

Which is why the warm-up has to be driven by direct `import('pages/...')` calls rather than by touching the aggregator.

### Warming the offline-critical pages correctly

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

// ... the remaining lazy pages follow the same shape
```

Each page keeps a single loader function, and both `React.lazy` and the preloader go through it. That matters: the module registry deduplicates, so a page warmed at startup renders from memory instead of hitting the network again. `Promise.allSettled` is deliberate — one page failing to download must not abort the rest of the warm-up.

```ts
// main.tsx
import { preloadOfflineCriticalPages } from 'routes/offline-critical-chunk';

window.requestIdleCallback(() => {
  void preloadOfflineCriticalPages();
});
```

The pages stay split into separate chunks, but their code starts downloading right after the app boots. [`requestIdleCallback`](https://developer.mozilla.org/en-US/docs/Web/API/Window/requestIdleCallback) keeps that work off the critical path so the warm-up competes with nothing the user is waiting for — worth guarding or polyfilling if you still ship to engines without it.

### Caching in the Service Worker

`preloadOfflineCriticalPages` downloads the critical page chunks at startup. For them to survive a later offline visit, those responses have to end up in Cache Storage: the shell, main entry and `index.html` go through precache and the manifest configuration, while everything under `chunks/` gets there through a runtime cache plus the warm-up.

#### Layer 1: precache via injectManifest

[`vite-plugin-pwa`](https://vite-pwa-org.netlify.app/) with the `injectManifest` strategy injects a manifest of static assets into the Service Worker at build time:

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

Every HTML, JS and CSS file from the build lands in the precache when the Service Worker first installs. The only exclusions are the chunks and libraries meant to be fetched on demand during navigation. The offline-critical chunks are still covered, because `preloadOfflineCriticalPages` warms them in code.

#### Layer 2: a runtime cache for chunks

Chunks under `chunks/` are excluded from the precache on purpose, so the install manifest does not balloon. Their offline availability comes from a runtime cache instead: whatever the preloader fetched, or whatever navigation happened to pull in, stays in `chunk-cache`.

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

This layer also softens the update race, when an already-open screen still holds references to the old hashed URLs after a deploy.

It works because chunk names follow a single predictable pattern, set in the Vite config:

```ts
// vite.config.ts
rollupOptions: {
  output: {
    chunkFileNames: 'chunks/[name]-[hash].js',
  },
}
```

[`CacheFirst`](https://developer.chrome.com/docs/workbox/modules/workbox-strategies#cache-first-falling-back-to-network) with a 30-day TTL means that while the entry is alive in the cache, a repeat request for the same URL is served from the cache and never touches the network. Once the TTL expires, or the entry is evicted, or the cache is cleared, the network is needed again. With hashed filenames (`[name]-[hash].js`) that is usually fine: a new deploy produces new URLs, so there is no stale-content problem to worry about — only a fresh warm-up to perform.

### Takeaways

Migrating from webpack to Vite does not require inventing new patterns, only adapting the existing ones to how Rollup/Rolldown work.

In webpack, `webpackChunkName` glues the critical pages into a single file, and the entry route pulls that file down as a side effect. In Vite the aggregator glues nothing — every page has its own `import()` — so the job of "fetch the critical code up front" moves to an explicit `preloadOfflineCriticalPages()`.

The layered caching in the Service Worker is what makes offline availability independent of the bundler underneath it.

---

### Related notes

- [Recovery and observability for a PWA that fails before it starts](/garden/pwa-recovery-observability_en)
- [View Transitions in React — a year in production](/garden/view-transitions_en)
- [Workbox Background Sync that survives iOS Safari and Android WebView](/garden/workbox-background-sync_en)
- [Measuring the visible part of the viewport](/garden/viewport_en)
- [Deep linking from the web](/garden/deeplink-web)
- [Better image viewing](/garden/zoom)
