// Which of Figure's larger copies the zoom loads: the smallest that covers the open image on this
// screen. Figure's script and the tests import it.

/** The space medium-zoom leaves around the open image, in CSS pixels. */
export const ZOOM_MARGIN = 24;

export interface ZoomSource {
  src: string;
  /** The copy's width in pixels. */
  width: number;
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

/**
 * How many image pixels wide the open image is: the image fitted into the window less `margin` on
 * every side, as medium-zoom fits it, at the screen's resolution.
 */
export function zoomedWidth(
  natural: { width: number; height: number },
  viewport: { width: number; height: number },
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
