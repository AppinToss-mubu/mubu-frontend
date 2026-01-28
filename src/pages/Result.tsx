/**
 * 결과 페이지 (Result)
 * - 가격 확인 후 최종 비교 결과를 보여주는 페이지
 * - 절약 금액/요약 문구/외부 링크 표시
 */

import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { SummaryCard } from "../components/SummaryCard";
import { ExternalLink } from "../components/ExternalLink";
import { useSummary, useExternalLink } from "../hooks/usePriceCompare";
import { useRecentComparisons } from "../hooks/useRecentComparisons";
import { usePriceStore } from "../store/priceStore";

function Result() {
  const { imageId } = useParams<{ imageId: string }>();
  const navigate = useNavigate();
  const { localPrice, currency, priceSource, compareResult } = usePriceStore();
  const [productName, setProductName] = useState<string | null>(null);
  const { add: addRecent } = useRecentComparisons();

  // 가격이 입력되었을 때만 summary 쿼리 활성화
  const {
    data: summaryData,
    isLoading: isSummaryLoading,
    error: summaryError,
  } = useSummary(
    imageId || null,
    localPrice,
    currency,
    priceSource,
    localPrice !== null
  );

  // 요약 생성 성공 시 "최근 비교" 저장
  useEffect(() => {
    if (!summaryData) return;
    if (!imageId) return;
    if (!compareResult?.productName) return;

    addRecent({
      id: imageId,
      productName: compareResult.productName,
      savedAmount: summaryData.savedAmount,
      createdAt: Date.now(),
    });
  }, [addRecent, compareResult?.productName, imageId, summaryData]);

  // compareResult에서 상품명 추출 (외부 링크용)
  useEffect(() => {
    if (compareResult?.productName) {
      setProductName(compareResult.productName);
    }
  }, [compareResult]);

  // 외부 링크 쿼리 (상품명이 있을 때만 활성화)
  const {
    data: externalLinkUrl,
    isLoading: isLinkLoading,
  } = useExternalLink(productName, !!productName);

  // imageId나 localPrice가 없으면 PriceConfirm으로 리다이렉트
  useEffect(() => {
    if (!imageId) {
      navigate("/");
      return;
    }
    if (localPrice === null) {
      navigate(`/price-confirm/${imageId}`);
    }
  }, [imageId, localPrice, navigate]);

  if (localPrice === null) {
    return null;
  }

  return (
    <div>
      <div style={{ marginTop: 18 }}>
        <div style={{ fontSize: 18, color: "var(--muted)" }}>비교 결과</div>
        <div style={{ fontSize: 24, fontWeight: 800, marginTop: 6 }}>
          가격 비교 완료
        </div>
      </div>

      {summaryError && (
        <div
          style={{
            marginTop: 18,
            marginBottom: 12,
            padding: 12,
            borderRadius: 12,
            backgroundColor: "var(--danger-bg)",
            color: "var(--danger-fg)",
            border: "1px solid var(--border)",
          }}
        >
          {summaryError.message || "요약 생성에 실패했습니다. 잠시 후 다시 시도해 주세요."}
        </div>
      )}

      {summaryData && (
        <div style={{ marginTop: 18 }}>
          <SummaryCard summary={summaryData} isLoading={isSummaryLoading} />
        </div>
      )}

      {externalLinkUrl && (
        <div style={{ marginTop: 18 }}>
          <ExternalLink url={externalLinkUrl}>
            <button
              style={{
                width: "100%",
                padding: "14px 18px",
                fontSize: 16,
                borderRadius: 14,
                border: "1px solid var(--border)",
                backgroundColor: "#16a34a",
                color: "#ffffff",
                cursor: "pointer",
                fontWeight: 700,
              }}
            >
              {isLinkLoading ? "링크 준비 중..." : "네이버 쇼핑에서 보기"}
            </button>
          </ExternalLink>
        </div>
      )}

      <div style={{ marginTop: 18 }}>
        <button
          onClick={() => navigate(`/price-confirm/${imageId}`)}
          style={{
            width: "100%",
            padding: "12px 18px",
            fontSize: 15,
            backgroundColor: "var(--card)",
            color: "var(--fg)",
            border: "1px solid var(--border)",
            borderRadius: 14,
            cursor: "pointer",
          }}
        >
          가격 다시 입력하기
        </button>
      </div>

      <div style={{ marginTop: 12 }}>
        <button
          onClick={() => navigate("/")}
          style={{
            width: "100%",
            padding: "12px 18px",
            fontSize: 15,
            backgroundColor: "transparent",
            color: "#2563eb",
            border: "1px solid #2563eb",
            borderRadius: 14,
            cursor: "pointer",
          }}
        >
          새로 비교하기
        </button>
      </div>
    </div>
  );
}

export default Result;