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
        },
        // One group per system. Entries given as a slug take their label from the page's title
        // in each language.
        {
          label: "Personal website",
          translations: { "zh-CN": "个人网站" },
          items: [
            { slug: "personal-website", label: "Overview", translations: { "zh-CN": "概览" } },
            {
              label: "Components",
              translations: { "zh-CN": "组件" },
              items: [
                {
                  slug: "personal-website/components",
                  label: "All components",
                  translations: { "zh-CN": "全部组件" }
                },
                ...["admonition", "spoiler", "abbreviation", "steps", "code-block", "table-scroll"].map((name) => ({
                  slug: `personal-website/components/${name}`
                }))
              ]
            }
          ]
        }
      ]
    })
  ]
});
