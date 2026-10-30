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

// Served by GitHub Pages at rottensea.github.io/design-system/, this repository's project site,
// so every URL starts with the base. Links in pages are relative (../tokens/) or go through
// import.meta.env.BASE_URL, never from the domain's root. Every language has its own folder in
// src/content/docs/, so there is no page at the base; it redirects to English.
const base = "/design-system";

export default defineConfig({
  site: "https://rottensea.github.io",
  base,
  // A redirect's target is a URL as it is: Astro does not add the base to it.
  redirects: { "/": `${base}/en/` },
  // The pages link to each other with relative paths such as ../tokens/, which only resolve from
  // an address that ends in a slash. With "always", every link Starlight writes ends in one,
  // including the site title's link to /en/.
  trailingSlash: "always",
  // The packages the system's components import in the browser. Bundled when the dev server
  // starts, they are not found one page at a time; each late find makes Vite re-bundle and
  // reload, and leaves Astro's dev toolbar script answering 504 until the cache is cleared.
  vite: {
    optimizeDeps: {
      include: [
        "@rottensea/ds-personal-website > medium-zoom",
        "@rottensea/ds-personal-website > mermaid",
        "@rottensea/ds-personal-website > qrcode"
      ]
    }
  },
  integrations: [
    starlight({
      title: "Design Systems",
      customCss: ["./src/styles/custom.css"],
      // The theme select goes through the system's theme store, so the docs site fades as its pages do.
      components: { ThemeSelect: "./src/components/ThemeSelect.astro" },
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
            },
            {
              label: "Page shell",
              translations: { "zh-CN": "页面外框" },
              items: [
                {
                  slug: "personal-website/shell",
                  label: "Overview",
                  translations: { "zh-CN": "概览" }
                },
                ...[
                  "top-nav",
                  "content-grid",
                  "sidebar-card",
                  "footer",
                  "floating-controls",
                  "theme-toggle",
                  "skip-link",
                  "starfield",
                  "dot-globe"
                ].map((name) => ({
                  slug: `personal-website/shell/${name}`
                }))
              ]
            },
            {
              label: "Home page",
              translations: { "zh-CN": "首页" },
              items: [
                {
                  slug: "personal-website/home",
                  label: "Overview",
                  translations: { "zh-CN": "概览" }
                },
                ...["quote-band", "article-list-card", "filter-list", "pagination", "stat-list", "mini-calendar"].map(
                  (name) => ({
                    slug: `personal-website/home/${name}`
                  })
                )
              ]
            },
            {
              label: "Post page",
              translations: { "zh-CN": "文章页" },
              items: [
                {
                  slug: "personal-website/post",
                  label: "Overview",
                  translations: { "zh-CN": "概览" }
                },
                ...["toc-list", "post-license", "post-nav", "avatar"].map((name) => ({
                  slug: `personal-website/post/${name}`
                }))
              ]
            },
            {
              label: "Settings and search",
              translations: { "zh-CN": "设置和搜索" },
              items: [
                {
                  slug: "personal-website/settings",
                  label: "Overview",
                  translations: { "zh-CN": "概览" }
                },
                ...["settings-menu", "search-panel", "post-share", "page-transitions"].map((name) => ({
                  slug: `personal-website/settings/${name}`
                }))
              ]
            }
          ]
        }
      ]
    })
  ]
});
