// The stylesheets that load the font families named by --font-display, --font-sans, --font-mono
// and --font-math, for the Fonts component, which loads them without holding up the page.
// fonts.css imports the same list for plain HTML pages; a test keeps the two equal.
//
// Manrope, Noto Sans SC and Noto Serif SC are variable fonts on Google Fonts, so one 400..700
// range covers the regular, medium and bold weight tokens with the same files. Maple Mono NL NF CN
// comes from RottenSea/webfonts, one stylesheet per static style.

const MAPLE = "https://cdn.jsdelivr.net/gh/RottenSea/webfonts@maple-mono-nl-nf-cn-v1.0.0/7.9";

export const fontStylesheets = [
  "https://fonts.googleapis.com/css2?family=Manrope:wght@400..700&family=Noto+Sans+SC:wght@400..700&family=Noto+Serif+SC:wght@400..700&family=Noto+Sans+Math&display=swap",
  `${MAPLE}/400-normal/result.css`,
  `${MAPLE}/400-italic/result.css`,
  `${MAPLE}/500-normal/result.css`,
  `${MAPLE}/700-normal/result.css`
];

/**
 * Where the stylesheets and the font files come from, to connect to early. Stylesheets are
 * fetched without CORS and font files with it, and a browser keeps the two kinds of connection
 * apart, so jsDelivr, which serves both, is listed twice.
 */
export const fontOrigins = [
  { href: "https://fonts.googleapis.com", cors: false },
  { href: "https://fonts.gstatic.com", cors: true },
  { href: "https://cdn.jsdelivr.net", cors: false },
  { href: "https://cdn.jsdelivr.net", cors: true }
];
