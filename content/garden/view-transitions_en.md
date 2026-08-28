---
title: View Transitions in React — a year in production
description: The View Transitions API has been shipping in my mobile WebView PWA for over a year. The navigation wrapper, named groups, header and tab bar isolation, and the Safari blur artifacts — no waiting on React's ViewTransition.
date: 2026-01-20
tags: [pwa, mobile, ssr, react, animation]
---

When React's experimental channel announced work on a [`ViewTransition` component](https://react.dev/reference/react/ViewTransition), the excitement was easy to understand. But the [View Transitions API](https://developer.mozilla.org/en-US/docs/Web/API/View_Transition_API) was not news from the future by then: it had already been running for more than a year in the hybrid PWA I ship inside a WebView, and on this site.

While the RFCs and the experiments are being discussed, my users have had smooth page transitions for a long time. What follows is not a "how to do a fade" tutorial. It is what real routes forced me to learn: a wrapper around `navigate`, CSS that behaves on a dark theme, isolating the header and the tab bar, and the Safari artifacts around `filter: blur`. React's wrappers will simplify the glue between transitions and navigation; the principles will not change.

## The real problem and the real fix

The app I work on is a hybrid PWA/SPA — React 18 with React Router, running inside a WebView. The goal was the classic one: get away from abrupt, jumpy route changes and toward something smooth and continuous, so the product feels like one application rather than a pile of separate pages.

