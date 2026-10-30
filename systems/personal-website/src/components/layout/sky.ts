// The drawing behind Starfield and DotGlobe, ported from the handoff's Rainbow Stone page: stars
// that drift across the canvas and twinkle, and a globe of dots that turns on a tilted axis. The
// shapes, speeds and numbers are the handoff's; the colours come from the system's tokens through
// custom properties on the element, so they follow the theme.
//
// Only the functions touch the page, so tests can import this file. land.ts uses the lattice at
// build time to work out which points are land.
import { themeStore } from "../../scripts/theme.ts";

/** The angle between consecutive points of the lattice, which spreads them evenly. */
const GOLDEN = Math.PI * (3 - Math.sqrt(5));
/** The Earth's axial tilt, in degrees. */
const TILT = 23.44;
/** The camera's distance from the globe's centre, in radii, for the perspective. */
const CAMERA = 3.2;

/** How many points a Fibonacci lattice needs for `spacing` degrees between neighbours. */
export function latticeCount(spacing: number): number {
  const s = (spacing * Math.PI) / 180;
  return Math.round((4 * Math.PI) / (s * s));
}

/**
 * Point i of an n-point Fibonacci lattice on the unit sphere: equal areas, no clumping at the
 * poles. y points north; longitude 0 faces +z.
 */
export function latticePoint(i: number, n: number): { x: number; y: number; z: number } {
  const y = 1 - (2 * i + 1) / n;
  const r = Math.sqrt(Math.max(0, 1 - y * y));
  const theta = i * GOLDEN;
  return { x: r * Math.sin(theta), y, z: r * Math.cos(theta) };
}

/** The land points named by a land mask (see land.ts), as x, y, z triples. */
export function landPoints(count: number, bits: string): Float32Array {
  const binary = atob(bits);
  const points: number[] = [];
  for (let i = 0; i < count; i++) {
    if (!(binary.charCodeAt(i >> 3) & (1 << (i & 7)))) continue;
    const { x, y, z } = latticePoint(i, count);
    points.push(x, y, z);
  }
  return new Float32Array(points);
}

export interface Star {
  x: number;
  y: number;
  radius: number;
  alpha: number;
  phase: number;
  speed: number;
  /** 0.25 to 1: nearer stars are larger, brighter and drift faster. */
  depth: number;
}

/**
 * A field of stars for a width × height canvas, one for every `area` square pixels. The same seed
 * every time, so a resize keeps the sky's pattern and only rescales it.
 */
export function makeStars(width: number, height: number, area = 5000): Star[] {
  let seed = 20260829;
  const random = () => {
    seed = (seed * 1664525 + 1013904223) % 4294967296;
    return seed / 4294967296;
  };
  return Array.from({ length: Math.round((width * height) / area) }, () => ({
    x: random() * width,
    y: random() * height,
    radius: 0.4 + random(),
    alpha: 0.18 + random() * 0.42,
    phase: random() * Math.PI * 2,
    speed: 0.25 + random() * 0.5,
    depth: 0.25 + random() * 0.75
  }));
}

export type Rgb = [number, number, number];

const rgba = ([r, g, b]: Rgb, alpha: number) =>
  `rgba(${r},${g},${b},${Math.max(0, Math.min(1, alpha)).toFixed(3)})`;

/** Where star s is at time t, in ms; stars leave one edge and come back at the other. */
export function starAt(s: Star, t: number, width: number, height: number, period: number) {
  const drift = -(t / 1000) * (width / period) * 0.72 * s.depth;
  const wrap = (v: number, size: number) => ((v % (size + 40)) + size + 40) % (size + 40) - 20;
  return { x: wrap(s.x + drift, width), y: wrap(s.y - drift * 0.22, height) };
}

