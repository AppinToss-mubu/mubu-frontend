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

interface PriceStore {
  imageId: string | null;
  localPrice: number | null;
  currency: string;
  priceSource: "AI" | "USER";
  compareResult: PriceCompareResult | null;
  pendingFile: File | null;
  setImageId: (id: string | null) => void;
  setLocalPrice: (price: number | null) => void;
  setCurrency: (currency: string) => void;
  setPriceSource: (source: "AI" | "USER") => void;
  setCompareResult: (result: PriceCompareResult | null) => void;
  setPendingFile: (file: File | null) => void;
  reset: () => void;
}

export const usePriceStore = create<PriceStore>((set) => ({
  imageId: null,
  localPrice: null,
  currency: "JPY",
  priceSource: "USER",
  compareResult: null,
  pendingFile: null,
  setImageId: (id) => set({ imageId: id }),
  setLocalPrice: (price) => set({ localPrice: price }),
  setCurrency: (currency) => set({ currency }),
  setPriceSource: (source) => set({ priceSource: source }),
  setCompareResult: (result) => set({ compareResult: result }),
  setPendingFile: (file) => set({ pendingFile: file }),
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
