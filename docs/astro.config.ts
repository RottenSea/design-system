import { readdirSync } from "node:fs";
import starlight from "@astrojs/starlight";
import type { AstroIntegration } from "astro";
import { defineConfig } from "astro/config";

// Starlight prefixes every route with a locale, and Astro answers a project page outside /en/ or
// /zh/ with a 404 status in development. Injected routes are exempt, so the example pages live in
// src/pages/_examples/ (no route of their own) and are injected here. A new example needs a restart.
function examples(): AstroIntegration {
  return {
    name: "examples",
    hooks: {
      "astro:config:setup": ({ injectRoute }) => {
        const dir = new URL("./src/pages/_examples/", import.meta.url);
        for (const system of readdirSync(dir)) {
          for (const file of readdirSync(new URL(`${system}/`, dir))) {
            if (!file.endsWith(".astro")) continue;
            injectRoute({
              pattern: `/examples/${system}/${file.slice(0, -".astro".length)}`,
              entrypoint: new URL(`${system}/${file}`, dir)
            });
          }
        }
      }
    }
  };
}

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

// A GitHub Pages project site: links are relative or go through import.meta.env.BASE_URL.
const base = "/design-system";

export default defineConfig({
  site: "https://rottensea.github.io",
  base,
  // A redirect's target is a URL as it is: Astro does not add the base to it.
  redirects: { "/": `${base}/en/` },
  // Relative links such as ../tokens/ resolve only from an address ending in a slash.
  trailingSlash: "always",
  // A browser package found late makes Vite re-bundle, and the dev toolbar then answers 504.
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
    examples(),
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
        // A slug entry takes its label from the page's title in each language.
        {
          label: "Personal website",
          translations: { "zh-CN": "个人网站" },
          items: [
            {
              slug: "personal-website",
              label: "Overview",
              translations: { "zh-CN": "概览" }
            },
            {
              label: "Foundations",
              translations: { "zh-CN": "基础" },
              items: [
                "colors",
                "typography",
                "spacing-radius",
                "shadows-borders",
                "motion",
                "themes",
                "scrollbars",
                "accessibility"
              ].map((name) => ({
                slug: `personal-website/${name}`
              }))
            },
            { slug: "personal-website/changelog" },
            {
              label: "Basics",
              translations: { "zh-CN": "基础组件" },
              items: [
                {
                  slug: "personal-website/basics",
                  label: "Overview",
                  translations: { "zh-CN": "概览" }
                },
                ...[
                  "button",
                  "icon-button",
                  "dialog",
                  "snackbar",
                  "tooltip",
                  "segmented-control",
                  "switch"
                ].map((name) => ({
                  slug: `personal-website/basics/${name}`
                }))
              ]
            },
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
                ...[
                  "quote-band",
                  "article-list-card",
                  "filter-list",
                  "pagination",
                  "stat-list",
                  "mini-calendar"
                ].map((name) => ({
                  slug: `personal-website/home/${name}`
                }))
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
                ...["toc-list", "post-license", "post-nav", "avatar"].map(
                  (name) => ({
                    slug: `personal-website/post/${name}`
                  })
                )
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
                ...[
                  "settings-menu",
                  "search-panel",
                  "post-share",
                  "page-transitions"
                ].map((name) => ({
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
