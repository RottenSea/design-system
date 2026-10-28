import type { ShikiTransformer } from "@shikijs/types";
import type { Root } from "mdast";
import type { Processor } from "unified";
import type { VFile } from "vfile";

/**
 * Turns the directive shorthand in MDX posts (`:::tip`, `:::details`, `:::spoiler`,
 * `:::steps`, `:::code-group`, `:::file-tree`, `:::gallery`, `::video`, `:spoiler[...]`,
 * `:term[...]{note="..."}`), `$...$` and `$$...$$` math, and mermaid fences into this
 * system's components, and marks an image on a line of its own as a figure.
 * It also turns on the parsers of remark-directive and remark-math.
 */
export function remarkDsDirectives(this: Processor): (tree: Root, file: VFile) => void;

/**
 * MathML for a formula, typeset by KaTeX, for MathBlock's `html`. `display` is false for a formula
 * inside a sentence. Throws when KaTeX cannot read the formula.
 */
export function typesetMath(tex: string, display?: boolean): string;

/** Copies `title="..."` and `showLineNumbers=false` from a code fence's meta onto the <pre>. */
export function transformerMetaAttributes(): ShikiTransformer;

/** Every Shiki transformer the code blocks use: meta and notation highlights, diff, focus,
 *  error levels and the fence's title. */
export function shikiTransformers(): ShikiTransformer[];
