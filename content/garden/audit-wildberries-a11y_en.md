---
title: Wildberries accessibility audit: can a blind shopper buy the Batmobile?
description: A public five-step accessibility audit of Wildberries — a major CIS marketplace — from keyboard and screen reader to checkout.
date: 2026-01-24
tags: [a11y, accessibility, audit, wildberries, retail]
---

> **TL;DR:** Wildberries scores about **90%** in Lighthouse Accessibility, yet a blind user still cannot complete a purchase. The blockers are invisible focus, broken filters, and notifications that never get announced.

After my [Priorbank audit](/garden/audit-priorbank-a11y) (a large Belarusian online bank), I wanted another high-traffic consumer product. Holiday shopping season had just ended — peak revenue, peak load, peak “everyone uses this app” energy.

I picked [Wildberries](https://www.wildberries.by), one of the largest e-commerce marketplaces in the CIS (roughly the Amazon / Walmart class of player for that region). I use it myself. Popularity is not the same thing as accessibility.

A caveat up front: this is not a hit piece. Every product has priorities, and when accessibility is not legally mandatory it often loses to conversion and delivery speed. Products I have shipped — including my own — fail criteria too. In one product last year, about 20% of users increased font size; that still does not mean anyone completes the core flow as a fully blind, screen-reader-only user.

Accessibility attention sometimes arrives via litigation more than via product craft: firms find a non-compliant company, recruit plaintiffs, and file expensive suits. That dynamic is real, especially under ADA-style regimes. It is also not the same as building a usable storefront for disabled customers.

Still, Wildberries serves millions of people and sells almost anything for the household. The question is simple: what does “accessibility” look like there today?

## Method

Same [five-step approach](/garden/audit-a11y-without-wcag_en) as before. The user story is intentionally concrete:

1. Search for a ridiculous Batmobile toy.
2. Add it to the cart.
3. Place the order.

Keyboard and screen reader only — no mouse.

## 1. Accessibility statement and skip links

**Result:** both missing.

There are no [skip links](/garden/skip-links), which fails [WCAG 2.4.1 Bypass Blocks](https://www.w3.org/WAI/WCAG21/Understanding/bypass-blocks.html). Navigation starts in the header, so a screen reader user must hear dozens of chrome links before product content.

There is also no [accessibility statement](https://www.w3.org/WAI/planning/statements/). Even finding the footer is hard: most pages keep infinite-scrolling the catalog. I only saw informational footer links reliably in the cart. There is a floating shortcut that opens the footer — more on that later.

![Site footer with no Accessibility Statement link](/audit/wildberries/1.webp)

**Takeaway:** assistive-tech navigation was not designed in from day one, and there is no public status page for accessibility either.

## 2. Keyboard navigation

**Result:** the classic anti-pattern — `:focus { outline: none }` across the app. Focus is invisible. That violates [WCAG 2.4.7 Focus Visible](https://www.w3.org/WAI/WCAG21/Understanding/focus-visible.html).

![Source that sets :focus { outline: none }](/audit/wildberries/3.webp)

Prefer `:focus-visible` so keyboard users get a ring without punishing pointer users:

```css
:focus {
  outline: none;
}
:focus-visible {
  outline: 2px solid var(--brand-color);
}
```

![“Careers at WB” has focus but no visible indicator](/audit/wildberries/2.webp)

**Side menu:** a header control with `aria-label="Site navigation"` opens a drawer. While the drawer is visually closed, its items remain in the tab order. You tab through invisible links. Confusing and exhausting.

![Side menu open](/audit/wildberries/4.webp)

**Filters — hard fail:** “All filters” can open from the keyboard, but focus never moves into the panel. You keep tabbing on the dimmed page underneath. Dropdowns such as popularity, color, category, and brand appear on hover only — Space/Enter do nothing. They are effectively mouse-only.

![Filters open while keyboard focus stays under the overlay](/audit/wildberries/5.webp)

**Takeaway:** without a mouse, filtering and menu use are basically broken.

## 3. Color contrast

**Result:** many colors look bold at a glance; two patterns fail closer inspection.

White text on light gray (secondary caption on product cards):

![White text on light-gray product caption](/audit/wildberries/7.webp)

Lilac-on-purple in the primary header actions — Orders, Favorites, Profile, Cart:

![Header actions with weak contrast](/audit/wildberries/8.webp)

Measured ratios were about **2.7:1** and **4.4:1** against the **4.5:1** minimum for normal text under [WCAG 1.4.3 Contrast (Minimum)](https://www.w3.org/WAI/WCAG21/Understanding/contrast-minimum.html) Level AA. For global navigation on a marketplace of this scale, that is a serious miss.

## 4. Screen reader + keyboard

Low-vision simulation plus VoiceOver. Reaching a product is possible; understanding it is harder.

![Product card focus under a low-vision setup](/audit/wildberries/6.webp)

**Prices:** announced as bare numbers. Visually you see a discounted price and a struck-through original; aurally they are just two amounts with no relationship.

![VoiceOver announcing price](/audit/wildberries/9.webp)

**Add to cart:** the control is labeled with a delivery promise — “Day after tomorrow.” That is the delivery ETA reused as the button name. From a screen reader, it is a riddle, not an action.

![Add-to-cart announced as “Day after tomorrow”](/audit/wildberries/10.webp)

**Confirmation:** after activating it, the “added to cart” toast is silent — broken live-region / ARIA wiring. On the card, the labeled control disappears and is replaced by two unlabeled controls around a quantity number. A low-vision user gets no confirmation that anything worked.

![Toast ignored by VoiceOver](/audit/wildberries/12.webp)

![Unlabeled quantity controls](/audit/wildberries/11.webp)

**Checkout collapse:** there is no quick path to the cart. After finding it and pressing **Order**, nothing useful is announced. The app wants a delivery address, but keyboard + screen reader get no error, no focus move — only a purple outline on screen. I stopped at ~90% of the happy path with no way to finish.

![Order button produces silence](/audit/wildberries/13.webp)

## 5. Automated scans

**axe:** 29 issues. One critical: the footer shortcut has no accessible name. Twenty-eight serious findings, mostly contrast. Even the primary add-to-cart controls fail — purple-on-white lands at **4.49:1**, a hundredth under the 4.5:1 bar. It feels like someone rounded in their favor.

![axe results](/audit/wildberries/14.webp)

![axe results](/audit/wildberries/15.webp)

**Lighthouse:** ~90% Accessibility, largely overlapping axe. That is the punchline: a strong automated score and a failed purchase. Automation still covers only a fraction of WCAG and almost none of real task completion.

**WAVE:** no `h1`; only `h2`s. The first heading in the header is… “Currency.” Semantic structure was never designed.

![WAVE results](/audit/wildberries/16.webp)

## Recommendations

If Wildberries wanted a pragmatic remediation backlog:

**Critical (blocks the task):**

1. Restore a visible `:focus-visible` indicator.
2. Trap focus correctly in filters and menus.
3. Make filters operable with Enter/Space (not hover-only).
4. Announce cart notifications with `aria-live` (`polite` or `assertive` as appropriate).
5. Surface checkout validation errors to assistive tech and move focus to the problem.

**High:**

1. Add a skip link to main content.
2. Fix header and add-to-cart contrast.
3. Rename the control to something like “Add to cart (delivery day after tomorrow).”
4. Expose price semantics (“Sale price”, “Original price”).

**Medium:**

1. Add a real `h1` and a coherent heading outline.
2. Remove closed drawers from the tab order (`inert` or `tabindex="-1"`).
3. Publish an accessibility statement in the footer.

## Bottom line

Wildberries is fast, popular, and commercially successful. Accessibility looks like an afterthought on a high-throughput retail stack: some ARIA (often wrong), a flattering automated score, decent image alts — and no reliable way to complete the core purchase without sight.

That is usually priorities, not malice. Until accessibility is a KPI next to conversion and performance, little changes. Millions of customers include people who cannot “just click.” For them the storefront stays beautiful and closed.

### P.S.

The Batmobile was never ordered. Hopefully Batman has better suppliers.

### Related notes

- [Accessibility audit of Priorbank’s web app](/garden/audit-priorbank-a11y)
- [Skip links — a quiet mark of good craft](/garden/skip-links)
- [A practical web accessibility audit in five steps](/garden/audit-a11y-without-wcag_en)
- [Web accessibility is not hype — it is responsibility](/garden/a11y-my-task-crafting)
