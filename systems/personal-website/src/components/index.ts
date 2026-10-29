// Every component, for passing to an MDX page at once:
//   import { components } from "@rottensea/ds-personal-website/components";
//   <Content components={components} />
// The map also replaces the <pre> of code fences, Markdown tables and images, so a post's plain
// Markdown gets the system's code blocks, scrolling tables and figures too.
// The page shell (TopNav, ContentGrid, Footer and the rest) is exported by name only: a post has
// no use for it. The Markdown directives in ../markdown/index.js write these names. This file is TypeScript
// so pages get the components' prop types; pages are compiled by Vite, which handles it.
import Button from "./buttons/Button.astro";
import IconButton from "./buttons/IconButton.astro";
import ArticleListCard from "./cards/ArticleListCard.astro";
import SidebarCard from "./cards/SidebarCard.astro";
import Surface from "./cards/Surface.astro";
import CodeBlock from "./code/CodeBlock.astro";
import FileTree from "./code/FileTree.astro";
import FileTreeNode from "./code/FileTreeNode.astro";
import MarkdownCode from "./code/MarkdownCode.astro";
import Abbreviation from "./content/Abbreviation.astro";
import Admonition from "./content/Admonition.astro";
import DiagramFrame from "./content/DiagramFrame.astro";
import Field from "./content/Field.astro";
import Fields from "./content/Fields.astro";
import FilterList from "./content/FilterList.astro";
import MarkdownTable from "./content/MarkdownTable.astro";
import MathBlock from "./content/MathBlock.astro";
import Mermaid from "./content/Mermaid.astro";
import MiniCalendar from "./content/MiniCalendar.astro";
import Option from "./content/Option.astro";
import OptionGroup from "./content/OptionGroup.astro";
import Pagination from "./content/Pagination.astro";
import PostMeta from "./content/PostMeta.astro";
import Spoiler from "./content/Spoiler.astro";
import StatList from "./content/StatList.astro";
import Step from "./content/Step.astro";
import Steps from "./content/Steps.astro";
import PostLicense from "./content/PostLicense.astro";
import PostNav from "./content/PostNav.astro";
import PostShare from "./content/PostShare.astro";
import TableScroll from "./content/TableScroll.astro";
import TocList from "./content/TocList.astro";
import Dialog from "./feedback/Dialog.astro";
import Snackbar from "./feedback/Snackbar.astro";
import Tooltip from "./feedback/Tooltip.astro";
import SegmentedControl from "./forms/SegmentedControl.astro";
import Switch from "./forms/Switch.astro";
import Fonts from "./head/Fonts.astro";
import ThemeScript from "./head/ThemeScript.astro";
import ContentGrid from "./layout/ContentGrid.astro";
import FloatingControls from "./layout/FloatingControls.astro";
import Footer from "./layout/Footer.astro";
import MenuPanel from "./layout/MenuPanel.astro";
import NavDrawer from "./layout/NavDrawer.astro";
import QuoteBand from "./layout/QuoteBand.astro";
import SearchPanel from "./layout/SearchPanel.astro";
import SettingsMenu from "./layout/SettingsMenu.astro";
import SkipLink from "./layout/SkipLink.astro";
import ThemeToggle from "./layout/ThemeToggle.astro";
import TocButton from "./layout/TocButton.astro";
import TopNav from "./layout/TopNav.astro";
import TagList from "./tags/TagList.astro";
import Avatar from "./media/Avatar.astro";
import Figure from "./media/Figure.astro";
import GitHubCard from "./media/GitHubCard.astro";
import ImageGrid from "./media/ImageGrid.astro";
import MarkdownImage from "./media/MarkdownImage.astro";
import VideoEmbed from "./media/VideoEmbed.astro";

export {
  Abbreviation,
  Admonition,
  ArticleListCard,
  Avatar,
  Button,
  CodeBlock,
  ContentGrid,
  DiagramFrame,
  Dialog,
  Field,
  Fields,
  Figure,
  FileTree,
  FileTreeNode,
  FilterList,
  FloatingControls,
  Fonts,
  Footer,
  GitHubCard,
  IconButton,
  ImageGrid,
  MarkdownCode,
  MarkdownImage,
  MarkdownTable,
  MathBlock,
  MenuPanel,
  Mermaid,
  MiniCalendar,
  NavDrawer,
  Option,
  OptionGroup,
  Pagination,
  PostLicense,
  PostMeta,
  PostNav,
  PostShare,
  QuoteBand,
  SearchPanel,
  SegmentedControl,
  SettingsMenu,
  SidebarCard,
  SkipLink,
  Snackbar,
  Spoiler,
  StatList,
  Step,
  Steps,
  Surface,
  Switch,
  TableScroll,
  TagList,
  ThemeScript,
  ThemeToggle,
  TocButton,
  TocList,
  Tooltip,
  TopNav,
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
