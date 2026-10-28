// Turns the directive shorthand in MDX posts into this system's components:
//
//   :::tip[Title]      → <Admonition variant="tip" title="Title">
//   :::details[Title]{open}
//   :::spoiler         → <Spoiler variant="block">
//   :::steps{current=1} with an ordered list inside → <Steps> and one <Step> per item
//   :::code-group{sync="pkg"} with code fences inside → <OptionGroup> and one <Option> per fence
//   :::file-tree{label="Your project"} with a nested list inside → <FileTree> of <FileTreeNode>
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

/** A container's label: the `label` attribute, or the `[label]` after the name. */
function groupLabel(node) {
  const label = takeLabel(node);
  return node.attributes?.label ?? (label ? textOf(label) : undefined);
}

/** The `title="..."` of a code fence's meta, and the meta without it. */
function takeTitle(meta) {
  const match = meta?.match(/(?:^|\s)title=(?:"([^"]*)"|'([^']*)')/);
  if (!match) return { title: undefined, meta };
  const rest = meta.replace(match[0], "").trim();
  return { title: match[1] ?? match[2], meta: rest || null };
}

/**
 * Each code fence starts an option, labelled with the fence's title (or its language); anything
 * between two fences belongs to the option above it. The title moves to the switch, so the code
 * block's bar does not repeat it.
 */
function codeGroup(node, file) {
  const label = groupLabel(node);
  const before = [];
  const options = [];
  for (const child of node.children) {
    if (child.type === "code") {
      const { title, meta } = takeTitle(child.meta);
      child.meta = meta;
      const optionLabel = title ?? child.lang ?? `Option ${options.length + 1}`;
      options.push({
        type: "mdxJsxFlowElement",
        name: "Option",
        attributes: [attribute("label", optionLabel)],
        children: [child]
      });
    } else if (options.length) {
      options.at(-1).children.push(child);
    } else {
      before.push(child);
    }
  }
  if (!options.length) {
    file.message(":::code-group needs at least one code fence inside it", node);
    return node.children;
  }
  if (before.length) {
    file.message(":::code-group should start with a code fence; the text before it stays above the group", node);
  }
  const attributes = [];
  if (node.attributes?.sync) attributes.push(attribute("syncKey", node.attributes.sync));
  if (label) attributes.push(attribute("label", label));
  return [...before, { type: "mdxJsxFlowElement", name: "OptionGroup", attributes, children: options }];
}

/** The source text of a node, so a file name such as __init__.py is not read as emphasis. */
function sourceOf(node, file) {
  const { start, end } = node.position ?? {};
  return start && end ? String(file.value).slice(start.offset, end.offset) : textOf(node);
}

/**
 * One FileTreeNode per list item. The item's first line is the name, and text two or more
 * spaces after it is the hint. A name ending in / is a folder; so is an item with a list
 * inside, which holds its contents and starts open.
 */
function fileTreeNodes(list, depth, file) {
  return list.children.map((item) => {
    const [first, ...rest] = item.children;
    const line = first?.type === "paragraph" ? sourceOf(first, file).trim() : "";
    const [, rawName = "", hint] = line.match(/^(.*?)(?:\s{2,}(.*))?$/) ?? [];
    const inner = rest.find((child) => child.type === "list");
    const attributes = [attribute("name", rawName.replace(/\/$/, "")), attribute("depth", String(depth))];
    if (rawName.endsWith("/") || inner) attributes.push(attribute("folder", null));
    if (inner) attributes.push(attribute("open", null));
    if (hint) attributes.push(attribute("hint", hint));
    return {
      type: "mdxJsxFlowElement",
      name: "FileTreeNode",
      attributes,
      children: inner ? fileTreeNodes(inner, depth + 1, file) : []
    };
  });
}

function fileTree(node, file) {
  const label = groupLabel(node);
  const list = node.children.find((child) => child.type === "list");
  if (!list) {
    file.message(":::file-tree needs a list inside it", node);
    return node.children;
  }
  return {
    type: "mdxJsxFlowElement",
    name: "FileTree",
    attributes: label ? [attribute("label", label)] : [],
    children: fileTreeNodes(list, 0, file)
  };
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
    if (node.name === "code-group") return codeGroup(node, file);
    if (node.name === "file-tree") return fileTree(node, file);
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
