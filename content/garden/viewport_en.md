---
title: Measuring the visible part of the viewport
description: Meta viewport, interactive-widget, viewport-fit, dvh, safe-area and the visualViewport API — how to control the visible area on mobile.
date: 2026-06-26
tags: [mobile, pwa, react, keyboard, viewport, css, safari, android]
---

## Keeping the page scrollable while the keyboard is open

On the mobile web the native keyboard usually covers part of the content, on the assumption that typing is a short, transient act. Sometimes that assumption is wrong and you need the whole content area to stay reachable and scrollable while the keyboard is up — a chat screen, a form with a long list of fields, a PWA where the keyboard is open for minutes at a time.

Picking the right tool is much easier once you know which "layers" a viewport is made of and what `<meta name="viewport">` actually configures.

## Two viewports: layout and visual

A mobile browser maintains two related but distinct areas:

- **Layout viewport** — the page canvas. Its dimensions are what `100vh` resolves against, what `position: fixed` is anchored to relative to the document, and what drives `document` scrolling.
- **Visual viewport** — the part of the screen the user can actually see right now. When the keyboard, a browser bar or some native UI appears, the visual viewport shrinks or shifts while the layout viewport may stay exactly as it was.

That gap is why `height: 100vh` so often overflows the visible area on mobile: `vh` is tied to the layout viewport, and the user is looking at something smaller.

## `<meta name="viewport">` — the baseline

The tag tells a mobile browser how to scale and position the page:

```html
<meta
  name="viewport"
  content="width=device-width, initial-scale=1, viewport-fit=cover, interactive-widget=resizes-content"
/>
```

The parameters you will reach for most:

| Parameter            | What it does                                                             |
| -------------------- | ------------------------------------------------------------------------ |
| `width=device-width` | Layout viewport width equals the screen width — no shrunken desktop page |
| `initial-scale=1`    | Start at 1:1 zoom                                                        |
| `maximum-scale=1`    | Block pinch zoom (use sparingly — it breaks accessibility)               |
| `viewport-fit`       | How the page fits a display with cutouts (see below)                     |
| `interactive-widget` | How the virtual keyboard affects the viewport (see below)                |

Without this tag, mobile Safari and Chrome render the page as a scaled-down desktop layout (~980px wide), and every CSS technique for "visible height" below will behave worse than it should.

## `interactive-widget` — reacting to the virtual keyboard

This parameter describes what happens to the viewport when the browser shows an interactive widget — in practice, the virtual keyboard. It takes three values.

### `resizes-visual` (default)

Only the **visual viewport** shrinks. The layout viewport, and therefore anything sized from `vh` or from `100%` of the document height, **does not change**.

This is the behaviour you know from older mobile sites: the keyboard slides over the page, the browser may scroll the focused input into view, but the "page height" in CSS stays the same. `100vh` still resolves against the full, keyboard-free screen.

### `resizes-content`

The **layout viewport** shrinks — the page canvas itself. The initial containing block shrinks with it, and **viewport units (`vh`, `dvh`, `svh`, `lvh`) are recomputed**.

This is what you want if flex/grid layouts and `height: 100%` should genuinely adapt to the area above the keyboard without any JavaScript. Content is lifted rather than buried under the keyboard.

```html
<meta name="viewport" content="width=device-width, interactive-widget=resizes-content" />
```

```css
.chat-layout {
  height: 100dvh; /* with resizes-content, dvh matches the visible area above the keyboard */
  display: flex;
  flex-direction: column;
}
```

Support: Chrome 108+, Firefox 132+, **not Safari on iOS yet** (WebKit has work in progress behind a feature flag, but nothing you can ship on).

### `overlays-content`

Neither the layout nor the visual viewport **changes size**. The keyboard simply covers the page like a `position: fixed` overlay.

Useful when you drive layout yourself through `visualViewport`, or when you do not want the browser relaying out the page every time the keyboard appears. The cost is that, without extra logic of your own, the focused input can end up underneath the keyboard.

### Side by side

| Value              | Layout viewport | Visual viewport | `vh`/`dvh` with keyboard | Typical use                    |
| ------------------ | --------------- | --------------- | ------------------------ | ------------------------------ |
| `resizes-visual`   | unchanged       | shrinks         | not recomputed           | Classic mobile behaviour       |
| `resizes-content`  | shrinks         | shrinks         | recomputed               | Chat, forms, full-screen PWA   |
| `overlays-content` | unchanged       | unchanged       | not recomputed           | Full manual control via JS/CSS |

## iOS: why `visualViewport` is still the answer

On Android, `interactive-widget=resizes-content` plus `dvh` is frequently all you need. On **iOS Safari and iOS WebView, `interactive-widget` is not supported today** — Safari keeps behaving as `resizes-visual`: it shifts the layout and shrinks the visual viewport, but gives you no way to pick a mode from the meta tag.

So a cross-platform PWA still needs manual `window.visualViewport` tracking. Think of it as a polyfill for `resizes-content`.

## The `visualViewport` API approach

