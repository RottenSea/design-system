import assert from "node:assert/strict";
import { test } from "node:test";
import { easing, mixFadeValue, parseFadeValue } from "../src/scripts/fade.ts";

test("computed colours and percentages are read", () => {
  assert.deepEqual(parseFadeValue("rgb(250, 249, 245)"), { rgb: [250, 249, 245], alpha: 1 });
  assert.deepEqual(parseFadeValue("rgba(250, 249, 245, 0.06)"), { rgb: [250, 249, 245], alpha: 0.06 });
  assert.deepEqual(parseFadeValue("rgb(43 41 37 / 0)"), { rgb: [43, 41, 37], alpha: 0 });
  assert.deepEqual(parseFadeValue("100%"), { percent: 100 });
  assert.equal(parseFadeValue("var(--x)"), null);
  assert.equal(parseFadeValue(""), null);
});

test("a blend starts and ends on the two values", () => {
  const light = parseFadeValue("rgb(250, 249, 245)");
  const dark = parseFadeValue("rgb(24, 23, 21)");
  assert.equal(mixFadeValue(light, dark, 0), "rgb(250 249 245 / 1)");
  assert.equal(mixFadeValue(light, dark, 1), "rgb(24 23 21 / 1)");
  assert.equal(mixFadeValue(light, dark, 0.5), "rgb(137 136 133 / 1)");
  assert.equal(mixFadeValue(parseFadeValue("0%"), parseFadeValue("100%"), 0.25), "25%");
});

test("a colour fading to transparent keeps its hue", () => {
  const line = parseFadeValue("rgb(230, 223, 216)");
  const none = parseFadeValue("rgba(0, 0, 0, 0)");
  assert.equal(mixFadeValue(line, none, 0.5), "rgb(230 223 216 / 0.5)");
});

test("values of different kinds do not blend", () => {
  assert.equal(mixFadeValue(parseFadeValue("50%"), parseFadeValue("rgb(0, 0, 0)"), 0.5), null);
});

test("the easing follows the curve and keeps its ends", () => {
  const move = easing("cubic-bezier(0.4, 0, 0.2, 1)");
  assert.equal(move(0), 0);
  assert.equal(move(1), 1);
  assert.ok(Math.abs(move(0.5) - 0.7743) < 0.002);
  assert.ok(move(0.25) < move(0.5) && move(0.5) < move(0.75));
  assert.ok(Math.abs(easing("linear")(0.3) - 0.3) < 0.001);
  assert.ok(Math.abs(easing("nonsense")(0.5) - easing("ease")(0.5)) < 1e-9);
});
