import type { ShikiTransformer } from "@shikijs/types";
import type { Root as HastRoot } from "hast";
import type { Root } from "mdast";
import type { Processor } from "unified";
import type { VFile } from "vfile";

/** Turns directives, math and mermaid fences in MDX posts into this system's components. */
export function remarkDsDirectives(
  this: Processor
): (tree: Root, file: VFile) => void;

/** MathML for MathBlock's `html`; throws when KaTeX cannot read the formula. */
export function typesetMath(tex: string, display?: boolean): string;

/** Puts a "#" link beside each h2, h3 and h4. */
export function rehypeDsHeadingAnchors(options?: {
  /** Heading levels that get an anchor. */
  levels?: number[];
  /** Comes before the heading's text in the link's name for screen readers. */
  label?: string;
}): (tree: HastRoot, file: VFile) => void;

/** Opens links to other sites in a new tab, with an arrow and a hidden note. */
export function rehypeDsExternalLinks(options?: {
  /** The site's own address, whose links stay internal. */
  site?: string;
  /** The visually hidden note after the link text. */
  note?: string;
}): (tree: HastRoot) => void;

/** Puts each task's checkbox and text in a <label>, so the task names the checkbox. */
export function rehypeDsTaskLists(): (tree: HastRoot) => void;

/** Copies `title="..."` and `showLineNumbers=false` from a code fence's meta onto the <pre>. */
export function transformerMetaAttributes(): ShikiTransformer;

/** Every Shiki transformer the code blocks use. */
export function shikiTransformers(): ShikiTransformer[];
