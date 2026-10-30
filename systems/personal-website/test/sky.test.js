// The lattice and land data behind DotGlobe, and the helpers Starfield and DotGlobe share.
import assert from "node:assert/strict";
import { test } from "node:test";
import { landMask } from "../src/components/layout/land.ts";
import { landPoints, latticeCount, latticePoint, makeStars, milliseconds } from "../src/components/layout/sky.ts";

/** The lattice point nearest a longitude and latitude, and whether the mask marks it as land. */
function landAt(mask, lon, lat) {
  const bytes = Buffer.from(mask.bits, "base64");
  const [lo, la] = [(lon * Math.PI) / 180, (lat * Math.PI) / 180];
  const target = { x: Math.cos(la) * Math.sin(lo), y: Math.sin(la), z: Math.cos(la) * Math.cos(lo) };
  let best = 0;
  let nearest = -2;
  for (let i = 0; i < mask.count; i++) {
    const p = latticePoint(i, mask.count);
    const dot = p.x * target.x + p.y * target.y + p.z * target.z;
    if (dot > nearest) [best, nearest] = [i, dot];
  }
  return Boolean(bytes[best >> 3] & (1 << (best & 7)));
}

test("the lattice has as many points as its spacing asks for, all on the unit sphere", () => {
  assert.equal(latticeCount(1.7), 14274);
  for (const i of [0, 100, 14273]) {
    const { x, y, z } = latticePoint(i, 14274);
    assert.ok(Math.abs(x * x + y * y + z * z - 1) < 1e-9);
  }
});

test("about three tenths of the globe is land", () => {
  const mask = landMask(1.7);
  const land = landPoints(mask.count, mask.bits).length / 3;
  assert.equal(mask.count, 14274);
  assert.ok(land / mask.count > 0.27 && land / mask.count < 0.31, `${land} of ${mask.count}`);
});

test("land and sea are where they should be, across the date line and at the poles", () => {
  const mask = landMask(1.7);
  assert.ok(landAt(mask, 20, 0), "the Congo basin");
  assert.ok(landAt(mask, 100, 60), "Siberia");
  assert.ok(landAt(mask, -178, 66.5), "Chukotka, past 180°");
  assert.ok(landAt(mask, 0, -89), "the South Pole");
  assert.ok(!landAt(mask, -150, 0), "the Pacific");
  assert.ok(!landAt(mask, 51, 42), "the Caspian, a hole in Eurasia");
  assert.ok(!landAt(mask, 0, 89), "the North Pole, on sea ice");
});

test("the mask is made once for each spacing", () => {
  assert.equal(landMask(1.7), landMask(1.7));
});

test("the stars are the same for the same size", () => {
  const a = makeStars(800, 500);
  assert.equal(a.length, 80);
  assert.deepEqual(a, makeStars(800, 500));
});

test("CSS times read as milliseconds", () => {
  assert.equal(milliseconds("350ms"), 350);
  assert.equal(milliseconds(" 0.35s"), 350);
  assert.equal(milliseconds(""), 350);
});
