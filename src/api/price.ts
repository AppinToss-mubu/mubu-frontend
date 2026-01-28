/**
 * 가격 비교 API 클라이언트
 * - compareWithImageAPI: 이미지 업로드 및 가격 비교
 * - getSummaryAPI: 가격 비교 결과 요약
 * - getExternalLinkAPI: 외부 쇼핑 링크 조회
 */

import type {
  PriceCompareResult,
  PriceCompareSummaryRequest,
  PriceCompareSummaryResponse,
} from "./types";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:8080";

// 앱 시작 시 API URL 확인용 로그
console.log("========================================");
console.log("[API] VITE_API_BASE_URL:", import.meta.env.VITE_API_BASE_URL);
console.log("[API] 최종 API_BASE_URL:", API_BASE_URL);
console.log("========================================");

/**
 * 이미지 기반 가격 비교 API
 * - 프론트엔드에서 imageId를 미리 생성해서 함께 전송한다.
 *   (서버가 imageId를 응답에 포함하지 않더라도, 클라이언트에서 동일한 값을 사용 가능)
 */
export const compareWithImageAPI = async (
  file: File,
): Promise<PriceCompareResult> => {
  const formData = new FormData();

  // 프론트에서 고유 imageId 생성 (crypto.randomUUID 지원 시 사용)
  const clientImageId =
    typeof crypto !== "undefined" && typeof crypto.randomUUID === "function"
      ? crypto.randomUUID()
      : `web_${Date.now()}`;

  formData.append("file", file);
  formData.append("imageId", clientImageId);

  console.log("[API] 요청 시작:", `${API_BASE_URL}/api/price/compare-with-image`);
  
  const response = await fetch(`${API_BASE_URL}/api/price/compare-with-image`, {
    method: "POST",
    body: formData,
  });

  console.log("[API] 응답 상태:", response.status, response.ok);

  const json = await response.json().catch((e) => {
    console.error("[API] JSON 파싱 실패:", e);
    return {};
  });
  
  console.log("[API] 응답 데이터:", json);
  
  // 400 에러지만 상품 정보가 있으면 (한국 가격만 못 찾은 경우) 결과 반환
  if (!response.ok) {
    // 상품 정보는 있지만 한국 가격을 못 찾은 경우
    if (json.productName) {
      return {
        imageId: json.imageId || clientImageId,
        aiText: json.aiText || "",
        productName: json.productName,
        lowestPrice: 0,
        mallName: "",
        link: "",
        image: "",
        localPrice: json.localPrice,
        localCurrency: json.localCurrency,
      } as PriceCompareResult;
    }
    throw new Error(json.message || "가격 비교 실패");
  }

  // 서버에서 imageId를 내려주지 않더라도, 클라이언트에서 생성한 값을 보정해서 사용
  return {
    ...(json as PriceCompareResult),
    imageId: (json as PriceCompareResult).imageId || clientImageId,
  };
};

/**
 * 가격 비교 결과 요약 API
 */
export const getSummaryAPI = async (
  imageId: string,
  localPrice: number,
  currency: string,
  priceSource: "AI" | "USER",
): Promise<PriceCompareSummaryResponse> => {
  const requestBody: PriceCompareSummaryRequest = {
    imageId,
    localPrice,
    currency,
    priceSource,
  };

  const response = await fetch(`${API_BASE_URL}/api/price/result/summary`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(requestBody),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || "요약 생성 실패");
  }

  return response.json();
};

/**
 * 외부 쇼핑 링크 조회 API
 */
export const getExternalLinkAPI = async (
  productName: string,
): Promise<string> => {
  const response = await fetch(
    `${API_BASE_URL}/api/price/external/link?productName=${encodeURIComponent(
      productName,
    )}`,
  );

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || "링크 조회 실패");
  }

  return response.text();
};
