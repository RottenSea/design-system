---
title: 组件
description: 个人网站的文章和页面用的组件。
sidebar:
  order: 0
---

每一页说明这个组件什么时候用、文章里怎么写、长什么样。示例在一个只加载本系统 CSS 的框里运行，跟着文档站的明暗主题切换。

| 组件 | 文章里的写法 | 作用 |
| --- | --- | --- |
| [Admonition 提示块](./admonition/) | `:::tip` 等五种，`:::details` | 把一个要点从正文里拎出来 |
| [Spoiler 剧透遮罩](./spoiler/) | `:spoiler[...]`、`:::spoiler` | 盖住答案，读者想看时再打开 |
| [Abbreviation 注释](./abbreviation/) | `:term[...]{note="..."}` | 给一个词加一行说明 |
| [Steps 步骤条](./steps/) | `:::steps` | 给操作步骤编号 |
| [CodeBlock 代码块](./code-block/) | 代码块 | 显示代码，带文件名、行号和复制 |
| [TableScroll 表格滚动](./table-scroll/) | Markdown 表格 | 让宽表格横向滚动 |
| [OptionGroup 选项组](./option-group/) | `:::code-group` | 同一操作的几种写法，选一种显示 |
| [FileTree 文件树](./file-tree/) | `:::file-tree` | 显示项目结构的一部分 |
| [Figure 图片](./figure/) | 单独一行的图片 | 带图注、点击放大和模糊占位的图片 |
| [ImageGrid 多图网格](./image-grid/) | `:::gallery` | 把几张图排成网格 |
| [VideoEmbed 视频](./video-embed/) | `::video` | 嵌入 B 站、YouTube、AcFun、Vimeo 视频，点了才加载 |
| [MathBlock 数学公式](./math-block/) | `$...$`、`$$...$$` | 显示构建时排好的公式 |
| [Mermaid 图表](./mermaid/) | `mermaid` 代码块 | 在 DiagramFrame 里画图 |
| [链接](./links/) | 标题和链接 | 标题旁的 # 链接，标出指向别的网站的链接 |
| [Fields 参数卡片](./fields/) | `::::fields` | 列出参数的类型、默认值和说明 |
| [GitHubCard 仓库卡片](./github-card/) | `::github` | 把 GitHub 仓库显示成一张卡片 |
