# Changelog

All notable changes to this system will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added

- `Starfield`: small stars that drift and twinkle behind a page, fixed to the window under its content, or filling a positioned box with `position="absolute"`. From the handoff's The Key of Urala and Rainbow Stone pages.
- `DotGlobe`: a globe of land dots turning slowly on the Earth's tilt, rising from the bottom of the window, with stars around it. From the handoff's Rainbow Stone page. Which dots are land is worked out at build time from Natural Earth's 1:110m coastlines (world-atlas), so the page loads no map and no mapping library.
- Both follow the theme, with a light version that is new: the colours are custom properties set from tokens, and they move to the new theme's over the page's fade. Both keep moving with reduced motion, which the rest of the system's motion does not: they are slow and even, and the site wants them so.

## [0.7.3] - 2026-10-30

### Added

- `ContentGrid` takes `mainWidth`: the main column keeps that width in the middle of the page, with the rails right beside it, as a post with its table of contents wants.
- `CodeBlock` names a block without a filename: "Terminal" for a shell language and "Code Block" for any other, in the sans face. `label` gives another name, `label={false}` none; in a code group the tab names the block, so the name is hidden there.

### Changed

- `TocList` indents an h3's coral mark with its text, so the mark sits at the heading's level.

## [0.7.2] - 2026-10-30

### Fixed

- QuoteBand's hint scrolls the content to just below a fixed or sticky TopNav, instead of under it. With `pullNext` it no longer goes past the start of the content by the 40svh the content is pulled up.
- QuoteBand's `pullNext` works in a built page. The build's minifier folded the scroll timeline into the `animation` shorthand, where browsers reject it, so the content never rose; and in a built page the element after the band is the script Astro writes there, so the rise and the hint now skip a `<script>`.

## [0.7.1] - 2026-10-30

This release fades the page's colours when the theme changes, adds SharePoster and the PostLicense mark, and fixes three components. A site that changes the theme with its own script should use the new theme store; nothing else a site uses changes.

### Added

- The theme store, `themeStore()` from the new `scripts/theme` export: one per page, and the only thing that changes the theme. It writes `data-theme` and the choice, follows the OS while the choice is system and other tabs as they change it, and components ask it with `set()` and hear from it with `subscribe()`. ThemeToggle, SettingsMenu, Mermaid and SharePoster use it, so SettingsMenu shows a choice made with ThemeToggle, and a diagram or poster draws again once for each real change. `ThemeScript` writes its key on `<html>` as `data-theme-key` for the store.
- A change of theme fades every colour on the page together over `--motion-entrance`. Components' own transitions, such as a button's hover tint, give way to the fade while it runs; Mermaid diagrams and SharePoster fade their new drawing in over the old one with `fadeIn`. A script that writes `data-theme` itself still gets the fade, with a warning in development. With reduced motion the theme changes at once.
- `SharePoster`, the poster from PostShare's dialog as a component of its own, which draws at once or, with `lazy`, when its `draw()` is called. It now takes the colours of the theme it sits in, and draws again when the theme changes; the QR code stays dark on a light tile.
- `PostLicense` has a large Creative Commons mark behind its text at the right, as the Shirone theme's card does, with the Tabler icon `creative-commons`.

### Fixed

- `SearchPanel` no longer jumps to the left while it fades out.
- `Switch`'s knob stays light in the dark theme, a shade softer, instead of taking the near-black canvas.
- `MiniCalendar`'s days with posts show on a rail's cream card, with a wash of ink instead of the card's own fill, and today is a cream chip in the dark theme instead of a dark one on a dark card.

## [0.7.0] - 2026-10-29

This release adds the display settings, search, sharing and page transitions. The scrollbar changes on every page; nothing else a site already uses does.

### Added

