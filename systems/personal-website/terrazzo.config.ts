import { defineConfig } from "@terrazzo/cli";
import css from "@terrazzo/plugin-css";

// Every text color that sits on a light surface, checked against WCAG AA (4.5:1).
const lightSurfaces = ["canvas", "soft", "card", "strong"];
const readableText = ["ink", "body-strong", "body", "muted", "link"];

export default defineConfig({
  tokens: "./tokens/personal-website.resolver.json",
  outDir: "./dist/",
  plugins: [css({ filename: "tokens.css" })],
  lint: {
    rules: {
      "a11y/min-contrast": [
        "error",
        {
          level: "AA",
          pairs: [
            ...readableText.flatMap((text) =>
              lightSurfaces.map((surface) => ({
                foreground: `color.text.${text}`,
                background: `color.surface.${surface}`,
              })),
            ),
            { foreground: "color.text.on-primary", background: "color.primary.default" },
            { foreground: "color.text.on-primary", background: "color.primary.pressed" },
          ],
        },
      ],
    },
  },
});
