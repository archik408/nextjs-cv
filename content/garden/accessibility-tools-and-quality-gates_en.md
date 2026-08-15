---
title: "Accessibility: a developer's field guide"
description: A practical accessibility stack for web engineers — WCAG, ARIA, APG, WAI, UI kits, testing, audits, linters, CI/CD, E2E, and AI agents.
date: 2026-05-27
tags: [a11y, accessibility, wcag, programming, quality-gates, tools]
---

# WebView · mobile web · desktop web

## Development

### WCAG

The main shared bar for accessible web apps is still the [W3C Web Content Accessibility Guidelines (WCAG)](https://www.w3.org/TR/wcag).

WCAG criteria are grouped into three conformance levels:

- **Level A** — the floor; basic barriers only;
- **Level AA** — the level that covers most common, high-impact issues;
- **Level AAA** — advanced / specialized requirements.

Treat **Level AA** as the shipping baseline. It is what most policies, RFPs, and lawsuits effectively expect.

Handy maps for navigating criteria by level:

- [WCAG in Plain English — Code](https://aaardvarkaccessibility.com/wcag-responsibility/code/)
- [WCAG Map](https://www.andrewhick.com/accessibility/wcag-map/)
- [WCAG Notion Explorer](https://wcag-2-point-2-explorer.notion.site/6d8f6cb4081349e99e7bcd85770cca00?v=4f93e67af3c6459593354a480a5db354)

### ARIA

[ARIA](https://www.w3.org/TR/wai-aria) extends HTML semantics so assistive technologies can understand custom UI. Used well, it fills gaps. Used casually, it creates new ones.

The [first rules of ARIA](https://www.w3.org/TR/using-aria) still win most debates:

1. **Don’t use ARIA if you can use a native element.** Prefer `<button>`, `<a>`, `<label>`, real headings, lists, and tables. Visually hidden text (for example `.visually-hidden`) usually beats a clever `aria-*` attribute.
2. **Don’t override native semantics** unless you have no other option.
3. **Every interactive ARIA control must be keyboard-operable.**
4. **Never put `role="presentation"` or `aria-hidden="true"` on a focusable element.**

### APG patterns

For complex widgets — menus, tabs, dialogs, accordions, carousels, comboboxes, sliders — follow the [ARIA Authoring Practices Guide (APG)](https://www.w3.org/WAI/ARIA/apg/patterns). Reinventing keyboard behavior from scratch is how focus traps and “mystery meat” controls ship.

### WAI tutorials

For concrete components, start with official W3C Web Accessibility Initiative (WAI) tutorials:

- [Images](https://www.w3.org/WAI/tutorials/images)
- [Menus](https://www.w3.org/WAI/tutorials/menus)
- [Page structure](https://www.w3.org/WAI/tutorials/page-structure)
- [Tables](https://www.w3.org/WAI/tutorials/tables)
- [Forms](https://www.w3.org/WAI/tutorials/forms)
- [Carousels](https://www.w3.org/WAI/tutorials/carousels)

Practical WAI shortcuts:

- [Tips for developing](https://www.w3.org/WAI/tips/developing)
- [Easy / preliminary checks](https://www.w3.org/WAI/test-evaluate/preliminary)

### Component libraries and UI kits

The highest-leverage advice is often boring: use a mature component library that already did the ARIA, focus, and screen-reader work.

Examples with strong accessibility defaults:

- [Chakra UI](https://chakra-ui.com)
- [Radix UI](https://www.radix-ui.com)
- [Material UI](https://mui.com)

These kits usually ship focus management ([focus-lock](https://www.npmjs.com/package/focus-lock) / [focus-trap](https://www.npmjs.com/package/focus-trap) patterns), sane semantics, and battle-tested ARIA. Build your own design-system primitives only if you are ready to own that same testing burden.

Many also expose accessibility helpers — for example Chakra’s [SkipNavLink](https://chakra-ui.com/docs/components/skip-nav) and [VisuallyHidden](https://chakra-ui.com/docs/components/visually-hidden).

## Testing and debugging

Scanners catch only [about 30–60% of accessibility issues](https://dev.to/chris_devto/your-accessibility-score-is-lying-to-you-5fh2). Manual testing with assistive technology is not optional if you care about real outcomes.

> axe-core can automatically detect about 57% of WCAG issues on average. Source: [deque/axe-core](https://github.com/dequelabs/axe-core)

Always exercise the product with screen readers:

- **Mobile:** TalkBack (Android), VoiceOver (iOS)
- **Desktop:** NVDA (Windows, free and popular with testers), JAWS (Windows, common in enterprise), VoiceOver (macOS)
- **Also useful:** Orca (Linux), Narrator (Windows)

See current popularity in the [WebAIM Screen Reader User Survey](https://webaim.org/projects/screenreadersurvey10/).

### Audit tools

My default audit stack starts with **Deque axe** as a [DevTools extension](https://www.deque.com/axe/devtools).

Useful companions:

- [WAVE](https://wave.webaim.org) (WebAIM) — structure, semantics, tab order, contrast
- [Colour Contrast Analyser (CCA)](https://vispero.com/lp/color-contrast-checker) (Vispero / TPGi) — desktop contrast checks across the UI
- [Sim Daltonism](https://apps.apple.com/us/app/sim-daltonism/id693112260?mt=12) — color-vision simulation on macOS (system alternative: [Settings → Accessibility → Display & Text Size → Color Filters](https://support.apple.com/en-us/111773))

Other common scanners:

- [Lighthouse Accessibility](https://developer.chrome.com/docs/lighthouse/accessibility/scoring) in Chrome DevTools
- [WebHint accessibility hints](https://webhint.io/docs/user-guide/hints/accessibility/) (axe under the hood)

## Static analysis

The cheapest quality gate is linting. Most modern JS/TS linters can stop the obvious failures — missing `alt`, clickable `div`s without roles, and similar footguns — before code review.

- ESLint — [eslint-plugin-jsx-a11y](https://github.com/jsx-eslint/eslint-plugin-jsx-a11y)
- Oxlint — [jsx-a11y settings](https://oxc.rs/docs/guide/usage/linter/config-file-reference.html#settings-jsx-a11y)
- Biome — [a11y rules](https://biomejs.dev/linter/javascript/rules/#a11y)

## Tests and automation

### CI/CD

Heavier, but valuable: fail the pipeline when pages regress.

- [@axe-core/cli](https://www.npmjs.com/package/@axe-core/cli)
- [Lighthouse CI](https://github.com/GoogleChrome/lighthouse-ci)

### Runtime

In local or staging environments you can run [axe-core](https://github.com/dequelabs/axe-core) inside the app and dump findings to the console via [@axe-core/react](https://www.npmjs.com/package/@axe-core/react):

```javascript
if (isDevEnv() || isStageEnv()) {
  // Give the UI time to settle after re-renders to cut false positives
  const AXE_DEBOUNCE_MS = 6000;
  void Promise.all([import('@axe-core/react'), import('react-dom')]).then(([axe, ReactDOM]) => {
    axe.default(React, ReactDOM, AXE_DEBOUNCE_MS);
  });
}
```

### End-to-end tests

A pragmatic middle ground is accessibility assertions inside the suite you already run:

- Playwright — [built-in guidance](https://playwright.dev/docs/accessibility-testing#example-accessibility-tests), [@axe-core/playwright](https://www.npmjs.com/package/@axe-core/playwright)
- Cypress — [docs](https://docs.cypress.io/app/guides/accessibility-testing), [cypress-axe](https://www.npmjs.com/package/cypress-axe), [wick-a11y](https://www.npmjs.com/package/wick-a11y)
- WebdriverIO — [docs](https://webdriver.io/docs/accessibility-testing/axe-core), [@axe-core/webdriverio](https://www.npmjs.com/package/@axe-core/webdriverio)

### Unit tests

Prefer [Testing Library](https://testing-library.com). Its query API is accessibility-first: `getByRole`, `getByLabelText`, and `getByAltText` surface inaccessible markup as a side effect of ordinary unit tests.

- [Accessibility API](https://testing-library.com/docs/dom-testing-library/api-accessibility/)
- [Query priority](https://testing-library.com/docs/queries/about/#priority)

## AI agents

### AGENTS.md

If AI agents write or edit UI code, put accessibility rules in writing. Models train on the public web — and a large share of that web is inaccessible. Look at real [AGENTS.md examples that mention accessibility](https://github.com/search?q=path%3AAGENTS.md+NOT+is%3Afork+NOT+is%3Aarchived+accessibility&type=code&p=2), or turn the sections above into project rules.

### Agent skills

[Agent skills](https://agentskills.io/) can encode both implementation guidance and audit workflows. One example: [Intopia’s accessibility skill](https://github.com/Intopia/intopia-web-accessibility-skill).

At Google I/O 2026, Chrome announced [Modern Web Guidance](https://developer.chrome.com/docs/modern-web-guidance) — open guides plus a skill pack for AI agents, including accessibility. Install with:

```bash
npx modern-web-guidance@latest install
```

It works with common agent stacks (Vercel AI SDK, Claude Code, Copilot CLI, and others). In Cursor you can also install it from the marketplace.

```bash
npx modern-web-guidance@latest search "create a dialog modal backdrop"
```

Example result:

```bash
[{"id":"accessibility","description":"Actionable coding guidelines for building accessible web applications, covering semantic HTML, focus management, forms, media, and testing. Use this skill when auditing or implementing accessibility features, keyboard navigation, or ARIA.","category":"accessibility","tokenCount":7129,"similarity":0.5102}]
```

Then retrieve the guide:

```bash
npx modern-web-guidance@latest retrieve "accessibility"
```

---

### Related notes

- [A practical web accessibility audit in five steps](/garden/audit-a11y-without-wcag_en)
- [Accessibility audit of Priorbank’s web app](/garden/audit-priorbank-a11y)
- [Wildberries accessibility audit. Can a blind user buy the Batmobile?](/garden/audit-wildberries-a11y_en)
- [Skip links — a quiet mark of good craft](/garden/skip-links)
- [Web accessibility is not hype — it is responsibility](/garden/a11y-my-task-crafting)
- [The web and tactile typography](/garden/braille)
- [When accessibility features break the design — and sometimes accessibility itself](/garden/normalize-text-scaling)
