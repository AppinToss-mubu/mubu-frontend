/**
 * 요약 결과 카드 컴포넌트
 * - 절약 금액, 요약 문구, 현지 가격/한국 가격을 카드 형태로 보여줌
 */

import type { PriceCompareSummaryResponse } from "../api/types";

interface SummaryCardProps {
  summary: PriceCompareSummaryResponse;
  isLoading?: boolean;
}

const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat("ko-KR").format(amount);
};

export const SummaryCard = ({ summary, isLoading = false }: SummaryCardProps) => {
  const { summary: summaryText, savedAmount, localPriceKrw, koreaPrice } = summary;

  return (
    <div
      style={{
        padding: 20,
        borderRadius: 16,
        backgroundColor: "var(--card)",
        border: "1px solid var(--border)",
      }}
    >
      {isLoading ? (
        <div style={{ textAlign: "center" }}>
          <p>결과를 계산하는 중...</p>
        </div>
      ) : (
        <>
          <div style={{ marginBottom: 16 }}>
            <h2
              style={{
                fontSize: 18,
                fontWeight: 800,
                margin: 0,
                marginBottom: 8,
              }}
            >
              비교 결과
            </h2>
            <p
              style={{
                fontSize: 16,
                margin: 0,
                color: savedAmount > 0 ? "#16a34a" : savedAmount < 0 ? "#dc2626" : "var(--muted)",
              }}
            >
              {summaryText}
            </p>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                padding: 12,
                backgroundColor: "var(--bg)",
                borderRadius: 12,
              }}
            >
              <span style={{ fontSize: 13, color: "var(--muted)" }}>현지 가격 (KRW 환산)</span>
              <span style={{ fontSize: 15, fontWeight: 700 }}>
                {formatCurrency(localPriceKrw)}원
              </span>
            </div>

            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                padding: 12,
                backgroundColor: "var(--bg)",
                borderRadius: 12,
              }}
            >
              <span style={{ fontSize: 13, color: "var(--muted)" }}>한국 최저가</span>
              <span style={{ fontSize: 15, fontWeight: 700 }}>
                {formatCurrency(koreaPrice)}원
              </span>
            </div>

            {savedAmount !== 0 && (
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  padding: 12,
                  borderRadius: 12,
                  backgroundColor: savedAmount > 0 ? "#dcfce7" : "#fee2e2",
                  border: `1px solid ${savedAmount > 0 ? "#bbf7d0" : "#fecaca"}`,
                }}
              >
                <span style={{ fontSize: 13, fontWeight: 700 }}>
                  {savedAmount > 0 ? "절약 금액" : "추가 비용"}
                </span>
                <span
                  style={{
                    fontSize: 16,
                    fontWeight: 800,
                    color: savedAmount > 0 ? "#15803d" : "#b91c1c",
                  }}
                >
                  {savedAmount > 0 ? "+" : ""}
                  {formatCurrency(Math.abs(savedAmount))}원
                </span>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
};
