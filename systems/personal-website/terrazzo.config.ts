import { defineConfig } from "@terrazzo/cli";
import { readFileSync } from "node:fs";
import css from "@terrazzo/plugin-css";

/** Every token in a token file with its type, which a token takes from its group when it has none. */
function tokensIn(file: string): { id: string; type?: string }[] {
  const tokens: { id: string; type?: string }[] = [];
  const walk = (node: Record<string, unknown>, path: string[], type?: string) => {
    const own = typeof node.$type === "string" ? node.$type : type;
    if ("$value" in node) return void tokens.push({ id: path.join("."), type: own });
    for (const [key, child] of Object.entries(node)) {
      if (!key.startsWith("$") && child && typeof child === "object") {
        walk(child as Record<string, unknown>, [...path, key], own);
      }
    }
  };
  walk(JSON.parse(readFileSync(new URL(file, import.meta.url), "utf8")), []);
  return tokens;
}

/** IDs of every token in a token file, so a context block writes only what that context changes. */
const tokenIds = (file: string) => tokensIn(file).map((token) => token.id);

const variable = (id: string) => `--${id.replaceAll(".", "-")}`;

/*
 * A change of theme fades these on <html> alone: every colour the dark theme changes, and
 * --theme-dark, which goes from 0% in the light theme to 100% in the dark for a colour that picks
 * between two values with color-mix(). They are listed in --theme-variables, which the theme store
 * (scripts/theme.ts) reads, and registered, so the store reads each one as a colour or percentage
 * it can blend. Every element reads the blended values, so none needs a transition of its own.
 */
const THEME_COLORS = tokensIn("./tokens/theme-dark.tokens.json")
  .filter((token) => token.type === "color")
  .map((token) => variable(token.id));
const THEME_VARIABLES = ["--theme-dark", ...THEME_COLORS];
const PROPERTIES = [
  "@property --theme-dark {\n  syntax: \"<percentage>\";\n  inherits: true;\n  initial-value: 0%;\n}",
  ...THEME_COLORS.map((name) => `@property ${name} {\n  syntax: "<color>";\n  inherits: true;\n  initial-value: transparent;\n}`),
].join("\n\n");

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
      variableName: (token) => variable(token.id),
      // No font shorthand: it would point at the default sub-value names, not the renamed ones.
      omitTypographyShorthand: true,
      subValueVariableName: (name, sub) => `${name}-${TYPE_SUFFIX[sub] ?? sub}`,
      permutations: [
        {
          // Light is :root. [data-theme="light"] lets a light subtree sit inside a dark page.
          input: { theme: "light", viewport: "wide" },
          prepare: (contents) =>
            `${PROPERTIES}\n\n:root,\n[data-theme="light"] {\n  color-scheme: light;\n  --theme-dark: 0%;\n` +
            `  --theme-variables: ${THEME_VARIABLES.join(", ")};\n${contents}\n}`,
        },
        {
          // The one dark block. The page's boot script always sets data-theme, so there is no
          // prefers-color-scheme query here. Only the tokens the dark theme changes are written.
          input: { theme: "dark" },
          include: tokenIds("./tokens/theme-dark.tokens.json"),
          prepare: (contents) => `[data-theme="dark"] {\n  color-scheme: dark;\n  --theme-dark: 100%;\n${contents}\n}`,
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
