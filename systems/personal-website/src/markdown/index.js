// Turns the directive shorthand in MDX posts into this system's components:
//
//   :::tip[Title]      → <Admonition variant="tip" title="Title">
//   :::details[Title]{open}
//   :::spoiler         → <Spoiler variant="block">
//   :::steps{current=1} with an ordered list inside → <Steps> and one <Step> per item
//   :spoiler[words]    → <Spoiler>
//   :term[SSR]{note="Server-Side Rendering"} → <Abbreviation term="...">
//
// It is plain JavaScript because a site's Astro config imports it straight from node_modules,
// where Node does not strip TypeScript. The components it names must be passed to the page,
// for example with `components` from "../components/index.js".
import remarkDirective from "remark-directive";
import { toString as textOf } from "mdast-util-to-string";

const CALLOUTS = new Set(["note", "tip", "important", "warning", "caution", "details"]);

/** An MDX JSX attribute. A null value is a boolean attribute such as `open`. */
const attribute = (name, value) => ({ type: "mdxJsxAttribute", name, value });

/** remark-directive puts `[label]` first, as a paragraph marked with data.directiveLabel. */
function takeLabel(node) {
  const [first] = node.children;
  if (first?.type === "paragraph" && first.data?.directiveLabel) {
    node.children.shift();
    return first;
  }
  return undefined;
}

function admonition(node) {
  const label = takeLabel(node);
  const attributes = [attribute("variant", node.name)];
  if (label) attributes.push(attribute("title", textOf(label)));
  if (node.name === "details" && node.attributes && "open" in node.attributes) {
    attributes.push(attribute("open", null));
  }
  return { type: "mdxJsxFlowElement", name: "Admonition", attributes, children: node.children };
}

function blockSpoiler(node) {
  takeLabel(node);
  return {
    type: "mdxJsxFlowElement",
    name: "Spoiler",
    attributes: [attribute("variant", "block")],
    children: node.children
  };
}

function steps(node, file) {
  takeLabel(node);
  const list = node.children.find((child) => child.type === "list" && child.ordered);
  if (!list) {
    file.message(":::steps needs an ordered list inside it", node);
    return { type: "mdxJsxFlowElement", name: "Steps", attributes: [], children: node.children };
  }
  const current = node.attributes?.current;
  const currentIndex = current === undefined || current === null ? undefined : Number(current);
  const items = list.children.map((item, index) => {
    const [title, ...body] = item.children;
    let status = "todo";
    if (currentIndex !== undefined && !Number.isNaN(currentIndex)) {
      status = index < currentIndex ? "done" : index === currentIndex ? "current" : "todo";
    }
    // The first paragraph is the title; it goes in the title slot so it keeps links and code.
    const titleSlot = {
      type: "mdxJsxFlowElement",
      name: "div",
      attributes: [attribute("slot", "title")],
      children: title ? [title] : []
    };
    return {
      type: "mdxJsxFlowElement",
      name: "Step",
      attributes: [attribute("status", status)],
      children: [titleSlot, ...body]
    };
  });
  return { type: "mdxJsxFlowElement", name: "Steps", attributes: [], children: items };
}

function inlineSpoiler(node) {
  return { type: "mdxJsxTextElement", name: "Spoiler", attributes: [], children: node.children };
}

function term(node, file) {
  const note = node.attributes?.note;
  if (!note) file.message(':term needs a note, as in :term[SSR]{note="Server-Side Rendering"}', node);
  return {
    type: "mdxJsxTextElement",
    name: "Abbreviation",
    attributes: [attribute("term", note ?? "")],
    children: node.children
  };
}

const HANDLERS = {
  containerDirective: (node, file) => {
    if (CALLOUTS.has(node.name)) return admonition(node);
    if (node.name === "spoiler") return blockSpoiler(node);
    if (node.name === "steps") return steps(node, file);
    return undefined;
  },
  textDirective: (node, file) => {
    if (node.name === "spoiler") return inlineSpoiler(node);
    if (node.name === "term") return term(node, file);
    return undefined;
  },
  leafDirective: () => undefined
};

const PREFIX = { containerDirective: ":::", leafDirective: "::", textDirective: ":" };

/**
 * A directive this plugin does not know. remark-directive reads any ASCII colon followed by a
 * letter as one, so ordinary text such as `note:abc` would otherwise vanish. The original text
 * is put back and a warning names it.
 */
function restore(node, file) {
  // Times such as 10:30 parse as a directive named 30; those are never meant as one.
  if (/^[a-z]/i.test(node.name)) {
    file.message(`Unknown directive ${PREFIX[node.type]}${node.name}; kept as text`, node);
  }
  const { start, end } = node.position ?? {};
  const source =
    start && end ? String(file.value).slice(start.offset, end.offset) : `${PREFIX[node.type]}${node.name}`;
  if (node.type === "textDirective") return { type: "text", value: source };
  if (node.type === "leafDirective") {
    return { type: "paragraph", children: [{ type: "text", value: source }] };
  }
  // An unknown container keeps its content, without the fences.
  takeLabel(node);
  return node.children;
}

/** Rewrites the tree from the leaves up, so directives nested in others are handled first. */
function transform(node, file) {
  if (Array.isArray(node.children)) {
    node.children = node.children.flatMap((child) => transform(child, file));
  }
  const handler = HANDLERS[node.type];
  if (!handler) return [node];
  const result = handler(node, file) ?? restore(node, file);
  return Array.isArray(result) ? result : [result];
}

/**
 * The remark plugin. It also turns on remark-directive's parser, so a site adds only this one.
 * @this {import("unified").Processor}
 */
export function remarkDsDirectives() {
  remarkDirective.call(this);
  return (tree, file) => {
    transform(tree, file);
  };
}

export { shikiTransformers, transformerMetaAttributes } from "./shiki.js";