Track the real height of the visible area:

```javascript
import { useEffect, useState } from 'react';

const useVisualViewportHeight = () => {
  const [height, setHeight] = useState(window.innerHeight);

  const handleResize = () => {
    const newHeight = window.visualViewport ? window.visualViewport.height : window.innerHeight;
    setHeight(newHeight);
  };

  useEffect(() => {
    const viewport = window.visualViewport || window;
    handleResize();

    viewport.addEventListener('resize', handleResize);
    return () => viewport.removeEventListener('resize', handleResize);
  }, []);

  return height;
};
```

Using it:

```javascript
const Component = () => {
  const viewportHeight = useVisualViewportHeight();

  return (
    <div style={{ height: viewportHeight, overflowY: 'auto' }}>
      {/* Content scrolls within the visible area */}
    </div>
  );
};
```

_Details worth knowing_

- `visualViewport.height` returns the height of the area the keyboard is not occupying
- Falls back to `window.innerHeight` in browsers without `visualViewport`
- Updates automatically as the keyboard appears and disappears
- On iOS this is the primary tool; on Android it is the fallback when the meta tag is not enough
- Battle-tested across hundreds of thousands of Android and iOS users

_What you get_

- Content stays reachable and interactive
- Smooth adaptation to keyboards of different heights
- Cross-browser compatibility

## `viewport-fit` — cutouts and rounded corners

This parameter decides how the page is fitted onto the physical display (iPhone notch, Android punch-hole, PWA in standalone mode):

```html
<meta name="viewport" content="width=device-width, viewport-fit=cover" />
```

| Value     | Behaviour                                                                              |
| --------- | -------------------------------------------------------------------------------------- |
| `auto`    | The page is drawn inside the safe rectangle; cutouts do not affect the layout viewport |
| `contain` | The viewport fits the largest rectangle inscribed in the display                       |
| `cover`   | The viewport spans the whole display, including the notch and home indicator areas     |

`cover` is the standard choice for full-screen PWAs: backgrounds and hero sections can run under the system zones while the content that matters is inset via the safe area (below).

## `dvh` and `env(safe-area-inset-*)` — native UI, not the keyboard

These tools solve a **different** problem: cutouts, the status bar, the home indicator, the swipe-to-dismiss gesture, the browser's own chrome. **They do not help with the virtual keyboard** — unless the browser supports `interactive-widget=resizes-content` and therefore recomputes `dvh` when the keyboard appears.

### `dvh` (dynamic viewport height)

```css
.app-shell {
  min-height: 100dvh;
}
```

- `svh` — small viewport height: the smallest visible height (browser bars expanded)
- `lvh` — large viewport height: the largest (bars hidden)
- `dvh` — the **current** visible height, changing as the address bar hides and shows

On mobile, `100vh` usually equals `lvh`, so the page ends up taller than the visible area. `100dvh` follows the real window height — **with no keyboard in the picture**.

### `safe-area-inset-*`

Once `viewport-fit=cover` is set, content can slide under the notch or the home indicator. The environment variables give you the insets from the physical edges:

```css
.header {
  padding-top: env(safe-area-inset-top);
}

.footer,
.floating-action {
  padding-bottom: env(safe-area-inset-bottom);
}

/* Handy shorthand with a fallback for older browsers */
.page {
  padding: max(16px, env(safe-area-inset-top)) max(16px, env(safe-area-inset-right))
    max(16px, env(safe-area-inset-bottom)) max(16px, env(safe-area-inset-left));
}
```

The everyday cases:

- the back button or menu does not slip under the status bar in a standalone PWA;
- bottom navigation is not covered by the home indicator;
- a fixed CTA does not land in the system dismiss-gesture zone;
- a full-bleed background (`cover`) with readable content kept inside the safe area.

## What to use when

| Problem                                      | Tool                                                       |
| -------------------------------------------- | ---------------------------------------------------------- |
| Keyboard should shrink the layout on Android | `interactive-widget=resizes-content` + `dvh`               |
| Keyboard on iOS / cross-platform             | `visualViewport` + a JS hook (as above)                    |
| Notch, cutout, home indicator                | `viewport-fit=cover` + `env(safe-area-inset-*)`            |
| Browser address bar hiding and showing       | `dvh` instead of `vh`                                      |
| Keyboard must not touch the layout           | `interactive-widget=overlays-content` + your own scrolling |
| Full control over container height           | `visualViewport.height` in state/style                     |

In practice a PWA combines several of these: `viewport-fit=cover`, `safe-area-inset` for the header and tab bar, `dvh` for the app shell, and `visualViewport` (or `resizes-content` on Android) on the screens where people type for a while.

---

### Related notes

- [View Transitions in React — a year in production](/garden/view-transitions_en)
- [Workbox Background Sync that survives iOS Safari and Android WebView](/garden/workbox-background-sync_en)
- [Deep linking from the web](/garden/deeplink-web)
- [When offline support collides with lazy loading](/garden/offline-vs-lazy-loading_en)
- [Better image viewing](/garden/zoom)