The **View Transitions API** offers [an elegant model](https://developer.chrome.com/docs/web-platform/view-transitions): you tell the browser "here is the current DOM, here is the new one, animate between them." The browser does the heavy lifting — it captures frames, stacks them, and animates on the GPU. Your job is narrower: call `document.startViewTransition` at the right moment, wait for a meaningful new frame, and refuse to animate the things that are supposed to stay still.

## Wiring it into an SPA: the idea matters more than the listing

The core is a hook that sits between your code and `navigate` from React Router: a fallback when the API is missing, protection against double clicks, a short pause after navigation so React can paint the new screen before the "new" state is captured, and rejecting the Promise when navigation throws (lazy route load, throw inside `navigate`).

```typescript
export const useTransitionNavigate = () => {
  const navigate = useNavigate();
  const isTransitioningRef = useRef(false);
  const isMountedRef = useRef(true);

  useEffect(
    () => () => {
      isMountedRef.current = false;
    },
    []
  );

  return useCallback(
    (to: To | number) => {
      if (!isMountedRef.current || isTransitioningRef.current) return;

      if (!document.startViewTransition) {
        navigate(to as To);
        return;
      }

      isTransitioningRef.current = true;

      const transition = document.startViewTransition(
        () =>
          new Promise<void>((resolve, reject) => {
            try {
              navigate(to as To);
              // Give the router and React time to paint the "new" DOM
              // Don't use React flushSync — it forces instant commits and kills the animation
              // Don't use requestAnimationFrame to wait for a paint iteration — on WebKit it breaks playback and transitions feel laggy
              window.setTimeout(resolve, 100);
            } catch (error) {
              reject(error);
            }
          })
      );

      transition.ready.catch((error) => console.error('Transition ready error', error));

      transition.finished
        .catch((error) => console.error('Transition finishing error', error))
        .finally(() => {
          isTransitioningRef.current = false;
        });
    },
    [navigate]
  );
};
```

What to watch in production:

- **VT lock/unlock** — a mutex via `isTransitioning` / `isMounted` so a new transition cannot start until the current animation finishes and incorrect snapshots are not stacked on top of each other.
- **`isTransitioning` / `isMounted` in refs**, not state in `useCallback` dependencies — avoids stale closures and unnecessary callback recreation.
- **`setTimeout` after `navigate`** — a practical technique, not a platform contract. Without it the new snapshot often catches an empty or skeleton screen.
- **Progressive enhancement** — without `startViewTransition`, ordinary navigation. Old WebViews lose the animation but nothing breaks.

On top of the hook sits a link that stays a real `<a href>` — which matters for SEO and for assistive technology — while the click is handed to our navigation:

```tsx
const ViewTransitionLink = React.forwardRef<
  HTMLAnchorElement,
  { to: string; children: React.ReactNode; onClick?: () => void; 'aria-label'?: string }
>(function ViewTransitionLink({ to, children, onClick, ...props }, ref) {
  const navigate = useTransitionNavigate();

  return (
    <a
      ref={ref}
      href={to}
      {...props}
      onClick={(e) => {
        e.preventDefault();
        onClick?.();
        navigate(to);
      }}
    >
      {children}
    </a>
  );
});
```

## Next.js (App Router): map the options before you write code

Server-side rendering changes the approach. Navigation belongs to Next.js, so "wrap `navigate`" is no longer automatically the right move.

What's on the table today:

1. **The built-in path** — the [`experimental.viewTransition`](https://nextjs.org/docs/app/api-reference/config/next-config-js/viewTransition) flag plus the [guide to designing transitions](https://nextjs.org/docs/app/guides/view-transitions). Route changes go through a React Transition, and the animation is expressed in CSS and `<ViewTransition>`.
2. **Third-party packages** such as [`next-view-transitions`](https://github.com/shuding/next-view-transitions) — a ready-made `Link` and layout wrapper, if you would rather not adopt an experimental flag.
3. **A global click interceptor** — what I run on my personal site. Simple, and blunt. Worth knowing as a fallback and as a way to understand the mechanics, not as the canonical 2026 answer.

The third option, condensed:

```tsx
'use client';

export function ViewTransitions({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const busy = useRef(false);

  useEffect(() => {
    if (!('startViewTransition' in document)) return;

    const onClick = (event: MouseEvent) => {
      const link = (event.target as HTMLElement).closest('a[href]') as HTMLAnchorElement | null;
      const href = link?.getAttribute('href');
      if (!link || !href) return;

      // Leave external links, in-page anchors, new tabs and modifier clicks alone
      if (
        href.startsWith('http') ||
        href.includes('#') ||
        link.target === '_blank' ||
        event.metaKey ||
        event.ctrlKey
      ) {
        return;
      }

      if (busy.current) {
        event.preventDefault();
        return;
      }

      event.preventDefault();
      busy.current = true;

      document
        .startViewTransition(() => {
          router.push(href);
          return new Promise((r) => setTimeout(r, 50));
        })
        .finished.finally(() => {
          busy.current = false;
        });
    };

    document.addEventListener('click', onClick);
    return () => document.removeEventListener('click', onClick);
  }, [router]);

  return <>{children}</>;
}
```

For a new Next.js project I would start with option 1 or 2. From here on, the interesting part is not how you hook into navigation but **what** you choose to animate.

## Where the feel comes from: the CSS

The API captures states; the finished look is CSS. What I want is a calm entrance and a slight shift, with no white flashes over a dark background:

```css
html::view-transition-old(root),
html::view-transition-new(root) {
  background: transparent; /* no white plate showing at the seam */
  mix-blend-mode: normal; /* keeps text from smearing as layers blend */
}

html::view-transition-group(*),
html::view-transition-image-pair(*) {
  isolation: auto;
}

html::view-transition-old(root) {
  animation: 0.3s ease-out both pageFadeOut;
}

html::view-transition-new(root) {
  animation: 0.4s ease-out both pageFadeIn;
}

@keyframes pageFadeIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes pageFadeOut {
  from {
    opacity: 1;
    transform: translateY(0);
  }
  to {
    opacity: 0;
    transform: translateY(-10px);
  }
}
```

The mismatched durations for leaving and entering create a slight overlap, and that overlap is why the transition reads as natural instead of like a mechanical one-to-one crossfade.

One thing to get right immediately: `@media (prefers-reduced-motion: reduce)` has to silence the named groups — the tab bar and the header — as well as `root`. Otherwise the chrome that is supposed to be static suddenly starts moving for exactly the people who asked for less motion.

## What if I only want to animate part of the page?

By default, View Transitions animates the whole page snapshot through `root`. That is great for a transition that should feel like one piece, but a real application usually has a persistent header and tab bar. Those should not lurch along with the content on every route change — they should read as fixed.

And on specific screens the behavior needs to change. In the screenshot below, entering the map view means the tab bar should slide smoothly down past the bottom edge of the screen.

![The header holds its position while the tab bar slides down off-screen on the map view](/garden/view-transitions/tabbar-header.webp)

The header should not travel with the `root` animation either, and it comes with a trap of its own: its title changes ("Tasks" → "Tasks on the map"). Leave it on the default morph with no isolation and the old and new text overlap for a fraction of a second, turning into unreadable mush.

The fix is the same for every piece of interface like this: pull it out of the shared snapshot with an isolated `view-transition-name`, then give each group its own animation — or none at all.

### Isolating with `view-transition-name`

Names are unique per document: no more than one element can carry a given `view-transition-name` at a time. In production I put them straight onto the root classes of the header and tab bar:

```scss
.header {
  view-transition-name: header;
}

.tabbar {
  view-transition-name: tabbar;
}
```

From that point on the browser creates separate transition groups, and they can be styled independently of `root`.

### Tab bar: static almost always, sliding only when it disappears

If the tab bar exists on both the old and the new screen, there is nothing to animate — we just hold it in place. Animation is only wanted when the element appears or disappears entirely. The `:only-child` pseudo-class on `::view-transition-old` / `::view-transition-new` is exactly the lever for that: it matches when only one of the two snapshots exists, meaning the element left the DOM or just entered it.

```css
html::view-transition-group(tabbar) {
  z-index: var(--tabbar-layer-index);
}

/* Both snapshots exist → the tab bar stays put instead of riding along with root */
html::view-transition-old(tabbar),
html::view-transition-new(tabbar) {
  animation: none;
}

/* Leaving: the map has no tab bar → the old snapshot slides off the bottom */
html::view-transition-old(tabbar):only-child {
  animation: 0.3s ease-out both slideOut;
}

/* Arriving: coming back from the map → the new snapshot slides up from below */
html::view-transition-new(tabbar):only-child {
  animation: 0.3s ease-out both slideIn;
}

@keyframes slideOut {
  from {
    transform: translateY(0);
  }
  to {
    transform: translateY(100%);
  }
}

@keyframes slideIn {
  from {
    transform: translateY(100%);
  }
  to {
    transform: translateY(0);
  }
}
```

The tab bar now lives its own life: it takes no part in the fade and shift of the content on ordinary tab-to-tab navigation, and it retreats cleanly downward when you move into the full-screen map.

### Header: stable position, its own fade for the text

The header goes into its own group, and instead of the default morph it gets a plain crossfade. The block itself stays where it is — no `translateY` inherited from `root` — and the titles no longer stack letter over letter:

```css
html::view-transition-group(header) {
  z-index: var(--header-layer-index);
}

html::view-transition-old(header) {
  animation: 0.3s ease-out both fadeOut;
}

html::view-transition-new(header) {
  animation: 0.3s ease-out both fadeIn;
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

@keyframes fadeOut {
  from {
    opacity: 1;
  }
  to {
    opacity: 0;
  }
}
```

The resulting split is simple: `root` animates the main content, and the persistent shell of the screen is handled separately under its own rules. The user perceives one application, not a stack of flickering pages with a jumping top and bottom.

### Artifacts: when CSS filters fall out of the snapshot

Isolation is not only about control — it is also how you fix rendering artifacts. On the referral page below, the background is a gradient glow built from colored circles with `filter: blur(...)` on them. At rest it looks soft. But in the intermediate frame of a view transition, Safari and the iOS WebView frequently **fail to bake the filter into the rasterized snapshot**, and instead of a blurred glow you get raw purple circles.

![Intermediate frame: filter blur is gone and bare purple circles are showing](/garden/view-transitions/blur-snapshot.webp)

The cure is the same technique: lift the blurred layer out of the `root` snapshot and **turn the animation off** for both states — hide the old one immediately, show the new one with no delay:

```scss
.blurWrapper {
  /* on iOS, filter: blur often doesn't make it into the transition snapshot */
  view-transition-name: gradient-blur-bg;
}
```

```css
html::view-transition-old(gradient-blur-bg) {
  animation: none;
  opacity: 0;
}

html::view-transition-new(gradient-blur-bg) {
  animation: none;
}
```

The rule of thumb is easy to remember: if an element breaks in the intermediate state — filters, non-trivial layer blending, expensive effects — do not drag it through the shared morph. Give it a `view-transition-name`, disable the group's animation, and let it swap instantly. An honest frame without the effect for 300 ms beats a visible glitch in the middle of the transition.

This layer of work — the persistent shell plus working around artifacts — is what separates "I put a fade on `root`" from something that feels like a native app. After it landed, complaints about jumpy screens in the WebView went where they belong: to edge cases and to old containers with no API at all.

## Custom animations per section

Fair question: what if you need context-dependent transitions rather than one universal one? A dim-and-reveal effect when entering the gallery, a horizontal slide between settings screens. A data attribute on `<html>` is a convenient lever, because it becomes a CSS selector.

```typescript
export const TRANSITION_ATTR = 'data-custom-page-transition';

export const useTransitionAttribute = (value = 'active') => {
  useEffect(() => {
    document.documentElement.setAttribute(TRANSITION_ATTR, value);
    return () => {
      document.documentElement.removeAttribute(TRANSITION_ATTR);
    };
  }, [value]);
};
```

```css
html[data-custom-page-transition='gallery-mode']::view-transition-old(root) {
  animation: 0.5s ease-in both galleryFadeOut;
}

html[data-custom-page-transition='gallery-mode']::view-transition-new(root) {
  animation: 0.6s ease-out both galleryFadeIn;
}
```

There is an important timing subtlety here. The `useEffect` cleanup removes the attribute when the page unmounts, and by the time the new state is captured the incoming screen may not have set its own mode yet — so the middle of the transition falls back to the default CSS. It is more reliable to set the attribute **before** `startViewTransition`, from the navigation wrapper based on the target route, or to keep it on a layout that outlives the child route swap.

## Afterword: what React's `<ViewTransition>` will buy you

The experimental [`ViewTransition`](https://react.dev/blog/2025/04/23/react-labs-view-transitions-activity-and-more) (and its Next.js integration) will remove some of the plumbing: fewer manual `startViewTransition` calls and `setTimeout` hacks, better cooperation with Suspense and concurrent rendering. The API is still moving, so read the following as a direction rather than a contract:

```tsx
import { ViewTransition } from 'react';

// Names and transition types become declarative; the CSS stays yours
<ViewTransition name="header" default="none">
  <AppHeader title={title} />
</ViewTransition>;
```

None of that changes the substance of this note: **progressive enhancement, isolating the persistent chrome, separate animations for changing text, working around Safari's artifacts.** React will shorten the glue to navigation; the character of a transition still lives in CSS and in what you deliberately choose _not_ to animate.

The ecosystem around the API is growing its own tooling, too — Google I/O 2026 showed the [View Transitions Toolkit](https://chrome.dev/view-transitions-toolkit/) (`npm i view-transitions-toolkit`). It has the shape of early Workbox for Service Workers: not required, but plausibly a convenient layer over a low-level API.

While a stable `<ViewTransition>` ripens, users and the client are already getting value out of the platform API. That is what makes it a working tool rather than an announcement about the future.

---

### Related notes

- [Measuring the visible part of the viewport](/garden/viewport)
- [Deep linking from the web](/garden/deeplink-web)
- [When offline support collides with lazy loading](/garden/offline-vs-lazy-loading)
- [Recovery and observability for a PWA that fails before it starts](/garden/pwa-recovery-observability_en)
- [Workbox Background Sync that survives iOS Safari and Android WebView](/garden/workbox-background-sync_en)
- [Better image viewing](/garden/zoom)
