---
title: "Accessibility: A developer's guide"
description: A developer's guide to accessibility — WCAG, ARIA, APG, WAI, UI kits, testing, audits, linters, CI/CD, E2E, and AI.
date: 2026-05-27
tags: [a11y, accessibility, wcag, programming, quality-gates, tools]
---

# WebView | Web Mobile | Web Desktop

## Development

### WCAG

One of the main reference points when building accessible web apps is the [W3C Web Content Accessibility Guidelines (WCAG)](https://www.w3.org/TR/wcag).

Requirements fall into three levels:

- _Level A_ — the baseline, very basic level
- _Level AA_ — accessibility sufficient for most people with disabilities
- _Level AAA_ — the advanced accessibility level

WCAG Level AA is the level to treat as your baseline (the minimum you ship). It covers the largest share of critical and common accessibility issues.

Maps that make it easier to navigate specific criteria by level:

- [WCAG in Plain English - Code](https://aaardvarkaccessibility.com/wcag-responsibility/code/)
- [WCAG Map](https://www.andrewhick.com/accessibility/wcag-map/)
- [WCAG Notion Explorer](https://wcag-2-point-2-explorer.notion.site/6d8f6cb4081349e99e7bcd85770cca00?v=4f93e67af3c6459593354a480a5db354)

### ARIA

ARIA attributes are a semantic extension of HTML markup that help assistive technologies understand the UI. The rationale and rules for these extensions live in a [separate specification](https://www.w3.org/TR/wai-aria).

When working with ARIA, there are [four important rules](https://www.w3.org/TR/using-aria):

1. The first and most important rule: if you can do without ARIA, prefer correct semantic markup. Semantic elements like `<button>`, `<a>`, `<label>`, headings, lists, tables, and visually hidden text hints (for example via a `.visually-hidden` class) work far better with assistive technologies than ARIA attributes alone.
2. Do not change an element's native semantics unless you absolutely must.
3. All interactive ARIA controls must be keyboard-accessible.
4. Do not use `role="presentation"` or `aria-hidden="true"` on a focusable element.

### APG patterns

For complex components — menus, tabs, dialogs, accordions, carousels, comboboxes, sliders, and the like — follow the established [patterns in the ARIA Authoring Practices Guide (APG)](https://www.w3.org/WAI/ARIA/apg/patterns).

### WAI tutorials

When working on specific components, use the official materials from the W3C Web Accessibility Initiative (WAI) — the W3C group focused on accessibility:

- [Images tutorials](https://www.w3.org/WAI/tutorials/images)
- [Menus tutorials](https://www.w3.org/WAI/tutorials/menus)
- [Page structure](https://www.w3.org/WAI/tutorials/page-structure)
- [Tables](https://www.w3.org/WAI/tutorials/tables)
- [Forms](https://www.w3.org/WAI/tutorials/forms)
- [Carousels](https://www.w3.org/WAI/tutorials/carousels)

Practical WAI guidance:

- General development tips: [WAI Tips](https://www.w3.org/WAI/tips/developing)
- Easy checks: [WAI Test-Evaluate](https://www.w3.org/WAI/test-evaluate/preliminary)

### Component libraries and UI kits

The best accessibility advice is often to adopt well-known component libraries that already handle ARIA markup and assistive-technology / screen-reader interaction.

Popular UI kits with accessibility out of the box:

- [Chakra UI](https://chakra-ui.com)
- [Radix UI](https://www.radix-ui.com)
- [Material UI](https://mui.com)

These libraries typically already cover focus behavior ([Focus Lock](https://www.npmjs.com/package/focus-lock) / [Focus Trap](https://www.npmjs.com/package/focus-trap), focus management), correct semantics and ARIA attributes, and testing against the major screen readers. If you build your own components, you inherit all of that work — and the responsibility to test with screen readers yourself.

Many of these libraries also ship accessibility-oriented primitives. Chakra UI, for example, provides [SkipNavLink](https://chakra-ui.com/docs/components/skip-nav) (skip navigation) and [VisuallyHidden](https://chakra-ui.com/docs/components/visually-hidden) (hide text visually while keeping it available to screen readers).

## Testing and debugging

Automation and scanners catch only [about 30% to 60% of accessibility issues](https://dev.to/chris_devto/your-accessibility-score-is-lying-to-you-5fh2) in an app, so manual testing and debugging remain essential.

> With axe-core you can automatically detect about 57% of WCAG issues on average. Source: https://github.com/dequelabs/axe-core

It is critical to verify accessibility by hand with assistive technologies — that is the only way to judge the real experience of users with disabilities.

Always test with screen readers:

- On mobile:
  - Android: TalkBack (preinstalled)
  - iOS: VoiceOver (preinstalled)
- On desktop:
  - NVDA (Windows) — free; the most popular among testers
  - JAWS (Windows) — paid; widely used in enterprise environments
  - VoiceOver (macOS) — built into the system
- Less common but still useful:
  - Orca (Ubuntu / Linux)
  - Narrator (Windows) — built-in basic screen reader

Screen reader popularity from the [WebAIM survey is here](https://webaim.org/projects/screenreadersurvey10/).

### Audit tools

The best accessibility audit tool on the market is _Deque axe_, available as a [DevTools extension](https://www.deque.com/axe/devtools).

Useful complements:

- _[WAVE](https://wave.webaim.org)_ from WebAIM — an online service for semantics, content structure, tab order, and contrast
- _[Colour Contrast Analyser (CCA)](https://vispero.com/lp/color-contrast-checker)_ from Vispero/TPGi — a desktop app for checking contrast across the UI
- _[Sim Daltonism](https://apps.apple.com/us/app/sim-daltonism/id693112260?mt=12)_ — a macOS app for previewing color and contrast under various forms of color vision deficiency (iOS / macOS alternative: [Settings → Accessibility → Display & Text Size → Color Filters](https://support.apple.com/en-us/111773))

Other popular accessibility scanners:

- _[Lighthouse](https://developer.chrome.com/docs/lighthouse/accessibility/scoring?hl=ru)_ (Accessibility section) — built into Chrome DevTools
- _[WebHint](https://webhint.io/docs/user-guide/hints/accessibility/)_ (Accessibility section; uses Deque axe under the hood)

## Static analysis

One of the cheapest ways to automate accessibility checks in code is static analysis. Most popular static analyzers offer solid defaults for basic accessibility rules. At minimum you can reach a point where no image ships without alt text and no `div`/`span` fires `onClick` without an appropriate semantic role.

Popular linters and their accessibility setups:

- ESLint — [eslint-plugin-jsx-a11y](https://github.com/jsx-eslint/eslint-plugin-jsx-a11y)
- Oxlint — [settings-jsx-a11y](https://oxc.rs/docs/guide/usage/linter/config-file-reference.html#settings-jsx-a11y)
- Biome — [a11y rules](https://biomejs.dev/linter/javascript/rules/#a11y)

## Tests and automation

### CI/CD

A more expensive, resource-heavy option is to run page audits directly in CI/CD. Deque axe and Lighthouse both plug into pipelines:

- [@axe-core/cli](https://www.npmjs.com/package/@axe-core/cli)
- [lighthouse-ci](https://github.com/GoogleChrome/lighthouse-ci)

### Runtime

You can also run [axe-core](https://github.com/dequelabs/axe-core) programmatically in a test or local development environment and log audit results to the console:

- [@axe-core/react](https://www.npmjs.com/package/@axe-core/react)

```javascript
if (isDevEnv() || isStageEnv()) {
  // Give the app time to settle after re-renders to reduce axe false positives
  const AXE_DEBOUNCE_MS = 6000;
  void Promise.all([import('@axe-core/react'), import('react-dom')]).then(([axe, ReactDOM]) => {
    axe.default(React, ReactDOM, AXE_DEBOUNCE_MS);
  });
}
```

### E2E tests

A more pragmatic approach is to fold accessibility checks into your automation suite. Most popular test frameworks expose an accessibility API:

- Playwright
  - [playwright accessibility-testing](https://playwright.dev/docs/accessibility-testing#example-accessibility-tests)
  - [@axe-core/playwright](https://www.npmjs.com/package/@axe-core/playwright)
- Cypress
  - [cypress accessibility-testing](https://docs.cypress.io/app/guides/accessibility-testing)
  - [cypress-axe](https://www.npmjs.com/package/cypress-axe)
  - [wick-a11y](https://www.npmjs.com/package/wick-a11y)
- WebDriver
  - [webdriver accessibility-testing](https://webdriver.io/docs/accessibility-testing/axe-core)
  - [@axe-core/webdriverio](https://www.npmjs.com/package/@axe-core/webdriverio)

### Unit tests

Regardless of how you configure and run JavaScript unit tests, prefer [Testing Library](https://testing-library.com), which is built accessibility-first.

Its query API nudges you toward correct semantics and markup: methods like `getByLabelText`, `getByRole`, and `getByAltText` exercise accessibility as a side effect of the unit test itself.

- [Accessibility API](https://testing-library.com/docs/dom-testing-library/api-accessibility/)
- [Queries API](https://testing-library.com/docs/queries/about/#priority)

## AI integration and agents

### AGENTS.md

When working with AI agents, spell out coding rules with an explicit accessibility focus.

Most LLMs train on open web data, and a large share of that web has serious accessibility problems. Example rule sections for [AGENTS.md](https://agents.md/) appear in [open-source projects](https://github.com/search?q=path%3AAGENTS.md+NOT+is%3Afork+NOT+is%3Aarchived+accessibility&type=code&p=2).

The sections above also make a solid base for drafting those rules.

### Agent skills

[Skills](https://agentskills.io/) can be a powerful tool both for implementing accessibility in a project and for auditing an existing codebase.

Example skills:

- [Intopia Accessibility Skill](https://github.com/Intopia/intopia-web-accessibility-skill)

At Google I/O 2026, Chrome announced [Modern Web Guidance](https://developer.chrome.com/docs/modern-web-guidance?hl=ru) — open guides and a skill pack for AI agents. Among other topics it includes an accessibility guide. Install with one command:

```bash
npx modern-web-guidance@latest install
```

It works with popular agents: Vercel AI SDK, Claude Code, Copilot CLI, Antigravity CLI, and others. In Cursor you can pull it in as a marketplace plugin.

Example usage:

```bash
npx modern-web-guidance@latest search "create a dialog modal backdrop"
```

Output:

```bash
[{"id":"accessibility","description":"Actionable coding guidelines for building accessible web applications, covering semantic HTML, focus management, forms, media, and testing. Use this skill when auditing or implementing accessibility features, keyboard navigation, or ARIA.","category":"accessibility","tokenCount":7129,"similarity":0.5102}]
```

Retrieving a guide:

```bash
npx modern-web-guidance@latest retrieve "accessibility"
```

---

### Related notes

- [[Practical web accessibility audit: 5 steps without the dogma](/garden/audit-a11y-without-wcag_en)]
- [[Accessibility audit of Priorbank's web app](/garden/audit-priorbank-a11y)]
- [[Wildberries accessibility audit. Can a blind user buy the Batmobile?](/garden/audit-wildberries-a11y_en)]
- [[Skip Links — an invisible marker of good taste](/garden/skip-links)]
- [[Web accessibility is not hype — it is responsibility](/garden/a11y-my-task-crafting)]
- [[Web and tactile typography](/garden/braille)]
- [[When accessibility features break the design — and sometimes accessibility itself](/garden/normalize-text-scaling)]
