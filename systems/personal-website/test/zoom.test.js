// Choosing which larger copy Figure's zoom loads.
import assert from "node:assert/strict";
import { test } from "node:test";
import {
  parseZoomSources,
  pickZoomSource,
  zoomedWidth
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