export function drawStars(
  ctx: CanvasRenderingContext2D,
  stars: Star[],
  t: number,
  size: { width: number; height: number; period: number },
  color: Rgb,
  strength: number,
  hidden?: (x: number, y: number) => boolean
) {
  for (const s of stars) {
    const { x, y } = starAt(s, t, size.width, size.height, size.period);
    if (hidden?.(x, y)) continue;
    const twinkle = 0.65 + 0.35 * Math.sin((t / 1000) * s.speed + s.phase);
    ctx.fillStyle = rgba(color, s.alpha * twinkle * (0.55 + 0.45 * s.depth) * strength);
    ctx.beginPath();
    ctx.arc(x, y, s.radius * (0.7 + 0.5 * s.depth), 0, Math.PI * 2);
    ctx.fill();
  }
}

export interface Globe {
  /** Centre and radius on the canvas. */
  cx: number;
  cy: number;
  radius: number;
}

/**
 * The globe for a width × height canvas: a radius of 62% of the shorter side, its centre below
 * the bottom edge by `drop` radii, so only its top shows.
 */
export function globeFor(width: number, height: number, drop: number): Globe {
  const radius = Math.min(width, height) * 0.62;
  return { cx: width / 2, cy: height + radius * drop, radius };
}

export function drawGlobe(
  ctx: CanvasRenderingContext2D,
  points: Float32Array,
  t: number,
  globe: Globe,
  period: number,
  dot: Rgb,
  halo: Rgb
) {
  const { cx, cy, radius } = globe;
  const glow = ctx.createRadialGradient(cx, cy, radius * 0.86, cx, cy, radius * 1.22);
  glow.addColorStop(0, rgba(halo, 0));
  glow.addColorStop(0.42, rgba(halo, 0.2));
  glow.addColorStop(1, rgba(halo, 0));
  ctx.fillStyle = glow;
  ctx.beginPath();
  ctx.arc(cx, cy, radius * 1.22, 0, Math.PI * 2);
  ctx.fill();

  const turn = (-(t / 1000) * (360 / period) * Math.PI) / 180;
  const [sinTurn, cosTurn] = [Math.sin(turn), Math.cos(turn)];
  const tilt = (TILT * Math.PI) / 180;
  const [sinTilt, cosTilt] = [Math.sin(tilt), Math.cos(tilt)];
  const base = Math.max(0.6, radius * 0.005);
  for (let i = 0; i < points.length; i += 3) {
    const [px, py, pz] = [points[i], points[i + 1], points[i + 2]];
    const x = px * cosTurn - pz * sinTurn;
    const turned = px * sinTurn + pz * cosTurn;
    const y = py * cosTilt - turned * sinTilt;
    const z = py * sinTilt + turned * cosTilt;
    // Full strength on the near side, fading to a fifth over the limb.
    const away = (1 - turned) / 2;
    const alpha = away <= 0.4 ? 1 : away >= 0.6 ? 0.2 : 1 - (0.8 * (away - 0.4)) / 0.2;
    const perspective = CAMERA / (CAMERA - z);
    ctx.fillStyle = rgba(dot, alpha);
    ctx.beginPath();
    ctx.arc(cx + x * radius * perspective, cy - y * radius * perspective, base * perspective, 0, Math.PI * 2);
    ctx.fill();
  }
}

/** A CSS time such as "350ms" or "0.35s" in milliseconds; 350 when there is none. */
export function milliseconds(time: string): number {
  const value = Number.parseFloat(time);
  if (Number.isNaN(value)) return 350;
  return /\dms\s*$/.test(time) ? value : value * 1000;
}

/** Any CSS colour as rgb, by letting a canvas parse it. */
export function parseColor(ctx: CanvasRenderingContext2D, css: string): Rgb {
  ctx.fillStyle = "#000";
  ctx.fillStyle = css;
  const value = String(ctx.fillStyle);
  if (value.startsWith("#")) {
    const n = Number.parseInt(value.slice(1, 7), 16);
    return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
  }
  const [r = 0, g = 0, b = 0] = value.match(/[\d.]+/g)?.map(Number) ?? [];
  return [r, g, b];
}

