---
title: Practical web accessibility audit: 5 steps without the dogma
description: A practical "5-step" accessibility audit (without a deep dive into the specs)
date: 2025-10-29
tags: [a11y, accessibility, wcag, programming, audit, skip-links]
---

Why do we avoid accessibility?
It feels like you have to memorize mountains of specs — [WCAG](https://www.w3.org/WAI/standards-guidelines/wcag/), [Section 508](https://www.section508.gov/manage/laws-and-policies), [ADA](https://www.ada.gov/resources/disability-rights-guide), [EAA](https://commission.europa.eu/strategy-and-policy/policies/justice-and-fundamental-rights/disability/union-equality-strategy-rights-persons-disabilities-2021-2030/european-accessibility-act_en), [ARIA](https://www.w3.org/TR/wai-aria), [ATAG](https://www.w3.org/WAI/standards-guidelines/atag), [UAAG](https://www.w3.org/WAI/standards-guidelines/uaag).

And that is not the full list: many countries, and even individual states and regions, have their own acts or directives.

But you can start with a simple, practical approach grounded in real users. Inspired by the ["Easy Checks"](https://www.w3.org/WAI/test-evaluate/easy-checks/) that WAI recommends, I have my own very down-to-earth method that anyone can use — developer, designer, tester, or product manager.

## Philosophy of the approach

Accessibility is not about checkboxes. It is about people — people with permanent disabilities and people who find themselves in temporarily or situationally constrained conditions:

- A permanently blind user.
- Someone with a temporarily broken arm.
- A parent holding a child.
- Someone outdoors in bright sunlight.
- [Someone with a color vision deficiency](https://t.me/proa11y/63?single).

If someone cannot use your product, that is a failure. The reasons stack up: poor UX, a missed audience, falling short of modern standards. We will leave the details and WHO statistics for longer pieces.

## 🛠️ A 5-step method for a quick audit

### 1. Signs of good taste

These are a quick signal of accessibility culture on a team. If they are present on a site, the rest is likely in decent shape as well.

#### Accessibility Statement

First, check whether the site has an [accessibility statement](https://www.w3.org/WAI/planning/statements/). The link is usually in the footer, next to the privacy policy and terms of use.

Having one is a good sign. It means the team publicly owns its accessibility work, states commitments, and offers a channel for feedback on the topic.

Such a statement often includes useful information:

- How testing is done (manually, automatically, with people with disabilities).
- Which standards and tools are used (WCAG, screen readers, and so on).
- Known issues (which barriers are still open).
- Contacts for reporting difficulties.

For an engineering team, shipping a basic version of this page is a [nearly free task](https://www.w3.org/WAI/planning/statements/generator/#create) that immediately adds transparency and trust.

Example Accessibility Statement:
![McDonald's Accessibility Statement](/garden/audit/accessibility-statement.webp)

Of course, great accessibility is first and foremost solid implementation under the hood — not a polished statement. Fundamentally, a site can be fully accessible without this document or these templates.

Still, an accessibility statement is much more than a checklist item. It is a strong communication tool that works on several levels:

- **A signal of priorities.** For users, it is an explicit marker that the team keeps inclusion in focus. Its mere presence builds trust and shows a mature approach to product work.
- **A window of transparency.** In the statement you can clearly say what has been tested and works, and where barriers remain.
- **A channel for dialogue.** The most important part is a direct, understandable way to give feedback. It turns a monologue into a conversation, letting users report problems and help you improve the product.

So an accessibility statement is not about "must" under the rules — it is about "makes sense" for building trust and openness with every user.

#### Skip Links

Check whether skip links are implemented. Press Tab when the page loads — the first link in the header should appear with text like "Skip to main content" or "Skip navigation."

[This simple, widely used practice](/garden/skip-links) lets screen reader and keyboard users jump straight to the content, past repeating navigation blocks.

Example Skip Links:
![McDonald's Skip Links](/garden/skip-links/mac.webp)

### 2. Color and contrast

Color issues are among the most common.

- Check questionable colors with [Colour Contrast Analyser (CCA)](https://www.tpgi.com/color-contrast-checker/) — I use TPGi's external desktop tool because it stays out of my way when I switch tabs and windows, outside the browser. You can also use an extension or [an online service like WebAIM](https://webaim.org/resources/contrastchecker). This matters for people with low vision or color blindness, and for use outdoors in bright sunlight.
- Make sure color is not the only carrier of information; feedback should preferably be reinforced with text.

Website contrast check:
![McDonald's contrast check](/garden/audit/color-contrast.webp)

### 3. Keyboard navigation

If a site is not usable with a keyboard, it is inaccessible for many users.

- Are ALL interactive elements reachable via Tab/Shift+Tab?
- Is focus visible? Was the outline removed without a custom replacement? Is it noticeable enough and high-contrast?
- Is the navigation order logical? Logical order: focus order should make sense and match the visual flow of the page (top to bottom, left to right).

### 4. Simulating constraints

This is the most powerful step — it immediately shows how much the interface assumes perfect vision, and it lets you actually feel the problems users with disabilities face.

- Turn on a strong blur (simulating poor vision) — I built a small browser extension for this, but you can also run this in the console:

```typescript
document.body.style = 'filter: blur(5px) !important';
```

- Turn on a screen reader (in my case VoiceOver; depending on your OS it might be NVDA, JAWS, Narrator, Orca, or another common one) and try to complete basic tasks with speech and the keyboard.

Website check with VoiceOver:
![McDonald's VoiceOver check](/garden/audit/voice-over.webp)

### 5. Automated scanning

[Tools will not find every issue](https://t.me/proa11y/52), but they catch technical errors well. By some estimates, up to about 30% of problems can be caught with automated tools.

I run this set of tools:

- [axe DevTools](https://chromewebstore.google.com/detail/axe-devtools-web-accessib/lhdoppojpmngadmnindnejefpokejbdd?hl=en-US) — probably the best scanner on the market for this kind of work right now
- [WAVE](https://wave.webaim.org/) — I usually use this to visually inspect page structure and how information is exposed
- [Lighthouse](https://developer.chrome.com/docs/lighthouse/overview?hl=ru) and [ARC Toolkit](https://www.tpgi.com/arc-platform/arc-toolkit/) — as a follow-up check after axe

Website check with axe DevTools:
![McDonald's axe DevTools check](/garden/audit/axe.webp)

Website check with WAVE:
![McDonald's WAVE check](/garden/audit/wave.webp)

They catch technical issues: missing alt text, invalid HTML, ARIA mistakes, WCAG mismatches. You do not need deep knowledge of all those specs — the tools themselves tell you what to fix for conformance.

## 🚩 Red flag: magic overlays

I will say it up front: I see little point in auditing a web app that ships an overlay or accessibility widget. For me, that is an immediate failure marker.
Widgets like [AccessiBe](https://accessibe.com/), [UserWay](https://userway.org/), and similar products are not a solution — they are more of a symptom.

Why this is a problem:

- They treat symptoms, not the disease
- They create an illusion of accessibility
- They fail with dynamic content
- They often break native accessibility
- They go against the community of users with disabilities

Overlay = a high likelihood of fundamental accessibility problems in the code. The goal of these products is not user convenience; it is reducing the chance of a multi-million-dollar lawsuit.

## 💡 The outcome

In 15–30 minutes of this kind of audit you get:

- A clear picture of accessibility health
- A list of critical barriers for users
- A sense of where to go next

You do not need to be a certified expert to start making products more accessible. It is enough to put yourself in the user's place and check these five points.

---

_This approach focuses on substance, not formal compliance theater. After these 5 steps, I am fairly confident you will land close to WCAG Level AA.
Remember: accessibility is about people, not checkboxes._

---

### Related notes

- [[Accessibility audit of Priorbank's web app](/garden/audit-priorbank-a11y)]
- [[Wildberries accessibility audit. Can a blind user buy the Batmobile?](/garden/audit-wildberries-a11y_en)]
- [[Web accessibility is not hype — it is responsibility](/garden/a11y-my-task-crafting)]
- [[Skip Links — an invisible marker of good taste](/garden/skip-links)]
