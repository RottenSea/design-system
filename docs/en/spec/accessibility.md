# Accessibility

The docs cite [WCAG 2.2](https://www.w3.org/TR/WCAG22/) for the rules that keep the system usable by everyone, and the [ARIA Authoring Practices Guide](https://www.w3.org/WAI/ARIA/apg/) (APG) for how widgets behave. Every system in this repository targets WCAG 2.2 level AA.

## Conformance levels

WCAG success criteria come in three levels. **A** is the minimum, **AA** is what laws and policies usually require, and **AAA** is the strictest. Meeting AA means meeting every A and AA criterion.

## Criteria that a design system decides

| Criterion | Level | What it asks |
| --- | --- | --- |
| [1.4.3 Contrast (Minimum)](https://www.w3.org/WAI/WCAG22/Understanding/contrast-minimum.html) | AA | Text has 4.5:1 contrast with its background. Large text (at least 18pt, or 14pt bold) needs 3:1 |
| [1.4.11 Non-text Contrast](https://www.w3.org/WAI/WCAG22/Understanding/non-text-contrast.html) | AA | Control boundaries, focus indicators and meaningful graphics have 3:1 against what is next to them |
| [1.4.1 Use of Color](https://www.w3.org/WAI/WCAG22/Understanding/use-of-color.html) | A | Color is never the only way to tell something apart. A link that differs from body text by color alone needs 3:1 against that text and another cue on hover or focus (technique G183); an underline is the simpler fix |
| [2.4.7 Focus Visible](https://www.w3.org/WAI/WCAG22/Understanding/focus-visible.html) | AA | Keyboard focus is always visible |
| [2.4.11 Focus Not Obscured (Minimum)](https://www.w3.org/WAI/WCAG22/Understanding/focus-not-obscured-minimum.html) | AA | A focused element is not completely hidden, for example by a sticky header. New in 2.2 |
| [2.5.8 Target Size (Minimum)](https://www.w3.org/WAI/WCAG22/Understanding/target-size-minimum.html) | AA | Click and tap targets are at least 24 by 24 CSS pixels, or have that much space around them. New in 2.2 |
| [1.4.4 Resize Text](https://www.w3.org/WAI/WCAG22/Understanding/resize-text.html) | AA | Text can grow to 200% without losing content |
| [1.4.10 Reflow](https://www.w3.org/WAI/WCAG22/Understanding/reflow.html) | AA | Content fits a 320 CSS pixel wide screen without scrolling sideways |
| [2.3.3 Animation from Interactions](https://www.w3.org/WAI/WCAG22/Understanding/animation-from-interactions.html) | AAA | Motion triggered by interaction can be turned off. Following the `prefers-reduced-motion` setting covers it cheaply |

## Contrast belongs in the build

Contrast is a property of token pairs, so check it where the tokens are defined. List every text color and surface that can appear together, and fail the build when a pair drops below its minimum, in every theme. A rule that is only written down will be broken by the next palette change.

## Widgets

For dialogs, tabs, menus and other widgets, follow the matching APG pattern for keys, roles and states. Prefer native HTML elements, which already behave correctly; add ARIA only where HTML has no element for the job.

## Source

[WCAG 2.2](https://www.w3.org/TR/WCAG22/), its Understanding documents linked above, and the [ARIA Authoring Practices Guide](https://www.w3.org/WAI/ARIA/apg/).
