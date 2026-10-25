# Themes

A theme is a set of token overrides, such as a dark theme or a high-contrast theme. The [DTCG Resolver Module](https://www.designtokens.org/TR/2025.10/resolver/) describes how token files combine into the tokens for one theme.

## The resolver in brief

A resolver document has three parts:

- **Sets** are lists of token files that always load together, such as the palette and the base semantic tokens.
- **Modifiers** are choices with named **contexts**. A `theme` modifier can have the contexts `light` and `dark`, each pointing to its own token files. A modifier can name a `default` context.
- **The resolution order** lists sets and modifiers in the order they apply. When two sources define the same token, the later one wins.

Picking one context for every modifier gives a **permutation**: the final set of tokens for that combination. Two modifiers with two contexts each give four permutations.

Keep modifiers **orthogonal** where possible, meaning no two modifiers set the same token. When a `theme` and a `brand` modifier both set `color.button`, only the order of the list decides which one wins, which is hard to see from the files.

## Keep themes small

Put everything shared in the sets, and let each theme context override only the semantic tokens that change. A dark theme changes the text, surface and border roles; the palette, spacing and type stay in the shared set.

## What a theme page says

- What the theme is for and when it applies, for example following the operating system's dark mode
- How a page or part of a page selects it, for example `data-theme="dark"`
- Which semantic tokens it changes, and why when the reason is not obvious (a link color that has to change to keep its contrast)
- Which contrast checks it passes. See [Accessibility](./accessibility)

## Source

[Design Tokens Resolver Module 2025.10](https://www.designtokens.org/TR/2025.10/resolver/), including its terminology for orthogonality and permutations.
