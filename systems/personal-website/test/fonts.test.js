import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { test } from "node:test";
import { fontStylesheets } from "../src/styles/fonts.js";

test("fonts.css imports the same stylesheets as the Fonts component", () => {
  const css = readFileSync(new URL("../src/styles/fonts.css", import.meta.url), "utf8");
  const imported = [...css.matchAll(/@import url\("([^"]+)"\)/g)].map((match) => match[1]);
  assert.deepEqual(imported, fontStylesheets);
});

test("styles.css loads no remote stylesheet, so nothing holds up the page", () => {
  const css = readFileSync(new URL("../src/styles/styles.css", import.meta.url), "utf8");
  assert.doesNotMatch(css, /@import\s+(url\()?["']?(https?:|\.\/fonts\.css)/);
});
