import type { ShikiTransformer } from "@shikijs/types";
import type { Root } from "mdast";
import type { Processor } from "unified";
import type { VFile } from "vfile";

/**
 * Turns the directive shorthand in MDX posts (`:::tip`, `:::details`, `:::spoiler`,
 * `:::steps`, `:::code-group`, `:::file-tree`, `:::gallery`, `::video`, `:spoiler[...]`,
 * `:term[...]{note="..."}`) into this system's components, and marks an image on a line of its
 * own as a figure.
 * It also turns on remark-directive's parser.
 */
export function remarkDsDirectives(this: Processor): (tree: Root, file: VFile) => void;

/** Copies `title="..."` and `showLineNumbers=false` from a code fence's meta onto the <pre>. */
export function transformerMetaAttributes(): ShikiTransformer;

/** Every Shiki transformer the code blocks use: meta and notation highlights, diff, focus,
 *  error levels and the fence's title. */
export function shikiTransformers(): ShikiTransformer[];
