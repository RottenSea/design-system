---
title: "Tokens"
---

Design tokens are the named values a design system is built from: colors, sizes, fonts, durations. Their values live in files in the [DTCG Format](https://www.designtokens.org/TR/2025.10/format/). The docs explain what each token is for and leave the value in the file.

## The DTCG format in brief

- Files use `.tokens.json` or `.tokens`.
- A token is an object with a `$value`. It can also have `$type`, `$description`, `$deprecated` and `$extensions`.
- A group is an object without a `$value` that holds tokens or other groups. A `$type` set on a group applies to every token inside it, so it does not need repeating. A group can hold a `$root` token as its own base value.
- Names cannot start with `$`, and cannot contain `{`, `}` or `.`, because those characters are used for references.
- References point one token at another: `{color.palette.coral.500}`. The referring token takes the other token's value.

## Types

| Kind | Types |
| --- | --- |
| Single values | `color`, `dimension` (`px` or `rem`), `fontFamily`, `fontWeight`, `duration` (`ms` or `s`), `cubicBezier`, `number` |
| Composite values | `strokeStyle`, `border`, `transition`, `shadow`, `gradient`, `typography` |

A composite token is several values that only make sense together, such as a shadow's color, offsets, blur and spread. A group is different: it only organizes tokens that each stand alone.

A color is an object with a color space and its components, for example `{ "colorSpace": "srgb", "components": [0.85, 0.47, 0.34], "hex": "#d97757" }`.

## Two layers

Split tokens into two layers so that themes only touch one of them:

- **Palette tokens** name the raw values: `color.palette.coral.500`. They say what a value is, not where to use it.
- **Semantic tokens** name a role and reference a palette token: `color.text.link` → `{color.palette.coral.800}`. Components only use semantic tokens.

A theme changes which palette token a semantic token points to. The palette itself never changes. See [Themes](../themes/).

## What a token page says

For a token or a group of tokens, write:

- What it is for, in one sentence
- When to use it, and when to use something else instead
- Pairings that must hold, for example which text colors are allowed on which surfaces
- A link to the token in the token file, instead of its value

Write the value only when it is generated from the token file, so it cannot drift.

## Source

[Design Tokens Format Module 2025.10](https://www.designtokens.org/TR/2025.10/format/), the first stable version, published by the W3C Design Tokens Community Group.
