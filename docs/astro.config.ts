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

// Served from the root of its own domain, a subdomain chosen when it is deployed; set `site` to
// that address then. Every language has its own folder in src/content/docs/, so there is no page
// at the root; it redirects to English.
export default defineConfig({
  redirects: { "/": "/en/" },
  // The pages link to each other with relative paths such as ../tokens/, which only resolve from
  // an address that ends in a slash. With "always", every link Starlight writes ends in one,
  // including the site title's link to /en/.
  trailingSlash: "always",
  integrations: [
    starlight({
      title: "Design Systems",
      customCss: ["./src/styles/custom.css"],
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
              label: "Foundations",
              translations: { "zh-CN": "基础" },
              items: ["colors", "typography", "spacing-radius", "shadows-borders", "motion", "themes", "accessibility"].map((name) => ({
                slug: `personal-website/${name}`
              }))
            },
            { slug: "personal-website/changelog" },
            {
              label: "Components",
              translations: { "zh-CN": "组件" },
              items: [
                {
                  slug: "personal-website/components",
                  label: "All components",
                  translations: { "zh-CN": "全部组件" }
                },
                ...[
                  "admonition",
                  "spoiler",
                  "abbreviation",
                  "steps",
                  "code-block",
                  "table-scroll",
                  "option-group",
                  "file-tree",
                  "figure",
                  "image-grid",
                  "video-embed",
                  "math-block",
                  "mermaid",
                  "links",
                  "fields",
                  "github-card"
                ].map((name) => ({
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
