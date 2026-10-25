import { type DefaultTheme, defineConfig } from "vitepress";

// Pages under /<locale>/spec/, in reading order, as [slug, English title, Chinese title].
const specPages = [
  ["", "Overview", "概览"],
  ["structure", "Structure", "结构"],
  ["tokens", "Tokens", "Token"],
  ["themes", "Themes", "主题"],
  ["components", "Components", "组件"],
  ["guidelines", "Guidelines", "准则"],
  ["accessibility", "Accessibility", "无障碍"],
  ["versioning", "Versioning", "版本"],
  ["writing", "Writing", "写作"],
] as const;

function specSidebar(locale: "en" | "zh", heading: string): DefaultTheme.SidebarItem[] {
  return [
    {
      text: heading,
      items: specPages.map(([slug, en, zh]) => ({ text: locale === "en" ? en : zh, link: `/${locale}/spec/${slug}` })),
    },
  ];
}

// Every locale lives in its own directory. The root index.md only redirects to /en/,
// because VitePress has no root locale here and GitHub Pages cannot redirect on the server.
export default defineConfig({
  title: "Design Systems",
  base: "/design-system/",
  cleanUrls: true,
  locales: {
    en: {
      label: "English",
      lang: "en",
      link: "/en/",
      description: "Documentation for RottenSea's design systems.",
      themeConfig: {
        nav: [{ text: "Docs spec", link: "/en/spec/" }],
        sidebar: { "/en/spec/": specSidebar("en", "Docs spec") },
      },
    },
    zh: {
      label: "简体中文",
      lang: "zh-CN",
      link: "/zh/",
      description: "RottenSea 的 design system 文档。",
      themeConfig: {
        nav: [{ text: "文档规范", link: "/zh/spec/" }],
        sidebar: { "/zh/spec/": specSidebar("zh", "文档规范") },
      },
    },
  },
  themeConfig: {
    socialLinks: [{ icon: "github", link: "https://github.com/RottenSea/design-system" }],
  },
});
