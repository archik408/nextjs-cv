---
title: PWA/WebView recovery and observability after a failed load
description: What to do when code splitting meets a new deploy — a static fallback before React, careful reload on missing chunks, and early offline-shell diagnostics.
date: 2026-07-05
tags: [pwa, service-worker, offline, vite, observability, recovery, webview, mobile]
---

The worst failure in a lazy-loaded PWA is not a React render crash. It is a **blank screen before the app can speak**. The entry script never arrives, a dynamic `import()` 404s on an old hashed chunk, the Service Worker serves a stale `index.html` — and the user stares at nothing. Sentry is quiet, because your `ErrorBoundary` never mounted.

With code splitting and content-hashed assets, this is not exotic after a release. It is expected — especially in a mobile WebView where a tab can live for days. I wrap these apps in three layers:

1. a fallback that works **without** the JS bundle;
2. runtime recovery that catches **version skew** after React is up;
3. Service Worker telemetry, without which recovery is superstition.

## First: a page that can fail gracefully

Until the bundle loads, React cannot help. Put the lifeline in `index.html`: inline CSS, plain copy, and a tiny dependency-free script.

Two hooks are usually enough:

- `onerror` on the entry `<script type="module">` (offline, flaky VPN/CDN, bad URL);
- a short timer on an empty `#root` (about three seconds in my apps). If React never mounts, treat boot as failed.

I deliberately skip a global `window.onerror` for every script — WebViews generate too much unrelated noise.

Behavior: soft-reload a few times; if the budget is spent, show a static screen with clear copy and Close / Retry. Keep the attempt counter in `sessionStorage` under a neutral key such as `boot-retry-count`, and **reuse the same key** in the in-app recovery path. Otherwise HTML and JS fight each other and the user gets a refresh carousel.

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

  // Successful mount — reset so the next visit starts clean
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

In a host WebView, Close usually maps to a container deeplink. The exact scheme is product-specific; what matters is that the action lives in HTML, not in the bundle that failed to load.

## Then: recovery when React is up but a chunk is gone

Classic post-deploy failure: the shell boots, the user opens a lazy route, and `chunks/Feature-abcd.js` is already gone from the CDN. Vite emits `vite:preloadError`, `import()` rejects with something like `Failed to fetch dynamically imported module`, and CSS preload can fail too.

Now you can recover from inside the bundle — same idea as the static fallback, with more judgment:

1. First try a soft `location.reload()`. Often enough for a cache race.
2. If that fails, probe whether the origin/CDN is actually reachable (do **not** trust `navigator.onLine` alone). Only then cache-bust the document, e.g. `?fresh=<timestamp>`.
3. If the network is dead: soft reload again and **do not** mass-clear `CacheStorage`. “Nuke caches just in case” is how you destroy offline for users who already have a weak signal.

Firefox once exposed a [`forceGet`](https://developer.mozilla.org/en-US/docs/Web/API/Location/reload#forceget) flag on `reload()` for cache-busting; nothing else supports it. `location.replace()` with a query param is the portable approach.

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

Two lessons from production:

**Do not `preventDefault` on [`vite:preloadError`](https://vite.dev/guide/build#load-error-handling).** In Vite that can cascade into “cannot read property `default` of undefined” — the module looks swallowed, but importers still expect an export. Let the error stand; recovery should trigger a reload.

**Teach the Service Worker about `fresh`.** If navigate always returns precached `index.html`, `?fresh=…` refreshes nothing. Exclude the param from precache URL matching **and** from the SPA navigate fallback:

```js
precacheAndRoute(self.__WB_MANIFEST, {
  // treat every query except fresh as usual; fresh must change the match key
  ignoreURLParametersMatching: [/^(?!fresh$).+/],
});

registerRoute(({ request, url }) => {
  if (request.mode !== 'navigate') return false;
  if (url.searchParams.has('fresh')) return false; // go to network for a new shell
  return true;
}, createHandlerBoundToURL('/index.html'));
```

Expose the connectivity probe as a NetworkOnly route (for example `/__connectivity-check__`). Keep `navigator.onLine` as a cheap “definitely offline” guard only.

While recovery runs, show a loader in `ErrorBoundary` — not a crash screen — and do not file it in Sentry as an application exception. Otherwise every deploy floods the dashboard with false crashes.

## Observability: is the Service Worker even there?

Recovery without sensors only treats symptoms you never see. A few seconds after start (not immediately — cold starts cause false alarms), check:

1. Is there a `navigator.serviceWorker.controller`? On a returning visit with no controller, the user is likely living without an offline shell even if the app “looks like a PWA.”
2. Is the shell document in Cache Storage (for example `/index.html`)? Precache may never have installed, the manifest may have been filtered, or quota eviction may have dropped it.

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

Attach the same context to lazy-route warmup failures and SW registration failures: controller present?, online?, pathname, recovery attempt. Logs then separate “network is dead,” “SW has not claimed the page yet,” and “CDN already serves another version.”

The five-second delay is empirical and scales with precache size. If the manifest includes the whole app, claiming can take 10–15 seconds.

I wrap SW registration in a small exponential retry and log only the final failure. Intermediate attempts are normal mobile-network weather, not incidents.

## How the layers fit

1. Entry fails or hangs → HTML answers before React.
2. App runs but a post-deploy chunk is missing → runtime recovery with a careful shell cache-bust.
3. Once per session → verify the Service Worker and offline shell still exist.

None of this replaces caching critical chunks from the note on [offline support vs lazy loading](/garden/offline-vs-lazy-loading). These layers cover the other half: what happens when the happy path already broke. Without them, a PWA looks solid in a demo and fragile the day after ship.

---

### Related notes

- [When offline support collides with lazy loading](/garden/offline-vs-lazy-loading)
- [Workbox Background Sync that survives iOS Safari and Android WebView](/garden/workbox-background-sync_en)
- [Deep linking from the web](/garden/deeplink-web)
- [Measuring the visible viewport](/garden/viewport)
- [View Transitions in React — already a year in production](/garden/view-transitions)
