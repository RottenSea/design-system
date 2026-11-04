import katex from "katex";

/**
 * MathML only: the browser draws it in --font-math, so no KaTeX stylesheet or font is needed.
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
