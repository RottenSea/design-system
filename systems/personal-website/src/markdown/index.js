// Turns the directive shorthand in MDX posts into this system's components:
//
//   :::tip[Title]      → <Admonition variant="tip" title="Title">
//   :::details[Title]{open}
//   :::spoiler         → <Spoiler variant="block">
//   :::steps{current=1} with an ordered list inside → <Steps> and one <Step> per item
//   :::code-group{sync="pkg"} with code fences inside → <OptionGroup> and one <Option> per fence
//   :::file-tree{label="Your project"} with a nested list inside → <FileTree> of <FileTreeNode>
//   :::gallery{columns=3 ratio="4/3"} with images inside → <ImageGrid> of figures
//   ![alt](./a.png "Caption") on a line of its own → a figure with that caption
//   ::video{src="https://www.bilibili.com/video/BV..." title="..." poster="./cover.png"} → <VideoEmbed>
//   $E = mc^2$ and $$...$$                → <MathBlock> holding MathML typeset by KaTeX
//   ```mermaid                             → <Mermaid>, drawn in the browser
//   :spoiler[words]    → <Spoiler>
//   :term[SSR]{note="Server-Side Rendering"} → <Abbreviation term="...">
//
// It is plain JavaScript because a site's Astro config imports it straight from node_modules,
// where Node does not strip TypeScript. The components it names must be passed to the page,
// for example with `components` from "../components/index.js".
import remarkDirective from "remark-directive";
import remarkMath from "remark-math";
import { toString as textOf } from "mdast-util-to-string";
import { videoSource } from "../components/media/video.js";
import { typesetMath } from "./math.js";

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

/**
 * Marks an image as a figure. The mark rides on the <img> into the site's `img` component,
 * MarkdownImage, which then draws a Figure with the title as its caption.
 */
function asFigure(image) {
  image.data = { ...image.data, hProperties: { ...image.data?.hProperties, dataDsFigure: true } };
  return image;
}

const isBlank = (node) => node.type === "text" && !node.value.trim();

/** A paragraph that holds only images, with nothing but line breaks between them. */
const isImageParagraph = (node) =>
  node.type === "paragraph" &&
  node.children.some((child) => child.type === "image") &&
  node.children.every((child) => child.type === "image" || child.type === "break" || isBlank(child));

/** Takes images out of the paragraphs they sit in alone, so each becomes a figure. */
function liftImages(node) {
  if (!Array.isArray(node.children)) return;
  node.children = node.children.flatMap((child) => {
    if (isImageParagraph(child)) return child.children.filter((c) => c.type === "image").map(asFigure);
    liftImages(child);
    return [child];
  });
}

/** Every image in the container becomes a tile; anything else is dropped, with a warning. */
function gallery(node, file) {
  takeLabel(node);
  const images = [];
  let dropped = false;
  for (const child of node.children) {
    if (isImageParagraph(child)) images.push(...child.children.filter((c) => c.type === "image"));
    else if (child.type === "image") images.push(child);
    else dropped = true;
  }
  if (dropped) file.message(":::gallery holds only images; other content in it was left out", node);
  const attributes = [];
  if (node.attributes?.columns) attributes.push(attribute("columns", node.attributes.columns));
  if (node.attributes?.ratio) attributes.push(attribute("ratio", node.attributes.ratio));
  return { type: "mdxJsxFlowElement", name: "ImageGrid", attributes, children: images.map(asFigure) };
}

/**
 * ::video{src title poster caption ratio}. A local poster goes in as an image, so Astro imports
 * and processes it like any image in the post; MarkdownImage draws it as the poster.
 */
function video(node, file) {
  const label = takeLabel(node);
  const { src, poster, caption, ratio } = node.attributes ?? {};
  const title = node.attributes?.title ?? (label ? textOf(label) : undefined);
  const source = src ? videoSource({ src }) : undefined;
  if (!source) {
    file.message('::video needs a src, as in ::video{src="https://www.bilibili.com/video/BV..."}', node);
    node.data = { ...node.data, dsReported: true };
    return undefined;
  }
  if (!source.provider) {
    file.message(`::video does not know the site of ${src}; it is used as the player's address`, node);
  }
  const attributes = [attribute("src", src)];
  if (title) attributes.push(attribute("title", title));
  if (caption) attributes.push(attribute("caption", caption));
  if (ratio) attributes.push(attribute("ratio", ratio));
  const children = poster
    ? [{ type: "image", url: poster, alt: "", title: null, data: { hProperties: { dataDsPoster: true } } }]
    : [];
  return { type: "mdxJsxFlowElement", name: "VideoEmbed", attributes, children };
}