export interface Sky {
  /** The custom properties holding the colours, read again on every theme change. */
  colors: string[];
  /** Called with the canvas's new size in CSS pixels. */
  resize(width: number, height: number): void;
  /** Draws one frame at t ms, with the colours in the order of `colors`. */
  draw(ctx: CanvasRenderingContext2D, t: number, colors: Rgb[], width: number, height: number): void;
}

/**
 * Runs a sky on a canvas inside host: sizes it to the host at the screen's resolution (at most
 * 2×), draws a frame whenever the screen refreshes while the host is on screen, and holds still on
 * one frame when the reader asked for less motion. On a theme change the colours move to the new
 * theme's over the page's fade. Returns a function that stops it all.
 */
export function runSky(host: HTMLElement, canvas: HTMLCanvasElement, sky: Sky): () => void {
  const ctx = canvas.getContext("2d");
  if (!ctx) return () => undefined;
  const root = document.documentElement;
  const calmQuery = matchMedia("(prefers-reduced-motion: reduce)");
  const calm = () => calmQuery.matches || root.dataset.reduceMotion === "true";

  let width = 0;
  let height = 0;
  let visible = true;
  let frame = 0;
  // Time only moves while the sky does, so stopping and starting again picks up where it was.
  let elapsed = 0;
  let last: number | undefined;

  const read = (): Rgb[] => {
    const style = getComputedStyle(host);
    return sky.colors.map((name) => parseColor(ctx, style.getPropertyValue(name).trim() || "#000"));
  };
  let colors = read();
  let tween: { from: Rgb[]; to: Rgb[]; start: number; duration: number } | undefined;

  const current = (now: number): Rgb[] => {
    if (!tween) return colors;
    const k = Math.min(1, (now - tween.start) / tween.duration);
    // Eases out, close to the page's own colour fade.
    const e = 1 - (1 - k) ** 3;
    const mixed = tween.to.map(
      (to, i) => to.map((c, j) => Math.round(tween!.from[i][j] + (c - tween!.from[i][j]) * e)) as Rgb
    );
    if (k >= 1) tween = undefined;
    return mixed;
  };

  const paint = (now: number) => {
    ctx.clearRect(0, 0, width, height);
    sky.draw(ctx, elapsed, current(now), width, height);
  };

  const tick = (now: number) => {
    frame = 0;
    if (!visible) return;
    if (!calm()) {
      if (last !== undefined) elapsed += now - last;
      last = now;
    } else last = undefined;
    paint(now);
    if (!calm() || tween) frame = requestAnimationFrame(tick);
  };
  const wake = () => {
    if (!frame) frame = requestAnimationFrame(tick);
  };

  const resizer = new ResizeObserver(() => {
    const ratio = Math.min(window.devicePixelRatio || 1, 2);
    width = host.clientWidth;
    height = host.clientHeight;
    canvas.width = Math.round(width * ratio);
    canvas.height = Math.round(height * ratio);
    ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
    sky.resize(width, height);
    paint(performance.now());
    wake();
  });
  resizer.observe(host);

  const watcher = new IntersectionObserver(([entry]) => {
    visible = entry.isIntersecting;
    last = undefined;
    if (visible) wake();
  });
  watcher.observe(host);

  const motion = () => {
    last = undefined;
    wake();
  };
  calmQuery.addEventListener("change", motion);
  const attributes = new MutationObserver(motion);
  attributes.observe(root, { attributes: true, attributeFilter: ["data-reduce-motion"] });

  const unsubscribe = themeStore().subscribe((state, previous) => {
    if (state.theme === previous.theme) return;
    const now = performance.now();
    const from = current(now);
    colors = read();
    const duration = calm() ? 0 : milliseconds(getComputedStyle(root).getPropertyValue("--motion-entrance"));
    tween = duration ? { from, to: colors, start: now, duration } : undefined;
    wake();
  });

  return () => {
    cancelAnimationFrame(frame);
    resizer.disconnect();
    watcher.disconnect();
    attributes.disconnect();
    calmQuery.removeEventListener("change", motion);
    unsubscribe();
  };
}
