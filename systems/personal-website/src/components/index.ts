// Every component, for passing to an MDX page at once:
//   import { components } from "@rottensea/ds-personal-website/components";
//   <Content components={components} />
// The map also replaces the <pre> of code fences and Markdown tables, so a post's plain Markdown
// gets the system's code blocks and scrolling tables too.
// The Markdown directives in ../markdown/index.js write these names. This file is TypeScript
// so pages get the components' prop types; pages are compiled by Vite, which handles it.
import CodeBlock from "./code/CodeBlock.astro";
import FileTree from "./code/FileTree.astro";
import FileTreeNode from "./code/FileTreeNode.astro";
import MarkdownCode from "./code/MarkdownCode.astro";
import Abbreviation from "./content/Abbreviation.astro";
import Admonition from "./content/Admonition.astro";
import MarkdownTable from "./content/MarkdownTable.astro";
import Option from "./content/Option.astro";
import OptionGroup from "./content/OptionGroup.astro";
import Spoiler from "./content/Spoiler.astro";
import Step from "./content/Step.astro";
import Steps from "./content/Steps.astro";
import TableScroll from "./content/TableScroll.astro";
import Tooltip from "./feedback/Tooltip.astro";

export {
  Abbreviation,
  Admonition,
  CodeBlock,
  FileTree,
  FileTreeNode,
  MarkdownCode,
  MarkdownTable,
  Option,
  OptionGroup,
  Spoiler,
  Step,
  Steps,
  TableScroll,
  Tooltip
};

export const components = {
  Abbreviation,
  Admonition,
  CodeBlock,
  FileTree,
  FileTreeNode,
  Option,
  OptionGroup,
  Spoiler,
  Step,
  Steps,
  TableScroll,
  Tooltip,
  pre: MarkdownCode,
  table: MarkdownTable
};
