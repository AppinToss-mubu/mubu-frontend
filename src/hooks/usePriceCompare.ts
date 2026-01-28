/**
 * 가격 비교 API 훅
 * - React Query를 사용한 서버 상태 관리
 * - compare-with-image, summary, external-link API 호출
 */

import { useMutation, useQuery } from "@tanstack/react-query";
import {
  compareWithImageAPI,
  getSummaryAPI,
  getExternalLinkAPI,
} from "../api/price";

/**
 * 이미지 기반 가격 비교 뮤테이션
 */
export const useCompareWithImage = () => {
  return useMutation({
    mutationFn: (file: File) => compareWithImageAPI(file),
  });
};

/**
 * 가격 비교 결과 요약 쿼리
 */
export const useSummary = (
  imageId: string | null,
  localPrice: number | null,
  currency: string,
  priceSource: "AI" | "USER",
  enabled: boolean
) => {
  return useQuery({
    queryKey: ["summary", imageId, localPrice, currency, priceSource],
    queryFn: () => {
      if (!imageId || localPrice === null) {
        throw new Error("필수 파라미터가 없습니다");
      }
      return getSummaryAPI(imageId, localPrice, currency, priceSource);
    },
    enabled: enabled && imageId !== null && localPrice !== null,
    retry: 1,
  });
};

/**
 * 외부 링크 조회 쿼리
 */
export const useExternalLink = (productName: string | null, enabled: boolean) => {
  return useQuery({
    queryKey: ["externalLink", productName],
    queryFn: () => {
      if (!productName) {
        throw new Error("상품명이 없습니다");
      }
      return getExternalLinkAPI(productName);
    },
    enabled: enabled && productName !== null,
    retry: 1,
  });
};
