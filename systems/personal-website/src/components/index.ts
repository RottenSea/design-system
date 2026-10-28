// Every component, for passing to an MDX page at once:
//   import { components } from "@rottensea/ds-personal-website/components";
//   <Content components={components} />
// The map also replaces the <pre> of code fences, Markdown tables and images, so a post's plain
// Markdown gets the system's code blocks, scrolling tables and figures too.
// The Markdown directives in ../markdown/index.js write these names. This file is TypeScript
// so pages get the components' prop types; pages are compiled by Vite, which handles it.
import CodeBlock from "./code/CodeBlock.astro";
import FileTree from "./code/FileTree.astro";
import FileTreeNode from "./code/FileTreeNode.astro";
import MarkdownCode from "./code/MarkdownCode.astro";
import Abbreviation from "./content/Abbreviation.astro";
import Admonition from "./content/Admonition.astro";
import DiagramFrame from "./content/DiagramFrame.astro";
import Field from "./content/Field.astro";
import Fields from "./content/Fields.astro";
import MarkdownTable from "./content/MarkdownTable.astro";
import MathBlock from "./content/MathBlock.astro";
import Mermaid from "./content/Mermaid.astro";
import Option from "./content/Option.astro";
import OptionGroup from "./content/OptionGroup.astro";
import Spoiler from "./content/Spoiler.astro";
import Step from "./content/Step.astro";
import Steps from "./content/Steps.astro";
import TableScroll from "./content/TableScroll.astro";
import Tooltip from "./feedback/Tooltip.astro";
import Fonts from "./head/Fonts.astro";
import Figure from "./media/Figure.astro";
import GitHubCard from "./media/GitHubCard.astro";
import ImageGrid from "./media/ImageGrid.astro";
import MarkdownImage from "./media/MarkdownImage.astro";
import VideoEmbed from "./media/VideoEmbed.astro";

export {
  Abbreviation,
  Admonition,
  CodeBlock,
  DiagramFrame,
  Field,
  Fields,
  Figure,
  FileTree,
  FileTreeNode,
  Fonts,
  GitHubCard,
  ImageGrid,
  MarkdownCode,
  MarkdownImage,
  MarkdownTable,
  MathBlock,
  Mermaid,
  Option,
  OptionGroup,
  Spoiler,
  Step,
  Steps,
  TableScroll,
  Tooltip,
  VideoEmbed
};

export const components = {
  Abbreviation,
  Admonition,
  CodeBlock,
  DiagramFrame,
  Field,
  Fields,
  Figure,
  FileTree,
  FileTreeNode,
  GitHubCard,
  ImageGrid,
  MathBlock,
  Mermaid,
  Option,
  OptionGroup,
  Spoiler,
  Step,
  Steps,
  TableScroll,
  Tooltip,
  VideoEmbed,
  img: MarkdownImage,
  pre: MarkdownCode,
  table: MarkdownTable
};
