import { visit } from "unist-util-visit";

/** Elements that end a task's own text: a nested list or a block in a loose item. */
const BLOCKS = new Set([
  "ul",
  "ol",
  "p",
  "div",
  "pre",
  "blockquote",
  "table",
  "figure"
]);

const isCheckbox = (node) =>
  node?.type === "element" &&
  node.tagName === "input" &&
  node.properties?.type === "checkbox";

/** GFM writes the checkbox first in the item, or first in its paragraph when the list is loose. */
export function rehypeDsTaskLists() {
  return (tree) => {
    visit(tree, "element", (node) => {
      if (node.tagName !== "li" && node.tagName !== "p") return;
      const first = node.children.findIndex(
        (child) => child.type !== "text" || child.value.trim()
      );
      if (!isCheckbox(node.children[first])) return;
      const end = node.children.findIndex(
        (child, index) =>
          index > first && child.type === "element" && BLOCKS.has(child.tagName)
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
