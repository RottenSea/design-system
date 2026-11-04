import {
  transformerMetaHighlight,
  transformerNotationDiff,
  transformerNotationErrorLevel,
  transformerNotationFocus,
  transformerNotationHighlight
} from "@shikijs/transformers";

/**
 * `title="..."` becomes data-title, CodeBlock's filename; `showLineNumbers=false` turns the
 * numbers off.
 * @returns {import("@shikijs/types").ShikiTransformer}
 */
export function transformerMetaAttributes() {
  return {
    name: "ds:meta-attributes",
    pre(node) {
      const raw = this.options.meta?.__raw ?? "";
      const title =
        raw.match(/title="([^"]*)"/)?.[1] ?? raw.match(/title='([^']*)'/)?.[1];
      if (title) node.properties["data-title"] = title;
      if (/\bshowLineNumbers=false\b/.test(raw))
        node.properties["data-line-numbers"] = "false";
    }
  };
}

/** For `markdown.shikiConfig.transformers` and Astro's <Code>. */
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
