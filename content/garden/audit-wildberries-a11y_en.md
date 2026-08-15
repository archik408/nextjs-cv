---
title: Wildberries accessibility audit. Can a blind user buy the Batmobile?
description: A practical accessibility audit of the Wildberries marketplace using the 5-step approach.
date: 2026-01-24
tags: [a11y, accessibility, audit, wildberries, retail]
---

> **TL;DR:** Wildberries scores 90% in Lighthouse, but a blind user cannot complete a purchase. Main issues: invisible focus, inaccessible filters, and silent notifications.

After [Priorbank](/garden/audit-priorbank-a11y), I wondered who to take on next for a short public audit. The holidays had just passed, and something told me plenty of people had been shopping online for gifts. That season is peak traffic for these apps: they make a lot of money then, and the infrastructure load is enormous.

My personal favorite among the major online marketplaces is [Wildberries](https://www.wildberries.by) — a major CIS e-commerce marketplace. I like the service and use it a lot. That alone felt like a good reason to see how accessible it is for people with various disabilities. It is hugely popular across the CIS, which of course does not mean it is 100% accessible.

A quick caveat: I am not trying to highlight some fatal flaw in the platform. Every product has its own business priorities, and accessibility (when it is not legally required) is each business's call. My own product does not meet every accessibility criterion either, nor did many others I have worked on. Last year's analytics showed that 20% of my user base changes font size for readability — but that does not mean even one person uses the product as a fully blind screen-reader user (I would guess there is none).

Interest in this topic often comes more from law firms. Spotting gaps in the rules, they find a "victim" — a company that falls short — then find people with disabilities in whose name they file multimillion-dollar suits and collect fees. The people with disabilities themselves may never have used those products.

Still, Wildberries reaches a multimillion audience and sells nearly any everyday goods. It is a giant platform, and it is simply interesting to see where it stands on accessibility today.

## Audit methodology

As before, there are only [five check stages](/garden/audit-a11y-without-wcag_en). The test task is deliberately simple: search for a huge, cool Batmobile, add it to the cart, and place the order. We will walk the path from the first click to the final "Order" using only the keyboard and a screen reader.

Let's begin.

## 1. Accessibility statement and skip links

**Result:** Both markers are missing.

There are no [skip links](/garden/skip-links) (quick links to jump to main content past the header). That violates [WCAG 2.4.1 Bypass Blocks](https://www.w3.org/WAI/WCAG21/Understanding/bypass-blocks.html). Navigation starts in the header, so a screen-reader user has to hear dozens of links every time before reaching the products.

There is also no [accessibility statement](https://www.w3.org/WAI/planning/statements/). Finding the footer with informational links is a problem in itself. I could not on the first try: almost every page uses infinite catalog scroll as you move down. Only in the cart did I see the footer links. It turns out there is a shortcut button at the bottom to open it — more on that later.

![Site footer with no link to an Accessibility Statement](/audit/wildberries/1.webp)

**Takeaway:** First impression — the platform was not designed with assistive-technology navigation in mind from the start, and there is no clear public information about its accessibility status.

## 2. Keyboard navigation

**Result:** A classic seen in many products: `:focus { outline: none }` across the whole app. It is unclear where you are moving with the keyboard — focus is invisible. That is a direct violation of [WCAG 2.4.7 Focus Visible](https://www.w3.org/WAI/WCAG21/Understanding/focus-visible.html).

![Source snippet that explicitly sets :focus { outline: none }](/audit/wildberries/3.webp)

The modern approach is to use `:focus-visible` so the focus indicator appears for keyboard navigation without bothering mouse users:

```css
:focus {
  outline: none;
}
:focus-visible {
  outline: 2px solid var(--brand-color);
}
```

![The "Careers at WB" link has focus but no visible highlight](/audit/wildberries/2.webp)

Side menu: A header button with `aria-label="Site navigation"` opens the side menu. Odd detail: even though the menu is visually hidden until you press the button, the keyboard still tabs through every item — they remain in the tab order while invisible. That is confusing.

![Portal side menu in the open state](/audit/wildberries/4.webp)

Filters — a complete failure: The "All filters" sidebar opens from the keyboard, but focus trapping is broken. The panel slides out, focus never moves into it, and you keep tabbing across the dimmed backdrop hoping to reach the filters eventually. Filters like "By popularity," "Color," "Category," and "Brand" are dropdowns that appear only on hover. You cannot open them with Space or Enter from the keyboard. They are fully inaccessible.

![Filters are open, but keyboard navigation continues under the overlay](/audit/wildberries/5.webp)

**Takeaway:** Without a mouse, filtering products and using the menu properly is nearly impossible. That blocks an entire category of users.

## 3. Color contrast

**Result:** Overall, a quick look shows bright, saturated colors. Two places look dubious.

White text on a light-gray background (secondary caption on a product card).

![White text on a light-gray background (secondary caption on a product card)](/audit/wildberries/7.webp)

And the main color problem: lilac on purple in the header for the key menu items "Orders," "Favorites," "Profile," and "Cart" — the main entry points.

![Menu items "Orders," "Favorites," "Profile," "Cart"](/audit/wildberries/8.webp)

**Intuition was right:** this fails [WCAG 1.4.3 Contrast (Minimum)](https://www.w3.org/WAI/WCAG21/Understanding/contrast-minimum.html) Level AA. Contrast ratios here are 2.7:1 and 4.4:1 against the required minimum of 4.5:1 for normal text. For global navigation on a marketplace of this scale, that is a serious miss.

## 4. Screen reader and keyboard

We switch to a low-vision setup and turn on VoiceOver. We eventually reach a product. This is where it gets interesting — how will the information be announced?

![Focus on a product card in the catalog under a low-vision setup](/audit/wildberries/6.webp)

**Prices:** Yes, they are announced, but with no explanation of the discount. What is visually clear as the current discounted price and the original (struck-through) price is read simply as different amounts. You cannot tell which is which.

![VoiceOver announces the product price](/audit/wildberries/9.webp)

**Add-to-cart button:** It is labeled "Day after tomorrow." Wildberries uses the delivery date as the add-to-cart button text. Figuring out that pressing it adds the item to the cart is no small task. This is not a button — it is a riddle.

![VoiceOver announces the add-to-cart button as "Day after tomorrow"](/audit/wildberries/10.webp)

**Add-to-cart notification:** Suppose I take the risk and press it. Disappointment. The "added to cart" notification is not announced. It is incorrectly marked up with ARIA attributes. Result: silence. The card status does not change for the screen reader either: the "Day after tomorrow" button simply disappears, replaced by two unlabeled "buttons" with a number in the middle (actually a quantity counter). A low-vision user never learns that.

![Add-to-cart notification ignored by VoiceOver](/audit/wildberries/12.webp)

![Unlabeled "buttons" with a number in the middle — product quantity counter](/audit/wildberries/11.webp)

**Cart and checkout failure:** There is no quick jump to the cart. You have to return to the header, find the indicator, check it, and only then navigate. Suppose I manage that. I select the item and press "Order." And… nothing happens. Just silence.

![Pressing "Order" in the cart — VoiceOver stays silent](/audit/wildberries/13.webp)

**The core problem:** The app requires choosing an address in a separate section, but with keyboard + screen reader we never learn that. No errors, no focus on the field — only a visual hint, a purple outline. End result: failure. I could not place the order after completing 90% of the path.

## 5. Tool scanning

**Deque Axe:** Found 29 issues. One critical — that footer shortcut button has no screen-reader label (`aria-label`). 28 serious — mostly color and contrast. Surprisingly, the add-to-cart buttons (the main conversion buttons!) fail contrast. Oddly, they miss the 4.5:1 bar by only 0.01 — purple on white yields 4.49:1. It feels as if someone checked and rounded in their favor.

![Deque Axe scan results](/audit/wildberries/14.webp)

![Deque Axe scan results](/audit/wildberries/15.webp)

**Lighthouse:** Reported 90% accessibility and the same issues as Axe. Funny, right? 90% accessibility, and I still could not place an order. That shows why automated tools cover only ~30% of WCAG criteria — they cannot verify interaction logic and user flows. Do not rely on tool scores alone; sometimes they are not even a half-measure.

**WAVE:** The interesting bit — heading hierarchy. There is no `h1` at all, only `h2`. There is no real hierarchy, and the first heading in the header is… "Currency." What does that say? The page's semantic structure was never designed.

![WAVE scan results](/audit/wildberries/16.webp)

## Recommendations

If the Wildberries team wanted to improve accessibility, here is a prioritized list:

**Critical (blocks usage):**

1. Add a visible focus indicator via `:focus-visible`
2. Fix focus trapping in modals (filters, menus)
3. Make filters keyboard-accessible (open with Enter/Space)
4. Announce notifications with `aria-live="polite"`, or even `"assertive"`
5. Fix checkout form validation — report errors to the screen reader

**High priority:**

1. Add a skip link to main content
2. Fix contrast in the header (menu) and on add-to-cart buttons
3. Rename the "Day after tomorrow" button → "Add to cart (delivery day after tomorrow)"
4. Add price semantics: "Discounted price: X", "Original price: Y"

**Medium priority:**

1. Establish a heading hierarchy (add an `h1`)
2. Remove the side menu from the tab order when closed (`inert` or `tabindex="-1"`)
3. Add an Accessibility Statement to the footer

## Bottom line: Accessibility as a luxury, not a necessity

Wildberries is a powerful, convenient, popular service. From an accessibility perspective, though, it looks like a typical high-traffic product where the topic was never treated systematically.

**What exists:** Minimal basic work with some ARIA attributes (often incorrect), 90% on automated checks, and decent image alt text.
**What is missing:** Thoughtful keyboard navigation, semantic markup, accessible interaction patterns, contrast on key elements, and — most importantly — the ability to complete the core flow without sight.

This is not malice; it is priorities. Until accessibility is a KPI on par with conversion or load speed, little will change. That is a shame, because a multimillion audience includes people who cannot simply click with a mouse. For them the super-portal remains a beautiful but closed storefront.

### P.S.

The Batmobile was never ordered. I hope Batman has other supply channels.

### Related notes

- [[Accessibility audit of Priorbank's web app](/garden/audit-priorbank-a11y)]
- [[Skip Links — an invisible marker of good taste](/garden/skip-links)]
- [[Practical web accessibility audit: 5 steps without the dogma](/garden/audit-a11y-without-wcag_en)]
- [[Web accessibility is not hype — it is responsibility](/garden/a11y-my-task-crafting)]
