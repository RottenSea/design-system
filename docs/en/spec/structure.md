# Structure

A design system's docs are a set of **entries**, and each entry's content is a list of **sections**. This follows the document model of [DSDS](https://designsystemdocspec.org/), which writes the same structure as YAML. Here it is written as Markdown pages.

## Entries

| Entry | What it documents |
| --- | --- |
| System | The design system as a whole: what it is for, who uses it, how to install it |
| Token | The purpose and usage of one design token or a group of them. The value stays in the token file |
| Theme | A named set of token overrides, such as a dark theme |
| Component | One reusable piece of UI |
| Other entry | Anything else: a foundation such as color or typography, a pattern that combines components, or a guide |

Entries link to each other. A dialog **uses** a button, a button uses color tokens, and a popover can be listed as an **alternative** to a dialog. Writing these links down lets readers follow them and lets a tool find what a change affects.

## Sections

Every entry is made of sections, and any section kind can appear in any entry.

| Section | Holds |
| --- | --- |
| Definitions | Terms and what they mean |
| Guidelines | Rules for using the thing, each with a requirement level. See [Guidelines](./guidelines) |
| Steps | An ordered procedure, such as installing a package |
| General section | Prose that does not fit the other kinds |

## Audience

DSDS gives each section an audience: people, agents, or both. Write for people by default; agents read that too. Add a section only for agents when they keep making a mistake that people do not, such as building a button out of a `div`.

## What a system page contains

- What the system is for and which product it serves
- How to install it and the files it exports
- Its foundations: tokens, themes, typography, accessibility rules
- Links to its components, patterns and guides
- Its version and a link to its changelog

## Source

[DSDS overview](https://designsystemdocspec.org/), which describes entries, sections and audiences.
