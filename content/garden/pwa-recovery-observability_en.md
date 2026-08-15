---
title: Recovery and observability for a PWA that fails before it starts
description: When code splitting meets a fresh deploy — a static fallback that runs without the bundle, careful reloads for missing chunks, and the Service Worker telemetry that makes recovery something other than guesswork.
date: 2026-07-05
tags: [pwa, service-worker, offline, vite, observability, recovery, webview, mobile]
---

The nastiest failure in a lazy-loaded PWA is not a crash inside React. It is the blank screen that appears before the app gets to say anything at all. The entry script never arrived, a dynamic `import()` returned 404 for a hash that no longer exists, the Service Worker handed back a stale `index.html` — and the user is looking at nothing. Sentry is silent, because execution never reached your `ErrorBoundary`.

With code splitting and content-hashed chunks, this is not an exotic edge case. It is the expected state of the world right after a release, and it lasts longer than you think in a WebView, where a tab can stay alive for days. Three layers go around every app like this:

- a fallback that works with no bundle at all;
- runtime recovery that catches version skew once the app is running;
- telemetry for the Service Worker, without which recovery is just ritual.

## First, a page that knows how to fail well

Until the JS bundle loads, nothing in your React stack can help you. So the lifeline lives directly in `index.html`: inline styles, plain text, and a tiny script with no dependencies.

Two hooks are usually enough. The first is `onerror` on the entry `<script type="module">` — it covers being offline, flaky networks, VPNs, CDN trouble, and plain broken URLs.

The second is a short timer against an empty `#root`. Three seconds works well in the apps I run. If React has not mounted by then, treat the boot as failed. I deliberately avoid a global `window.onerror` across every script: a WebView generates far too much noise from code that isn't yours.

The behavior is deliberately dumb. Try a plain `reload` a few times. Once the budget is spent, show a static screen with honest copy and a single action — close or retry. Keep the attempt counter in `sessionStorage` under a neutral key like `boot-retry-count`, and use **that same key** in the in-app recovery path below. Otherwise the HTML and the bundle each run their own reload loop, and the user gets a refresh carousel instead of one coherent recovery cycle.

```html
<main id="boot-fallback" hidden aria-live="polite">
  <h1>Couldn't load the app</h1>
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

  // A successful mount resets the counter so the next visit starts clean
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

Inside a mobile WebView, the close button usually maps to a deeplink back into the host shell. The exact scheme depends on your container and isn't worth putting in an article; what matters is that this action also lives in the HTML rather than in the bundle that just failed to load.

## Then, recovery for when React is alive but the chunk is not

The classic post-deploy story: the shell came up fine, the user clicked into a lazy route, and `chunks/Feature-abcd.js` is no longer on the CDN. Vite dispatches `vite:preloadError`, the `import()` promise rejects with something like `Failed to fetch dynamically imported module`, and sometimes preloaded CSS fails alongside it.

Here you can work from inside the bundle. Same idea as the static fallback, but with more judgment:

1. First attempt is a soft `location.reload()`. That is often enough when it was just a cache race.
2. If that didn't help, check whether the origin or CDN is actually reachable — not via `navigator.onLine`, which lies, but with a real network probe. Only then cache-bust: force a fresh document with a query parameter like `?fresh=<timestamp>`.
3. If there is no network at all, do another soft reload and **absolutely no** wholesale wipe of `CacheStorage`. Clearing caches "just in case" is the surest way to destroy offline support for someone who is already on a bad signal.

Worth knowing: Firefox once shipped a [`forceGet`](https://developer.mozilla.org/en-US/docs/Web/API/Location/reload#forceget) argument to `location.reload()` for exactly this, but nothing else supports it. A `location.replace()` with a changed query string is the portable answer.

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

function tries(): number {
  try {
    return Number(sessionStorage.getItem(RETRY_KEY) || 0);
  } catch {
    return 0;
  }
}

function bumpTries(next: number): void {
  try {
    sessionStorage.setItem(RETRY_KEY, String(next));
  } catch {}
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

Wiring it up is the boring part, but it has to cover both the Vite-specific event and rejected imports that never reach a `catch`:

```ts
window.addEventListener('vite:preloadError', (event) => {
  if (looksLikeChunkError(event.payload)) void recover();
});

