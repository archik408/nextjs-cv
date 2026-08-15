---
title: Recovery and Observability for PWA/WebView After a Failed Load
description: What to do when code splitting and a Service Worker meet a new deploy — a static fallback before React, careful reload on broken chunks, and early offline-shell diagnostics
date: 2026-07-05
tags: [pwa, service-worker, offline, vite, observability, recovery, webview, mobile]
---

The worst failure in a PWA with lazy loading is not a crash inside React. It is a blank screen before the app can say anything at all. The entry script never arrived, a dynamic `import()` got a 404 for an old hash, the Service Worker served a stale `index.html` — and the user stares at emptiness. Sentry stays quiet: your `ErrorBoundary` never ran.

With code splitting and hashed chunks, this is not rare after a release — it is an expected scenario. Especially in a WebView, where a tab can live for days. Below are three layers I put around such an app:

- A fallback that works without the bundle;
- A mechanism that catches version skew once the app is running;
- Telemetry and Service Worker diagnostics, without which recovery turns into guesswork.

## First — a page that can fail gracefully

Until the JS bundle loads, nothing in your React stack can help. So the minimum lifeline lives in `index.html`: inline styles, plain text, and a tiny dependency-free script.

Two handlers are usually enough. The first is `onerror` on the entry `<script type="module">`: offline, network, VPN, CDN, or a broken URL.

The second is a short timer (empirically about three seconds for me) on an empty `#root`. If React has not mounted by then, treat boot as failed. I deliberately skip a global `window.onerror` on every script: WebViews produce too much unrelated noise.

Behavior is simple. Retry with a normal `reload` a few times. If the limit is exhausted, show a static screen with clear copy and a “close / retry” action. Store the attempt counter in `sessionStorage` under a neutral key such as `boot-retry-count`, and **reuse that same key** in the JS recovery path below. Otherwise HTML and the bundle will reload independently, and the user gets a refresh carousel instead of one coherent cycle.

```html
<main id="boot-fallback" hidden aria-live="polite">
  <h1>Failed to load the app</h1>
  <p>Check your connection and try again.</p>
  <button type="button" id="boot-fallback-close">Close</button>
</main>

<div id="root"></div>
<script type="module" src="/assets/index.js" onerror="window.__bootFail?.()"></script>
```

```js
(function () {
  const RETRY_KEY = 'boot-retry-count';
  const MAX_TRIES = 3;
  const WAIT_MS = 3000;

  function tries() {
    try {
      return Number(sessionStorage.getItem(RETRY_KEY) || 0);
    } catch {
      return 0;
    }
  }

  function fail() {
    if (tries() < MAX_TRIES) {
      try {
        sessionStorage.setItem(RETRY_KEY, String(tries() + 1));
      } catch {}
      location.reload();
      return;
    }
    document.getElementById('boot-fallback')?.removeAttribute('hidden');
  }

  window.__bootFail = fail;

  setTimeout(() => {
    const root = document.getElementById('root');
    if (root && !root.firstChild) fail();
  }, WAIT_MS);

  // Successful mount — clear the counter so the next visit starts clean
  const root = document.getElementById('root');
  if (root && 'MutationObserver' in window) {
    const observer = new MutationObserver(() => {
      if (!root.firstChild) return;
      try {
        sessionStorage.removeItem(RETRY_KEY);
      } catch {}
      document.getElementById('boot-fallback')?.setAttribute('hidden', '');
      observer.disconnect();
    });
    observer.observe(root, { childList: true });
  }
})();
```

In a mobile WebView, the “Close” button usually maps to a host-app deeplink. The exact scheme depends on the container — no need to spell it out here. What matters is that the action also lives in HTML, not in the bundle that failed to load.

## Then — recovery when React is up but a chunk is gone

The classic post-deploy case: the shell boots, the user opens a lazy route, and `chunks/Feature-abcd.js` is already gone from the CDN. Vite fires `vite:preloadError`, the `import()` promise rejects with something like `Failed to fetch dynamically imported module`, and sometimes preload CSS fails too.

Here you can work from the bundle. Same idea as the static fallback, but smarter:

1. First attempt — a soft `location.reload()`. Often enough when it is just a cache race.
2. If that fails, check whether the origin / CDN is actually reachable (do not trust `navigator.onLine` alone — probe the network), and only then cache-bust: force a fresh document with a query param such as `?fresh=timestamp`.
3. If there is no network — soft reload again and **no** mass wipe of `CacheStorage`. Clearing caches “just in case” is the fastest way to break offline for someone who already has a weak signal.

