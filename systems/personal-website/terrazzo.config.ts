import { defineConfig } from "@terrazzo/cli";
import css from "@terrazzo/plugin-css";
import { contrastPairs } from "./contrast-pairs.ts";

export default defineConfig({
  tokens: "./tokens/personal-website.resolver.json",
  outDir: "./dist/",
  plugins: [
    css({
      filename: "tokens.css",
      permutations: [
        {
          // Light is the default, and [data-theme="light"] forces it on a page or a subtree.
          input: { theme: "light" },
          prepare: (contents) => `:root,\n[data-theme="light"] {\n  color-scheme: light;\n${contents}\n}`,
        },
        {
          // Dark follows the OS unless the page forces light.
          input: { theme: "dark" },
          prepare: (contents) =>
            `@media (prefers-color-scheme: dark) {\n  :root:not([data-theme="light"]) {\n    color-scheme: dark;\n${contents}\n  }\n}`,
        },
        {
          // [data-theme="dark"] forces dark on a page or a subtree.
          input: { theme: "dark" },
          prepare: (contents) => `[data-theme="dark"] {\n  color-scheme: dark;\n${contents}\n}`,
        },
      ],
    }),
  ],
  lint: {
    rules: {
      // Only sees the default theme; scripts/check-contrast.ts covers the others.
      "a11y/min-contrast": ["error", { level: "AA", pairs: contrastPairs }],
    },
  },
});
