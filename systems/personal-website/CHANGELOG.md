# Changelog

All notable changes to this system will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Fixed

- `SearchPanel` shows `<` and `>` in an excerpt from Pagefind as themselves. Pagefind writes them as `&lt;` and `&gt;`, and the panel escaped the `&` again, so `Array<string>` read `Array&lt;string&gt;`. Entities in an excerpt are kept now; a bare `&` is still escaped.
- A malformed web address in a post, such as `https://exa mple.com`, warns with its place in the file. `rehypeDsExternalLinks` used to throw `Invalid URL` on it and stop the build, without saying which post.
- `:::steps` keeps the text beside its ordered list, above or below the steps, with a warning. It used to drop it without a word.
- A mermaid fence reads `title=` and `caption=` only as whole words, so `subtitle="…"` no longer becomes the diagram's label.

## [1.2.0] - 2026-11-05

### Added

- `THIRD-PARTY-NOTICES.md` in the package: the icons in `src/icons/` are from Tabler Icons, and it carries Tabler's MIT License.

### Changed

- `LICENSE` names the copyright holder: `Copyright 2026 RottenSea`.
- `Figure` zooms with its own script, and medium-zoom is no longer a dependency. The zoom starts at once, placed from the original's size, which the build writes on the image; medium-zoom waited for the larger copy to load and showed only the scrim until then. The first frame is the image as the page shows it, a tile's crop and corners included, and the cropped parts unfold as it grows. Closing runs the same way back. Resizing the window also closes it.

### Fixed

- The theme fade works in a built site. The minifier writes `--motion-entrance: 350ms` as `.35s`, which the theme store read with `parseFloat` as 0.35ms, so every colour jumped to the new theme at once and anything with its own transition, such as a `Spoiler` and the text it reveals, caught up 120ms later. The fade's last frame also draws the new values now, so no transition starts when it ends.
- `QuoteBand` picks its quote before the first paint. A module script used to pick it after the page had drawn the first quote, so each visit showed that one for a moment before the random one.

## [1.1.2] - 2026-11-04

### Added

- `surface.on-card`, for a part inside a card that would take the card's own colour: `#e0d8ca` in the light theme and `#322f2a` in the dark, one step from the card in each, as the dark theme's code bar is.

### Changed

- `CodeBlock` folds a block longer than 12 lines to its first 10, where it folded one longer than 20 to its first 16.
- `CodeBlock`'s horizontal scrollbar is the block's last row, below "Show all N lines": the button sits in the scroll area, held at its left edge, so the scroll area's own scrollbar falls under it. A folded block's scrollbar used to lie across the last line shown, inside the fade.

### Removed

- `SkipLink`, and its page on the docs site. A site that used it takes `<SkipLink />` out of its layout.

### Fixed

- Content inside an `Admonition` stands apart from it in the light theme. A code block's bar and a table's header took the card's own colour, and the light hairline around them barely shows on the card, so they ran into the admonition; an admonition inside another ran into it in both themes. Inside an admonition, `--surface-card`, `--surface-code-bar` and `--surface-cream-strong` now take `--surface-on-card`, which also covers a formula's card, a spoiler's cover and an OptionGroup's tabs. `tone="dark"` is unchanged.

## [1.1.1] - 2026-11-04

### Added

- `coral.300`, a light coral (`#e6ab96`): coral-500 mixed 60% with cream-50.

### Changed

- `DotGlobe` draws its dots in `--coral-300` in the light theme. The halo and the dark theme are unchanged.

## [1.1.0] - 2026-11-04

### Changed

- `Starfield` and `DotGlobe` fade their colours on a theme change with the page's own duration and easing, from `themeFade()`, instead of a separate ease-out curve.
- The source comments are shorter, and the repository is formatted with Biome.

## [1.0.9] - 2026-11-04

### Added

- Colour tokens for a code block that follows the theme: `surface.code`, `surface.code-bar`, `surface.code-highlight`, `hairline-code` and `hairline-code-frame`. Each takes the light or dark value of the theme, so it fades at the page's pace.
- `themeValues(element, names, theme?)` in `scripts/theme`: custom properties as they will be once the theme has settled. While the theme fades, `getComputedStyle()` gives colours partway between the two themes, so Mermaid and SharePoster draw with this instead.

### Changed

