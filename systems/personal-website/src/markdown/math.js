// Typesets LaTeX with KaTeX at build time, as MathML only. The browser draws MathML itself in
// --font-math, so no KaTeX stylesheet or font reaches the page. Plain JavaScript for the same
// reason as index.js: a site's astro.config imports it.
import katex from "katex";

/**
 * MathML for a formula, for MathBlock's `html`. Throws when KaTeX cannot read the formula.
 * @param {string} tex
 * @param {boolean} [display] true for a formula on its own, false for one inside a sentence
 * @returns {string}
 */
export function typesetMath(tex, display = true) {
  return katex.renderToString(tex, {
    displayMode: display,
    output: "mathml",
    throwOnError: true,
    // Chinese inside \text{} is fine for a MathML-only build.
    strict: "ignore"
  });
}
