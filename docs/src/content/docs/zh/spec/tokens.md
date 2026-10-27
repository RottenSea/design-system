---
title: "Token"
---

design token 是构成 design system 的具名数值：颜色、尺寸、字体、时长。它们的值写在 [DTCG Format](https://www.designtokens.org/TR/2025.10/format/) 格式的文件里。文档只解释每个 token 的用途，值留在文件里。

## DTCG 格式要点

- 文件扩展名用 `.tokens.json` 或 `.tokens`。
- token 是一个带 `$value` 的对象，还可以有 `$type`、`$description`、`$deprecated` 和 `$extensions`。
- 组（group）是不带 `$value` 的对象，里面放 token 或其他组。在组上写的 `$type` 对组内所有 token 生效，不用重复写。组里可以放一个 `$root` token，作为这个组自己的基础值。
- 名字不能以 `$` 开头，也不能包含 `{`、`}` 和 `.`，因为引用要用到这几个字符。
- 引用让一个 token 指向另一个：`{color.palette.coral.500}`。引用方取被引用 token 的值。

## 类型

| 种类 | 类型 |
| --- | --- |
| 单一值 | `color`、`dimension`（`px` 或 `rem`）、`fontFamily`、`fontWeight`、`duration`（`ms` 或 `s`）、`cubicBezier`、`number` |
| 复合值 | `strokeStyle`、`border`、`transition`、`shadow`、`gradient`、`typography` |

复合 token 是几个必须放在一起才有意义的值，例如阴影的颜色、偏移、模糊和扩展。组不一样，组只是把各自独立的 token 归在一起。

颜色是一个对象，写明色彩空间和各分量，例如 `{ "colorSpace": "srgb", "components": [0.85, 0.47, 0.34], "hex": "#d97757" }`。

## 两层 token

把 token 分成两层，这样主题只需要改其中一层：

- **色板 token** 给原始值命名：`color.palette.coral.500`。它只说明这个值是什么，不说明用在哪里。
- **语义 token** 给用途命名，并引用一个色板 token：`color.text.link` → `{color.palette.coral.800}`。组件只使用语义 token。

主题改变的是语义 token 指向哪个色板 token，色板本身从不改变。见[主题](../themes/)。

## token 页写什么

一个 token 或一组 token 的页面写：

- 一句话说明用途
- 什么时候用它，什么时候该换别的
- 必须成立的搭配，例如哪些文字颜色可以放在哪些背景上
- 指向 token 文件里这个 token 的链接，而不是它的值

只有当数值是从 token 文件自动生成的时候才写出来，这样它才不会和文件对不上。

## 来源

[Design Tokens Format Module 2025.10](https://www.designtokens.org/TR/2025.10/format/)，W3C Design Tokens Community Group 发布的第一个稳定版。
