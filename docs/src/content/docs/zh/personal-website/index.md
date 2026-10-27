---
title: 个人网站
description: 个人网站 The Key of Urala 的 design system。
sidebar:
  order: 0
---

个人博客 [The Key of Urala](https://rottensea.github.io) 用的 design system，包括 design token、由它生成的 CSS，以及文章和页面用的 Astro 组件。源码在 [`systems/personal-website`](https://github.com/RottenSea/design-system/tree/main/systems/personal-website)。

## 安装

每个版本是一个 GitHub Release，附带打包好的文件。从 Release 的网址安装：

```sh
pnpm add https://github.com/RottenSea/design-system/releases/download/personal-website-v0.2.0/rottensea-ds-personal-website-0.2.0.tgz
```

下面的组件和 remark 插件从 0.2.1 开始提供；0.2.0 只有 token 和 CSS。

## 使用

在网站的布局里加载一次 CSS。`index.css` 带重置样式，给用打包工具构建的网站用；`styles.css` 不带重置样式，给普通 HTML 页面用。

```astro
---
import "@rottensea/ds-personal-website/index.css";
---
```

组件是 Astro 组件。可以按名字单独引入，也可以一次全部传给 MDX 页面，文章里就不用写 import。同一张对照表还会把文章里的代码块和表格换成 CodeBlock 和 TableScroll：

```astro
---
import { components } from "@rottensea/ds-personal-website/components";
const { Content } = await render(post);
---
<Content components={components} />
```

文章用 `:::tip` 这类指令写组件。把这个系统的 remark 插件加到 unified 处理器里，指令才会变成组件；再加上它的 Shiki 转换器，代码块才能写标题和高亮行：

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

## 主题

token 有浅色和深色两套主题。CSS 只看 `data-theme` 属性，所以页面要在绘制前给 `<html>` 设好 `data-theme="light"` 或 `data-theme="dark"`。

## 版本

每个版本改了什么，见[更新日志](https://github.com/RottenSea/design-system/blob/main/systems/personal-website/CHANGELOG.md)。
