import { defineConfig } from "@terrazzo/cli";
import { readFileSync } from "node:fs";
import css from "@terrazzo/plugin-css";

/** IDs of every token in a token file, so a context block writes only what that context changes. */
function tokenIds(file: string): string[] {
  const ids: string[] = [];
  const walk = (node: Record<string, unknown>, path: string[]) => {
    if ("$value" in node) return void ids.push(path.join("."));
    for (const [key, child] of Object.entries(node)) {
      if (!key.startsWith("$") && child && typeof child === "object") walk(child as Record<string, unknown>, [...path, key]);
    }
  };
  walk(JSON.parse(readFileSync(new URL(file, import.meta.url), "utf8")), []);
  return ids;
}

// Typography tokens write one variable per property, named the short way the components use.
const TYPE_SUFFIX: Record<string, string> = {
  "font-family": "family",
  "font-size": "size",
  "font-weight": "weight",
  "line-height": "lh",
  "letter-spacing": "ls",
};

export default defineConfig({
  tokens: "./tokens/personal-website.resolver.json",
  outDir: "./dist/",
  plugins: [
    css({
      filename: "tokens.css",
      legacyHex: true,
      // Token IDs map straight to variable names: `text.body` is --text-body, `coral.500` is --coral-500.
      variableName: (token) => `--${token.id.replaceAll(".", "-")}`,
      // No font shorthand: it would point at the default sub-value names, not the renamed ones.
      omitTypographyShorthand: true,
      subValueVariableName: (name, sub) => `${name}-${TYPE_SUFFIX[sub] ?? sub}`,
      permutations: [
        {
          // Light is :root. [data-theme="light"] lets a light subtree sit inside a dark page.
          input: { theme: "light", viewport: "wide" },
          prepare: (contents) => `:root,\n[data-theme="light"] {\n  color-scheme: light;\n${contents}\n}`,
        },
        {
          // The one dark block. The page's boot script always sets data-theme, so there is no
          // prefers-color-scheme query here. Only the tokens the dark theme changes are written.
          input: { theme: "dark" },
          include: tokenIds("./tokens/theme-dark.tokens.json"),
          prepare: (contents) => `[data-theme="dark"] {\n  color-scheme: dark;\n${contents}\n}`,
        },
        {
          input: { viewport: "narrow" },
          include: tokenIds("./tokens/typography-narrow.tokens.json"),
          prepare: (contents) => `@media (max-width: 768px) {\n  :root {\n${contents}\n  }\n}`,
        },
      ],
    }),
  ],
});
