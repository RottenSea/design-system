---
title: "版本"
---

每个系统都有自己的版本号、变更记录和发布 tag。版本号告诉使用者升级要付出多少代价，变更记录告诉他们改了什么。

## 版本号

版本号遵循[语义化版本](https://semver.org/)：`主版本.次版本.修订号`（`MAJOR.MINOR.PATCH`）。

| 升级 | 什么时候 |
| --- | --- |
| 主版本 | 原来能用的东西不能用了 |
| 次版本 | 加了新东西，原来的都还能用 |
| 修订号 | 修复问题，其他都不变 |

主版本是 `0` 的时候，每次发布都可能有任何改动；到 `1.0.0` 才承诺公开 API 保持稳定。

design system 的公开 API 是其他代码依赖的一切：token 名称和由它生成的 CSS 自定义属性、包导出的文件、组件的 props 和事件。重命名或删除其中任何一个，都是主版本变更；新增一个，是次版本变更。修改 token 的值不会让代码出错，但用户看到的东西变了，所以写进变更记录的 Changed，至少作为次版本发布。

## 变更记录

每个系统都有一个 `CHANGELOG.md`，格式遵循 [Keep a Changelog](https://keepachangelog.com/en/1.1.0/)：

- 最新版本在最上面，顶部有一个 `Unreleased` 小节，记录还没发布的改动
- 每个版本一个标题，带日期：`## [0.1.0] - 2026-10-25`
- 改动分为 Added、Changed、Deprecated、Removed、Fixed、Security 几类
- 写给使用这套系统的人看，不照抄提交说明

## 提交说明

提交说明遵循 [Conventional Commits](https://www.conventionalcommits.org/en/v1.0.0/)：`type(scope): description`，例如 `feat(personal-website): add a dark theme`。`feat` 对应次版本，`fix` 对应修订号，类型后面加 `!` 或者有 `BREAKING CHANGE:` 脚注，对应主版本。

## 弃用

删除任何东西之前都要先预告：

1. 在 DTCG 文件里给 token 加上 `$deprecated`，可以写 `true`，也可以写一句话说明原因和替代方案。
2. 在文档里和变更记录的 Deprecated 下注明，写出替代方案。
3. 在下一个主版本里删除，记在 Removed 下。

## 本仓库的发布方式

推送名为 `<system>-v<version>` 的 tag（例如 `personal-website-v0.1.0`），就会把这个系统发布成一个 GitHub Release，附上打好的包，并用这个版本在变更记录里的那一节作为发布说明。

## 来源

[语义化版本 2.0.0](https://semver.org/)、[Keep a Changelog 1.1.0](https://keepachangelog.com/en/1.1.0/)、[Conventional Commits 1.0.0](https://www.conventionalcommits.org/en/v1.0.0/)，以及 [DTCG Format](https://www.designtokens.org/TR/2025.10/format/) 中的 `$deprecated` 属性。
