import assert from "node:assert/strict";
import { afterEach, test } from "node:test";
import remarkMdx from "remark-mdx";
import remarkParse from "remark-parse";
import { unified } from "unified";
import { VFile } from "vfile";
import { repository } from "../src/components/media/github.js";
import { remarkDsDirectives } from "../src/markdown/index.js";

function run(source) {
  const processor = unified().use(remarkParse).use(remarkMdx).use(remarkDsDirectives);
  const file = new VFile(source);
  const tree = processor.runSync(processor.parse(file), file);
  return { tree, messages: file.messages.map(String) };
}

const attrs = (node) => Object.fromEntries(node.attributes.map((a) => [a.name, a.value ?? true]));

test("::::fields turns :::field blocks into a Fields card of Field rows", () => {
  const source = [
    "::::fields[Options]",
    ':::field{name="build.format" type="\'file\' | \'directory\'" required}',
    "Whether to build `x.html` or `x/index.html`.",
    ":::",
    "",
    ':::field{name="trailingSlash" type="string" default="ignore"}',
    "How URLs end.",
    ":::",
    "::::",
    ""
  ].join("\n");
  const { tree, messages } = run(source);
  const [card] = tree.children;
  assert.equal(card.name, "Fields");
  assert.deepEqual(attrs(card), { label: "Options" });
  assert.deepEqual(
    card.children.map(attrs),
    [
      { name: "build.format", type: "'file' | 'directory'", required: true },
      { name: "trailingSlash", type: "string", default: "ignore" }
    ]
  );
  assert.equal(card.children[0].children[0].type, "paragraph");
  assert.deepEqual(messages, []);
});

test("a :::field outside ::::fields gets a card of its own, with a warning", () => {
  const { tree, messages } = run(':::field{name="a"}\nOne.\n:::\n\n:::field{name="b"}\nTwo.\n:::\n');
  assert.equal(tree.children.length, 1);
  assert.equal(tree.children[0].name, "Fields");
  assert.equal(tree.children[0].children.length, 2);
  assert.match(messages[0], /belongs inside ::::fields/);
});

test("::github becomes a GitHubCard, and a malformed repo stays text", () => {
  const { tree } = run('::github{repo="RottenSea/design-system"}\n\n::github{repo="nope"}\n');
  assert.equal(tree.children[0].name, "GitHubCard");
  assert.deepEqual(attrs(tree.children[0]), { repo: "RottenSea/design-system" });
  assert.equal(tree.children[1].type, "paragraph");
});

const realFetch = globalThis.fetch;
afterEach(() => {
  globalThis.fetch = realFetch;
});

test("repository() keeps what the card shows and asks GitHub once per repository", async () => {
  let calls = 0;
  globalThis.fetch = async () => {
    calls += 1;
    return new Response(
      JSON.stringify({
        description: "Design systems",
        language: "TypeScript",
        stargazers_count: 1234,
        forks_count: 5,
        license: { spdx_id: "MIT" },
        topics: ["astro"],
        archived: false,
        html_url: "https://github.com/a/b"
      }),
      { status: 200 }
    );
  };
  const first = await repository("test/one");
  await repository("test/one");
  assert.equal(calls, 1);
  assert.deepEqual(first, {
    description: "Design systems",
    language: "TypeScript",
    stars: 1234,
    forks: 5,
    license: "MIT",
    topics: ["astro"],
    archived: false,
    url: "https://github.com/a/b"
  });
});

test("a failed request gives undefined instead of failing the build", async () => {
  globalThis.fetch = async () => new Response("rate limited", { status: 403, statusText: "Forbidden" });
  const warn = console.warn;
  console.warn = () => {};
  try {
    assert.equal(await repository("test/limited"), undefined);
  } finally {
    console.warn = warn;
  }
});
