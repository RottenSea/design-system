import assert from "node:assert/strict";
import { test } from "node:test";
import { VFile } from "vfile";
import { rehypeDsExternalLinks, rehypeDsHeadingAnchors } from "../src/markdown/links.js";

const text = (value) => ({ type: "text", value });
const element = (tagName, properties, children) => ({ type: "element", tagName, properties, children });
const root = (...children) => ({ type: "root", children });
const classes = (node) => node.properties.className;
const textOf = (node) => ("value" in node ? node.value : (node.children ?? []).map(textOf).join(""));

test("h2 to h4 get an id and a # link beside them, outside the heading", () => {
  const tree = root(
    element("h1", {}, [text("Title")]),
    element("h2", {}, [text("Getting "), element("code", {}, [text("started")])]),
    element("h5", {}, [text("Deep")])
  );
  const file = new VFile();
  rehypeDsHeadingAnchors()(tree, file);
  const [h1, wrapper, h5] = tree.children;
  assert.equal(h1.tagName, "h1");
  assert.equal(h5.tagName, "h5");
  assert.deepEqual(classes(wrapper), ["ds-heading", "ds-heading--h2"]);
  const [heading, anchor] = wrapper.children;
  assert.equal(heading.properties.id, "getting-started");
  // The heading keeps only its own text, so the table of contents does too.
  assert.equal(textOf(heading), "Getting started");
  assert.equal(anchor.properties.href, "#getting-started");
  assert.equal(textOf(anchor), "#Link to section: Getting started");
  assert.equal(file.data.astro.headings[1].slug, "getting-started");
});

test("an id the author set is kept", () => {
  const tree = root(element("h2", { id: "custom" }, [text("Heading")]));
  rehypeDsHeadingAnchors()(tree, new VFile());
  assert.equal(tree.children[0].children[1].properties.href, "#custom");
});

test("links to other sites open in a new tab, with a hidden note", () => {
  const tree = root(
    element("p", {}, [
      element("a", { href: "https://astro.build" }, [text("Astro")]),
      element("a", { href: "/about" }, [text("About")]),
      element("a", { href: "mailto:a@example.com" }, [text("Mail")]),
      element("a", { href: "https://rottenth.cafe/blog" }, [text("Own")]),
      element("a", { href: "https://example.com/a.zip", download: "" }, [text("Zip")])
    ])
  );
  rehypeDsExternalLinks({ site: "https://rottenth.cafe" })(tree);
  const [astro, about, mail, own, zip] = tree.children[0].children;
  assert.equal(astro.properties.target, "_blank");
  assert.deepEqual(astro.properties.rel, ["noreferrer"]);
  assert.deepEqual(classes(astro), ["ds-external"]);
  assert.equal(textOf(astro), "Astro (opens in a new tab)");
  for (const link of [about, mail, own, zip]) assert.equal(link.properties.target, undefined);
});