- `SettingsMenu`, the display settings behind one round button: the theme as Light, Dark or System, and Reduce motion, which sets `data-reduce-motion` on `<html>`. Both apply at once and are remembered. It is made of `SegmentedControl` and `Switch`, ported from the handoff, which work on their own too. `ThemeScript` takes `motionKey` and sets Reduce motion before the first paint.
- `SearchPanel`, ported from the handoff: search in a panel over the page. It never fetches; the page answers its `ds-query` events with `setResults()`. "/" and Ctrl+K or ⌘K open it.
- `PostShare`: Copy link, and a poster of a post with a QR code to download or share. It is made of `Button`, `Dialog` and `Snackbar`, ported from the handoff. The `qrcode` package is a new dependency.
- `page-transitions.css`, a stylesheet a site can import for a fade between pages, with the browser's own cross-document view transitions.
- The Tabler icons `adjustments`, `download`, `link`, `search` and `share`.

### Changed

- The page's scrollbar is thin, in the soft muted text colour, and its space is kept on every page, so pages centre the same whether they scroll or not.

## [0.6.0] - 2026-10-29

This release adds the parts of a post page: the table of contents, the copyright card, the links to the previous and next posts, and the avatar for an about page. Nothing a site already uses changes.

### Added

- The post page's parts: `TocList`, the table of contents in the right rail, ported from the handoff, which marks the heading being read as the page scrolls; `TocButton`, a round Contents button for `FloatingControls` that opens the same list in a sheet below 1080px, where the right rail is hidden; `PostLicense`, the copyright card at the end of a post; `PostNav`, the links to the previous and next posts; and `Avatar`, a round portrait with the initials as its fallback, ported from the handoff.
- A `PostMeta` part can carry `href`, and is then a link.
- `MenuPanel` takes `label`, which names the dialog and its close button.
- The Tabler icon `list`.

## [0.5.0] - 2026-10-29

This release adds the parts of a home page: the quote band, the post list with its filters and pager, and the rail's statistics and calendar. Nothing a site already uses changes.

### Added

- The home page's parts, ported from the handoff: `QuoteBand`, a quote that fills the first screen; `ArticleListCard`, one post in a list, and `PostMeta`, the post's meta line; `FilterList`, the rail's categories, and `TagList`, a cloud of tags; `Pagination`; `StatList`, statistics in a rail; and `MiniCalendar`, a month grid with the days that have posts.
- `QuoteBand` takes `quotes` and shows one at random on each visit, and with `pullNext` lets the element after it rise over it faster than the page scrolls at first, as a scroll-driven animation.
- `FilterList`, `TagList`, `Pagination` and `MiniCalendar` report the reader's choice with `ds-select` and `ds-page` events, for a page that filters or pages a list in the browser. `Pagination` with `href` writes plain links instead.
- `MiniCalendar` takes `counts` keyed by date, draws the reader's current month and today in their own time zone, and can move between months (`navigable`) and select a day (`selectable`).
- `TopNav` has the handoff's `overlay` mode: fixed and see-through over a full-height band, with its surface coming up as the page scrolls.
- The Tabler icons `arrow-left`, `arrow-right`, `calendar-event`, `chevron-down`, `clock-hour-3`, `folder`, `text-size` and the filled `pinned`.

## [0.4.0] - 2026-10-29

This release adds the parts every page shares, for the site's new layout. Nothing a site already uses changes.

### Added

- The page shell, ported from the handoff: `TopNav`, the nav bar, whose links become a menu button below 768px; `NavDrawer` and `MenuPanel`, the menu sheet, a native modal `<dialog>`; `ContentGrid`, the main column between a 200px and a 280px rail, which drops the right rail below 1080px and stacks below 768px; `SidebarCard`, a card in a rail, and `Surface`, the card body under every card; `Footer`, the dark band with columns of links and a copyright line; `FloatingControls`, back to top and up to two other round buttons in the bottom right corner; `IconButton`, the 36px round button with one icon; and `ThemeToggle`, the light and dark switch. They are exported by name and are not in the `components` map for posts.
- `ThemeScript`, which sets `data-theme` in the `<head>` before the first paint, from the reader's choice or the OS setting. The handoff gives it as a snippet to paste.
- `SkipLink`, a link past the nav to the main content that shows when it has the keyboard focus. The handoff has none.
- The Tabler icons `arrow-up`, `menu`, `moon`, `sun` and `x`.

