import type { ShikiTransformer } from "@shikijs/types";
import type { Root as HastRoot } from "hast";
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

/**
 * Puts a "#" link beside each h2, h3 and h4, in a div.ds-heading that content.css styles. Gives
 * the headings their ids first, with Astro's rehypeHeadingIds.
 */
export function rehypeDsHeadingAnchors(options?: {
  /** Heading levels that get an anchor. */
  levels?: number[];
  /** Comes before the heading's text in the link's name for screen readers. */
  label?: string;
}): (tree: HastRoot, file: VFile) => void;

/**
 * Opens links to other sites in a new tab, marks them with an arrow that content.css draws, and
 * adds a visually hidden note for screen readers.
 */
export function rehypeDsExternalLinks(options?: {
  /** The site's own address, whose links stay internal. */
  site?: string;
  /** The visually hidden note after the link text. */
  note?: string;
}): (tree: HastRoot) => void;

/** Copies `title="..."` and `showLineNumbers=false` from a code fence's meta onto the <pre>. */
export function transformerMetaAttributes(): ShikiTransformer;

/** Every Shiki transformer the code blocks use: meta and notation highlights, diff, focus,
 *  error levels and the fence's title. */
export function shikiTransformers(): ShikiTransformer[];
