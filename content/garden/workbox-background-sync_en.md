---
title: Workbox Background Sync that survives iOS Safari and Android WebView
description: How to reliably replay offline mutating requests when Sync Manager is missing or disabled — extending Workbox instead of reinventing the queue.
date: 2025-06-05
tags: [pwa, service-worker, workbox, offline, ios, android, seedling]
---

If your PWA must keep working offline, failed POST/PUT/PATCH/DELETE requests cannot simply vanish. [Workbox](https://developer.chrome.com/docs/workbox) is still one of the best toolkits for [Service Worker](https://developer.mozilla.org/en-US/docs/Web/API/Service_Worker_API) caching and replay — and its Background Sync plugin is the right starting point. The catch: the underlying [Background Sync API](https://developer.mozilla.org/en-US/docs/Web/API/Background_Synchronization_API) is not universal.

This note shows how I extend Workbox so offline replay still works on **iOS/Safari** (no Sync Manager) and on **older Android WebViews** where Background Sync may be disabled.

## Native Background Sync limits

Background Sync lets the browser finish deferred network work after connectivity returns, typically via a [SyncEvent](https://caniuse.com/mdn-api_syncevent). Two production constraints matter:

1. **Safari / iOS** does not implement Sync Manager.
2. **Android WebView** can disable Background Sync (for example via browser/WebView settings). Clients then see errors like `UnknownError: Background Sync is disabled`.

So you need a fallback trigger that does not depend on Sync Manager.

## Extend Workbox instead of rewriting it

I keep Workbox’s queue, IndexedDB persistence, and plugin surfaces, then add a cross-platform driver on top. Reinventing the queue from scratch is rarely worth it.

> “Talk is cheap. Show me the code.” — Linus Torvalds

Initialization in the Service Worker, plus a retry loop with [exponential backoff](https://advancedweb.hu/how-to-implement-an-exponential-backoff-retry-strategy-in-javascript/):

### service-worker.js

```javascript
// service-worker.js

backgroundSyncInit(self, {
  queueName: 'OfflineRequests', // IndexedDB queue name
  maxRetentionTime: 24 * 60, // keep entries for 24 hours
  urls: SYNC_URLS, // URL substrings / patterns to intercept
});
```

### backgroundSyncInit.ts

```typescript
// backgroundSyncInit.ts

import { updateAccessToken } from './accessToken';
import { FALLBACK_SYNC_EVENT, REFRESH_TOKEN_EVENT } from './events';
import createQueue from './createQueue';

// Only mutating traffic belongs in the offline queue.
// GET/OPTIONS/etc. should not be replayed as side-effecting work.
const HTTP_CHANGE_VERBS = ['POST', 'PUT', 'PATCH', 'DELETE'];

interface IParams {
  queueName: string;
  maxRetentionTime?: number;
  urls: string[];
  statuses?: number[];
}

const backgroundSyncInit = (
  self,
  { queueName, maxRetentionTime, urls, statuses = [] }: IParams
) => {
  const { queue, onQueueSync, handleRequest } = createQueue(self, {
    queueName,
    maxRetentionTime,
    badStatuses: statuses,
  });

  self.addEventListener('fetch', (event) => {
    if (
      !HTTP_CHANGE_VERBS.includes(event.request.method) ||
      !urls.find((url) => event.request.url.includes(url))
    ) {
      return;
    }
    event.respondWith(handleRequest(event));
  });

  self.addEventListener('message', async (event) => {
    if (event?.data?.type === FALLBACK_SYNC_EVENT) {
      updateAccessToken(event?.data?.token);
      await onQueueSync({ queue });
    }

    if (event?.data?.type === REFRESH_TOKEN_EVENT) {
      updateAccessToken(event?.data?.token);
    }
  });
};

export default backgroundSyncInit;
```

### createQueue.ts

Core ideas: a mutex so the queue is not flushed twice in parallel, status-aware retries, and exponential backoff:

```typescript
const MIN_BACKOFF_DEPTH = 4;
const MAX_BACKOFF_DEPTH = 10;

const hasBadStatusAndShouldBeRepeated = (response, badStatuses = [], metadata?) => {
  const hasNoStatus = !response.status;
  const hasBadStatus = badStatuses.includes(response.status);
  const isServerError = response.status >= 500;
  const isReachedRepeatLimit =
    metadata?.backOffDepth && metadata?.backOffDepth >= MAX_BACKOFF_DEPTH;
  return (hasNoStatus || hasBadStatus || isServerError) && !isReachedRepeatLimit;
};
```

### Fallback trigger: the `online` event

When Sync Manager is missing or disabled, use a boring, widely supported signal — the page is online again — and ask the Service Worker to flush:

```javascript
window.addEventListener('online', () => {
  navigator?.serviceWorker?.controller?.postMessage({
    type: 'FALLBACK_SYNC_EVENT',
  });
});
```

### Intercept mutating requests

```javascript
self.addEventListener('fetch', (event) => {
  const changeVerbs = ['POST', 'PUT', 'PATCH', 'DELETE'];
  if (!changeVerbs.includes(event.request.method)) return;
  event.respondWith(handleRequest(event));
});
```

## What matters in the design

- **`FALLBACK_SYNC_EVENT`** stands in for native `SyncEvent` on platforms that lack it.
- **`handleRequest`** clones the request and owns replay against the network.
- **`hasBadStatusAndShouldBeRepeated`** decides whether a response should be retried or re-queued.
- Request metadata tracks backoff depth / next attempt timing and whether the entry is new or a failed retry.

## Practical tips

- Do not enqueue GET/OPTIONS — they are not state changes.
- Refresh the access token before a batch flush to avoid cascading 401/403 failures.
- Log why retries happen (5xx, 429, network) and how often they succeed.

## Takeaways

Cross-platform Background Sync on top of Workbox takes real code — especially for iOS and quirky WebViews — but the result stays maintainable and close to the upstream plugin model. If native Background Sync ever becomes reliable enough everywhere you ship, you can thin this layer and fall back toward stock Workbox behavior.

---

### Related notes

- [View Transitions in React — already a year in production](/garden/view-transitions)
- [Measuring the visible viewport](/garden/viewport)
- [Deep linking from the web](/garden/deeplink-web)
- [When offline support collides with lazy loading](/garden/offline-vs-lazy-loading)
- [Better image viewing](/garden/zoom)
