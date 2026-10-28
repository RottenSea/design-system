// The blurred stand-in an image shows while it loads: the image itself shrunk to 16px and written
// into the HTML as a data URL, about 200 bytes. It is made at build time with sharp, which Astro
// uses for its own images, from the file an imported image points to (`fsPath`).
import type { ImageMetadata } from "astro";
import sharp from "sharp";

const SIZE = 16;
const cache = new Map<string, Promise<string | undefined>>();

async function make(path: string) {
  const tiny = await sharp(path).resize(SIZE, SIZE, { fit: "inside" }).png().toBuffer();
  // A transparent image would show the stand-in through its clear parts after it loads.
  const { isOpaque } = await sharp(tiny).stats();
  if (!isOpaque) return undefined;
  const webp = await sharp(tiny).webp({ quality: 60 }).toBuffer();
  return `data:image/webp;base64,${webp.toString("base64")}`;
}

/** The stand-in for a local image, or undefined for a remote, vector or transparent one. */
export function placeholderOf(image: ImageMetadata): Promise<string | undefined> {
  if (!image.fsPath || image.format === "svg") return Promise.resolve(undefined);
  let result = cache.get(image.fsPath);
  if (!result) {
    // An unreadable file loses its stand-in, not the page.
    result = make(image.fsPath).catch(() => undefined);
    cache.set(image.fsPath, result);
  }
  return result;
}
