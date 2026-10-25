// Checks contrast-pairs.ts in every theme the a11y/min-contrast lint does not see.
// The lint only gets the resolver's default input, so this covers the rest.
import { readFile } from "node:fs/promises";
import { defineConfig, parse, type TokenNormalizedSet } from "@terrazzo/parser";
import { tokenToColor } from "@terrazzo/token-tools";
import { contrastWCAG21 } from "colorjs.io/fn";
import { type ContrastPair, contrastPairs } from "../contrast-pairs.ts";

// WCAG AA minimums, the same ones the a11y/min-contrast lint applies.
const AA = { default: 4.5, largeText: 3 };
const root = new URL("../", import.meta.url);
const resolverFile = new URL("tokens/personal-website.resolver.json", root);

/** Returns one message per pair below its AA minimum, empty when every pair passes. */
function failingPairs(tokens: TokenNormalizedSet, pairs: ContrastPair[]): string[] {
  const color = (id: string) => {
    // A misspelled id is a broken pair list, not a contrast failure, so stop like the lint does.
    if (tokens[id]?.$type !== "color") {
      throw new Error(`${id} is not a color token`);
    }
    return tokenToColor(tokens[id].$value);
  };
  return pairs.flatMap(({ foreground, background, largeText }) => {
    const ratio = contrastWCAG21(color(foreground), color(background));
    const min = largeText ? AA.largeText : AA.default;
    return ratio < min ? [`${foreground} on ${background}: ${ratio.toFixed(2)}, needs ${min}`] : [];
  });
}

const config = defineConfig({ tokens: [resolverFile.href] }, { cwd: root });
const { resolver } = await parse([{ src: await readFile(resolverFile, "utf8"), filename: resolverFile }], {
  config,
  skipLint: true,
});

const failures = failingPairs(resolver.apply({ theme: "dark" }), contrastPairs);
if (failures.length > 0) {
  console.error(`dark theme: ${failures.length} pair(s) below WCAG AA:\n  ${failures.join("\n  ")}`);
  process.exit(1);
}
console.log(`dark theme: all ${contrastPairs.length} pairs meet WCAG AA`);
