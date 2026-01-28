/**
 * API 타입 정의
 * - PriceCompareResult: 이미지 비교 결과
 * - PriceCompareSummaryRequest/Response: 요약 요청/응답
 * - ExternalLink: 외부 링크 관련 타입
 */

/**
 * 이미지 기반 가격 비교 결과
 * - localPrice/localCurrency는 AI가 현지 가격을 인식했을 때만 내려오는 선택 값
 */
export interface PriceCompareResult {
  imageId: string;
  aiText: string;
  productName: string;
  lowestPrice: number;
  mallName: string;
  link: string;
  image: string;
  localPrice?: number;
  localCurrency?: string;
}

/**
 * 가격 비교 요약 요청
 */
export interface PriceCompareSummaryRequest {
  imageId: string;
  localPrice: number;
  currency: string; // 'JPY', 'USD', 'CNY', etc.
  priceSource: "AI" | "USER";
}

/**
 * 가격 비교 요약 응답
 */
export interface PriceCompareSummaryResponse {
  summary: string; // "한국에서 사면 8,200원 절약!"
  savedAmount: number; // 절약 금액 (KRW)
  localPriceKrw: number; // 현지 가격 환산 (KRW)
  koreaPrice: number; // 한국 최저가
}