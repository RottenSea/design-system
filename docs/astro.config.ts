import starlight from "@astrojs/starlight";
import { defineConfig } from "astro/config";

// Pages under /<locale>/spec/, in reading order.
const specPages = [
  ["", "Overview", "概览"],
  ["structure", "Structure", "结构"],
  ["tokens", "Tokens", "Token"],
  ["themes", "Themes", "主题"],
  ["components", "Components", "组件"],
  ["guidelines", "Guidelines", "准则"],
  ["accessibility", "Accessibility", "无障碍"],
  ["versioning", "Versioning", "版本"],
  ["writing", "Writing", "写作"]
] as const;

// Served from GitHub Pages at rottensea.github.io/design-system. Every language has its own
// folder in src/content/docs/, so there is no page at the root; it redirects to English.
export default defineConfig({
  site: "https://rottensea.github.io",
  base: "/design-system",
  redirects: { "/": "/design-system/en/" },
  integrations: [
    starlight({
      title: "Design Systems",
      defaultLocale: "en",
      locales: {
        en: { label: "English" },
        zh: { label: "简体中文", lang: "zh-CN" }
      },
      social: [
        {
          icon: "github",
          label: "GitHub",
          href: "https://github.com/RottenSea/design-system"
        }
      ],
      sidebar: [
        {
          label: "Docs spec",
          translations: { "zh-CN": "文档规范" },
          items: specPages.map(([slug, en, zh]) => ({
            label: en,
            translations: { "zh-CN": zh },
            // Pages build to folders, so their URLs end in a slash.
            link: slug ? `/spec/${slug}/` : "/spec/"
          }))
        }
      ]
    })
  ]
});