- `CodeBlock` follows the theme by default, and so does every code fence in a post: the new `auto` tone is cream in the light theme (the canvas, a hairline and the card colour in the bar) and the warm navy in the dark, fading between them with the page, from the new `surface.code*` and `hairline-code*` tokens. `tone="dark"` keeps the navy in both themes, as the default did before.
- `CodeBlock` shows "Terminal" and "Code Block" in the mono face, like a filename, instead of the sans face.
- A theme change fades the theme's colour variables on `<html>` alone, where every element used to get a colour transition of its own. `tokens.css` registers each colour the dark theme changes with `@property`, lists them in `--theme-variables`, and adds `--theme-dark`, 0% in the light theme and 100% in the dark. The theme store writes the variables on `<html>` on each frame of the fade, a step further from the old theme to the new; every element reads them as they blend and drops its own transitions while the fade runs. The store writes them itself because Chrome will not draw a visited link from a variable a CSS transition is changing (crbug.com/569257985), so with a transition a visited link and the text in it took another colour during the fade and jumped at the end. A large page starts the fade much sooner: on the example post with Mermaid diagrams, KaTeX and code, the first frame came 770ms after the change and the colours jumped to the new theme; now it comes after about 75ms and the colours fade.
- Shiki's token colours in `CodeBlock` and `Switch`'s knob mix their light and dark colours with `color-mix()` by `--theme-dark` instead of picking one with `light-dark()`, so they fade with the rest.
- `Footer` spaces its columns wider from 769px up: 72px between the link columns instead of 48px, and 96px after the brand column instead of 72px.
- `Dialog` animates out when it closes, by the close button, the scrim or Escape, and only then closes. It has no overshoot: a `tilt` dialog turns away on the entrance's diagonal over 250ms, slowly at first and then faster, and fades out late; a `lift` dialog grows to 1.04 the same way over 200ms; the scrim fades with it. With reduced motion it still closes at once.
- `Steps` marks the current step with `--color-primary-active` and a white number, in place of the dark surface.
- `Footer` placed straight in `<body>` sits on the window's bottom edge on a page shorter than the window: `<body>` becomes a column at least `100dvh` tall and the footer takes the spare height above it, as the personal website did on its own.
- `SearchPanel` keeps its scrollbar's space in the results, so the rows do not move sideways when more results bring in a scrollbar. `CodeBlock`'s scroll area draws its thumb in the block's own soft text colour, so it reads on the navy as well.
- The theme store no longer warns in development when `data-theme` changes on a page whose `<html>` has `data-theme-pinned`: the docs site's examples use it to show one example in the other theme.

### Fixed

- `Mermaid` changes with the page when the theme changes, where it started a moment later. It drew the diagram for the new theme only after the change; now it draws the other theme's diagram once the browser is idle, and on a change fades it in over the old one as the page's colours start to fade.
- `Mermaid` draws flat diagrams in the token colours. Mermaid 12 draws in its newer look by default, with drop shadows, gradient strokes and greys of its own; the component now asks for the classic look and gives Mermaid every colour it would otherwise work out itself, such as a sequence diagram's arrows, which were in the text colour, and its half arrowheads, which were black.
- `Mermaid` no longer makes the page taller for a moment each time it draws: it draws in a hidden element fixed to the window instead of one Mermaid adds to `<body>`. In a docs example, whose frame follows its page's height, the frame grew and shrank on every theme change.
- `Mermaid` measures its labels in the web font. The Fonts component loads the font stylesheets without holding up the page, so `document.fonts.ready` could resolve before the browser knew of the sans font, and the labels were measured in the fallback font and shown in Manrope, out of their boxes. It now waits up to a second after the page starts for the sans font in the faces the diagram's text needs; on a slower connection it draws in the fallback font and once more when the font arrives.
- `QuoteBand` keeps its styles when it picks a quote at random on a site that scopes styles by class, as Starlight sets Astro to do: replacing the quote's `className` dropped the scope class, and the quote showed in the body font.
- A theme change fades text with everything else again. The `color-scheme` of `<html>` changed at the start of the fade, and while it changes under them Chrome starts every element's colour transition again on each frame, so text crept a fifth of the way and then jumped at the end while backgrounds faded. The theme store now keeps the old `color-scheme` until the fade is over; scrollbars and form controls change then.

## [1.0.8] - 2026-11-03

### Fixed

