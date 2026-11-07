import { rehypeHeadingIds } from "@astrojs/markdown-remark";
import { toString as textOf } from "mdast-util-to-string";
import { SKIP, visit } from "unist-util-visit";

const hidden = (value) => ({
  type: "element",
  tagName: "span",
  properties: { className: ["ds-visually-hidden"] },
  children: [{ type: "text", value }]
});

/**
 * The link sits beside the heading, not in it, so its text joins neither the heading's name nor
 * Astro's table of contents. Astro runs rehypeHeadingIds only after the site's plugins, so it runs
 * here first; Astro's later run keeps the ids.
 * @param {{ levels?: number[], label?: string }} [options]
 */
export function rehypeDsHeadingAnchors({
  levels = [2, 3, 4],
  label = "Link to section:"
} = {}) {
  const addIds = rehypeHeadingIds();
  return (tree, file) => {
    addIds(tree, file);
    visit(tree, "element", (node, index, parent) => {
      const level = Number(/^h([1-6])$/.exec(node.tagName)?.[1]);
      if (!levels.includes(level) || !parent || index === undefined) return;
      const id = node.properties?.id;
      if (typeof id !== "string") return;
      // A heading only screen readers see, such as the label GFM gives the footnotes, would show
      // its link with nothing beside it.
      const classes = node.properties?.className ?? [];
      if (classes.includes("sr-only") || classes.includes("ds-visually-hidden"))
        return;
      const anchor = {
        type: "element",
        tagName: "a",
        properties: { className: ["ds-heading__anchor"], href: `#${id}` },
        children: [
          {
            type: "element",
            tagName: "span",
            properties: { ariaHidden: "true" },
            children: [{ type: "text", value: "#" }]
          },
          hidden(`${label} ${textOf(node)}`)
        ]
      };
      parent.children[index] = {
        type: "element",
        tagName: "div",
        properties: { className: ["ds-heading", `ds-heading--h${level}`] },
        children: [node, anchor]
      };
      return [SKIP, index + 1];
    });
  };
}

const WEB = /^(?:https?:)?\/\//i;

/** The address's host, or undefined with a warning when it is not a valid address. */
function hostOf(href, node, file) {
  try {
    return new URL(href, "https://example.invalid").host;
  } catch {
    file?.message(`${href} is not a valid address`, node);
    return undefined;
  }
}

/**
 * Only web addresses count, since mailto: and tel: open an app. A link with its own target or
 * download attribute is left alone.
 * @param {{ site?: string, note?: string }} [options]
 */
export function rehypeDsExternalLinks({
  site,
  note = " (opens in a new tab)"
} = {}) {
  const own = site ? new URL(site).host : undefined;
  return (tree, file) => {
    visit(tree, "element", (node) => {
      if (node.tagName !== "a") return;
      const href = String(node.properties?.href ?? "");
      if (
        !WEB.test(href) ||
        node.properties.target ||
        node.properties.download != null
      )
        return;
      if (own && hostOf(href, node, file) === own) return;
      node.properties.target = "_blank";
      node.properties.rel = ["noreferrer"];
      node.properties.className = [
        ...(node.properties.className ?? []),
        "ds-external"
      ];
      node.children.push(hidden(note));
    });
  };
}
