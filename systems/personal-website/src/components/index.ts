// Every component, for passing to an MDX page at once:
//   import { components } from "@rottensea/ds-personal-website/components";
//   <Content components={components} />
// The Markdown directives in ../markdown/index.js write these names. This file is TypeScript
// so pages get the components' prop types; pages are compiled by Vite, which handles it.
import Abbreviation from "./content/Abbreviation.astro";
import Admonition from "./content/Admonition.astro";
import Spoiler from "./content/Spoiler.astro";
import Step from "./content/Step.astro";
import Steps from "./content/Steps.astro";
import Tooltip from "./feedback/Tooltip.astro";

export { Abbreviation, Admonition, Spoiler, Step, Steps, Tooltip };

export const components = {
  Abbreviation,
  Admonition,
  Spoiler,
  Step,
  Steps,
  Tooltip
};
