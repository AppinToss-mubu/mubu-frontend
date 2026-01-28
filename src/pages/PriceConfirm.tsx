/**
 * 가격 확인 페이지 (PriceConfirm)
 * - 스크린샷 4번 기준 UI
 * - 상품 이미지 상단, 감지된 가격 카드, 수정/맞아요 버튼
 */

import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { usePriceStore } from "../store/priceStore";
import { TDSButton, TDSTextField } from "../components/tds";
import { isTossEnvironment } from "../utils/env";

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
    AUD: "A$",
  };
  return symbols[currency.toUpperCase()] || currency;
};

function PriceConfirm() {
  const { imageId } = useParams<{ imageId: string }>();
  const navigate = useNavigate();
  const { compareResult, setLocalPrice, setCurrency, setPriceSource } =
    usePriceStore();

  const [editMode, setEditMode] = useState(false);
  const [editPrice, setEditPrice] = useState("");
  const [editCurrency, setEditCurrency] = useState("THB");

  useEffect(() => {
    if (!imageId || imageId === "undefined") {
      navigate("/");
      return;
    }
    if (!compareResult) {
      navigate("/");
    }
  }, [imageId, compareResult, navigate]);

  useEffect(() => {
    if (compareResult?.localPrice != null) {
      setEditPrice(compareResult.localPrice.toString());
    }
    if (compareResult?.localCurrency) {
      setEditCurrency(compareResult.localCurrency);
    }
  }, [compareResult]);

  const handleConfirm = () => {
    if (!compareResult) return;

    const price = compareResult.localPrice!;
    const curr = compareResult.localCurrency!;

    setLocalPrice(price);
    setCurrency(curr);
    setPriceSource("AI");
    navigate(`/result/${imageId}`);
  };

  const handleEdit = () => {
    setEditMode(true);
  };

  const handleEditSubmit = () => {
    const price = parseFloat(editPrice);
    if (isNaN(price) || price <= 0) {
      alert("올바른 가격을 입력해주세요.");
      return;
    }

    setLocalPrice(price);
    setCurrency(editCurrency);
    setPriceSource("USER");
    navigate(`/result/${imageId}`);
  };

  const handleClose = () => {
    navigate("/");
  };

  if (!compareResult) {
    return null;
  }

  const currencySymbol = getCurrencySymbol(
    compareResult.localCurrency || editCurrency,
  );
  const hasAiPrice =
    compareResult.localPrice != null && compareResult.localCurrency;

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "var(--bg)" }}>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "16px 20px",
          borderBottom: "1px solid var(--border)",
        }}
      >
        <h1 style={{ fontSize: 17, fontWeight: 600, margin: 0 }}>가격 확인</h1>
        <button
          onClick={handleClose}
          style={{
            background: "transparent",
            border: "none",
            fontSize: 24,
            cursor: "pointer",
            color: "var(--muted)",
            padding: 4,
          }}
          aria-label="닫기"
        >
          ×
        </button>
      </div>

      <div style={{ padding: "0 20px" }}>
        {compareResult.image && (
          <div
            style={{
              marginTop: 20,
              borderRadius: 16,
              overflow: "hidden",
              border: "1px solid var(--border)",
            }}
          >
            <img
              src={compareResult.image}
              alt={compareResult.productName}
              style={{
                width: "100%",
                height: 240,
                objectFit: "cover",
              }}
            />
          </div>
        )}

        <div style={{ marginTop: 20 }}>
          <h2
            style={{
              fontSize: 18,
              fontWeight: 700,
              margin: 0,
              marginBottom: 4,
              color: "var(--fg)",
              lineHeight: 1.4,
            }}
          >
            {compareResult.productName || "상품명 인식 실패"}
          </h2>
          <p
            style={{
              fontSize: 14,
              color: "var(--muted)",
              margin: 0,
            }}
          >
            {compareResult.mallName || ""}
          </p>
        </div>

        {!editMode && hasAiPrice && (
          <div
            style={{
              marginTop: 24,
              padding: 20,
              borderRadius: 16,
              backgroundColor: "var(--card)",
              border: "1px solid var(--border)",
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
                fontSize: 36,
                fontWeight: 800,
                color: "var(--fg)",
              }}
            >
              {currencySymbol}
              {compareResult.localPrice?.toLocaleString()}
            </div>
            <div
              style={{
                fontSize: 13,
                color: "var(--muted)",
                marginTop: 4,
              }}
            >
              원본: {compareResult.localPrice?.toFixed(2)}
            </div>

            <div
              style={{
                textAlign: "center",
                marginTop: 24,
                marginBottom: 16,
                fontSize: 14,
                color: "var(--muted)",
              }}
            >
              이 가격이 맞나요?
            </div>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: 12,
              }}
            >
              {isTossEnvironment() ? (
                <>
                  <TDSButton
                    onClick={handleEdit}
                    color="primary"
                    variant="weak"
                    size="large"
                  >
                    <span>✎</span> 수정
                  </TDSButton>
                  <TDSButton
                    onClick={handleConfirm}
                    color="primary"
                    variant="fill"
                    size="large"
                  >
                    <span>✓</span> 맞아요
                  </TDSButton>
                </>
              ) : (
                <>
                  <button
                    onClick={handleEdit}
                    style={{
                      padding: "14px 16px",
                      borderRadius: 12,
                      border: "1px solid var(--border)",
                      backgroundColor: "var(--bg)",
                      color: "var(--fg)",
                      fontSize: 15,
                      fontWeight: 600,
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: 6,
                    }}
                  >
                    <span>✎</span> 수정
                  </button>
                  <button
                    onClick={handleConfirm}
                    style={{
                      padding: "14px 16px",
                      borderRadius: 12,
                      border: "none",
                      backgroundColor: "#1f2937",
                      color: "#ffffff",
                      fontSize: 15,
                      fontWeight: 600,
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: 6,
                    }}
                  >
                    <span>✓</span> 맞아요
                  </button>
                </>
              )}
            </div>
          </div>
        )}

        {(editMode || !hasAiPrice) && (
          <div
            style={{
              marginTop: 24,
              padding: 20,
              borderRadius: 16,
              backgroundColor: "var(--card)",
              border: "1px solid var(--border)",
            }}
          >
            <div
              style={{
                fontSize: 13,
                color: "var(--muted)",
                marginBottom: 16,
              }}
            >
              {hasAiPrice ? "가격 수정" : "가격을 직접 입력해주세요"}
            </div>

            <div style={{ marginBottom: 16 }}>
              <label
                style={{
                  display: "block",
                  fontSize: 13,
                  color: "var(--muted)",
                  marginBottom: 8,
                }}
              >
                통화
              </label>
              <select
                value={editCurrency}
                onChange={(e) => setEditCurrency(e.target.value)}
                style={{
                  width: "100%",
                  padding: "12px 16px",
                  borderRadius: 12,
                  border: "1px solid var(--border)",
                  backgroundColor: "var(--bg)",
                  fontSize: 16,
                  color: "var(--fg)",
                }}
              >
                <option value="THB">THB (฿) - 태국 바트</option>
                <option value="JPY">JPY (¥) - 일본 엔</option>
                <option value="USD">USD ($) - 미국 달러</option>
                <option value="AUD">AUD (A$) - 호주 달러</option>
                <option value="CNY">CNY (¥) - 중국 위안</option>
                <option value="EUR">EUR (€) - 유로</option>
                <option value="SGD">SGD (S$) - 싱가포르 달러</option>
                <option value="VND">VND (₫) - 베트남 동</option>
                <option value="PHP">PHP (₱) - 필리핀 페소</option>
                <option value="IDR">IDR (Rp) - 인도네시아 루피아</option>
                <option value="HKD">HKD (HK$) - 홍콩 달러</option>
                <option value="TWD">TWD (NT$) - 대만 달러</option>
              </select>
            </div>

            <div style={{ marginBottom: 24 }}>
              {isTossEnvironment() ? (
                <TDSTextField
                  value={editPrice}
                  onChange={(e) => {
                    const val = e.target.value;
                    if (val === "" || /^[0-9]*\.?[0-9]*$/.test(val)) {
                      setEditPrice(val);
                    }
                  }}
                  label="가격"
                  placeholder="0"
                  prefix={getCurrencySymbol(editCurrency)}
                  inputMode="decimal"
                  variant="box"
                />
              ) : (
                <>
                  <label
                    style={{
                      display: "block",
                      fontSize: 13,
                      color: "var(--muted)",
                      marginBottom: 8,
                    }}
                  >
                    가격
                  </label>
                  <input
                    type="text"
                    inputMode="decimal"
                    value={editPrice}
                    onChange={(e) => {
                      const val = e.target.value;
                      if (val === "" || /^[0-9]*\.?[0-9]*$/.test(val)) {
                        setEditPrice(val);
                      }
                    }}
                    placeholder="0"
                    style={{
                      width: "100%",
                      padding: "14px 16px",
                      borderRadius: 12,
                      border: "1px solid var(--border)",
                      backgroundColor: "var(--bg)",
                      fontSize: 18,
                      color: "var(--fg)",
                      boxSizing: "border-box",
                    }}
                  />
                </>
              )}
            </div>

            {isTossEnvironment() ? (
              <>
                <TDSButton
                  onClick={handleEditSubmit}
                  color="primary"
                  variant="fill"
                  size="xlarge"
                  display="full"
                >
                  확인
                </TDSButton>
                {editMode && (
                  <TDSButton
                    onClick={() => setEditMode(false)}
                    color="primary"
                    variant="weak"
                    size="large"
                    display="full"
                    style={{ marginTop: 12 }}
                  >
                    취소
                  </TDSButton>
                )}
              </>
            ) : (
              <>
                <button
                  onClick={handleEditSubmit}
                  style={{
                    width: "100%",
                    padding: "14px 16px",
                    borderRadius: 12,
                    border: "none",
                    backgroundColor: "#1f2937",
                    color: "#ffffff",
                    fontSize: 16,
                    fontWeight: 600,
                    cursor: "pointer",
                  }}
                >
                  확인
                </button>
                {editMode && (
                  <button
                    onClick={() => setEditMode(false)}
                    style={{
                      width: "100%",
                      marginTop: 12,
                      padding: "12px 16px",
                      borderRadius: 12,
                      border: "1px solid var(--border)",
                      backgroundColor: "transparent",
                      color: "var(--muted)",
                      fontSize: 14,
                      cursor: "pointer",
                    }}
                  >
                    취소
                  </button>
                )}
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default PriceConfirm;
