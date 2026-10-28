# design-system

A set of design systems. Each system has its own folder under `systems/` and its own version.

| System | Folder | Used by |
| --- | --- | --- |
| personal-website | `systems/personal-website` | [RottenSea.github.io](https://github.com/RottenSea/RottenSea.github.io) |

## Requirements

Node.js 24 or later, and the pnpm version pinned in `package.json`.

## Commands

Run these from the repository root:

| Command | What it does |
| --- | --- |
| `pnpm install` | Installs the build tools for every system |
| `pnpm check` | Validates every system's tokens against the DTCG 2025.10 format |
| `pnpm build` | Builds each system's tokens into CSS under its `dist/` folder, and the docs site |
| `pnpm --filter @rottensea/ds-docs dev` | Serves the docs site locally while you edit it |

The docs site in `docs/` is built with [Starlight](https://starlight.astro.build/), Astro's documentation theme, and served from the root of its own domain, a subdomain set up when it is deployed. Until then the Docs workflow runs only by hand. English pages are in `docs/src/content/docs/en/` and Chinese pages in `docs/src/content/docs/zh/`, with the same file paths, which is how Starlight pairs a page with its translation. Each system gets its own section inside both language folders. Links between pages are relative, such as `../tokens/`, because page URLs end in a slash. `pnpm --filter @rottensea/ds-docs dev` serves it on Astro's default port, 4321.

Each system also has specimen pages in its `guidelines/` folder, one per foundation topic. They are plain HTML that link the system's own `src/styles/fonts.css` and `src/styles/styles.css`, so after `pnpm build` they open in a browser as they are, and a site can show them in iframes without its own styles getting in the way.

Tokens follow the [Design Tokens Format Module 2025.10](https://www.designtokens.org/TR/2025.10/). [Terrazzo](https://terrazzo.app/) reads them and writes the CSS. `dist/` is build output and is not committed.

## Releasing

Each system is released on its own, as a GitHub Release with the package tarball attached.

1. In the system's `package.json`, set `version`. In its `CHANGELOG.md`, rename `[Unreleased]` to the version and date, start a new empty `[Unreleased]` section, and update the links at the bottom.
2. Commit as `chore(<system>): release <version>` and push.
3. Tag that commit `<system>-v<version>`, for example `personal-website-v0.1.0`, and push the tag.

The Release workflow checks that the tag matches `package.json`, runs the checks and the build, packs the system, and creates the release with that version's CHANGELOG section as its notes. A site installs the release from the tarball's URL:

```
pnpm add https://github.com/RottenSea/design-system/releases/download/personal-website-v0.1.0/rottensea-ds-personal-website-0.1.0.tgz
```

The CI workflow runs `pnpm check` and `pnpm build` on every push to `main` and on every pull request.
