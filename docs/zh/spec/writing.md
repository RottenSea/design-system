# 写作

这些规则针对文档本身。它们参考了 [GitHub Docs 写作风格指南](https://docs.github.com/en/contributing/style-guide-and-content-model/style-guide)，指南的第一条原则在这里同样适用：清楚和意思准确比语法规则更重要。

## 先确定写的是哪类页面

| 类型 | 回答的问题 | 本站的例子 |
| --- | --- | --- |
| 概念 | 这是什么，为什么存在 | Token、主题 |
| 操作 | 怎样完成这件事 | 安装一个系统 |
| 参考 | 具体有哪些选项 | token 列表、组件 props 列表 |

一个页面只写一类。夹在解释中间的参考表格，以后很难找到，放到参考页，再链接过去。

## 平实的语言

- 句子要短，用主动语态，一句话只讲一件事。
- 先写读者需要的内容，背景放在后面，或者给个链接。
- 术语第一次出现时解释清楚，之后处处用法一致：一个概念只用一个词。文档里用了“背景（surface）”，就不要再用“背景层”指同一个东西。

## 标题和链接

- 标题写清楚这一节的内容。
- 链接文字说明链接到哪里。“见[无障碍](./accessibility)”可以，“点这里”不行。

## 图片

每张图片都要有替代文字（alt text），写出图片想表达的意思，而不是描述像素。GitHub 的指南建议写 40 到 150 个字符，开头写明图片类型（“截图：……”“示意图：……”），不要用“图片：”开头。

## 两种语言

英文页和中文页结构相同，内容一致。两种语言在同一次提交里一起改。翻译意思，不逐字翻译；代码、token 名称和文件路径不翻译。

## 写给 agent

人和 agent 读的是同一批页面。先写给人看。只有当 agent 反复犯同一个错时，才加一段写给 agent 的说明，直接写出应该怎么做。

## 来源

[GitHub Docs 写作风格指南](https://docs.github.com/en/contributing/style-guide-and-content-model/style-guide)和[内容模型](https://docs.github.com/en/contributing/style-guide-and-content-model/about-the-content-model)，以及 [DSDS](https://designsystemdocspec.org/) 中关于读者的规则。