window.addEventListener('unhandledrejection', (event) => {
  if (looksLikeChunkError(event.reason)) void recover();
});
```

Two details I learned the hard way.

First: do **not** call `preventDefault` on [`vite:preloadError`](https://vite.dev/guide/build#load-error-handling). In Vite that produces secondary failures along the lines of "cannot read property `default` of undefined" — the module error looks swallowed, while every importer is still sitting there waiting for an export. Let the error propagate; recovery only needs to kick off a reload.

Second: the Service Worker has to understand your cache-bust parameter. If the navigation handler always serves `index.html` from precache, `?fresh=…` refreshes precisely nothing. Exclude the parameter both from `ignoreURLParametersMatching`, so precache doesn't collapse it back onto the plain URL, and from the SPA navigation fallback:

```js
precacheAndRoute(self.__WB_MANIFEST, {
  // strip every query param except fresh — fresh has to change the match key
  ignoreURLParametersMatching: [/^(?!fresh$).+/],
});

registerRoute(({ request, url }) => {
  if (request.mode !== 'navigate') return false;
  if (url.searchParams.has('fresh')) return false; // go to the network for a new shell
  return true;
}, createHandlerBoundToURL('/index.html'));
```

Give the origin probe its own NetworkOnly route in the Service Worker: a short path like `/__connectivity-check__`, never cached. Keep `navigator.onLine` only as a cheap guard meaning "definitely offline, don't get aggressive."

While recovery is running, show a loader in your `ErrorBoundary` rather than an error screen, and don't report it to Sentry as a crash — it's a reload. Otherwise the dashboard fills with phantom failures every time you deploy.

## And separately, proof that the Service Worker is actually there

Recovery without observability treats symptoms you never see. The most useful sensor I add after SW registration runs a few seconds into the session — not immediately, or cold starts will produce false positives — and checks two things.

Is `navigator.serviceWorker.controller` present? If this isn't the user's first visit and there's still no controller, they are almost certainly living without the offline shell, however much the app "looks like a PWA."

Is the shell document sitting in Cache Storage — say `/index.html`? Precache may have failed to install, the manifest may have filtered it out, or a quota eviction may have thrown the entry away.

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

Attach the same context to lazy-route warmup errors and to SW registration failures: is there a controller, is the device online, what pathname, which recovery attempt. With that, your logs can tell apart "the network died," "the Service Worker hasn't claimed the page yet," and "the CDN is already serving a different version."

One caveat on that five-second timeout: it's an empirical number that comes from your own users, and it scales directly with what you put in precache. If the manifest covers the entire app and every chunk, the Service Worker may take 10 or 15 seconds to take control of the page.

I wrap SW registration itself in a small retry with exponential pauses and log only the final failure. Intermediate attempts are ordinary mobile-network weather, not an incident.

## How it all fits together

First the entry fails or hangs, and the HTML answers before React ever runs. Then the app is alive but trips over a chunk that a release removed, and runtime recovery answers with a careful cache-bust of the shell. Running alongside both, once per session, you check whether the Service Worker has quietly gone missing and whether the offline shell is still in the cache.

None of these layers replace precaching the critical chunks described in the [note on offline support and lazy loading](/garden/offline-vs-lazy-loading). They cover something else: what happens once the ideal path has already broken. Without them, a PWA looks solid in a demo and turns brittle the day after you ship.

---

### Related notes

- [When offline support collides with lazy loading](/garden/offline-vs-lazy-loading)
- [Workbox Background Sync that survives iOS Safari and Android WebView](/garden/workbox-background-sync_en)
- [Deep linking from the web](/garden/deeplink-web)
- [Measuring the visible part of the viewport](/garden/viewport)
- [View Transitions in React — a year in production](/garden/view-transitions)