/**
 * $...$ and $$...$$, typeset with KaTeX at build time as MathML only, so no KaTeX stylesheet or
 * font is needed: the browser draws MathML itself. \tag{n} becomes MathBlock's number, because
 * KaTeX puts a tag in an <mlabeledtr>, which browsers do not draw. A formula KaTeX cannot read
 * keeps its source, shown by MathBlock in the mono face, and the build warns.
 */
function math(node, display, file) {
  const tag = display ? node.value.match(/\\tag\*?\{([^}]*)\}/) : null;
  const tex = tag ? node.value.replace(tag[0], "").trim() : node.value;
  const attributes = [attribute("tex", tex)];
  if (!display) attributes.push(attribute("display", "false"));
  if (tag) attributes.push(attribute("number", tag[1]));
  try {
    attributes.push(attribute("html", typesetMath(tex, display)));
  } catch (error) {
    const fence = display ? "$$" : "$";
    file.message(`Could not typeset ${fence}${tex}${fence}: ${error.message}`, node);
  }
  return {
    type: display ? "mdxJsxFlowElement" : "mdxJsxTextElement",
    name: "MathBlock",
    attributes,
    children: []
  };
}

/**
 * A ```mermaid fence becomes a diagram, drawn in the browser. The fence's title="..." is the
 * frame's label and caption="..." its caption.
 */
function mermaid(node) {
  const meta = node.meta ?? "";
  const quoted = (name) => meta.match(new RegExp(`${name}=(?:"([^"]*)"|'([^']*)')`))?.slice(1).find(Boolean);
  const attributes = [attribute("code", node.value)];
  const label = quoted("title");
  const caption = quoted("caption");
  if (label) attributes.push(attribute("label", label));
  if (caption) attributes.push(attribute("caption", caption));
  return { type: "mdxJsxFlowElement", name: "Mermaid", attributes, children: [] };
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
    if (node.name === "gallery") return gallery(node, file);
    return undefined;
  },
  textDirective: (node, file) => {
    if (node.name === "spoiler") return inlineSpoiler(node);
    if (node.name === "term") return term(node, file);
    return undefined;
  },
  leafDirective: (node, file) => {
    if (node.name === "video") return video(node, file);
    return undefined;
  }
};

/** Markdown nodes, not directives, that become components. Anything else stays as it is. */
const NODE_HANDLERS = {
  math: (node, file) => math(node, true, file),
  inlineMath: (node, file) => math(node, false, file),
  code: (node) => (node.lang === "mermaid" ? mermaid(node) : node)
};

const PREFIX = { containerDirective: ":::", leafDirective: "::", textDirective: ":" };

/**
 * A directive this plugin does not know. remark-directive reads any ASCII colon followed by a
 * letter as one, so ordinary text such as `note:abc` would otherwise vanish. The original text
 * is put back and a warning names it. A known directive written wrongly comes here too, after
 * its handler has warned and set data.dsReported, so it is not called unknown as well.
 */
function restore(node, file) {
  // Times such as 10:30 parse as a directive named 30; those are never meant as one.
  if (/^[a-z]/i.test(node.name) && !node.data?.dsReported) {
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
  const nodeHandler = NODE_HANDLERS[node.type];
  if (nodeHandler) return [nodeHandler(node, file)];
  const handler = HANDLERS[node.type];
  if (!handler) return [node];
  const result = handler(node, file) ?? restore(node, file);
  return Array.isArray(result) ? result : [result];
}

/**
 * The remark plugin. It also turns on the parsers of remark-directive and remark-math, so a site
 * adds only this one.
 * @this {import("unified").Processor}
 */
export function remarkDsDirectives() {
  remarkDirective.call(this);
  remarkMath.call(this);
  return (tree, file) => {
    transform(tree, file);
    liftImages(tree);
  };
}

export { shikiTransformers, transformerMetaAttributes } from "./shiki.js";
export { typesetMath } from "./math.js";
