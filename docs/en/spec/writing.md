# Writing

These rules are for the docs themselves. They borrow from the [GitHub Docs style guide](https://docs.github.com/en/contributing/style-guide-and-content-model/style-guide), whose first principle fits here too: clarity and meaning come before grammar rules.

## Know which kind of page you are writing

| Kind | Answers | Example here |
| --- | --- | --- |
| Concept | What is this and why does it exist | Tokens, Themes |
| How-to | How do I do this task | Installing a system |
| Reference | What exactly are the options | A list of tokens or component props |

Keep one kind per page. A reference table in the middle of an explanation is hard to find later; link to it instead.

## Plain language

- Short sentences, active voice, one idea per sentence.
- Lead with what the reader needs. Put background after the point, or link to it.
- Explain a term the first time it appears, then use it the same way everywhere: one term per concept. If the docs say "surface", they never also say "background layer" for the same thing.

## Headings and links

- Headings say what the section holds, in sentence case.
- Link text says where the link goes. "See [Accessibility](./accessibility)" works; "click here" does not.

## Images

Every image has alt text that gives its meaning, not a description of pixels. GitHub's guide suggests 40 to 150 characters, starting with the kind of image ("Screenshot of…", "Diagram that shows…"), and never starting with "Image of".

## Two languages

English and Chinese pages have the same structure and say the same things. Change both in the same commit. Translate meaning, not word by word, and leave code, token names and file paths untranslated.

## Writing for agents

People and agents read the same pages. Write for people first. Add a note aimed at agents only for mistakes agents keep making, and say plainly what to do instead.

## Source

[GitHub Docs style guide](https://docs.github.com/en/contributing/style-guide-and-content-model/style-guide) and [content model](https://docs.github.com/en/contributing/style-guide-and-content-model/about-the-content-model), and the audience rules in [DSDS](https://designsystemdocspec.org/).
