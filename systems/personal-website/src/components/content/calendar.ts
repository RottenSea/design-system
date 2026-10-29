// The month grid MiniCalendar draws, as HTML: MiniCalendar.astro writes it at build time, and its
// script writes it again in the reader's browser, where "today" and the current month are known.
// Dates are "YYYY-MM-DD" strings in the reader's own calendar, so no time zone is involved here.

export interface MonthOptions {
  year: number;
  /** 1 to 12. */
  month: number;
  /** Posts per day, keyed by "YYYY-MM-DD". */
  counts: Record<string, number>;
  /** Today's date, or null to mark no day. */
  today: string | null;
  weekStart: "mon" | "sun";
  /** Marked days are buttons. */
  selectable: boolean;
  /** The selected day. */
  selected: string | null;
}

const WEEK = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

const pad = (n: number) => String(n).padStart(2, "0");

export const isoDate = (year: number, month: number, day: number) => `${year}-${pad(month)}-${pad(day)}`;

/** Today in the reader's own calendar. */
export const localToday = (now = new Date()) => isoDate(now.getFullYear(), now.getMonth() + 1, now.getDate());

export const monthLabel = (year: number, month: number) =>
  new Date(Date.UTC(year, month - 1, 1)).toLocaleString("en-US", { month: "long", year: "numeric", timeZone: "UTC" });

export function monthHtml({ year, month, counts, today, weekStart, selectable, selected }: MonthOptions): string {
  const offset = weekStart === "sun" ? 0 : 1;
  const firstDay = new Date(Date.UTC(year, month - 1, 1)).getUTCDay();
  const length = new Date(Date.UTC(year, month, 0)).getUTCDate();
  const lead = (firstDay - offset + 7) % 7;
  const week = [...WEEK.slice(offset), ...WEEK.slice(0, offset)];
  const cells: string[] = week.map(
    (name) => `<abbr class="ds-cal__head" title="${name}" aria-hidden="true">${name[0]}</abbr>`
  );
  for (let i = 0; i < lead; i += 1) cells.push('<span class="ds-cal__blank"></span>');
  for (let day = 1; day <= length; day += 1) {
    const date = isoDate(year, month, day);
    const count = counts[date] ?? 0;
    const classes = ["ds-cal__day", count ? "ds-cal__day--marked" : "", date === today ? "ds-cal__day--today" : ""]
      .filter(Boolean)
      .join(" ");
    const note = count ? `<span class="ds-visually-hidden">, ${count} post${count === 1 ? "" : "s"}</span>` : "";
    const current = date === today ? ' aria-current="date"' : "";
    cells.push(
      count && selectable
        ? `<button type="button" class="${classes}" data-date="${date}" aria-pressed="${date === selected}"${current}>${day}${note}</button>`
        : `<span class="${classes}"${current}>${day}${note}</span>`
    );
  }
  return cells.join("");
}
