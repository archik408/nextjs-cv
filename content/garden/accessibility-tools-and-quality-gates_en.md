---
title: "Accessibility: a developer's field guide"
description: A working accessibility stack for web engineers — WCAG, ARIA, APG, WAI, UI kits, manual testing, audit tools, linters, CI/CD, E2E, and AI agents.
date: 2026-05-27
tags: [a11y, accessibility, wcag, programming, quality-gates, tools]
---

# WebView · mobile web · desktop web

## Development

### WCAG

The reference point for accessible web apps is still the [W3C Web Content Accessibility Guidelines (WCAG)](https://www.w3.org/TR/wcag).

Its success criteria come in three conformance levels:

- **Level A** — the floor: basic, easy-to-meet requirements;
- **Level AA** — enough accessibility for the majority of people with disabilities;
- **Level AAA** — advanced and often specialized requirements.

**Level AA is the baseline you ship.** It covers the largest share of critical, commonly encountered barriers, and it is the bar most policies and procurement checklists assume.

Maps that make it easier to navigate specific criteria per level:

- [WCAG in Plain English — Code](https://aaardvarkaccessibility.com/wcag-responsibility/code/)
- [WCAG Map](https://www.andrewhick.com/accessibility/wcag-map/)
- [WCAG Notion Explorer](https://wcag-2-point-2-explorer.notion.site/6d8f6cb4081349e99e7bcd85770cca00?v=4f93e67af3c6459593354a480a5db354)

### ARIA

ARIA attributes are a semantic extension of HTML markup that makes your UI legible to assistive technology. The reasoning behind them lives in [its own specification](https://www.w3.org/TR/wai-aria).

Working with ARIA comes down to [four rules](https://www.w3.org/TR/using-aria):

1. **If you can avoid ARIA, avoid it.** Proper semantic markup wins. Native `<button>`, `<a>`, `<label>`, real headings, lists, tables, and visually hidden text (a `.visually-hidden` class, for example) work far better with assistive technology than a pile of `aria-*` attributes.
2. **Do not override native semantics** unless you genuinely have no alternative.
3. **Every interactive ARIA control must be keyboard-operable.**
4. **Never put `role="presentation"` or `aria-hidden="true"` on a focusable element.**

### APG patterns

For complex widgets — menus, tabs, dialogs, accordions, carousels, comboboxes, sliders, and friends — follow the established [markup and keyboard patterns from the ARIA Authoring Practices Guide (APG)](https://www.w3.org/WAI/ARIA/apg/patterns).

### WAI tutorials

When you are building a specific component, go to the official material from the W3C Web Accessibility Initiative (WAI), the part of the W3C dedicated to accessibility:

- [Images](https://www.w3.org/WAI/tutorials/images)
- [Menus](https://www.w3.org/WAI/tutorials/menus)
- [Page structure](https://www.w3.org/WAI/tutorials/page-structure)
- [Tables](https://www.w3.org/WAI/tutorials/tables)
- [Forms](https://www.w3.org/WAI/tutorials/forms)
- [Carousels](https://www.w3.org/WAI/tutorials/carousels)

Practical WAI guides:

- General development advice: [WAI Tips](https://www.w3.org/WAI/tips/developing)
- Quick manual checks: [Easy Checks](https://www.w3.org/WAI/test-evaluate/preliminary)

### Component libraries and UI kits

The best accessibility advice is usually the least glamorous: reach for a mature component library that has already worked through the ARIA, focus, and screen reader details.

Popular UI kits with accessibility out of the box:

- [Chakra UI](https://chakra-ui.com)
- [Radix UI](https://www.radix-ui.com)
- [Material UI](https://mui.com)

These libraries typically handle focus management for you ([focus-lock](https://www.npmjs.com/package/focus-lock) / [focus-trap](https://www.npmjs.com/package/focus-trap)), get the semantics and ARIA right, and have been tested against the mainstream screen readers. Roll your own components and you own all of that — the mechanics, the rules, and the screen reader testing.

Many of these kits also ship dedicated accessibility helpers. Chakra UI, for instance, has [SkipNavLink](https://chakra-ui.com/docs/components/skip-nav) for skipping navigation and [VisuallyHidden](https://chakra-ui.com/docs/components/visually-hidden) for hiding text visually while keeping it available to screen readers.

## Testing and debugging

Automated scanners find only [30% to 60% of accessibility issues](https://dev.to/chris_devto/your-accessibility-score-is-lying-to-you-5fh2) in an application, so manual testing and debugging are unavoidable.

> axe-core automatically detects an average of 57% of WCAG issues. Source: [dequelabs/axe-core](https://github.com/dequelabs/axe-core)

Checking accessibility by hand with real assistive technology is critical — it is the only way to judge the actual experience of users with disabilities.

Test with screen readers, without exception:

- Mobile:
  - Android: TalkBack (preinstalled)
  - iOS: VoiceOver (preinstalled)
- Desktop:
  - NVDA (Windows) — free, and the most popular option among testers
  - JAWS (Windows) — commercial, widespread in enterprise environments
  - VoiceOver (macOS) — built into the system
- Less common, but still worth a pass:
  - Orca (Ubuntu / Linux)
  - Narrator (Windows) — the built-in basic reader

For current usage numbers, see the [WebAIM Screen Reader User Survey](https://webaim.org/projects/screenreadersurvey10/).

### Audit tools

The best accessibility audit tool on the market is _Deque axe_, available as a [DevTools extension](https://www.deque.com/axe/devtools).

Useful companions:

- _[WAVE](https://wave.webaim.org)_ by WebAIM — an online service for checking semantics, content structure, tab order, and contrast
- _[Colour Contrast Analyser (CCA)](https://vispero.com/lp/color-contrast-checker)_ by Vispero/TPGi — a desktop app that makes it easy to sample contrast anywhere on screen
- _[Sim Daltonism](https://apps.apple.com/us/app/sim-daltonism/id693112260?mt=12)_ — a macOS app for reviewing color and contrast through various color vision deficiencies (built-in alternative on iOS/macOS: [Settings → Accessibility → Display & Text Size → Color Filters](https://support.apple.com/en-us/111773))

Other popular accessibility scanners:

- _[Lighthouse](https://developer.chrome.com/docs/lighthouse/accessibility/scoring)_ (Accessibility section) — built into Chrome DevTools
- _[WebHint](https://webhint.io/docs/user-guide/hints/accessibility/)_ (Accessibility hints, running the same Deque axe engine under the hood)

## Static analysis

The cheapest way to automate accessibility checks at the code level is static analysis. Nearly every popular linter offers a solid set of baseline accessibility rules. At the very least you reach a state where no image ships without `alt` text and no `div` or `span` sneaks through with an `onClick` handler and no matching semantic role.

The most common linters and their accessibility rule sets:

- ESLint — [eslint-plugin-jsx-a11y](https://github.com/jsx-eslint/eslint-plugin-jsx-a11y)
- Oxlint — [jsx-a11y settings](https://oxc.rs/docs/guide/usage/linter/config-file-reference.html#settings-jsx-a11y)
- Biome — [a11y rules](https://biomejs.dev/linter/javascript/rules/#a11y)

## Tests and automation

### CI/CD

A pricier, more resource-hungry option is auditing pages directly in your CI/CD pipeline. Both Deque axe and Lighthouse plug in there:

- [@axe-core/cli](https://www.npmjs.com/package/@axe-core/cli)
- [Lighthouse CI](https://github.com/GoogleChrome/lighthouse-ci)

### Runtime

In a test environment or during local development you can run [axe-core](https://github.com/dequelabs/axe-core) programmatically and print audit results straight to the console:

- [@axe-core/react](https://www.npmjs.com/package/@axe-core/react)

```javascript
if (isDevEnv() || isStageEnv()) {
  // Let the app settle after re-renders so axe reports fewer false positives
  const AXE_DEBOUNCE_MS = 6000;
  void Promise.all([import('@axe-core/react'), import('react-dom')]).then(([axe, ReactDOM]) => {
    axe.default(React, ReactDOM, AXE_DEBOUNCE_MS);
  });
}
```

### End-to-end tests

The more pragmatic move is to put accessibility checks inside the automated tests you already run — almost every popular framework exposes an API for it:

- Playwright
  - [Accessibility testing guide](https://playwright.dev/docs/accessibility-testing#example-accessibility-tests)
  - [@axe-core/playwright](https://www.npmjs.com/package/@axe-core/playwright)
- Cypress
  - [Accessibility testing guide](https://docs.cypress.io/app/guides/accessibility-testing)
  - [cypress-axe](https://www.npmjs.com/package/cypress-axe)
  - [wick-a11y](https://www.npmjs.com/package/wick-a11y)
- WebdriverIO
  - [Accessibility testing guide](https://webdriver.io/docs/accessibility-testing/axe-core)
  - [@axe-core/webdriverio](https://www.npmjs.com/package/@axe-core/webdriverio)

### Unit tests

Whatever runner you configure your JavaScript unit tests with, reach for [Testing Library](https://testing-library.com) — it is built accessibility-first.

Its API nudges you toward correct semantics and markup on its own: queries like `getByLabelText`, `getByRole`, and `getByAltText` test the component and, as a side effect, its accessibility.

- [Accessibility API](https://testing-library.com/docs/dom-testing-library/api-accessibility/)
- [Query priority](https://testing-library.com/docs/queries/about/#priority)

## AI integration and agents

### AGENTS.md

If AI agents touch your UI code, spell out your accessibility coding rules explicitly.

Most LLMs are trained on the open web, and a large share of that web has serious accessibility problems. For inspiration, look at how [open source projects](https://github.com/search?q=path%3AAGENTS.md+NOT+is%3Afork+NOT+is%3Aarchived+accessibility&type=code&p=2) write these sections in their [AGENTS.md](https://agents.md/).

Every section of this guide above also makes a decent starting point for drafting those rules.

### Agent skills

[Skills](https://agentskills.io/) can be a powerful tool in their own right — both for building accessibility into new code and for auditing an existing codebase.

Example skills:

- [Intopia Accessibility Skill](https://github.com/Intopia/intopia-web-accessibility-skill)

At Google I/O 2026, Chrome announced [Modern Web Guidance](https://developer.chrome.com/docs/modern-web-guidance) — open guides plus a skill pack for AI agents, accessibility guide included. One command to install:

```bash
npx modern-web-guidance@latest install
```

It works with the popular agents: Vercel AI SDK, Claude Code, Copilot CLI, Antigravity CLI, and others. In Cursor you can pull it in as a plugin from the marketplace.

Here is what using it looks like:

```bash
npx modern-web-guidance@latest search "create a dialog modal backdrop"
```

Output:

```bash
[{"id":"accessibility","description":"Actionable coding guidelines for building accessible web applications, covering semantic HTML, focus management, forms, media, and testing. Use this skill when auditing or implementing accessibility features, keyboard navigation, or ARIA.","category":"accessibility","tokenCount":7129,"similarity":0.5102}]
```

Then pull the guide itself:

```bash
npx modern-web-guidance@latest retrieve "accessibility"
```

---

### Related notes

- [A practical web accessibility audit in five steps (no dogma)](/garden/audit-a11y-without-wcag_en)
- [Accessibility audit of Priorbank’s web app](/garden/audit-priorbank-a11y)
- [Wildberries accessibility audit. Can a blind user buy the Batmobile?](/garden/audit-wildberries-a11y_en)
- [Skip links — a quiet mark of good craft](/garden/skip-links)
- [Web accessibility is not hype — it is responsibility](/garden/a11y-my-task-crafting)
- [The web and tactile typography](/garden/braille)
- [When accessibility features break the design — and sometimes accessibility itself](/garden/normalize-text-scaling)
