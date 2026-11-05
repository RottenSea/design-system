// Figure's zoom: where the open image goes, how it starts from the image on the page, and which
// larger copy to load. Figure's script and the tests import it.

/** The space around the open image, in CSS pixels. */
export const ZOOM_MARGIN = 24;

export interface ZoomSource {
  src: string;
  /** The copy's width in pixels. */
  width: number;
}

export interface Size {
  width: number;
  height: number;
}

export interface Rect extends Size {
  left: number;
  top: number;
}

/** Reads the copies from a srcset-style list: "a.webp 1200w, b.webp 1800w". */
export function parseZoomSources(list: string): ZoomSource[] {
  return list
    .split(",")
    .map((entry) => entry.trim().split(/\s+/))
    .filter(([src, width]) => src && /^\d+w$/.test(width ?? ""))
    .map(([src, width]) => ({ src, width: Number.parseInt(width, 10) }))
    .sort((a, b) => a.width - b.width);
}

/** The smallest copy at least `needed` pixels wide, or the largest when none is. */
export function pickZoomSource(
  sources: ZoomSource[],
  needed: number
): ZoomSource | undefined {
  return sources.find((source) => source.width >= needed) ?? sources.at(-1);
}

/** The open image's width in device pixels: the whole image fitted into the window less the margin. */
export function zoomedWidth(
  natural: Size,
  viewport: Size,
  margin: number,
  ratio: number
): number {
  const room = {
    width: viewport.width - 2 * margin,
    height: viewport.height - 2 * margin
  };
  const scale = Math.min(
    room.width / natural.width,
    room.height / natural.height
  );
  return Math.round(natural.width * scale * ratio);
}

/**
 * Where the open image lands, from the original's size alone, so the zoom needs nothing loaded:
 * the whole image in the window less the margin, centred, no larger than its own pixels unless the
 * page already shows it larger (`shownWidth`).
 */
export function zoomTarget(
  natural: Size,
  viewport: Size,
  margin: number,
  shownWidth = 0
): Rect {
  const scale = Math.min(
    Math.max(0, viewport.width - 2 * margin) / natural.width,
    Math.max(0, viewport.height - 2 * margin) / natural.height,
    Math.max(1, shownWidth / natural.width)
  );
  const width = natural.width * scale;
  const height = natural.height * scale;
  return {
    left: (viewport.width - width) / 2,
    top: (viewport.height - height) / 2,
    width,
    height
  };
}

/**
 * Where the whole image is drawn for an <img> box with this object-fit, centred as
 * object-position's default. With cover it is larger than the box; the box shows a crop of it.
 */
export function shownImage(box: Rect, natural: Size, fit: string): Rect {
  let { width, height } = box;
  if (fit === "cover" || fit === "contain") {
    const scale = (fit === "cover" ? Math.max : Math.min)(
      box.width / natural.width,
      box.height / natural.height
    );
    width = natural.width * scale;
    height = natural.height * scale;
  }
  return {
    left: box.left + (box.width - width) / 2,
    top: box.top + (box.height - height) / 2,
    width,
    height
  };
}

export interface ZoomFrame {
  transform: string;
  clip: string;
}

const fixed = (value: number) => `${Number(value.toFixed(6))}`;
const px = (value: number) => `${fixed(Math.max(0, value))}px`;

/** The open image as it ends: where zoomTarget put it, whole and square-cornered. */
export const zoomEnd: ZoomFrame = {
  transform: "translate(0px, 0px) scale(1, 1)",
  clip: "inset(0px 0px 0px 0px round 0px / 0px)"
};

/**
 * The open image as it starts, and ends again on closing: laid over the image on the page, with
 * what the box crops clipped away and the box's corners. The clip is in the open image's own
 * pixels, so it grows away as the scale does. `radius` counts only where the box itself clips.
 */
export function zoomStart(
  box: Rect,
  shown: Rect,
  target: Rect,
  radius: number
): ZoomFrame {
  const sx = shown.width / target.width;
  const sy = shown.height / target.height;
  const right = shown.left + shown.width;
  const bottom = shown.top + shown.height;
  const top = Math.max(0, box.top - shown.top);
  const left = Math.max(0, box.left - shown.left);
  const cutRight = Math.max(0, right - (box.left + box.width));
  const cutBottom = Math.max(0, bottom - (box.top + box.height));
  const cropped = top + left + cutRight + cutBottom > 0.5;
  const fills =
    Math.abs(shown.width - box.width) < 0.5 &&
    Math.abs(shown.height - box.height) < 0.5;
  const round = cropped || fills ? radius : 0;
  return {
    transform: `translate(${fixed(shown.left - target.left)}px, ${fixed(shown.top - target.top)}px) scale(${fixed(sx)}, ${fixed(sy)})`,
    clip: `inset(${px(top / sy)} ${px(cutRight / sx)} ${px(cutBottom / sy)} ${px(left / sx)} round ${px(round / sx)} / ${px(round / sy)})`
  };
}
