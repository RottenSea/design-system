// The page numbers Pagination shows: all of them up to seven pages, otherwise the first, the
// last, the current one and its neighbours, with a gap ("…") between runs. Pagination.astro draws
// them at build time and its script draws them again when the page or the count changes.

export type PageItem = number | "gap";

export function pageItems(page: number, count: number): PageItem[] {
  if (count <= 7) return Array.from({ length: count }, (_, index) => index + 1);
  const items: PageItem[] = [1];
  const from = Math.max(2, page - 1);
  const to = Math.min(count - 1, page + 1);
  if (from > 2) items.push("gap");
  for (let n = from; n <= to; n += 1) items.push(n);
  if (to < count - 1) items.push("gap");
  items.push(count);
  return items;
}
