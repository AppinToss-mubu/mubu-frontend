import { useCallback, useEffect, useState } from "react";
import type { RecentComparison } from "../utils/recentComparisons";
import {
  loadRecentComparisons,
  upsertRecentComparison,
} from "../utils/recentComparisons";

export function useRecentComparisons() {
  const [items, setItems] = useState<RecentComparison[]>(() =>
    loadRecentComparisons()
  );

  useEffect(() => {
    const onStorage = (e: StorageEvent) => {
      if (e.key && e.key.includes("mubu.recentComparisons")) {
        setItems(loadRecentComparisons());
      }
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  const add = useCallback((item: RecentComparison) => {
    const next = upsertRecentComparison(item);
    setItems(next);
  }, []);

  return { items, add };
}

