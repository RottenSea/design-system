# Docs spec

This spec says what the documentation of a design system in this repository contains and where each fact in it comes from. It is a summary written for this project. Every page links the standards it draws on, and when this summary and a standard disagree, the standard wins.

## Who reads the docs

- People building with the system need to know what exists, when to use it and how.
- AI agents writing code with the system need the same, plus the rules they tend to get wrong.
- Tools such as linters and generators read the parts that are structured data.

## Point to a fact instead of copying it

Most facts in a design system already live somewhere with an owner. The docs link to that place and explain meaning and usage around it.

| Fact | Where it lives | What the docs do |
| --- | --- | --- |
| Token values, types and aliases | DTCG token files | Link to the token |
| Theme overrides | The DTCG resolver | Link to the theme |
| A component's props and events | The component's source, or a generated manifest such as CEM | Link to it instead of retyping a props table |
| Why a rule exists | WCAG, the ARIA Authoring Practices, MDN | Cite it as evidence |
| Whether a rule holds | Tests and lint rules | Name the check |
| Versions and changes | The package version and CHANGELOG | Link to them |

A copied value goes stale without anyone noticing. A link can break too, but a link checker finds that on the next build.

## Pages

- [Structure](./structure): the parts of a design system's docs and how they connect
- [Tokens](./tokens): documenting design tokens in the DTCG format
- [Themes](./themes): documenting themes built with the DTCG resolver
- [Components](./components): anatomy, variants, states and API
- [Guidelines](./guidelines): writing rules people and tools can act on
- [Accessibility](./accessibility): the WCAG and APG facts every page relies on
- [Versioning](./versioning): versions, changelogs and deprecations
- [Writing](./writing): style for the docs themselves

## Sources

- [Design System Doc Spec (DSDS)](https://designsystemdocspec.org/), version 0.23.0. It is still a draft.
- [Design Tokens Format Module 2025.10](https://www.designtokens.org/TR/2025.10/format/) and [Resolver Module 2025.10](https://www.designtokens.org/TR/2025.10/resolver/) from the W3C Design Tokens Community Group.