- `Starfield` and `DotGlobe` fill each star and dot on its own again, as before 1.0.6. Filling every dot of one opacity step as one path took less script time but far longer to draw: with the GPU drawing the canvas, DotGlobe at 1280 by 800, twice the CSS pixels, managed about 49 frames a second, with the slowest twentieth of frames at 56ms, against about 220 frames a second and 6ms with a fill for each dot.

## [1.0.7] - 2026-11-03

### Changed

- `Starfield` and `DotGlobe` make their stars larger in the light theme by adding 0.3px to every star's radius, instead of multiplying it by 1.2. A dark dot on a light ground looks smaller by about as much for a small dot as for a large one, so the factor did most for the largest stars and almost nothing for the smallest, which grew by 0.06px; now they grow by 0.3px too. The stars still grow over the page's fade on a theme change.
- `Starfield` and `DotGlobe` draw on every screen refresh again, as before 1.0.6. At 60 frames a second the drift stuttered on a screen whose rate is not a multiple of 60, such as 144Hz, where a frame stayed up for two refreshes, then three. The stars and dots are still filled by opacity in 64 steps.

### Removed

- `--ds-sky-star-size`, the factor on the stars' radius. `--ds-sky-star-grow`, a length in px added to it, takes its place.

## [1.0.6] - 2026-11-03

### Changed

- `Starfield` and `DotGlobe` draw at most 60 frames a second, so a 120Hz or 144Hz screen no longer draws twice as often for a sky that moves a few pixels a second. Their stars and dots are filled by opacity, in 64 steps, one path a step, instead of one fill and one colour string each: a frame of DotGlobe's 4,100 dots took 2.0ms instead of 3.6ms in a test at 1280 by 800, twice the CSS pixels. The picture is the same to the eye; where translucent dots overlap over the globe's limb, the overlap is no longer drawn twice.

## [1.0.5] - 2026-11-03

### Changed

- `Footer` puts the link columns from the left, right after the brand column, instead of at the right edge: each as wide as its links, 48px apart, with 72px between the brand and the first. The link columns still set the height, with `brand-extra` level with the end of the longest. Below 768px it is the same as before.

### Fixed

- `ContentGrid` with `mainWidth` below 768px: the rule that puts every column back in the one track was less specific than the ones that place them, so the main column stayed in the second track, with an empty first track and the gap to its left. On a phone, a post's text sat 48px in from the left.
- `ContentGrid` leaves out a rail whose slot renders nothing. Content given to a slot under a condition that turned out false, such as a post's table of contents when it has no headings, still counted as a rail, so a 280px empty track stayed open beside the main column from 1081px up.
- `TableScroll` clips what is absolutely positioned inside it. The hidden "(opens in a new tab)" note of a link to another site, in a cell past the right edge, widened the page, and a phone zoomed the whole page out to fit it.

## [1.0.4] - 2026-11-03

`Footer` looks different with the same props: the brand gets a column of its own, with a new `brand-extra` slot under it. A site needs no other change.

### Changed

- `Figure` opens its zoom at once, from the image already on the page, instead of waiting for the larger copy to download; the larger copy takes its place when it arrives. The build makes copies 1200, 1800 and 2400px wide (none wider than the image) instead of one at 2400px, and the browser loads the smallest that covers the open image on its screen, starting as soon as the pointer rests on the image or the image takes the focus. The image carries them as `data-ds-zoom` instead of medium-zoom's `data-zoom-src`.

- `Footer` gives the brand a column of its own on the left, with a new `brand-extra` slot under the mark and name for a badge or a short line; the brand-extra slot sits at the bottom of that column, level with the end of the link columns, which sit side by side on the right, ending at the right edge; the note stays across the bottom. Below 768px the brand column stacks above the links, two across. The props are the same.

### Fixed

- `rehypeDsHeadingAnchors` leaves out headings only screen readers see (`sr-only` or `ds-visually-hidden`), such as the label GFM gives a post's footnotes, whose # link showed above the footnotes with nothing beside it.

## [1.0.3] - 2026-11-03

TopNav looks different with the same props and slots: the brand moves to the middle, and on a narrow screen to the left as the mark alone, so give it a mark in its `logo` slot. To name task list checkboxes, add `rehypeDsTaskLists` to the site's `rehypePlugins`.

### Changed

