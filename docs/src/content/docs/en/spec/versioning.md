---
title: "Versioning"
---

Each system has its own version, changelog and release tag. The version tells people what an upgrade will cost them, and the changelog tells them what changed.

## Version numbers

Versions follow [Semantic Versioning](https://semver.org/): `MAJOR.MINOR.PATCH`.

| Bump | When |
| --- | --- |
| MAJOR | Something that worked before stops working |
| MINOR | Something new is added and everything old still works |
| PATCH | A fix that changes nothing else |

While the major version is `0`, anything may change in any release; `1.0.0` is the point where the public API is promised to stay stable.

A design system's public API is everything other code depends on: token names and the CSS custom properties built from them, the files the package exports, and component props and events. Renaming or removing any of them is a major change. Adding one is a minor change. Changing a token's value breaks no code but changes what people see, so it goes in the changelog under Changed and ships in at least a minor release.

## Changelog

Each system keeps a `CHANGELOG.md` in the [Keep a Changelog](https://keepachangelog.com/en/1.1.0/) format:

- Newest version first, with an `Unreleased` section at the top for changes that have not shipped
- One heading per version with its date: `## [0.1.0] - 2026-10-25`
- Changes grouped as Added, Changed, Deprecated, Removed, Fixed and Security
- Written for the people using the system, not copied from commit messages

## Commit messages

Commits follow [Conventional Commits](https://www.conventionalcommits.org/en/v1.0.0/): `type(scope): description`, for example `feat(personal-website): add a dark theme`. A `feat` commit points to a minor release, a `fix` to a patch, and a `!` after the type or a `BREAKING CHANGE:` footer to a major one.

## Deprecation

Remove nothing without warning first:

1. Mark the token with `$deprecated` in its DTCG file. It can be `true` or a sentence explaining why and what to use instead.
2. Say so in the docs and under Deprecated in the changelog, naming the replacement.
3. Remove it in the next major release, under Removed.

## Releases in this repository

A tag named `<system>-v<version>`, such as `personal-website-v0.1.0`, publishes that system as a GitHub Release with the package attached and that version's changelog section as its notes.

## Source

[Semantic Versioning 2.0.0](https://semver.org/), [Keep a Changelog 1.1.0](https://keepachangelog.com/en/1.1.0/), [Conventional Commits 1.0.0](https://www.conventionalcommits.org/en/v1.0.0/) and the `$deprecated` property in the [DTCG Format](https://www.designtokens.org/TR/2025.10/format/).
