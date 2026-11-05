// Choosing which larger copy Figure's zoom loads.
import assert from "node:assert/strict";
import { test } from "node:test";
import {
  parseZoomSources,
  pickZoomSource,
  shownImage,
  zoomEnd,
  zoomedWidth,
  zoomStart,
  zoomTarget
} from "../src/components/media/zoom.ts";

const sources = parseZoomSources(
  "/a-1200.webp 1200w, /a-1800.webp 1800w, /a-2400.webp 2400w"
);

test("the copies are read from a srcset-style list", () => {
  assert.deepEqual(sources, [
    { src: "/a-1200.webp", width: 1200 },
    { src: "/a-1800.webp", width: 1800 },
    { src: "/a-2400.webp", width: 2400 }
  ]);
  assert.deepEqual(parseZoomSources(""), []);
});

test("the smallest copy that covers the open image is chosen", () => {
  assert.equal(pickZoomSource(sources, 900)?.src, "/a-1200.webp");
  assert.equal(pickZoomSource(sources, 1200)?.src, "/a-1200.webp");
  assert.equal(pickZoomSource(sources, 1500)?.src, "/a-1800.webp");
});

test("past the largest copy, the largest is chosen", () => {
  assert.equal(pickZoomSource(sources, 5000)?.src, "/a-2400.webp");
  assert.equal(pickZoomSource([], 800), undefined);
});

test("the open image fits the window less its margins, at the screen's resolution", () => {
  // A wide image on a desktop window is limited by the width.
  assert.equal(
    zoomedWidth(
      { width: 2000, height: 1000 },
      { width: 1448, height: 900 },
      24,
      1
    ),
    1400
  );
  // A tall image is limited by the height: 852px tall at 2:3 is 568px wide, twice on a 2x screen.
  assert.equal(
    zoomedWidth(
      { width: 1000, height: 1500 },
      { width: 1448, height: 900 },
      24,
      2
    ),
    1136
  );
  // On a phone the width limits it, at three times the CSS pixels.
  assert.equal(
    zoomedWidth(
      { width: 2000, height: 1000 },
      { width: 375, height: 812 },
      24,
      3
    ),
    981
  );
});

test("the open image is placed before its larger copy loads, from the original's size", () => {
  // 2000×1000 in a 1448×900 window: 1400 wide, centred.
  assert.deepEqual(
    zoomTarget({ width: 2000, height: 1000 }, { width: 1448, height: 900 }, 24),
    { left: 24, top: 100, width: 1400, height: 700 }
  );
  // A small original opens no larger than its own pixels.
  assert.deepEqual(
    zoomTarget({ width: 400, height: 300 }, { width: 1448, height: 900 }, 24),
    { left: 524, top: 300, width: 400, height: 300 }
  );
  // Unless the page already shows it larger: then it stays that size.
  assert.equal(
    zoomTarget(
      { width: 400, height: 300 },
      { width: 1448, height: 900 },
      24,
      600
    ).width,
    600
  );
});

const tile = { left: 100, top: 200, width: 200, height: 200 };

test("a tile's cropped image is drawn larger than the tile, centred on it", () => {
  // 2:1 covering a 200px square is 400×200, 100px past each side.
  assert.deepEqual(shownImage(tile, { width: 4000, height: 2000 }, "cover"), {
    left: 0,
    top: 200,
    width: 400,
    height: 200
  });
  assert.deepEqual(shownImage(tile, { width: 4000, height: 2000 }, "contain"), {
    left: 100,
    top: 250,
    width: 200,
    height: 100
  });
  assert.deepEqual(shownImage(tile, { width: 10, height: 99 }, "fill"), tile);
});

test("the zoom starts as the tile shows it: the hidden sides clipped, the corners rounded", () => {
  const natural = { width: 4000, height: 2000 };
  const shown = shownImage(tile, natural, "cover");
  const target = { left: 24, top: 100, width: 1400, height: 700 };
  const start = zoomStart(tile, shown, target, 16);
  // 400 shown over 1400 open: scale 2/7, moved from (24, 100) to (0, 200).
  assert.equal(
    start.transform,
    "translate(-24px, 100px) scale(0.285714, 0.285714)"
  );
  // The 100px cut from each side of the shown image is 350px of the open one.
  assert.equal(start.clip, "inset(0px 350px 0px 350px round 56px / 56px)");
  assert.equal(zoomEnd.clip, "inset(0px 0px 0px 0px round 0px / 0px)");
});

test("an image the tile shows whole starts unclipped, with no corners of the tile", () => {
  const natural = { width: 4000, height: 2000 };
  const shown = shownImage(tile, natural, "contain");
  const start = zoomStart(
    tile,
    shown,
    { left: 24, top: 100, width: 1400, height: 700 },
    16
  );
  assert.equal(start.clip, "inset(0px 0px 0px 0px round 0px / 0px)");
});
