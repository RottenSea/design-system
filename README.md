# design-system

Design systems for my projects. Each system has its own folder under `systems/` and its own version.

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
| `pnpm check` | Validates every system's tokens against the DTCG 2025.10 format and checks color contrast in every theme |
| `pnpm build` | Builds each system's tokens into CSS under its `dist/` folder, and the docs site |
| `pnpm --filter @rottensea/ds-docs dev` | Serves the docs site locally while you edit it |

The docs site in `docs/` is built with [VitePress](https://vitepress.dev/) and published at [rottensea.github.io/design-system](https://rottensea.github.io/design-system/). English pages are in `docs/en/` and Chinese pages in `docs/zh/`, with the same structure.

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
