---
title: Configuring Workbox Background Sync for iOS and Android WebView Compatibility
description: A practical guide to reliably retrying offline requests on iOS/Safari and Android WebView — working around Service Worker and IndexedDB constraints.
date: 2025-06-05
tags: [pwa, service-worker, workbox, offline, ios, android, seedling]
---

Reliable offline request handling is hard to overstate — especially for apps that must keep working when the network is gone. [Workbox](https://developer.chrome.com/docs/workbox?hl=ru) is a strong toolkit for managing [Service Workers](https://developer.mozilla.org/en-US/docs/Web/API/Service_Worker_API) in the browser, and its Background Sync plugin is built for exactly this case. Support for the [Background Sync API](https://developer.mozilla.org/en-US/docs/Web/API/Background_Synchronization_API) is not universal, though. In this note I show how to extend Workbox so Background Sync still works on iOS/Safari (which has no Sync Manager) and on older Android WebView builds (Chromium).

## Understanding native Background Sync API limits

The Background Sync API lets apps finish network work that was interrupted offline as soon as the device reconnects, via a [SyncEvent](https://caniuse.com/mdn-api_syncevent). Two hard limits matter in practice: Safari does not support the API, and Android WebView can disable it (for example via browser settings — the client then sees _UnknownError: Background Sync is disabled_). So we need another way to drive the same work.

## Using Workbox Background Sync

Workbox ships a Background Sync plugin you can wire up for different request-handling scenarios. My approach extends that plugin rather than reinventing it, so Background Sync becomes cross-browser while we keep the plugin’s interfaces and its IndexedDB queue for storing request copies.

> “Talk is cheap. Show me the code.” — Linus Torvalds

Below is the Service Worker initialization of the background synchronizer with its parameters, plus the Workbox Background Sync extension that retries requests on an interval and grows that interval exponentially on failure ([exponential backoff](https://advancedweb.hu/how-to-implement-an-exponential-backoff-retry-strategy-in-javascript/)):

### service-worker.js

```javascript
// service-worker.js

backgroundSyncInit(self, {
  queueName: 'OfflineRequests', // Queue name for requests stored in IndexedDB
  maxRetentionTime: 24 * 60, // Max time to keep requests in the queue (24 hours)
  urls: SYNC_URLS, // URL patterns to sync
});
```

### backgroundSyncInit.ts

```typescript
// backgroundSyncInit.ts

import { updateAccessToken } from './accessToken';
import { FALLBACK_SYNC_EVENT, REFRESH_TOKEN_EVENT } from './events';
import initBackgroundSyncQueue from './initBackgroundSyncQueue';

// We only care about mutating requests that would otherwise be lost,
// so read-only methods (GET, OPTIONS, etc.) are excluded
const HTTP_CHANGE_VERBS = ['POST', 'PUT', 'PATCH', 'DELETE'];

interface IParams {
  queueName: string;
  maxRetentionTime?: number;
  urls: Array<string>;
  statuses: Array<number>;
}

const backgroundSyncInit = (
  self,
  { queueName, maxRetentionTime, urls, excludeUrls, statuses = [] }: IParams
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

Core logic with a mutex so the queue is not processed concurrently, status checks, and exponential backoff:

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

### Triggering via `online` — a SyncManager alternative

Instead of SyncManager, an older, more widely supported signal can start the queue: the app is back online.

```javascript
window.addEventListener('online', () => {
  navigator?.serviceWorker?.controller?.postMessage({
    type: 'FALLBACK_SYNC_EVENT',
  });
});
```

### Intercepting mutating requests in the SW

```javascript
self.addEventListener('fetch', (event) => {
  const changeVerbs = ['POST', 'PUT', 'PATCH', 'DELETE'];
  if (!changeVerbs.includes(event.request.method)) return;
  event.respondWith(handleRequest(event));
});
```

## Implementation highlights

- A custom **FALLBACK_SYNC_EVENT** effectively replaces the native SyncEvent.
- **handleRequest** clones the request and retries it against the server.
- **hasBadStatusAndShouldBeRepeated** inspects the response status and decides whether to retry or re-enqueue.
- Request metadata stores the next retry interval and whether the entry arrived after a failed retry or is new to the queue.

## Practical tips

- Do not enqueue GET/OPTIONS — they do not change state.
- Refresh the access token before a batch flush to avoid 401/403 responses.
- Log failure reasons (5xx / 429 / network) and retry metrics.

## Takeaways

Extending Workbox Background Sync for every platform — including iOS and partial Android WebView implementations — takes a fair amount of code. That code stays scalable, handles non-standard errors and platform limits, and keeps flexibility. Most importantly, we stay on Workbox: if Background Synchronization API support becomes broad enough later, we can fall back to the stock plugin without our custom layer.

---

### Related notes

- [[View Transitions in React — a production tool already shipping for a year](/garden/view-transitions)]
- [[Computing the visible portion of the viewport](/garden/viewport)]
- [[Deep linking from the web](/garden/deeplink-web)]
- [[When offline functionality conflicts with lazy loading](/garden/offline-vs-lazy-loading)]
- [[Improving image viewing](/garden/zoom)]
