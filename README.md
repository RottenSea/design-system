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
| `pnpm check` | Validates every system's tokens against the DTCG 2025.10 format |
| `pnpm build` | Builds each system's tokens into CSS under its `dist/` folder |

Tokens follow the [Design Tokens Format Module 2025.10](https://www.designtokens.org/TR/2025.10/). [Terrazzo](https://terrazzo.app/) reads them and writes the CSS. `dist/` is build output and is not committed.
