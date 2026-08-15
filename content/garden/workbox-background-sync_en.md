---
title: Workbox Background Sync that survives iOS Safari and Android WebView
description: Replaying offline mutations reliably when Sync Manager is missing or switched off — extending the Workbox queue instead of rewriting it, with exponential backoff and a hand-rolled sync trigger.
date: 2025-06-05
tags: [pwa, service-worker, workbox, offline, ios, android, seedling]
---

In an app that has to keep working without a connection, a failed `POST` is not a rendering glitch — it is a lost order, a lost message, a lost signature. [Workbox](https://developer.chrome.com/docs/workbox) is still the most sensible foundation for [Service Worker](https://developer.mozilla.org/en-US/docs/Web/API/Service_Worker_API) work, and its Background Sync plugin is the right place to start. The problem is what sits underneath it: the [Background Sync API](https://developer.mozilla.org/en-US/docs/Web/API/Background_Synchronization_API) is not available everywhere you ship.

This note walks through how I extend Workbox so offline replay keeps working on **iOS/Safari**, which has no Sync Manager at all, and on **older Android WebViews**, where Background Sync exists but can be turned off underneath you.

## Where the native API stops helping

Background Sync is supposed to let the browser finish deferred network work once connectivity returns, delivering a [`SyncEvent`](https://caniuse.com/mdn-api_syncevent) to your Service Worker. Two constraints show up immediately in production:

1. **Safari and iOS** do not implement Sync Manager. There is no event to wait for.
2. **Android WebView** may have Background Sync disabled — for instance through browser or WebView settings the host app controls. Registration then rejects with something like `UnknownError: Background Sync is disabled`.

Both cases need the same thing: a replay trigger that does not depend on Sync Manager existing.

## Extend the plugin, don't replace it

The temptation is to write your own offline queue. Resist it. Workbox already gives you IndexedDB persistence, request serialization, retention windows, and a plugin surface that the rest of your caching strategy understands. What is missing is only the driver on top: something that decides _when_ to flush and _how_ to retry. So I keep the Workbox queue and add that layer myself.

> "Talk is cheap. Show me the code." — Linus Torvalds

Below is the Service Worker initialization, followed by the extension itself: it replays queued requests on an interval that grows exponentially after each failure — the familiar [exponential backoff retry strategy](https://advancedweb.hu/how-to-implement-an-exponential-backoff-retry-strategy-in-javascript/).

### service-worker.js

```javascript
// service-worker.js

backgroundSyncInit(self, {
  queueName: 'OfflineRequests', // IndexedDB queue that holds the stored requests
  maxRetentionTime: 24 * 60, // drop anything older than 24 hours
  urls: SYNC_URLS, // only these endpoints are worth replaying
});
```

### backgroundSyncInit.ts

```typescript
// backgroundSyncInit.ts

import { updateAccessToken } from './accessToken';
import { FALLBACK_SYNC_EVENT, REFRESH_TOKEN_EVENT } from './events';
import createQueue from './createQueue';

// Only mutations are worth recovering. Reads (GET, OPTIONS and friends)
// can simply be issued again by the app, so they never enter the queue.
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

This is where the interesting decisions live: a mutex so a flush can never run twice concurrently, status-aware retry rules, and the backoff schedule.

```typescript
const MIN_BACKOFF_DEPTH = 4;
const MAX_BACKOFF_DEPTH = 10;

// Depth 4 is roughly 16 seconds, depth 10 lands around 17 minutes —
// long enough to ride out a bad tunnel, short enough to stay useful.
const backoffDelayMs = (depth = MIN_BACKOFF_DEPTH) => 2 ** depth * 1000;

const hasBadStatusAndShouldBeRepeated = (response, badStatuses = [], metadata?) => {
  const hasNoStatus = !response.status;
  const hasBadStatus = badStatuses.includes(response.status);
  const isServerError = response.status >= 500;
  const isReachedRepeatLimit =
    metadata?.backOffDepth && metadata?.backOffDepth >= MAX_BACKOFF_DEPTH;
  return (hasNoStatus || hasBadStatus || isServerError) && !isReachedRepeatLimit;
};
```

A missing status means the fetch never reached the server, so it is always worth another attempt. `5xx` responses are retried because they are usually transient. Everything else — `4xx` in particular — is a client-side problem that replaying will not fix, and retrying it forever just burns battery. Each retry stores the new depth on the entry's metadata, and `backoffDelayMs` turns that depth into the delay before the queue looks at the request again.

### The `online` event as a stand-in for SyncManager

Instead of Sync Manager, use the oldest and most boring signal available: the page noticed it is back online. Post a message into the Service Worker and let the queue drain.

```javascript
window.addEventListener('online', () => {
  navigator?.serviceWorker?.controller?.postMessage({
    type: 'FALLBACK_SYNC_EVENT',
  });
});
```

### Intercepting mutations in the Service Worker

```javascript
self.addEventListener('fetch', (event) => {
  const changeVerbs = ['POST', 'PUT', 'PATCH', 'DELETE'];
  if (!changeVerbs.includes(event.request.method)) return;
  event.respondWith(handleRequest(event));
});
```

## The parts worth remembering

- **`FALLBACK_SYNC_EVENT`** is a custom event that plays the role of the native `SyncEvent` on platforms that never fire one.
- **`handleRequest`** clones the request before it can be consumed, then owns the replay against the network.
- **`hasBadStatusAndShouldBeRepeated`** decides whether a response counts as failure — retry now, push back into the queue, or give up.
- Request **metadata** carries the backoff depth and when the next attempt is due, plus whether this entry is a fresh arrival or a retry that already failed once.

## Practical notes

- Keep `GET`/`OPTIONS` out of the queue. They change nothing, and replaying them only produces confusing traffic spikes on reconnect.
- Refresh the access token _before_ draining the queue. Otherwise a batch that has been sitting in IndexedDB for hours turns into a wall of `401`/`403` responses.
- Log why each retry happened — `5xx`, `429`, or no response at all — along with attempt counts. Without that, a queue that quietly gives up looks identical to one that never had anything to send.

## Takeaways

Making Background Sync behave the same on iOS and on half-implemented WebViews takes real code. The payoff is that it stays close to the upstream plugin: the queue, the storage, and the retention rules are all still Workbox. If the Background Synchronization API ever becomes dependable across the platforms you ship to, you can delete the driver and fall back to the stock plugin without touching anything else.

---

### Related notes

- [Recovery and observability for a PWA that fails before it starts](/garden/pwa-recovery-observability_en)
- [View Transitions in React — a year in production](/garden/view-transitions)
- [Measuring the visible part of the viewport](/garden/viewport)
- [Deep linking from the web](/garden/deeplink-web)
- [When offline support collides with lazy loading](/garden/offline-vs-lazy-loading)
- [Better image viewing](/garden/zoom)
