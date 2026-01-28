export type RecentComparison = {
  id: string; // imageId
  productName: string;
  savedAmount: number; // KRW (+면 한국이 더 쌈)
  createdAt: number; // epoch ms
};

const KEY = "mubu.recentComparisons.v1";
const MAX_ITEMS = 20;

export function loadRecentComparisons(): RecentComparison[] {
  try {
    const raw = sessionStorage.getItem(KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as RecentComparison[];
    if (!Array.isArray(parsed)) return [];
    return parsed.filter(Boolean).slice(0, MAX_ITEMS);
  } catch {
    return [];
  }
}

export function saveRecentComparisons(items: RecentComparison[]) {
  sessionStorage.setItem(KEY, JSON.stringify(items.slice(0, MAX_ITEMS)));
}

export function upsertRecentComparison(item: RecentComparison) {
  const current = loadRecentComparisons();
  const next = [item, ...current.filter((x) => x.id !== item.id)].slice(0, MAX_ITEMS);
  saveRecentComparisons(next);
  return next;
}

