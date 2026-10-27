---
title: "无障碍"
---

文档引用 [WCAG 2.2](https://www.w3.org/TR/WCAG22/) 来说明哪些规则保证所有人都能用这套系统，引用 [ARIA Authoring Practices Guide](https://www.w3.org/WAI/ARIA/apg/)（APG）来说明各类控件该怎样运作。本仓库的所有系统都以 WCAG 2.2 AA 级为目标。

## 符合级别

WCAG 的成功标准分三级。**A** 是最低要求，**AA** 是法律和政策通常要求的级别，**AAA** 最严格。达到 AA 意味着满足所有 A 级和 AA 级的标准。

## 由 design system 决定的标准

| 标准 | 级别 | 要求 |
| --- | --- | --- |
| [1.4.3 对比度（最低）](https://www.w3.org/WAI/WCAG22/Understanding/contrast-minimum.html) | AA | 文字和背景的对比度至少 4.5:1。大号文字（至少 18pt，或 14pt 粗体）至少 3:1 |
| [1.4.11 非文本对比度](https://www.w3.org/WAI/WCAG22/Understanding/non-text-contrast.html) | AA | 控件边界、焦点指示和有含义的图形，与相邻颜色的对比度至少 3:1 |
| [1.4.1 颜色的使用](https://www.w3.org/WAI/WCAG22/Understanding/use-of-color.html) | A | 不能只靠颜色区分信息。如果链接和正文只有颜色不同，链接色和正文色之间要有 3:1，并且悬停或聚焦时有别的提示（技术 G183）；加下划线是更简单的办法 |
| [2.4.7 焦点可见](https://www.w3.org/WAI/WCAG22/Understanding/focus-visible.html) | AA | 键盘焦点始终看得见 |
| [2.4.11 焦点不被遮挡（最低）](https://www.w3.org/WAI/WCAG22/Understanding/focus-not-obscured-minimum.html) | AA | 获得焦点的元素不能被完全挡住，例如被固定在顶部的页头挡住。2.2 新增 |
| [2.5.8 目标尺寸（最低）](https://www.w3.org/WAI/WCAG22/Understanding/target-size-minimum.html) | AA | 点击目标至少 24×24 CSS 像素，或者周围留有同样大小的空间。2.2 新增 |
| [1.4.4 调整文字大小](https://www.w3.org/WAI/WCAG22/Understanding/resize-text.html) | AA | 文字放大到 200% 时内容不丢失 |
| [1.4.10 重排](https://www.w3.org/WAI/WCAG22/Understanding/reflow.html) | AA | 在 320 CSS 像素宽的屏幕上，不需要左右滚动就能看完内容 |
| [2.3.3 交互触发的动画](https://www.w3.org/WAI/WCAG22/Understanding/animation-from-interactions.html) | AAA | 由交互触发的动效可以关闭。跟随系统的 `prefers-reduced-motion` 设置就能低成本做到 |

## 对比度要在构建时检查

对比度是 token 两两搭配时的属性，所以在定义 token 的地方检查。列出所有可能放在一起的文字色和背景色，每个主题都检查，任何一对低于最低值就让构建失败。只写在文档里的规则，下次调整色板时就会被破坏。

## 控件

对话框、标签页、菜单等控件，按键、角色和状态都照 APG 里对应的模式来。优先用原生 HTML 元素，它们本来就有正确的行为；只有 HTML 没有合适元素时才加 ARIA。

## 来源

[WCAG 2.2](https://www.w3.org/TR/WCAG22/)、上面链接的各条 Understanding 文档，以及 [ARIA Authoring Practices Guide](https://www.w3.org/WAI/ARIA/apg/)。