- `TopNav` puts the site's mark and name in the middle, the links on the left and the actions on the right, all within `--container-max`, so on a wide window the two sides line up with the content. Below 768px the brand moves to the left as the mark alone, with its name kept for screen readers; without a mark in the `logo` slot it keeps the name. The props and slots are the same.
- `Starfield` and `DotGlobe` draw their stars 1.2 times larger in the light theme, where a dark dot on cream looks smaller than a light one on night; `--ds-sky-star-size` sets the factor. On a theme change the stars' strength and size now move to the new theme's with their colour, instead of waiting for the next resize.
- `Starfield` and `DotGlobe` stars drift at a speed set by the longer side instead of the width, so on a phone held upright they move about twice as fast as before and as fast as on a wide screen. `period` is the time to cross the longer side.

### Added

- `MiniCalendar` takes an `id`, and a button with `data-ds-calendar-clear` set to it clears the selected day. The calendar shows the button only while a day is selected.
- `SidebarCard` draws a link or button in its `action` slot as the label's uppercase micro-label, in the muted colour.
- `rehypeDsTaskLists`, a rehype plugin that puts each task list item's checkbox and its text in a `<label>`. GFM gives the checkboxes no name, so a screen reader announced only "checkbox"; now it reads the task. Add it to the site's `rehypePlugins`.

## [1.0.2] - 2026-11-03

### Changed

- `MarkdownImage` gives a figure in a post `sizes="(min-width: 720px) 680px, 100vw"`, the width of the post's text. A site that builds several widths of each image (Astro's `image.layout`) then sends one sized for the text instead of for the whole window.

## [1.0.1] - 2026-11-01

### Added

- `Comments`: the comments under a post, from a [Twikoo](https://twikoo.js.org) comment service. It loads Twikoo when the comments come near the screen, takes Twikoo's own stylesheet out and styles the form, the thread, the replies and the admin panel from tokens, in both themes. `path` is the key the comments are kept under. New dependency: `twikoo` 2.0.17.
- `ViewCount`: how many times a page has been viewed, from the same service, as one more part of a PostMeta line.
- `PostMeta` has a slot after its parts, for a part the page fills in later, such as ViewCount.

## [1.0.0] - 2026-10-30

The first stable release, made as the three sites built on this system went live. The public API is now promised to stay stable: token names and the CSS custom properties built from them, the files the package exports, and component props and events. From here, renaming or removing any of them comes only in a new major version. Nothing else changed since 0.7.4.

## [0.7.4] - 2026-10-30

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

[unreleased]: https://github.com/RottenSea/design-system/compare/personal-website-v1.2.0...HEAD
[1.2.0]: https://github.com/RottenSea/design-system/compare/personal-website-v1.1.2...personal-website-v1.2.0
[1.1.2]: https://github.com/RottenSea/design-system/compare/personal-website-v1.1.1...personal-website-v1.1.2
[1.1.1]: https://github.com/RottenSea/design-system/compare/personal-website-v1.1.0...personal-website-v1.1.1
[1.1.0]: https://github.com/RottenSea/design-system/compare/personal-website-v1.0.9...personal-website-v1.1.0
[1.0.9]: https://github.com/RottenSea/design-system/compare/personal-website-v1.0.8...personal-website-v1.0.9
[1.0.8]: https://github.com/RottenSea/design-system/compare/personal-website-v1.0.7...personal-website-v1.0.8
[1.0.7]: https://github.com/RottenSea/design-system/compare/personal-website-v1.0.6...personal-website-v1.0.7
[1.0.6]: https://github.com/RottenSea/design-system/compare/personal-website-v1.0.5...personal-website-v1.0.6
[1.0.5]: https://github.com/RottenSea/design-system/compare/personal-website-v1.0.4...personal-website-v1.0.5
[1.0.4]: https://github.com/RottenSea/design-system/compare/personal-website-v1.0.3...personal-website-v1.0.4
[1.0.3]: https://github.com/RottenSea/design-system/compare/personal-website-v1.0.2...personal-website-v1.0.3
[1.0.2]: https://github.com/RottenSea/design-system/compare/personal-website-v1.0.1...personal-website-v1.0.2
[1.0.1]: https://github.com/RottenSea/design-system/compare/personal-website-v1.0.0...personal-website-v1.0.1
[1.0.0]: https://github.com/RottenSea/design-system/compare/personal-website-v0.7.4...personal-website-v1.0.0
[0.7.4]: https://github.com/RottenSea/design-system/compare/personal-website-v0.7.3...personal-website-v0.7.4
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
