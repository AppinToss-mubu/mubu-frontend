/**
 * 가격 확인 페이지 (PriceConfirm)
 * - AI가 감지한 가격을 보여주고 사용자가 확인/수정하는 중간 단계
 * - 확인 후 Result 페이지로 이동하여 최종 결과 표시
 */

import { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { PriceInput } from "../components/PriceInput";
import { usePriceStore } from "../store/priceStore";

function PriceConfirm() {
  const { imageId } = useParams<{ imageId: string }>();
  const navigate = useNavigate();
  const { compareResult, setLocalPrice, setCurrency, setPriceSource } =
    usePriceStore();

  // imageId가 없거나 compareResult가 없으면 홈으로 리다이렉트
  useEffect(() => {
    if (!imageId || imageId === "undefined") {
      navigate("/");
      return;
    }
    if (!compareResult) {
      // compareResult가 없으면 홈으로 돌아가기 (에러가 발생했거나 세션이 만료된 경우)
      navigate("/");
    }
  }, [imageId, compareResult, navigate]);

  const handlePriceConfirm = (price: number, selectedCurrency: string) => {
    // AI가 인식한 가격/통화와 동일하면 priceSource를 AI로, 아니면 USER로 설정
    const fromAi =
      compareResult?.localPrice != null &&
      compareResult?.localCurrency &&
      Math.abs(compareResult.localPrice - Math.round(price)) < 1 &&
      compareResult.localCurrency.toUpperCase() === selectedCurrency.toUpperCase();

    setLocalPrice(price);
    setCurrency(selectedCurrency);
    setPriceSource(fromAi ? "AI" : "USER");

    // 가격 확인 후 Result 페이지로 이동
    navigate(`/result/${imageId}`);
  };

  if (!compareResult) {
    return null;
  }

  return (
    <div>
      {/* 뒤로가기 버튼 */}
      <div style={{ marginTop: 8, marginBottom: 8 }}>
        <button
          onClick={() => navigate(-1)}
          style={{
            background: "transparent",
            border: "none",
            fontSize: 20,
            cursor: "pointer",
            color: "var(--fg)",
            padding: "4px 8px",
            display: "flex",
            alignItems: "center",
          }}
          aria-label="뒤로가기"
        >
          ←
        </button>
      </div>

      <div style={{ marginTop: 10 }}>
        <div style={{ fontSize: 18, color: "var(--muted)" }}>가격 확인</div>
        <div style={{ fontSize: 24, fontWeight: 800, marginTop: 6 }}>
          현지 가격을 확인해주세요
        </div>
        <div
          style={{
            fontSize: 14,
            color: "var(--muted)",
            marginTop: 10,
            lineHeight: 1.6,
          }}
        >
          AI가 인식한 가격이 맞는지 확인하거나 수정해주세요.
        </div>
      </div>

      {/* 상품 정보 카드 */}
      <div
        style={{
          marginTop: 18,
          marginBottom: 18,
          padding: 16,
          borderRadius: 16,
          border: "1px solid var(--border)",
          background: "var(--card)",
        }}
      >
        <div style={{ fontSize: 13, color: "var(--muted)", marginBottom: 8 }}>
          인식된 상품
        </div>
        <div
          style={{
            fontSize: 16,
            fontWeight: 700,
            color: "var(--fg)",
            padding: "12px",
            borderRadius: 8,
            background: "var(--bg)",
            border: "1px solid var(--border)",
          }}
        >
          {compareResult.productName || "상품명을 인식하지 못했습니다"}
        </div>
        {compareResult.image && (
          <div style={{ marginTop: 12 }}>
            <img
              src={compareResult.image}
              alt={compareResult.productName}
              style={{
                width: "100%",
                maxHeight: 200,
                objectFit: "cover",
                borderRadius: 12,
              }}
            />
          </div>
        )}
      </div>

      {/* AI가 인식한 가격이 있는 경우 */}
      {compareResult.localPrice != null && compareResult.localCurrency ? (
        <div
          style={{
            marginTop: 16,
            marginBottom: 16,
            padding: 18,
            borderRadius: 16,
            border: "1px solid var(--border)",
            background: "var(--bg)",
          }}
        >
          <div
            style={{
              fontSize: 13,
              color: "var(--muted)",
              marginBottom: 8,
            }}
          >
            감지된 가격
          </div>
          <div
            style={{
              padding: 16,
              borderRadius: 12,
              background: "var(--card)",
            }}
          >
            <div
              style={{
                fontSize: 26,
                fontWeight: 800,
                marginBottom: 4,
              }}
            >
              {compareResult.localPrice.toLocaleString()}{" "}
              {compareResult.localCurrency}
            </div>
            <div
              style={{
                fontSize: 13,
                color: "var(--muted)",
              }}
            >
              이 가격이 맞나요?
            </div>
          </div>

          {/* 샘플 앱과 비슷한 버튼 구성: 수정 / 맞아요 */}
          <div
            style={{
              display: "flex",
              gap: 10,
              marginTop: 14,
            }}
          >
            <button
              type="button"
              onClick={() => {
                // 수정: 아래 입력 폼에서 다시 입력하도록 스크롤만 유도
                const el = document.getElementById("price");
                el?.scrollIntoView({ behavior: "smooth", block: "center" });
                (el as HTMLInputElement | null)?.focus();
              }}
              style={{
                flex: 1,
                padding: "10px 12px",
                borderRadius: 10,
                border: "1px solid var(--border)",
                background: "var(--card)",
                color: "var(--fg)",
                fontWeight: 700,
                cursor: "pointer",
              }}
            >
              수정
            </button>
            <button
              type="button"
              onClick={() => {
                // 맞아요: AI가 인식한 가격을 그대로 확정
                handlePriceConfirm(
                  compareResult.localPrice!,
                  compareResult.localCurrency!
                );
              }}
              style={{
                flex: 1,
                padding: "10px 12px",
                borderRadius: 10,
                border: "none",
                background: "var(--primary)",
                color: "var(--primary-contrast)",
                fontWeight: 700,
                cursor: "pointer",
              }}
            >
              맞아요
            </button>
          </div>
        </div>
      ) : (
        <div
          style={{
            marginTop: 16,
            marginBottom: 16,
            padding: 16,
            borderRadius: 16,
            border: "1px solid var(--border)",
            background: "var(--card)",
          }}
        >
          <div
            style={{
              fontSize: 14,
              color: "var(--muted)",
            }}
          >
            AI가 가격을 인식하지 못했습니다. 직접 입력해주세요.
          </div>
        </div>
      )}

      {/* 가격 입력 폼 */}
      <div style={{ marginTop: 24 }}>
        <PriceInput
          onSubmit={handlePriceConfirm}
          initialPrice={compareResult.localPrice ?? null}
          initialCurrency={compareResult.localCurrency ?? "JPY"}
        />
      </div>
    </div>
  );
}

export default PriceConfirm;
