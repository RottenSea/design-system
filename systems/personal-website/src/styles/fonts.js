// The font stylesheets for the Fonts component; fonts.css imports the same list, and a test keeps
// the two equal.

const MAPLE =
  "https://cdn.jsdelivr.net/gh/RottenSea/webfonts@maple-mono-nl-nf-cn-v1.0.0/7.9";

export const fontStylesheets = [
  "https://fonts.googleapis.com/css2?family=Manrope:wght@400..700&family=Noto+Sans+SC:wght@400..700&family=Noto+Serif+SC:wght@400..700&family=Noto+Sans+Math&display=swap",
  `${MAPLE}/400-normal/result.css`,
  `${MAPLE}/400-italic/result.css`,
  `${MAPLE}/500-normal/result.css`,
  `${MAPLE}/700-normal/result.css`
];

/** jsDelivr is listed twice: stylesheets come without CORS and fonts with it, on separate connections. */
export const fontOrigins = [
  { href: "https://fonts.googleapis.com", cors: false },
  { href: "https://fonts.gstatic.com", cors: true },
  { href: "https://cdn.jsdelivr.net", cors: false },
  { href: "https://cdn.jsdelivr.net", cors: true }
];