One detail: Firefox once exposed a [forceget](https://developer.mozilla.org/en-US/docs/Web/API/Location/reload#forceget) flag on `location.reload()` for cache-busting, but nothing else supports it. `location.replace()` with a query param is the portable approach.

```ts
const RETRY_KEY = 'boot-retry-count';
const FRESH_PARAM = 'fresh';
const MAX_TRIES = 3;

const CHUNK_HINTS = [
  'Failed to fetch dynamically imported module',
  'Importing a module script failed',
  'ChunkLoadError',
  'Unable to preload CSS for',
];

function looksLikeChunkError(error: unknown): boolean {
  const message = error instanceof Error ? error.message : String(error ?? '');
  return CHUNK_HINTS.some((hint) => message.includes(hint));
}

async function originLooksReachable(): Promise<boolean> {
  if (!navigator.onLine) return false;

  const ctrl = new AbortController();
  const timer = window.setTimeout(() => ctrl.abort(), 3000);

  try {
    await fetch('/__connectivity-check__', {
      cache: 'no-store',
      signal: ctrl.signal,
    });
    return true;
  } catch {
    return false;
  } finally {
    window.clearTimeout(timer);
  }
}

function reloadWithFreshShell(): void {
  const url = new URL(location.href);
  url.searchParams.set(FRESH_PARAM, String(Date.now()));
  location.replace(url.toString());
}

async function recover(): Promise<boolean> {
  const next = tries() + 1;
  if (next > MAX_TRIES) return false;
  bumpTries(next);

  if (next === 1) {
    location.reload();
    return true;
  }

  if (await originLooksReachable()) reloadWithFreshShell();
  else location.reload();
  return true;
}
```

Two lessons I learned the hard way.

First: on [`vite:preloadError`](https://vite.dev/guide/build#load-error-handling), do **not** call `preventDefault`. In Vite that leads to secondary failures like “cannot read property `default` of undefined” — the module looks swallowed, but consumers still expect an export. Let the error stand; recovery should only trigger a reload.

Second: the Service Worker must understand your cache-bust parameter. If the navigate handler always serves precached `index.html`, `?fresh=…` refreshes nothing. Exclude the param both from `ignoreURLParametersMatching` (so precache does not collapse it into the normal URL) and from the SPA-fallback navigate route:

```js
precacheAndRoute(self.__WB_MANIFEST, {
  // any query except fresh — as usual; fresh must change the match key
  ignoreURLParametersMatching: [/^(?!fresh$).+/],
});

registerRoute(({ request, url }) => {
  if (request.mode !== 'navigate') return false;
  if (url.searchParams.has('fresh')) return false; // hit the network for a new shell
  return true;
}, createHandlerBoundToURL('/index.html'));
```

Prefer a dedicated NetworkOnly route in the SW for the origin/CDN probe: a short path like `/__connectivity-check__`, uncached. Keep `navigator.onLine` only as a guardrail (“definitely offline — do not get aggressive”).

While recovery runs, show a loader in `ErrorBoundary`, not an error screen, and do not report it to Sentry as a crash: reload. Otherwise every deploy floods the dashboard with false failures.

## Separately — so you can see whether the SW is even there

Recovery without observability treats symptoms you never notice. The most useful sensor I add after SW registration: a few seconds after start (not immediately — cold starts cause false positives), check two things.

Is there a `navigator.serviceWorker.controller`? If this is not the first visit and there is still no controller, the user is likely living without an offline shell even if it “looks like a PWA.”

Is the shell document in Cache Storage, for example `/index.html`? Precache may never have installed, the manifest may have been filtered, or quota eviction may have dropped the entry.

```ts
window.setTimeout(async () => {
  const controlled = Boolean(navigator.serviceWorker?.controller);

  if (!controlled) {
    reportWarning('sw-missing-controller', { online: navigator.onLine });
  }

  if (!('caches' in window)) return;

  try {
    const shell = await caches.match('/index.html', { ignoreSearch: true });
    if (!shell) {
      reportWarning('sw-missing-offline-shell', { controlled });
    }
  } catch (error) {
    reportWarning('sw-cache-check-failed', { error });
  }
}, 5_000);
```

For lazy-route warmup errors and SW registration failures, attach the same context: whether a controller exists, whether the device is online, which pathname, which recovery attempt. Logs then distinguish “network is dead,” “SW has not claimed the page yet,” and “CDN already has another version.”

Worth noting: the five-second timeout is empirical — tuned from real users — and scales with what you put in precache. If the manifest includes the whole app and every chunk, the SW may take ten or fifteen seconds to control the page.

I wrap SW registration in a small retry with exponential backoff and log only the final failure. Intermediate attempts are normal mobile-network life, not an incident.

## How it fits together

First the entry fails or hangs — HTML answers, still before React. Then the app runs but trips on a missing chunk after a release — runtime recovery answers with a careful shell cache-bust. In parallel, once per session you check whether the Service Worker “fell off” and whether the offline shell vanished from cache.

None of these layers replaces caching critical chunks from the [note on offline vs lazy loading](/garden/offline-vs-lazy-loading). They cover something else: what happens when the ideal path already broke. Without them, a PWA looks solid in a demo and fragile the day after a ship.

---

### Related notes

- [[When offline functionality conflicts with lazy loading](/garden/offline-vs-lazy-loading)]
- [[Configuring Workbox Background Sync for iOS and Android WebView Compatibility](/garden/workbox-background-sync_en)]
- [[Deep linking from the web](/garden/deeplink-web)]
- [[Computing the visible portion of the viewport](/garden/viewport)]
- [[View Transitions in React — a production tool already shipping for a year](/garden/view-transitions)]
