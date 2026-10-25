# Components

A component page tells people when to use a piece of UI and how to use it well. Its API lives in the source code, so the page links there instead of retyping it.

## What a component page contains

| Part | What to write |
| --- | --- |
| Description | One sentence on what it does, such as "Triggers an action on the current screen." |
| When to use | Situations it fits, and what to use instead when it does not fit. A link that navigates is not a button |
| Anatomy | Its named parts, such as the label, icon and focus ring of a button |
| Variants | Configurations a developer picks, such as `size` or `tone` |
| States | Conditions the component is in, such as hover, focus, pressed or disabled |
| Combinations | Which variants and states can and cannot appear together |
| Accessibility | Its role, its keyboard behavior and how it gets a name. See [Accessibility](./accessibility) |
| API | A link to the source file or a generated manifest such as a [Custom Elements Manifest](https://github.com/webcomponents/custom-elements-manifest) |
| Examples | A live demo or a link to one |
| Related | Components it uses and components that can replace it |

## Variants and states

DSDS calls both of these **traits** and tells them apart: a **variant** is chosen by whoever uses the component, and a **state** happens to it while someone uses it. Either can be a yes/no switch or one value out of a list. `size` is a variant with the values small, medium and large; `disabled` is a yes/no state.

Write down **combinations** that are not allowed, for example a disabled button that is also pressed, so the rule is in one place instead of in each developer's head.

## Keyboard behavior comes from APG

For any widget that has a pattern in the [ARIA Authoring Practices Guide](https://www.w3.org/WAI/ARIA/apg/) (dialog, tabs, menu, combobox and so on), take the keys, roles and states from that pattern instead of inventing new ones. Native HTML elements come first: a `<button>` already has the right role and keyboard behavior, and the APG warns that no ARIA is better than bad ARIA.

## Source

[DSDS component entries](https://designsystemdocspec.org/), which define traits, combinations, source files and specs, and the [ARIA Authoring Practices Guide](https://www.w3.org/WAI/ARIA/apg/).
