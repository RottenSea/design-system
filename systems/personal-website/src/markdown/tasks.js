// A rehype plugin for task lists (- [ ] and - [x]). Plain JavaScript for the same reason as
// index.js: a site's astro.config imports it.
import { visit } from "unist-util-visit";

/** Elements that end a task's own text: a nested list or a block in a loose item. */
const BLOCKS = new Set(["ul", "ol", "p", "div", "pre", "blockquote", "table", "figure"]);

const isCheckbox = (node) =>
  node?.type === "element" && node.tagName === "input" && node.properties?.type === "checkbox";

/**
 * Puts each task's checkbox and the text after it in a <label>, so the checkbox is named by its
 * task instead of having no name at all. GFM writes the checkbox first in the list item, or first
 * in its paragraph when the list is loose; a nested list after the text stays outside the label.
 */
export function rehypeDsTaskLists() {
  return (tree) => {
    visit(tree, "element", (node) => {
      if (node.tagName !== "li" && node.tagName !== "p") return;
      const first = node.children.findIndex((child) => child.type !== "text" || child.value.trim());
      if (!isCheckbox(node.children[first])) return;
      const end = node.children.findIndex(
        (child, index) => index > first && child.type === "element" && BLOCKS.has(child.tagName)
      );
      const stop = end < 0 ? node.children.length : end;
      const label = {
        type: "element",
        tagName: "label",
        properties: {},
        children: node.children.slice(first, stop)
      };
      node.children.splice(first, stop - first, label);
    });
  };
}
