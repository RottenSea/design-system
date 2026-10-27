// Shiki transformers for code blocks, so the CodeBlock component can show what a code fence asks
// for. Plain JavaScript for the same reason as index.js: a site's astro.config imports it.
import {
  transformerMetaHighlight,
  transformerNotationDiff,
  transformerNotationErrorLevel,
  transformerNotationFocus,
  transformerNotationHighlight
} from "@shikijs/transformers";

/**
 * Copies what the fence's meta says onto the <pre>: `title="..."` becomes data-title, which
 * CodeBlock shows as the filename, and `showLineNumbers=false` turns the numbers off.
 * The language is on data-language already.
 * @returns {import("@shikijs/types").ShikiTransformer}
 */
export function transformerMetaAttributes() {
  return {
    name: "ds:meta-attributes",
    pre(node) {
      const raw = this.options.meta?.__raw ?? "";
      const title = raw.match(/title="([^"]*)"/)?.[1] ?? raw.match(/title='([^']*)'/)?.[1];
      if (title) node.properties["data-title"] = title;
      if (/\bshowLineNumbers=false\b/.test(raw)) node.properties["data-line-numbers"] = "false";
    }
  };
}

/**
 * Every transformer the code blocks use, for `markdown.shikiConfig.transformers` and for
 * Astro's <Code> component:
 * - ```js {2,4-5} highlights those lines
 * - // [!code ++] and // [!code --] mark added and removed lines
 * - // [!code highlight], // [!code focus], // [!code error] and // [!code warning] mark one line
 * - title="file.ts" names the file
 */
export function shikiTransformers() {
  return [
    transformerMetaHighlight(),
    transformerNotationHighlight(),
    transformerNotationDiff(),
    transformerNotationFocus(),
    transformerNotationErrorLevel(),
    transformerMetaAttributes()
  ];
}
