// The shared logic behind Pagination and MiniCalendar, which both run at build time and again in
// the browser.
import assert from "node:assert/strict";
import { test } from "node:test";
import { isoDate, monthHtml, monthLabel } from "../src/components/content/calendar.ts";
import { pageItems } from "../src/components/content/pagination.ts";

test("up to seven pages are all shown", () => {
  assert.deepEqual(pageItems(3, 7), [1, 2, 3, 4, 5, 6, 7]);
});

test("more pages keep the ends and the current page's neighbours", () => {
  assert.deepEqual(pageItems(1, 10), [1, 2, "gap", 10]);
  assert.deepEqual(pageItems(5, 10), [1, "gap", 4, 5, 6, "gap", 10]);
  assert.deepEqual(pageItems(10, 10), [1, "gap", 9, 10]);
});

const month = (options) =>
  monthHtml({ counts: {}, today: null, weekStart: "sun", selectable: false, selected: null, ...options });

test("a month starts on the right weekday", () => {
  // October 2026 begins on a Thursday: four blanks from Sunday, three from Monday.
  const blanks = (html) => html.match(/ds-cal__blank/g)?.length ?? 0;
  assert.equal(blanks(month({ year: 2026, month: 10 })), 4);
  assert.equal(blanks(month({ year: 2026, month: 10, weekStart: "mon" })), 3);
  assert.equal((month({ year: 2026, month: 2 }).match(/class="ds-cal__day/g) ?? []).length, 28);
});

test("days with posts are marked, and buttons when selectable", () => {
  const counts = { "2026-06-16": 1, "2026-06-17": 2 };
  const html = month({ year: 2026, month: 6, counts, today: "2026-06-17", selectable: true, selected: "2026-06-16" });
  assert.match(html, /data-date="2026-06-16" aria-pressed="true">16<span class="ds-visually-hidden">, 1 post<\/span>/);
  assert.match(html, /ds-cal__day--marked ds-cal__day--today" data-date="2026-06-17" aria-pressed="false" aria-current="date">17<span class="ds-visually-hidden">, 2 posts/);
  assert.doesNotMatch(month({ year: 2026, month: 6, counts }), /<button/);
});

test("dates and labels do not depend on the time zone", () => {
  assert.equal(isoDate(2026, 5, 8), "2026-05-08");
  assert.equal(monthLabel(2026, 1), "January 2026");
});
