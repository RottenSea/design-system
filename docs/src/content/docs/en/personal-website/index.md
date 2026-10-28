---
title: Personal website
description: The design system for the personal website, The Key of Urala.
sidebar:
  order: 0
---

The design system behind [The Key of Urala](https://rottensea.github.io), a personal blog. It holds the design tokens, the CSS built from them, and the Astro components that posts and pages use. Its source is in [`systems/personal-website`](https://github.com/RottenSea/design-system/tree/main/systems/personal-website).

## Install

Each version is a GitHub Release with the package attached. Install it from the release URL:

```sh
pnpm add https://github.com/RottenSea/design-system/releases/download/personal-website-v0.2.0/rottensea-ds-personal-website-0.2.0.tgz
```

The components and the remark plugin below arrive in 0.2.1; 0.2.0 has the tokens and the CSS.

## Use it

Load the CSS once, in the site's layout. `index.css` includes a reset and is meant for a site built with a bundler; `styles.css` leaves the reset out, for a plain HTML page.

```astro
---
import "@rottensea/ds-personal-website/index.css";
---
```

The CSS loads no fonts, because a font stylesheet pulled in by CSS would hold up the whole page while Google Fonts or jsDelivr answers. Put the Fonts component in the layout's `<head>` instead. It loads the same stylesheets without blocking, and the text shows in fallback fonts until they arrive. A plain HTML page can link `fonts.css`, which loads them the blocking way.

```astro
---
import { Fonts } from "@rottensea/ds-personal-website/components";
---
<head>
  <Fonts />
</head>
```

The components are Astro components. Import one by name, or pass all of them to an MDX page so posts can use them without imports. The same map turns a post's code fences, tables and images into CodeBlock, TableScroll and Figure:

```astro
---
import { components } from "@rottensea/ds-personal-website/components";
const { Content } = await render(post);
---
<Content components={components} />
```

Figure makes its placeholders with sharp, which Astro uses for its own images. With pnpm, add `sharp` to the site's own dependencies, because pnpm does not expose the copy Astro installs.

Posts write components with directives such as `:::tip`. Add the system's remark plugin to the unified processor so they become components, and its Shiki transformers so code fences can have a title and highlighted lines:

```ts
import { unified } from "@astrojs/markdown-remark";
import { remarkDsDirectives, shikiTransformers } from "@rottensea/ds-personal-website/markdown";

export default defineConfig({
  markdown: {
    processor: unified({ remarkPlugins: [remarkDsDirectives] }),
    shikiConfig: {
      themes: { light: "github-light", dark: "github-dark" },
      defaultColor: false,
      transformers: shikiTransformers()
    }
  }
});
```

## Themes

The tokens have a light and a dark theme. The CSS reads only the `data-theme` attribute, so the page sets `data-theme="light"` or `data-theme="dark"` on `<html>` before it paints.

## Version

See the [changelog](https://github.com/RottenSea/design-system/blob/main/systems/personal-website/CHANGELOG.md) for what changed in each version.
