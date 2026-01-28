/**
 * 결과 페이지 (Result)
 * - 스크린샷 5번 기준 UI
 * - 수량 선택기, 가격 비교 테이블, 절약 금액, 액션 버튼
 */

import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useSummary, useExternalLink } from "../hooks/usePriceCompare";
import { useRecentComparisons } from "../hooks/useRecentComparisons";
import { usePriceStore } from "../store/priceStore";
import { TDSNumericSpinner, TDSButton } from "../components/tds";
import { isTossEnvironment } from "../utils/env";

const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat("ko-KR").format(amount);
};

const getCurrencySymbol = (currency: string): string => {
  const symbols: Record<string, string> = {
    THB: "฿",
    JPY: "¥",
    USD: "$",
    CNY: "¥",
    EUR: "€",
    KRW: "₩",
    SGD: "S$",
    VND: "₫",
    PHP: "₱",
    IDR: "Rp",
    HKD: "HK$",
    TWD: "NT$",
  };
  return symbols[currency.toUpperCase()] || currency;
};

function Result() {
  const { imageId } = useParams<{ imageId: string }>();
  const navigate = useNavigate();
  const { localPrice, currency, priceSource, compareResult } = usePriceStore();
  const [productName, setProductName] = useState<string | null>(null);
  const [quantity, setQuantity] = useState(1);
  const { add: addRecent } = useRecentComparisons();

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

  useEffect(() => {
    if (compareResult?.productName) {
      setProductName(compareResult.productName);
    }
  }, [compareResult]);

  const { data: externalLinkUrl } = useExternalLink(productName, !!productName);

  useEffect(() => {
    if (!imageId) {
      navigate("/");
      return;
    }
    if (localPrice === null) {
      navigate(`/price-confirm/${imageId}`);
    }
  }, [imageId, localPrice, navigate]);

  if (localPrice === null || !compareResult) {
    return null;
  }

  const currencySymbol = getCurrencySymbol(currency);
  const localUnitPrice = localPrice;
  const koreaUnitPrice = summaryData?.koreaPrice || 0;
  const localTotal = localUnitPrice * quantity;
  const koreaTotal = koreaUnitPrice * quantity;
  const localTotalKrw = (summaryData?.localPriceKrw || 0) * quantity;
  const savedTotal = localTotalKrw - koreaTotal;
  const hasKoreaPrice = koreaUnitPrice > 0;

  const handleViewKoreaPrice = () => {
    if (externalLinkUrl) {
      window.open(externalLinkUrl, "_blank");
    }
  };

  const handlePurchase = () => {
    if (externalLinkUrl) {
      window.open(externalLinkUrl, "_blank");
    }
  };

  return (
    <div style={{ paddingBottom: 100 }}>
      <div
        style={{
          padding: 20,
          borderRadius: 16,
          backgroundColor: "var(--card)",
          border: "1px solid var(--border)",
        }}
      >
        <h2
          style={{
            fontSize: 18,
            fontWeight: 700,
            margin: 0,
            marginBottom: 4,
            color: "var(--fg)",
          }}
        >
          {compareResult.productName}
        </h2>
        <p
          style={{
            fontSize: 13,
            color: "var(--muted)",
            margin: 0,
          }}
        >
          출처: {hasKoreaPrice ? compareResult.mallName : "한국 가격 정보 없음"}
        </p>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 20,
            marginTop: 20,
            marginBottom: 20,
          }}
        >
          <span style={{ fontSize: 14, color: "var(--muted)" }}>수량</span>
          {isTossEnvironment() ? (
            <TDSNumericSpinner
              value={quantity}
              onChange={setQuantity}
              min={1}
              max={99}
              size="large"
              decreaseAriaLabel="수량 줄이기"
              increaseAriaLabel="수량 늘리기"
            />
          ) : (
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 16,
                padding: "8px 16px",
                borderRadius: 24,
                backgroundColor: "var(--bg)",
                border: "1px solid var(--border)",
              }}
            >
              <button
                onClick={() => setQuantity((prev) => Math.max(1, prev - 1))}
                disabled={quantity <= 1}
                style={{
                  width: 32,
                  height: 32,
                  borderRadius: "50%",
                  border: "1px solid var(--border)",
                  backgroundColor: "var(--card)",
                  fontSize: 18,
                  cursor: quantity > 1 ? "pointer" : "not-allowed",
                  opacity: quantity > 1 ? 1 : 0.5,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                −
              </button>
              <span style={{ fontSize: 18, fontWeight: 700, minWidth: 24, textAlign: "center" }}>
                {quantity}
              </span>
              <button
                onClick={() => setQuantity((prev) => prev + 1)}
                style={{
                  width: 32,
                  height: 32,
                  borderRadius: "50%",
                  border: "1px solid var(--border)",
                  backgroundColor: "var(--card)",
                  fontSize: 18,
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                +
              </button>
            </div>
          )}
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: 12,
            marginBottom: 16,
          }}
        >
          <div
            style={{
              padding: 16,
              borderRadius: 12,
              backgroundColor: "var(--bg)",
              textAlign: "center",
            }}
          >
            <div style={{ fontSize: 12, color: "var(--muted)", marginBottom: 6 }}>현지 단가</div>
            <div style={{ fontSize: 20, fontWeight: 700 }}>
              {localUnitPrice.toLocaleString()}{currencySymbol}
            </div>
          </div>
          <div
            style={{
              padding: 16,
              borderRadius: 12,
              backgroundColor: "var(--bg)",
              textAlign: "center",
            }}
          >
            <div style={{ fontSize: 12, color: "var(--muted)", marginBottom: 6 }}>한국 단가</div>
            <div style={{ fontSize: 20, fontWeight: 700 }}>
              {hasKoreaPrice ? `₩${formatCurrency(koreaUnitPrice)}` : "₩0"}
            </div>
          </div>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: 12,
          }}
        >
          <div
            style={{
              padding: 16,
              borderRadius: 12,
              backgroundColor: "var(--bg)",
              textAlign: "center",
            }}
          >
            <div style={{ fontSize: 12, color: "var(--muted)", marginBottom: 6 }}>현지 총액</div>
            <div style={{ fontSize: 18, fontWeight: 700 }}>
              {localTotal.toLocaleString()}{currencySymbol}
            </div>
            <div style={{ fontSize: 12, color: "var(--muted)", marginTop: 4 }}>
              ₩{formatCurrency(localTotalKrw)}
            </div>
          </div>
          <div
            style={{
              padding: 16,
              borderRadius: 12,
              backgroundColor: "var(--bg)",
              textAlign: "center",
            }}
          >
            <div style={{ fontSize: 12, color: "var(--muted)", marginBottom: 6 }}>한국 총액</div>
            <div style={{ fontSize: 18, fontWeight: 700 }}>
              {hasKoreaPrice ? `₩${formatCurrency(koreaTotal)}` : "₩0"}
            </div>
          </div>
        </div>
      </div>

      {summaryError && (
        <div
          style={{
            marginTop: 16,
            padding: 16,
            borderRadius: 12,
            backgroundColor: "#fee2e2",
            color: "#b91c1c",
            textAlign: "center",
          }}
        >
          {summaryError.message || "가격 비교에 실패했습니다."}
        </div>
      )}

      {isSummaryLoading ? (
        <div
          style={{
            marginTop: 16,
            padding: 24,
            borderRadius: 16,
            backgroundColor: "var(--card)",
            textAlign: "center",
          }}
        >
          계산 중...
        </div>
      ) : !hasKoreaPrice ? (
        <div
          style={{
            marginTop: 16,
            padding: 24,
            borderRadius: 16,
            background: "linear-gradient(135deg, #fef3c7 0%, #fde68a 100%)",
            textAlign: "center",
          }}
        >
          <div style={{ fontSize: 36, marginBottom: 8 }}>🔍</div>
          <div
            style={{
              fontSize: 18,
              fontWeight: 700,
              color: "#92400e",
              marginBottom: 8,
            }}
          >
            한국에서 구할 수 없을 수도 있어요
          </div>
          <div
            style={{
              fontSize: 13,
              color: "#a16207",
              lineHeight: 1.6,
            }}
          >
            이 상품은 한국에서 판매되지 않거나<br />
            정확히 일치하는 상품을 찾지 못했어요
          </div>
          <div
            style={{
              marginTop: 16,
              padding: 12,
              borderRadius: 8,
              backgroundColor: "rgba(255,255,255,0.6)",
              fontSize: 13,
              color: "#78350f",
            }}
          >
            💡 현지에서 구매하시는 걸 추천해요!<br />
            현지가: <strong>{localTotal.toLocaleString()}{currencySymbol}</strong> (약 ₩{formatCurrency(localTotalKrw)})
          </div>
        </div>
      ) : (
        <div
          style={{
            marginTop: 16,
            padding: 24,
            borderRadius: 16,
            background: savedTotal > 0
              ? "linear-gradient(135deg, #e0f2fe 0%, #dbeafe 100%)"
              : savedTotal < 0
              ? "linear-gradient(135deg, #dcfce7 0%, #d1fae5 100%)"
              : "var(--card)",
            textAlign: "center",
          }}
        >
          <div
            style={{
              fontSize: 14,
              color: "var(--muted)",
              marginBottom: 4,
            }}
          >
            {(savedTotal > 0 ? "−" : savedTotal < 0 ? "+" : "−") + " 총 절약"}
          </div>
          <div
            style={{
              fontSize: 28,
              fontWeight: 800,
              color: savedTotal > 0 ? "#0369a1" : savedTotal < 0 ? "#15803d" : "var(--fg)",
            }}
          >
            {`${Math.abs(savedTotal).toLocaleString()}원`}
          </div>
          <div
            style={{
              fontSize: 13,
              color: "var(--muted)",
              marginTop: 8,
            }}
          >
            {savedTotal > 0
              ? "한국에서 사는 것이 더 저렴해요"
              : savedTotal < 0
              ? "현지에서 사는 것이 더 저렴해요"
              : "한국과 현지 가격이 동일해요"}
          </div>
        </div>
      )}

      {hasKoreaPrice ? (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: 12,
            marginTop: 16,
          }}
        >
          {isTossEnvironment() ? (
            <>
              <TDSButton onClick={handleViewKoreaPrice} disabled={!externalLinkUrl} color="light" variant="weak" size="large" style={{ border: "1px solid var(--border)" }}>
                <span>↗</span> 한국가격 보기
              </TDSButton>
              <TDSButton onClick={handlePurchase} disabled={!externalLinkUrl} color="dark" variant="fill" size="large">
                <span>✓</span> 구매함
              </TDSButton>
            </>
          ) : (
            <>
              <button
                onClick={handleViewKoreaPrice}
                disabled={!externalLinkUrl}
                style={{
                  padding: "14px 16px",
                  borderRadius: 12,
                  border: "1px solid var(--border)",
                  backgroundColor: "var(--card)",
                  color: "var(--fg)",
                  fontSize: 14,
                  fontWeight: 600,
                  cursor: externalLinkUrl ? "pointer" : "not-allowed",
                  opacity: externalLinkUrl ? 1 : 0.5,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 6,
                }}
              >
                <span>↗</span> 한국가격 보기
              </button>
              <button
                onClick={handlePurchase}
                disabled={!externalLinkUrl}
                style={{
                  padding: "14px 16px",
                  borderRadius: 12,
                  border: "none",
                  backgroundColor: "#1f2937",
                  color: "#ffffff",
                  fontSize: 14,
                  fontWeight: 600,
                  cursor: externalLinkUrl ? "pointer" : "not-allowed",
                  opacity: externalLinkUrl ? 1 : 0.5,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 6,
                }}
              >
                <span>✓</span> 구매함
              </button>
            </>
          )}
        </div>
      ) : (
        <div style={{ marginTop: 16 }}>
          {isTossEnvironment() ? (
            <TDSButton onClick={() => navigate("/")} color="dark" variant="fill" size="large" display="full">
              다른 상품 비교하기
            </TDSButton>
          ) : (
            <button
              onClick={() => navigate("/")}
              style={{
                width: "100%",
                padding: "14px 16px",
                borderRadius: 12,
                border: "none",
                backgroundColor: "#1f2937",
                color: "#ffffff",
                fontSize: 14,
                fontWeight: 600,
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 6,
              }}
            >
              다른 상품 비교하기
            </button>
          )}
        </div>
      )}

      <div
        style={{
          marginTop: 16,
          padding: 16,
          fontSize: 11,
          color: "var(--muted)",
          textAlign: "center",
          lineHeight: 1.6,
        }}
      >
        <p style={{ margin: 0, marginBottom: 4 }}>
          ⓘ 해당 링크를 통해 구매 시 소정의 수수료를 받을 수 있습니다
        </p>
        <p style={{ margin: 0 }}>
          ※ 가격 및 환율은 실시간 변동 가능하며, 동일 모델/옵션 기준으로 비교되었습니다
        </p>
      </div>
    </div>
  );
}

export default Result;
