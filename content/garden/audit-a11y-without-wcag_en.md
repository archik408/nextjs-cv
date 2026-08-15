---
title: A practical web accessibility audit in five steps (no dogma)
description: A grounded five-step accessibility audit you can run without memorizing the specs first.
date: 2025-10-29
tags: [a11y, accessibility, wcag, programming, audit, skip-links]
---

Why do teams still dodge accessibility?

It feels like you have to memorize an entire shelf of specs — [WCAG](https://www.w3.org/WAI/standards-guidelines/wcag/), [Section 508](https://www.section508.gov/manage/laws-and-policies), [ADA](https://www.ada.gov/resources/disability-rights-guide), [EAA](https://commission.europa.eu/strategy-and-policy/policies/justice-and-fundamental-rights/disability/union-equality-strategy-rights-persons-disabilities-2021-2030/european-accessibility-act_en), [ARIA](https://www.w3.org/TR/wai-aria), [ATAG](https://www.w3.org/WAI/standards-guidelines/atag), [UAAG](https://www.w3.org/WAI/standards-guidelines/uaag). And that list keeps growing: countries, states, and regions often add their own rules.

You do not need all of that to start. Inspired by WAI’s [Easy Checks](https://www.w3.org/WAI/test-evaluate/easy-checks/), I use a deliberately practical method anyone can run — engineer, designer, QA, or product manager.

## The idea

Accessibility is not a checklist sport. It is about people — including people with permanent disabilities and people who are temporarily or situationally constrained:

- someone who is blind;
- someone with a broken arm;
- a parent holding a child;
- someone outdoors in harsh sunlight;
- someone with a [color vision deficiency](https://www.w3.org/WAI/people-use-web/abilities-barriers/#visual).

If a person cannot use your product, that is a product failure — bad UX, a lost audience, and often a compliance gap. WHO stats and deep legal analysis can wait for a longer piece.

## A five-step quick audit

### 1. Culture markers

These are a fast read on whether accessibility is part of the team’s culture. If they exist, the rest of the site is more likely to be in decent shape.

#### Accessibility statement

Check for an [accessibility statement](https://www.w3.org/WAI/planning/statements/). The link usually sits in the footer next to privacy and terms.

Having one is a good sign: the team publicly owns the work, states commitments, and offers a feedback channel. A useful statement often covers:

- how testing is done (manual, automated, with people with disabilities);
- which standards and tools are used (WCAG, screen readers, and so on);
- known issues that are still open;
- how to report problems.

Shipping a basic page is [almost free](https://www.w3.org/WAI/planning/statements/generator/#create) and buys transparency immediately.

Example:

![McDonald's Accessibility Statement](/garden/audit/accessibility-statement.webp)

Great accessibility still comes from the implementation, not from a polished policy page. A site can be fully accessible without a statement. Even so, the statement is more than checkbox theater:

- **Priority signal.** Users can see that inclusion is on the team’s radar.
- **Transparency.** You can say what works today and what still fails.
- **Feedback loop.** A clear contact path turns a monologue into a conversation.

So this is less “required by the rules” and more “smart for trust.”

#### Skip links

Press Tab on page load. The first focusable control should be something like “Skip to main content” or “Skip navigation.”

[Skip links](/garden/skip-links) let keyboard and screen reader users jump past repeating chrome to the content that matters.

Example:

![McDonald's Skip Links](/garden/skip-links/mac.webp)

### 2. Color and contrast

Color failures are still among the most common.

- Spot-check questionable pairs with [Colour Contrast Analyser (CCA)](https://www.tpgi.com/color-contrast-checker/). I prefer TPGi’s desktop app because it stays out of the browser while I move between tabs and windows. An extension or [WebAIM’s Contrast Checker](https://webaim.org/resources/contrastchecker) also works. This matters for low vision, color vision deficiency, and bright outdoor use.
- Do not rely on color alone. Pair status and feedback with text (or another non-color cue).

Example:

![McDonald's contrast check](/garden/audit/color-contrast.webp)

### 3. Keyboard navigation

If the site is not usable from the keyboard, it is inaccessible for many people.

- Can every interactive control be reached with Tab / Shift+Tab?
- Is focus visible? Was `outline` removed without a clear replacement? Is the indicator high-contrast enough?
- Does focus order follow the visual reading order (typically top to bottom, left to right in LTR layouts)?

### 4. Simulate real constraints

This step hits hardest. It shows how much the UI assumes perfect vision — and it makes barriers tangible.

- Blur the page to approximate low vision. I use a tiny browser extension; in a pinch you can run:

```js
document.body.style.filter = 'blur(5px)';
```

- Turn on a screen reader and complete a basic task with speech plus keyboard. On macOS that is VoiceOver; elsewhere try NVDA, JAWS, Narrator, or Orca.

Example:

![McDonald's VoiceOver check](/garden/audit/voice-over.webp)

### 5. Automated scanning

[Automation will not find everything](https://www.w3.org/WAI/test-evaluate/), but it is excellent at catching technical defects. Rough industry estimates put automated coverage around 30–60% of issues, depending on the product and the toolset.

My usual combo:

- [axe DevTools](https://chromewebstore.google.com/detail/axe-devtools-web-accessib/lhdoppojpmngadmnindnejefpokejbdd?hl=en-US) — still my first scanner for this kind of work;
- [WAVE](https://wave.webaim.org/) — strong for structure and how information is exposed;
- [Lighthouse](https://developer.chrome.com/docs/lighthouse/overview) and [ARC Toolkit](https://www.tpgi.com/arc-platform/arc-toolkit/) as a second pass after axe.

Examples:

![McDonald's axe DevTools check](/garden/audit/axe.webp)

![McDonald's WAVE check](/garden/audit/wave.webp)

These tools catch missing alt text, broken HTML, ARIA mistakes, and many WCAG failures. You do not need to memorize every criterion first — the findings tell you what to fix.

## Red flag: overlay widgets

I rarely bother auditing a product whose “accessibility strategy” is an overlay widget. For me that is an immediate failed smell test. Products like [accessiBe](https://accessibe.com/), [UserWay](https://userway.org/), and peers are usually a symptom, not a cure.

Why:

- they treat symptoms instead of the underlying markup and UX;
- they create an illusion of compliance;
- they struggle with dynamic content;
- they often break native accessibility;
- many disabled users and advocates actively oppose them.

An overlay often signals deeper accessibility debt in the product code. The business goal is frequently lawsuit risk reduction, not a usable experience.

## What you get

In 15–30 minutes you usually walk away with:

- a clear picture of accessibility health;
- a shortlist of critical barriers;
- a practical next-step direction.

You do not need a certification to start. Put yourself in the user’s place and run these five checks.

---

_This method prioritizes substance over compliance theater. After these five steps you will usually be much closer to WCAG 2.x Level AA — and, more importantly, closer to a product people can actually use._

### Related notes

- [Accessibility audit of Priorbank’s web app](/garden/audit-priorbank-a11y)
- [Wildberries accessibility audit. Can a blind user buy the Batmobile?](/garden/audit-wildberries-a11y_en)
- [Web accessibility is not hype — it is responsibility](/garden/a11y-my-task-crafting)
- [Skip links — a quiet mark of good craft](/garden/skip-links)
