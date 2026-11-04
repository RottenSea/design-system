// `components` is the map for an MDX page's <Content>, and also replaces Markdown's <pre>, tables
// and images. Page shell components are exported by name only.
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
import Comments from "./content/Comments.astro";
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
import PostLicense from "./content/PostLicense.astro";
import PostMeta from "./content/PostMeta.astro";
import PostNav from "./content/PostNav.astro";
import PostShare from "./content/PostShare.astro";
import SharePoster from "./content/SharePoster.astro";
import Spoiler from "./content/Spoiler.astro";
import StatList from "./content/StatList.astro";
import Step from "./content/Step.astro";
import Steps from "./content/Steps.astro";
import TableScroll from "./content/TableScroll.astro";
import TocList from "./content/TocList.astro";
import ViewCount from "./content/ViewCount.astro";
import Dialog from "./feedback/Dialog.astro";
import Snackbar from "./feedback/Snackbar.astro";
import Tooltip from "./feedback/Tooltip.astro";
import SegmentedControl from "./forms/SegmentedControl.astro";
import Switch from "./forms/Switch.astro";
import Fonts from "./head/Fonts.astro";
import ThemeScript from "./head/ThemeScript.astro";
import ContentGrid from "./layout/ContentGrid.astro";
import DotGlobe from "./layout/DotGlobe.astro";
import FloatingControls from "./layout/FloatingControls.astro";
import Footer from "./layout/Footer.astro";
import MenuPanel from "./layout/MenuPanel.astro";
import NavDrawer from "./layout/NavDrawer.astro";
import QuoteBand from "./layout/QuoteBand.astro";
import SearchPanel from "./layout/SearchPanel.astro";
import SettingsMenu from "./layout/SettingsMenu.astro";
import SkipLink from "./layout/SkipLink.astro";
import Starfield from "./layout/Starfield.astro";
import ThemeToggle from "./layout/ThemeToggle.astro";
import TocButton from "./layout/TocButton.astro";
import TopNav from "./layout/TopNav.astro";
import Avatar from "./media/Avatar.astro";
import Figure from "./media/Figure.astro";
import GitHubCard from "./media/GitHubCard.astro";
import ImageGrid from "./media/ImageGrid.astro";
import MarkdownImage from "./media/MarkdownImage.astro";
import VideoEmbed from "./media/VideoEmbed.astro";
import TagList from "./tags/TagList.astro";

export {
  Abbreviation,
  Admonition,
  ArticleListCard,
  Avatar,
  Button,
  CodeBlock,
  Comments,
  ContentGrid,
  DiagramFrame,
  Dialog,
  DotGlobe,
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
  SharePoster,
  SidebarCard,
  SkipLink,
  Snackbar,
  Spoiler,
  Starfield,
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
  VideoEmbed,
  ViewCount
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
