import type { Root } from "mdast";
import type { Processor } from "unified";
import type { VFile } from "vfile";

/**
 * Turns the directive shorthand in MDX posts (`:::tip`, `:::details`, `:::spoiler`,
 * `:::steps`, `:spoiler[...]`, `:term[...]{note="..."}`) into this system's components.
 * It also turns on remark-directive's parser.
 */
export function remarkDsDirectives(this: Processor): (tree: Root, file: VFile) => void;
