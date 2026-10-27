# Changelog

All notable changes to this system will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added

- Astro components, ported from the brand design handoff with the same props: `Admonition` (note, tip, important, warning, caution and a foldable details variant), `Spoiler` (inline and block), `Abbreviation` with `Tooltip`, and `Steps` with `Step`. Import them from `components`, which also exports all of them as `components` for an MDX page.
- `markdown`, a remark plugin that turns directives in MDX posts into those components: `:::note`, `:::tip`, `:::important`, `:::warning`, `:::caution`, `:::details`, `:::spoiler`, `:::steps`, `:spoiler[...]` and `:term[...]{note="..."}`. A directive it does not know is kept as text, with a warning when its name starts with a letter.
- `CodeBlock`, highlighted by Shiki, with a filename, a language label, line numbers, highlighted, added and removed lines, a copy button that leaves removed lines out, and, new to the system, folding for blocks longer than 20 lines. `MarkdownCode` puts a post's code fences into it.
- `TableScroll`, which lets a wide table scroll, and `MarkdownTable`, which puts a post's tables into it. The `components` map now also replaces `pre` and `table`.
- `shikiTransformers()` from `markdown`, for a site's `shikiConfig`: line highlights in a fence's meta, Shiki's `[!code ...]` notations, and the fence's `title`.
- The Tabler icons the components use, in `src/icons/`.

### Changed

- The CSS files moved to `src/styles/`. The package's export paths, such as `index.css`, are unchanged.

## [0.2.0] - 2026-10-27

This release redesigns the system after the brand design handoff. Most variable names change, so sites have to update their styles.

### Added

- Specimen pages in `guidelines/`, one per foundation topic: brand, colors, layout, motion, spacing and shape, and type. Each is a plain HTML page that links `src/styles.css`, and opens with an `@dsCard` comment giving its group, name, subtitle and size.
- `styles.css`, the whole system without a reset, for plain HTML pages. `index.css` now loads the reset and then `styles.css`.
- `typography.css` with the `.ds-display-*`, `.ds-title-*`, `.ds-body-*`, `.ds-caption`, `.ds-caption-upper` and `.ds-code` classes.
- `motion.css` with the composed `--transition-tint`, `--transition-surface`, `--transition-fade` and `--transition-collapse` shorthands, the `.ds-reveal-in`, `.ds-fade-out` and `.ds-collapse` primitives, and the `.ds-progress-indeterminate` loop.
- `touch.css`, which grows elements marked `data-ds-tap` to `--tap-min` (44px) below 768px.
- Layout tokens: `--container-max`, `--container-reading`, `--container-wide`, `--rail-left`, `--rail-right`, `--nav-height`, `--control-height`, `--icon-button-size`, and `--break-rails` and `--break-stack` for reference.
- Marker tints `--marker-coral`, `--marker-teal`, `--marker-amber` and `--marker-red`, with on-dark pairs.
- Translucent surfaces for backdrop blur, `--surface-blur-cream` and `--surface-blur-dark`, with opaque fallbacks.
- `--focus-ring`, the halo around a focused input, and `--motion-entrance` and `--motion-shift`.
- Below 768px the three largest display sizes step down to 44, 38 and 32px.
- Setting `data-reduce-motion="true"` on an element reduces motion inside it, as the OS setting does.
- Chinese descriptions for tokens in `$extensions["cafe.rottenth"].description["zh-CN"]`.
- The brand mark, `assets/logo-colored.svg`.

### Changed

- Variable names follow the handoff. Palette steps drop the `color-palette` prefix (`--coral-500`), semantic colors drop the `color` prefix (`--text-body`, `--surface-canvas`, `--hairline`), spacing uses size names (`--space-xxs` to `--space-xxl` and `--space-section`), and each text style writes its properties separately (`--display-xl-size`, `-weight`, `-lh`, `-ls`, `-family`) instead of a `font` shorthand.
- The display font token is `--font-display`, formerly `--font-serif`.
- Durations are `--motion-fast`, `--motion-base` and `--motion-slow`, and easings are `--ease-enter`, `--ease-exit` and `--ease-move`. The `--transition-*` variables now include the properties they animate, so use them as `transition: var(--transition-tint)`.
- The dark theme applies only under `data-theme="dark"`; there is no `prefers-color-scheme` query. A page sets `data-theme` before the first paint from the saved choice or the OS setting. Only the tokens the dark theme changes are written in its block.
- Links have no underline until hovered, and inline links use coral 500.
- h1 to h3 use the display styles and h4 to h6 use the sans at weight 500.
- Colors are written as hex.

### Removed

- The contrast check in `pnpm check`. It now only validates the tokens against the DTCG format.
- `--color-text-disabled`, `--color-focus`, the extra palette steps coral 600 and 800, night 600 to 750, and red 400 and 600, and the font weight tokens.

## [0.1.0] - 2026-10-25

### Added

- Color palette and semantic color tokens for the light theme: primary fill, text, surface, border, accent and status.
- A dark theme that follows `prefers-color-scheme`. Setting `data-theme="light"` or `data-theme="dark"` on an element forces that theme for the element and everything inside it. The dark theme changes the semantic colors and shadows and sets `color-scheme: dark`, so native controls match the page.
- `pnpm check` fails when text or the error color drops below WCAG AA contrast on any surface in either theme, when text on the primary fill does, and when the focus outline drops below 3:1 on any surface.
- Font family tokens `--font-serif`, `--font-sans`, `--font-mono` and `--font-math`, and regular, medium and bold weights.
- Twelve typography styles: display xl to sm, title lg to sm, body md and sm, caption, uppercase caption and code. Sizes are in rem.
- Spacing tokens on a 4px grid, `--space-1` (4px) to `--space-24` (96px), in rem.
- Corner radius tokens `--radius-xs` to `--radius-xl` and `--radius-full`, in px.
- Shadow tokens `--shadow-hover` and `--shadow-float`, and border tokens `--border-hairline` and `--border-hairline-soft`.
- Motion tokens: durations `--duration-fast`, `--duration-base` and `--duration-slow`, easings `--easing-enter`, `--easing-exit` and `--easing-move`, and transitions `--transition-tint`, `--transition-surface` and `--transition-fade`.
- `fonts.css`, which loads Manrope, Noto Sans SC, Noto Serif SC and Noto Sans Math from Google Fonts and Maple Mono NL NF CN 400, 400 italic, 500 and 700 from RottenSea/webfonts.
- `base.css`, element defaults in the `base` cascade layer: page background and body text, h1 to h6 on the display and title styles, underlined links, monospace code, placeholder and selection colors, and a `:focus-visible` outline in the new `--color-focus`. When the reader asks for reduced motion, transitions and animations finish in 1ms and run once, except inside an element with `data-motion="essential"`.
- `index.css`, which loads the Tailwind Preflight reset from `@unocss/reset` into a `reset` layer, then the fonts, the tokens and `base.css`.

[unreleased]: https://github.com/RottenSea/design-system/compare/personal-website-v0.2.0...HEAD
[0.2.0]: https://github.com/RottenSea/design-system/compare/personal-website-v0.1.0...personal-website-v0.2.0
[0.1.0]: https://github.com/RottenSea/design-system/releases/tag/personal-website-v0.1.0
