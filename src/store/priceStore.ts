/**
 * 가격 비교 UI 상태 스토어 (Zustand)
 * - imageId: 현재 비교 중인 이미지 ID
 * - localPrice: 사용자 입력 또는 AI 추출 가격
 * - currency: 통화 코드 (JPY, USD 등)
 * - priceSource: 가격 출처 ('AI' | 'USER')
 * - compareResult: compare-with-image API 응답 결과
 * - pendingFile: 분석 대기 중인 이미지 파일
 */

import { create } from "zustand";
import type { PriceCompareResult } from "../api/types";

const DAILY_COMPARE_LIMIT_GUEST = 3;
const DAILY_COMPARE_LIMIT_FREE = 5;

function getTodayKey(): string {
  return new Date().toISOString().slice(0, 10);
}

function getStoredCount(): { date: string; count: number } {
  try {
    const raw = localStorage.getItem("mubu_compare_count");
    if (raw) {
      const parsed = JSON.parse(raw);
      if (parsed.date === getTodayKey()) {
        return parsed;
      }
    }
  } catch {}
  return { date: getTodayKey(), count: 0 };
}

function saveCount(count: number) {
  localStorage.setItem(
    "mubu_compare_count",
    JSON.stringify({ date: getTodayKey(), count }),
  );
}

interface PriceStore {
  imageId: string | null;
  localPrice: number | null;
  currency: string;
  priceSource: "AI" | "USER";
  compareResult: PriceCompareResult | null;
  pendingFile: File | null;
  dailyCompareCount: number;
  userTier: "guest" | "free" | "premium";
  setImageId: (id: string | null) => void;
  setLocalPrice: (price: number | null) => void;
  setCurrency: (currency: string) => void;
  setPriceSource: (source: "AI" | "USER") => void;
  setCompareResult: (result: PriceCompareResult | null) => void;
  setPendingFile: (file: File | null) => void;
  setUserTier: (tier: "guest" | "free" | "premium") => void;
  incrementCompareCount: () => void;
  canCompare: () => boolean;
  reset: () => void;
}

export const usePriceStore = create<PriceStore>((set, get) => ({
  imageId: null,
  localPrice: null,
  currency: "JPY",
  priceSource: "USER",
  compareResult: null,
  pendingFile: null,
  dailyCompareCount: getStoredCount().count,
  userTier: "guest",
  setImageId: (id) => set({ imageId: id }),
  setLocalPrice: (price) => set({ localPrice: price }),
  setCurrency: (currency) => set({ currency }),
  setPriceSource: (source) => set({ priceSource: source }),
  setCompareResult: (result) => set({ compareResult: result }),
  setPendingFile: (file) => set({ pendingFile: file }),
  setUserTier: (tier) => set({ userTier: tier }),
  incrementCompareCount: () => {
    const current = getStoredCount();
    const newCount = current.count + 1;
    saveCount(newCount);
    set({ dailyCompareCount: newCount });
  },
  canCompare: () => {
    const { userTier } = get();
    if (userTier === "premium") return true;
    const { count } = getStoredCount();
    const limit =
      userTier === "free" ? DAILY_COMPARE_LIMIT_FREE : DAILY_COMPARE_LIMIT_GUEST;
    return count < limit;
  },
  reset: () =>
    set({
      imageId: null,
      localPrice: null,
      currency: "JPY",
      priceSource: "USER",
      compareResult: null,
      pendingFile: null,
    }),
}));
