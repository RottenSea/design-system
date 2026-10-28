// Reads a design system's tokens with Terrazzo when the docs build, so the tables show the values in
// the token files and cannot drift from them. Nothing generated is committed.
//
// A system keeps its tokens in systems/<system>/tokens/, with a DTCG resolver named after the
// system. The light theme and the wide screen are the resolver's defaults; the other contexts are
// applied on top, and a value is listed for a context only where it differs.
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { pathToFileURL } from "node:url";
import { defineConfig, parse, type TokenNormalized } from "@terrazzo/parser";

export interface TokenInfo {
  /** DTCG path: "text.body". */
  id: string;
  /** The CSS variable tokens.css writes for it: "--text-body". */
  cssVar: string;
  type: string;
  /** Readable values; dark and narrow only where they differ from light and wide. */
  value: { light: string; dark?: string; narrow?: string };
  /** A CSS color for a swatch, for color tokens. */
  swatch?: { light: string; dark?: string };
  /** The CSS variable of the token this one points to, in each theme. */
  alias?: { light?: string; dark?: string };
  /** The token's description, by language: "en" and "zh-CN". */
  description: Record<string, string | undefined>;
  /** The resolved token, for tables that need more than a readable value. */
  raw: { light: TokenNormalized; dark?: TokenNormalized; narrow?: TokenNormalized };
}

/** The variable name rule of the systems' terrazzo.config.ts: `coral.500` is --coral-500. */
export const cssVar = (id: string) => `--${id.replaceAll(".", "-")}`;

const unit = (dimension: { value: number; unit: string }) => `${dimension.value}${dimension.unit}`;

interface Color {
  hex?: string;
  alpha?: number;
  colorSpace: string;
  components: (number | "none")[];
}

function cssColor(color: Color) {
  const alpha = color.alpha ?? 1;
  if (color.hex && alpha === 1) return color.hex;
  const [r, g, b] = color.components.map((c) => Math.round((c === "none" ? 0 : c) * 255));
  return `rgb(${r} ${g} ${b} / ${Math.round(alpha * 100)}%)`;
}

/** A value the way a reader writes it in CSS. */
export function readable(token: TokenNormalized): string {
  // biome-ignore lint/suspicious/noExplicitAny: each token type has its own value shape.
  const value = token.$value as any;
  switch (token.$type) {
    case "color":
      return cssColor(value);
    case "dimension":
    case "duration":
      return unit(value);
    case "cubicBezier":
      return `cubic-bezier(${value.join(", ")})`;
    case "fontFamily":
      return value.map((name: string) => (/\s/.test(name) ? `"${name}"` : name)).join(", ");
    case "shadow":
      return value
        .map(
          (layer: Record<string, { value: number; unit: string }> & { color: Color; inset?: boolean }) =>
            `${layer.inset ? "inset " : ""}${unit(layer.offsetX)} ${unit(layer.offsetY)} ${unit(layer.blur)} ${unit(layer.spread)} ${cssColor(layer.color)}`
        )
        .join(", ");
    case "border":
      return `${unit(value.width)} ${value.style} ${cssColor(value.color)}`;
    case "typography": {
      const size = value.fontSize ? unit(value.fontSize) : "";
      const tracking = value.letterSpacing ? ` · ${unit(value.letterSpacing)}` : "";
      return `${size} / ${value.lineHeight} · ${value.fontWeight}${tracking}`;
    }
    default:
      return typeof value === "object" ? JSON.stringify(value) : String(value);
  }
}

const describe = (token: TokenNormalized) => {
  const extension = token.$extensions?.["cafe.rottenth"] as { description?: Record<string, string> } | undefined;
  return { en: token.$description, ...extension?.description };
};

const cache = new Map<string, Promise<TokenInfo[]>>();

/** Every token of a system, in the order of its files. */
export function loadTokens(system: string): Promise<TokenInfo[]> {
  let result = cache.get(system);
  if (!result) {
    result = load(system);
    cache.set(system, result);
  }
  return result;
}

/**
 * The position of each token in the foundation's files, in the order the resolver lists them. The
 * parser does not keep that order, and a table reads best the way the file was written.
 */
function fileOrder(resolverPath: string): Map<string, number> {
  const resolverJson = JSON.parse(readFileSync(resolverPath, "utf8"));
  const sets = Object.values(resolverJson.sets ?? {}) as { sources?: { $ref?: string }[] }[];
  const order = new Map<string, number>();
  const walk = (node: Record<string, unknown>, path: string[]) => {
    if ("$value" in node) {
      const id = path.join(".");
      if (!order.has(id)) order.set(id, order.size);
      return;
    }
    for (const [key, child] of Object.entries(node)) {
      if (!key.startsWith("$") && child && typeof child === "object") walk(child as Record<string, unknown>, [...path, key]);
    }
  };
  for (const set of sets) {
    for (const source of set.sources ?? []) {
      if (source.$ref) walk(JSON.parse(readFileSync(resolve(resolverPath, "..", source.$ref), "utf8")), []);
    }
  }
  return order;
}

async function load(system: string): Promise<TokenInfo[]> {
  // The docs build runs in docs/, next to systems/.
  const path = resolve(process.cwd(), "..", "systems", system, "tokens", `${system}.resolver.json`);
  const url = pathToFileURL(path);
  const config = defineConfig({ tokens: [path] }, { cwd: new URL(".", url) });
  const { tokens, resolver } = await parse([{ src: readFileSync(url, "utf8"), filename: url }], {
    config,
    skipLint: true
  });
  const dark = resolver.apply({ theme: "dark" });
  const narrow = resolver.apply({ viewport: "narrow" });
  const order = fileOrder(path);
  const position = (id: string) => order.get(id) ?? Number.MAX_SAFE_INTEGER;
  const sorted = Object.values(tokens).sort((a, b) => position(a.id) - position(b.id));
  return sorted.map((token) => {
    const darkToken = dark[token.id];
    const narrowToken = narrow[token.id];
    const light = readable(token);
    const darkValue = darkToken ? readable(darkToken) : undefined;
    const narrowValue = narrowToken ? readable(narrowToken) : undefined;
    const isColor = token.$type === "color";
    return {
      id: token.id,
      cssVar: cssVar(token.id),
      type: token.$type,
      value: {
        light,
        dark: darkValue !== light ? darkValue : undefined,
        narrow: narrowValue !== light ? narrowValue : undefined
      },
      swatch: isColor ? { light, dark: darkValue !== light ? darkValue : undefined } : undefined,
      alias: {
        light: token.aliasOf ? cssVar(token.aliasOf) : undefined,
        dark: darkToken?.aliasOf && darkToken.aliasOf !== token.aliasOf ? cssVar(darkToken.aliasOf) : undefined
      },
      description: describe(token),
      raw: { light: token, dark: darkToken, narrow: narrowToken }
    };
  });
}

/**
 * The tokens a table lists: "text.*" is every token in the text group, anything else an exact
 * path. Tokens keep the order of the token files.
 */
export function select(tokens: TokenInfo[], patterns: string[]): TokenInfo[] {
  return tokens.filter((token) =>
    patterns.some((pattern) =>
      pattern.endsWith(".*") ? token.id.startsWith(pattern.slice(0, -1)) : token.id === pattern
    )
  );
}
