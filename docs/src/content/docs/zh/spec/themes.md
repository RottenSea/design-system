---
title: "主题"
---

主题是一组 token 覆盖值，例如暗色主题或高对比度主题。[DTCG Resolver Module](https://www.designtokens.org/TR/2025.10/resolver/) 规定了多个 token 文件怎样组合成某个主题下的全部 token。

## resolver 要点

resolver 文档由三部分组成：

- **集合（set）**：总是一起加载的一组 token 文件，例如色板和基础语义 token。
- **修饰器（modifier）**：一个带若干具名**情境（context）**的选择项。例如 `theme` 修饰器有 `light` 和 `dark` 两个情境，各自指向自己的 token 文件。修饰器可以指定一个 `default` 情境。
- **解析顺序（resolution order）**：按生效顺序列出集合和修饰器。两个来源定义了同一个 token 时，后面的生效。

给每个修饰器各选一个情境，就得到一个**排列（permutation）**，也就是这种组合下最终的全部 token。两个修饰器各有两个情境，就有四种排列。

尽量让修饰器**正交**，也就是任意两个修饰器不会设置同一个 token。如果 `theme` 和 `brand` 两个修饰器都设置了 `color.button`，谁生效只取决于列表顺序，从文件上很难看出来。

## 主题要小

共用的内容都放在集合里，每个主题情境只覆盖会变的语义 token。暗色主题改变文字、背景和边框这些用途；色板、间距和字号留在共用集合里。

## 主题页写什么

- 主题的用途和生效条件，例如跟随操作系统的暗色模式
- 页面或页面的一部分怎样选中它，例如 `data-theme="dark"`
- 它改了哪些语义 token；原因不明显时写明原因（例如为了保持对比度，链接颜色必须换一个色阶）
- 它通过了哪些对比度检查。见[无障碍](../accessibility/)

## 来源

[Design Tokens Resolver Module 2025.10](https://www.designtokens.org/TR/2025.10/resolver/)，包括其中关于正交和排列的术语说明。
