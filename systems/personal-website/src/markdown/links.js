// Rehype plugins for the links in a post: an anchor beside each heading, and a mark and a new tab
// for links to other sites. They write class names that content.css styles. Plain JavaScript for
// the same reason as index.js: a site's astro.config imports it.
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
 * Puts a link to each h2, h3 and h4 beside it: a "#" that shows when the reader points at the
 * heading or tabs to the link, and always on a touch screen. The heading and its link sit in a
 * div.ds-heading, with the link outside the heading, so the link's text joins neither the
 * heading's accessible name nor the table of contents Astro collects.
 *
 * It gives the headings their ids first with Astro's own rehypeHeadingIds, which Astro would
 * otherwise run only after the site's plugins; Astro's later run keeps the ids.
 * @param {{ levels?: number[], label?: string }} [options] `label` comes before the heading's
 *   text in the link's name for screen readers.
 */
export function rehypeDsHeadingAnchors({ levels = [2, 3, 4], label = "Link to section:" } = {}) {
  const addIds = rehypeHeadingIds();
  return (tree, file) => {
    addIds(tree, file);
    visit(tree, "element", (node, index, parent) => {
      const level = Number(/^h([1-6])$/.exec(node.tagName)?.[1]);
      if (!levels.includes(level) || !parent || index === undefined) return;
      const id = node.properties?.id;
      if (typeof id !== "string") return;
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

/**
 * Opens links to other sites in a new tab, marks them with an arrow that content.css draws, and
 * adds a visually hidden note after the link text so screen reader users know (WCAG technique
 * G201). Only web addresses count: mailto: and tel: open an app, not a page. A link that already
 * has a target or a download attribute is left alone.
 * @param {{ site?: string, note?: string }} [options] `site` is the site's own address, whose
 *   links stay internal; `note` is the hidden note.
 */
export function rehypeDsExternalLinks({ site, note = " (opens in a new tab)" } = {}) {
  const own = site ? new URL(site).host : undefined;
  return (tree) => {
    visit(tree, "element", (node) => {
      if (node.tagName !== "a") return;
      const href = String(node.properties?.href ?? "");
      if (!WEB.test(href) || node.properties.target || node.properties.download != null) return;
      if (own && new URL(href, "https://example.invalid").host === own) return;
      node.properties.target = "_blank";
      node.properties.rel = ["noreferrer"];
      node.properties.className = [...(node.properties.className ?? []), "ds-external"];
      node.children.push(hidden(note));
    });
  };
}
