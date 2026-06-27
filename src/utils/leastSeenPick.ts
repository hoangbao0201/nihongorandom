export function pickLeastSeenExcludingHighest<T>(
  items: T[],
  getCount: (item: T) => number
): T {
  if (items.length === 0) {
    throw new Error("Cannot pick from empty pool");
  }

  if (items.length === 1) {
    return items[0];
  }

  const ranked = [...items].sort(
    (first, second) => getCount(first) - getCount(second)
  );
  const candidates = ranked.slice(0, -1);
  return candidates[Math.floor(Math.random() * candidates.length)];
}
