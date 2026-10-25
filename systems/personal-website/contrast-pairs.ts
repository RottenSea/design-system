// Every text color that must read at WCAG AA (4.5:1) on every surface, in every theme.
// terrazzo.config.ts checks these in the default (light) theme and
// scripts/check-contrast.ts checks them in the others.
const surfaces = ["canvas", "soft", "card", "strong"];
const readableText = ["text.ink", "text.body-strong", "text.body", "text.muted", "text.link", "status.error"];

export interface ContrastPair {
  foreground: string;
  background: string;
}

export const contrastPairs: ContrastPair[] = [
  ...readableText.flatMap((text) =>
    surfaces.map((surface) => ({
      foreground: `color.${text}`,
      background: `color.surface.${surface}`,
    })),
  ),
  { foreground: "color.text.on-primary", background: "color.primary.default" },
  { foreground: "color.text.on-primary", background: "color.primary.pressed" },
];