## [0.3.1] - 2026-10-29

### Changed

- A post's tables wrap their cells. `MarkdownTable` turns on `TableScroll`'s `wrap`, so a column of sentences no longer runs off to the right; each column keeps at least 8rem, and a table that still cannot fit scrolls. `TableScroll` used on its own still does not wrap by default.

## [0.3.0] - 2026-10-29

This release adds the components and Markdown plugins for posts. Two changes need a site to act when it upgrades: the CSS no longer loads the fonts, so put the `Fonts` component in the page's `<head>` (or link `fonts.css` on a plain HTML page), and the `guidelines/` specimen pages are gone.

### Added

- Astro components, ported from the brand design handoff with the same props: `Admonition` (note, tip, important, warning, caution and a foldable details variant), `Spoiler` (inline and block), `Abbreviation` with `Tooltip`, and `Steps` with `Step`. Import them from `components`, which also exports all of them as `components` for an MDX page.
- `markdown`, a remark plugin that turns directives in MDX posts into those components: `:::note`, `:::tip`, `:::important`, `:::warning`, `:::caution`, `:::details`, `:::spoiler`, `:::steps`, `:spoiler[...]` and `:term[...]{note="..."}`. A directive it does not know is kept as text, with a warning when its name starts with a letter.
- `CodeBlock`, highlighted by Shiki, with a filename, a language label, line numbers, highlighted, added and removed lines, a copy button that leaves removed lines out, and, new to the system, folding for blocks longer than 20 lines. `MarkdownCode` puts a post's code fences into it.
- `TableScroll`, which lets a wide table scroll, and `MarkdownTable`, which puts a post's tables into it. The `components` map now also replaces `pre` and `table`.
- `OptionGroup` with `Option`: one instruction in several flavours behind a segmented switch, where groups sharing a `syncKey` switch together. The `:::code-group` directive makes one from code fences and labels each option with the fence's `title`.
- `FileTree` with `FileTreeNode`: part of a project's structure as a tree whose folders fold as native `<details>`, with change-state dots and hints. The `:::file-tree` directive makes one from a nested list.
- `Figure`, one image with an optional caption. It enlarges on click or Enter with medium-zoom, into a larger copy made at build time, and shows a blurred 16px copy of itself, written into the HTML, while it loads. `MarkdownImage` puts a post's images into it; the `components` map now also replaces `img`. An image on a line of its own becomes a figure, with its Markdown title as the caption; an image inside a line of text stays inline.
- `ImageGrid`, several images in fixed columns at a fixed ratio, with the striped placeholder for tiles that have no image yet. The `:::gallery` directive makes one from the images inside it.
- `VideoEmbed`, a video that loads nothing from the video site until the reader presses play. Besides the handoff's YouTube, Bilibili, Vimeo and files, it plays AcFun, and `src` also takes a video page's address and works out the player from it. Without script, the play control is a link to the video's page. The `::video` directive makes one, and passes a local `poster` as an image so the site processes it.
- `MathBlock`, the surface for a typeset formula, on a card with an optional equation number or inside a sentence. The `markdown` plugin turns on remark-math and typesets a post's `$...$` and `$$...$$` with KaTeX at build time, as MathML only, so no KaTeX stylesheet, font or script reaches the page; `\tag{n}` becomes the number. `typesetMath()` from `markdown` does the same for an Astro page.
- `DiagramFrame`, the surface for a diagram the page draws, and `Mermaid`, which draws a ```` ```mermaid ```` fence in the browser in the token colours and draws it again when the theme changes. The mermaid library is fetched only on a page with a diagram.
- `rehypeDsHeadingAnchors` and `rehypeDsExternalLinks` from `markdown`, with their styles in the new `content.css`, which `styles.css` includes. The first puts a "#" link beside each h2, h3 and h4, outside the heading so the table of contents stays clean, after giving the headings Astro's own ids; the second opens links to other sites in a new tab, with an arrow and a hidden note for screen readers. `@astrojs/markdown-remark` is a peer dependency for the heading ids.
- `Fields` with `Field`, a card listing options with their type, "Required" or default, and a description, as a `<dl>` of hairline rows. The `::::fields` directive makes one from `:::field{name type required default}` blocks.
- `GitHubCard`, a repository as a card in the manner of the handoff's ProjectCard: description, main language, stars, forks, licence and topics, fetched from GitHub when the site builds. An archived repository has an archive icon before its name. A failed request leaves the name and link, and `GITHUB_TOKEN` raises GitHub's limit. The `::github{repo="owner/name"}` directive makes one.
- `sharp` is a peer dependency, for the image placeholders. Astro uses it too; with pnpm, a site adds it to its own dependencies.
- `shikiTransformers()` from `markdown`, for a site's `shikiConfig`: line highlights in a fence's meta, Shiki's `[!code ...]` notations, and the fence's `title`.
- The Tabler icons the components use, in `src/icons/`.
- The licence text, `LICENSE`, in the package.

### Changed

- A `TableScroll` with `wrap` keeps each column at least 8rem wide and scrolls, instead of squeezing a column down to its longest word.
- The CSS files moved to `src/styles/`. The package's export paths, such as `index.css`, are unchanged.
- `--font-math` falls back to Cambria Math, STIX Two Math and the `math` family instead of a sans serif, so formulas keep stretchy brackets and large operators when Noto Sans Math cannot load.
- `styles.css` and `index.css` no longer load the fonts. A font stylesheet pulled in with CSS `@import` held up the whole page until Google Fonts and jsDelivr answered, and those can be slow or unreachable. A site now puts the new `Fonts` component in its `<head>`, which loads the same stylesheets without blocking; a plain HTML page links `fonts.css`, which still loads them the blocking way.

### Removed

- The specimen pages in `guidelines/`, and the `./guidelines/*` export. The foundations are now pages on the docs site, with token tables read from the token files and specimens generated from them, so nothing restates a value by hand.

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

[unreleased]: https://github.com/RottenSea/design-system/compare/personal-website-v0.7.3...HEAD
[0.7.3]: https://github.com/RottenSea/design-system/compare/personal-website-v0.7.2...personal-website-v0.7.3
[0.7.2]: https://github.com/RottenSea/design-system/compare/personal-website-v0.7.1...personal-website-v0.7.2
[0.7.1]: https://github.com/RottenSea/design-system/compare/personal-website-v0.7.0...personal-website-v0.7.1
[0.7.0]: https://github.com/RottenSea/design-system/compare/personal-website-v0.6.0...personal-website-v0.7.0
[0.6.0]: https://github.com/RottenSea/design-system/compare/personal-website-v0.5.0...personal-website-v0.6.0
[0.5.0]: https://github.com/RottenSea/design-system/compare/personal-website-v0.4.0...personal-website-v0.5.0
[0.4.0]: https://github.com/RottenSea/design-system/compare/personal-website-v0.3.1...personal-website-v0.4.0
[0.3.1]: https://github.com/RottenSea/design-system/compare/personal-website-v0.3.0...personal-website-v0.3.1
[0.3.0]: https://github.com/RottenSea/design-system/compare/personal-website-v0.2.0...personal-website-v0.3.0
[0.2.0]: https://github.com/RottenSea/design-system/compare/personal-website-v0.1.0...personal-website-v0.2.0
[0.1.0]: https://github.com/RottenSea/design-system/releases/tag/personal-website-v0.1.0
