/** The arithmetic of the theme fade in theme.ts. */

/** A colour in sRGB, channels 0 to 255 and alpha 0 to 1, or a percentage. */
export type FadeValue =
  | { rgb: [number, number, number]; alpha: number }
  | { percent: number };

/** A computed rgb(), rgba() or percentage; anything else is null and is set at the start. */
export function parseFadeValue(value: string): FadeValue | null {
  const text = value.trim();
  const colour = /^rgba?\(([^)]*)\)$/i.exec(text);
  if (colour) {
    const parts = colour[1].split(/[\s,/]+/).filter(Boolean);
    if (parts.length < 3 || parts.length > 4) return null;
    const numbers = parts.map((part) =>
      part.endsWith("%")
        ? Number.parseFloat(part) / 100
        : Number.parseFloat(part)
    );
    if (numbers.some((number) => Number.isNaN(number))) return null;
    return {
      rgb: [numbers[0], numbers[1], numbers[2]],
      alpha: numbers[3] ?? 1
    };
  }
  const percent = /^(-?[\d.]+)%$/.exec(text);
  if (percent) return { percent: Number.parseFloat(percent[1]) };
  return null;
}

/**
 * A CSS time in ms, null if it is not one. A minifier may write 350ms as .35s, so the unit
 * counts: read with parseFloat alone, .35s was a fade of 0.35ms.
 */
export function parseDuration(value: string): number | null {
  const time = /^(-?(?:\d+\.?\d*|\.\d+))(ms|s)?$/i.exec(value.trim());
  if (!time) return null;
  const number = Number.parseFloat(time[1]);
  if (time[2]?.toLowerCase() === "s") return number * 1000;
  // A bare number is only valid as 0.
  if (!time[2] && number !== 0) return null;
  return number;
}

const round = (value: number) => Math.round(value * 100) / 100;

/**
 * Colours blend in premultiplied sRGB, as a CSS transition does, so one fading to transparent
 * keeps its hue. Null if the two are not the same kind.
 */
export function mixFadeValue(
  from: FadeValue,
  to: FadeValue,
  progress: number
): string | null {
  if ("percent" in from && "percent" in to)
    return `${round(from.percent + (to.percent - from.percent) * progress)}%`;
  if (!("rgb" in from) || !("rgb" in to)) return null;
  const alpha = from.alpha + (to.alpha - from.alpha) * progress;
  const channels = from.rgb.map((value, index) => {
    const start = value * from.alpha;
    const end = to.rgb[index] * to.alpha;
    return alpha > 0 ? (start + (end - start) * progress) / alpha : 0;
  });
  return `rgb(${channels.map(round).join(" ")} / ${round(alpha * 10000) / 10000})`;
}

const KEYWORDS: Record<string, [number, number, number, number]> = {
  ease: [0.25, 0.1, 0.25, 1],
  "ease-in": [0.42, 0, 1, 1],
  "ease-out": [0, 0, 0.58, 1],
  "ease-in-out": [0.42, 0, 0.58, 1],
  linear: [0, 0, 1, 1]
};

/** A CSS easing, a cubic-bezier() or one of its keywords, as progress for a time from 0 to 1. */
export function easing(css: string): (time: number) => number {
  const text = css.trim();
  const given = /^cubic-bezier\(([^)]*)\)$/
    .exec(text)?.[1]
    .split(",")
    .map(Number);
  const [x1, y1, x2, y2] =
    given?.length === 4 && given.every(Number.isFinite)
      ? given
      : (KEYWORDS[text] ?? KEYWORDS.ease);
  const curve = (a: number, b: number, s: number) =>
    3 * a * s * (1 - s) ** 2 + 3 * b * s * s * (1 - s) + s ** 3;
  return (time) => {
    if (time <= 0) return 0;
    if (time >= 1) return 1;
    // The curve's x grows with s, so halving finds the s whose x is the time.
    let low = 0;
    let high = 1;
    for (let step = 0; step < 24; step += 1) {
      const middle = (low + high) / 2;
      if (curve(x1, x2, middle) < time) low = middle;
      else high = middle;
    }
    return curve(y1, y2, (low + high) / 2);
  };
}
