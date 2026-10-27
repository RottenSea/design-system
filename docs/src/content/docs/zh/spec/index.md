---
title: "文档规范"
---

这份规范说明本仓库里每个 design system 的文档要包含哪些内容，以及其中每个事实从哪里来。它是为这个项目写的总结，每一页都链接了所依据的标准；总结和标准不一致时，以标准为准。

## 谁来读文档

- 使用这套系统的人：需要知道有哪些东西、什么时候用、怎么用。
- 用这套系统写代码的 AI agent：需要同样的内容，外加它们容易弄错的规则。
- 工具：lint、生成器等会读取文档里的结构化数据。

## 链接事实，不复制事实

design system 里的大多数事实已经有固定的出处。文档只链接出处，并围绕它解释含义和用法。

| 事实 | 出处 | 文档怎么做 |
| --- | --- | --- |
| token 的值、类型和引用 | DTCG token 文件 | 链接到这个 token |
| 主题的覆盖值 | DTCG resolver | 链接到这个主题 |
| 组件的 props 和事件 | 组件源码，或者生成的清单（例如 CEM） | 链接过去，不重抄 props 表格 |
| 规则为什么存在 | WCAG、ARIA Authoring Practices、MDN | 作为依据引用 |
| 规则有没有被遵守 | 测试和 lint 规则 | 写明是哪一项检查 |
| 版本和变更 | 包的版本号和 CHANGELOG | 链接过去 |

复制过来的值过期了也没人发现。链接也会失效，但下次构建时链接检查就能找出来。

## 页面

- [结构](./structure/)：design system 文档由哪些部分组成，彼此怎么关联
- [Token](./tokens/)：怎样记录 DTCG 格式的 design token
- [主题](./themes/)：怎样记录用 DTCG resolver 构建的主题
- [组件](./components/)：结构、变体、状态和 API
- [准则](./guidelines/)：写出人和工具都能照做的规则
- [无障碍](./accessibility/)：每一页都要用到的 WCAG 和 APG 要点
- [版本](./versioning/)：版本号、变更记录和弃用
- [写作](./writing/)：文档本身的写作风格

## 来源

- [Design System Doc Spec（DSDS）](https://designsystemdocspec.org/)，0.23.0 版，目前仍是草案。
- W3C Design Tokens Community Group 的 [Design Tokens Format Module 2025.10](https://www.designtokens.org/TR/2025.10/format/) 和 [Resolver Module 2025.10](https://www.designtokens.org/TR/2025.10/resolver/)。
