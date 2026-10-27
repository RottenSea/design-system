import assert from "node:assert/strict";
import { test } from "node:test";
import remarkMdx from "remark-mdx";
import remarkParse from "remark-parse";
import { unified } from "unified";
import { VFile } from "vfile";
import { remarkDsDirectives } from "../src/markdown/index.js";

/** Parses MDX the way a site does and returns the transformed tree and the file's warnings. */
function run(source) {
  const processor = unified().use(remarkParse).use(remarkMdx).use(remarkDsDirectives);
  const file = new VFile(source);
  const tree = processor.runSync(processor.parse(file), file);
  return { tree, messages: file.messages.map(String) };
}

/** The attributes of an MDX JSX node as a plain object; a boolean attribute reads as true. */
const attrs = (node) => Object.fromEntries(node.attributes.map((a) => [a.name, a.value ?? true]));

const text = (node) =>
  "value" in node ? node.value : (node.children ?? []).map(text).join("");

test(":::tip becomes an Admonition with its title", () => {
  const { tree } = run(":::tip[Be careful]\nBody text.\n:::\n");
  const [node] = tree.children;
  assert.equal(node.type, "mdxJsxFlowElement");
  assert.equal(node.name, "Admonition");
  assert.deepEqual(attrs(node), { variant: "tip", title: "Be careful" });
  assert.equal(text(node), "Body text.");
});

test(":::details{open} keeps the open flag", () => {
  const { tree } = run(":::details[More]{open}\nHidden.\n:::\n");
  assert.deepEqual(attrs(tree.children[0]), { variant: "details", title: "More", open: true });
});

test(":::spoiler becomes a block Spoiler and :spoiler an inline one", () => {
  const { tree } = run(":::spoiler\nThe answer.\n:::\n\nIt was :spoiler[the butler].\n");
  assert.equal(tree.children[0].name, "Spoiler");
  assert.deepEqual(attrs(tree.children[0]), { variant: "block" });
  const inline = tree.children[1].children.find((n) => n.type === "mdxJsxTextElement");
  assert.equal(inline.name, "Spoiler");
  assert.equal(text(inline), "the butler");
});

test(":term becomes an Abbreviation with the note as its term", () => {
  const { tree } = run('Rendered on the server, :term[SSR]{note="Server-Side Rendering"}.\n');
  const node = tree.children[0].children.find((n) => n.type === "mdxJsxTextElement");
  assert.equal(node.name, "Abbreviation");
  assert.deepEqual(attrs(node), { term: "Server-Side Rendering" });
  assert.equal(text(node), "SSR");
});

test(":::steps turns each list item into a Step with a title slot and a status", () => {
  const { tree } = run(":::steps{current=1}\n1. First\n\n   Detail.\n\n2. Second\n3. Third\n:::\n");
  const [list] = tree.children;
  assert.equal(list.name, "Steps");
  assert.deepEqual(
    list.children.map((step) => attrs(step).status),
    ["done", "current", "todo"]
  );
  const [first] = list.children;
  assert.equal(first.children[0].name, "div");
  assert.deepEqual(attrs(first.children[0]), { slot: "title" });
  assert.equal(text(first.children[0]), "First");
  assert.equal(text(first.children[1]), "Detail.");
});

test("directives nest: a spoiler inside a tip is handled too", () => {
  const { tree } = run(":::tip\nIt was :spoiler[him].\n:::\n");
  const inline = tree.children[0].children[0].children.find((n) => n.type === "mdxJsxTextElement");
  assert.equal(inline.name, "Spoiler");
});

test("an unknown directive is kept as text, with a warning", () => {
  const { tree, messages } = run("Sent at 10:30, see note:abc for details.\n");
  assert.equal(text(tree.children[0]), "Sent at 10:30, see note:abc for details.");
  assert.equal(messages.length, 1);
  assert.match(messages[0], /Unknown directive :abc/);
});
