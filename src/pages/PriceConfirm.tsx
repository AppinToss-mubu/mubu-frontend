/**
 * 가격 확인 페이지 (PriceConfirm)
 * - Toss 환경: TDS v2 Post.H1, ListRow, FixedBottomCTA, TextField, Menu 사용
 * - 일반 웹: 기존 스타일 유지
 */

import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { usePriceStore } from "../store/priceStore";
import { isTossEnvironment } from "../utils/env";
import { useTDS } from "../utils/tds";

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

const CURRENCY_OPTIONS = [
  { value: "THB", label: "THB (฿) - 태국 바트" },
  { value: "JPY", label: "JPY (¥) - 일본 엔" },
  { value: "USD", label: "USD ($) - 미국 달러" },
  { value: "AUD", label: "AUD (A$) - 호주 달러" },
  { value: "CNY", label: "CNY (¥) - 중국 위안" },
  { value: "EUR", label: "EUR (€) - 유로" },
  { value: "SGD", label: "SGD (S$) - 싱가포르 달러" },
  { value: "VND", label: "VND (₫) - 베트남 동" },
  { value: "PHP", label: "PHP (₱) - 필리핀 페소" },
  { value: "IDR", label: "IDR (Rp) - 인도네시아 루피아" },
  { value: "HKD", label: "HKD (HK$) - 홍콩 달러" },
  { value: "TWD", label: "TWD (NT$) - 대만 달러" },
];

function PriceConfirm() {
  const { imageId } = useParams<{ imageId: string }>();
  const navigate = useNavigate();
  const { compareResult, setLocalPrice, setCurrency, setPriceSource } =
    usePriceStore();

  const [editMode, setEditMode] = useState(false);
  const [editPrice, setEditPrice] = useState("");
  const [editCurrency, setEditCurrency] = useState("THB");
  const [currencyMenuOpen, setCurrencyMenuOpen] = useState(false);

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

  const isToss = isTossEnvironment();
  const { tds, colors, ready: tdsReady } = useTDS();
  const shouldUseTDS = isToss && tdsReady;

  if (shouldUseTDS) {
    const { Post, Text, Button, BottomSheet, TextField } = tds;
    const { adaptive } = colors;
    return (
      <div style={{ minHeight: "100vh", backgroundColor: "#FFFFFF", paddingBottom: 100 }}>
        <Post.H1 paddingBottom={24}>가격확인</Post.H1>

        {compareResult.image && (
          <div style={{ padding: "0 20px", marginBottom: 20 }}>
            <div style={{ borderRadius: 16, overflow: "hidden" }}>
              <img
                src={compareResult.image}
                alt={compareResult.productName}
                style={{ width: "100%", height: 240, objectFit: "cover" }}
              />
            </div>
          </div>
        )}

        {!editMode && hasAiPrice && (
          <div style={{ padding: "0 20px" }}>
            <div style={{
              backgroundColor: "#F2F4F6",
              borderRadius: 16,
              padding: "24px 20px",
              textAlign: "center",
              marginBottom: 16,
            }}>
              <Text display="block" color={adaptive.grey600} typography="t6" fontWeight="regular">
                감지된 가격
              </Text>
              <div style={{ height: 8 }} />
              <Text display="block" color={adaptive.grey900} typography="t1" fontWeight="bold">
                {currencySymbol}{compareResult.localPrice?.toLocaleString()}
              </Text>
            </div>

            <div style={{
              backgroundColor: "#F8F9FA",
              borderRadius: 12,
              padding: "16px 20px",
              textAlign: "center",
              marginBottom: 24,
            }}>
              <Text display="block" color={adaptive.grey800} typography="t4" fontWeight="medium">
                이 가격이 맞나요?
              </Text>
            </div>

            <div style={{ display: "flex", gap: 8 }}>
              <div style={{ flex: 1 }}>
                <Button color="dark" variant="weak" display="block" onClick={handleEdit}>
                  수정
                </Button>
              </div>
              <div style={{ flex: 1 }}>
                <Button display="block" onClick={handleConfirm}>
                  맞아요
                </Button>
              </div>
            </div>
          </div>
        )}

        {(editMode || !hasAiPrice) && (
          <div style={{ padding: "0 20px" }}>
            <Text display="block" color={adaptive.grey600} typography="t6" fontWeight="regular" style={{ marginBottom: 8 }}>
              가격수정
            </Text>

            <button
              onClick={() => setCurrencyMenuOpen(true)}
              style={{
                width: "100%",
                padding: "14px 16px",
                borderRadius: 12,
                border: "1px solid #E5E8EB",
                backgroundColor: "#FFFFFF",
                fontSize: 15,
                fontWeight: 500,
                color: "#191F28",
                textAlign: "left",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                marginBottom: 16,
              }}
            >
              <span>{CURRENCY_OPTIONS.find(o => o.value === editCurrency)?.label || "통화를 선택해주세요"}</span>
              <span style={{ color: "#8B95A1", fontSize: 12 }}>▼</span>
            </button>

            <BottomSheet
              open={currencyMenuOpen}
              onClose={() => setCurrencyMenuOpen(false)}
              header={<BottomSheet.Header>통화를 선택해주세요</BottomSheet.Header>}
            >
              <BottomSheet.Select
                options={CURRENCY_OPTIONS.map((opt) => ({
                  name: opt.label,
                  value: opt.value,
                }))}
                value={editCurrency}
                onChange={(e: any) => {
                  const selected = e.target.value;
                  if (selected) {
                    setEditCurrency(selected);
                    setCurrencyMenuOpen(false);
                  }
                }}
              />
            </BottomSheet>

            <div style={{ marginBottom: 24 }}>
              <TextField.Clearable
                variant="box"
                hasError={false}
                label="가격"
                labelOption="sustain"
                value={editPrice}
                onChange={(e: any) => {
                  const val = typeof e === "string" ? e : e?.target?.value || "";
                  if (val === "" || /^[0-9]*\.?[0-9]*$/.test(val)) {
                    setEditPrice(val);
                  }
                }}
                placeholder={`${getCurrencySymbol(editCurrency)} 숫자 입력`}
                type="tel"
              />
            </div>

            <div style={{ display: "flex", gap: 8 }}>
              <div style={{ flex: 1 }}>
                <Button color="dark" variant="weak" display="block" onClick={editMode ? () => setEditMode(false) : handleClose}>
                  취소
                </Button>
              </div>
              <div style={{ flex: 1 }}>
                <Button display="block" onClick={handleEditSubmit}>
                  확인
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

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
              lineHeight: "25.2px",
            }}
          >
            {compareResult.productName || "상품명 인식 실패"}
          </h2>
          {compareResult.mallName && (
            <p
              style={{
                fontSize: 12,
                color: "var(--muted)",
                margin: 0,
                marginTop: 2,
                opacity: 0.6,
              }}
            >
              {compareResult.mallName}
            </p>
          )}
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
            <div style={{ fontSize: 13, color: "var(--muted)", marginBottom: 8 }}>
              감지된 가격
            </div>
            <div style={{ fontSize: 36, fontWeight: 800, color: "var(--fg)" }}>
              {currencySymbol}
              {compareResult.localPrice?.toLocaleString()}
            </div>
            <div style={{ fontSize: 13, color: "var(--muted)", marginTop: 4 }}>
              원본: {compareResult.localPrice?.toFixed(2)}
            </div>

            <div style={{ textAlign: "center", marginTop: 24, marginBottom: 16, fontSize: 14, color: "var(--muted)" }}>
              이 가격이 맞나요?
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
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
            <div style={{ fontSize: 13, color: "var(--muted)", marginBottom: 16 }}>
              {hasAiPrice ? "가격 수정" : "가격을 직접 입력해주세요"}
            </div>

            <div style={{ marginBottom: 16 }}>
              <label style={{ display: "block", fontSize: 13, color: "var(--muted)", marginBottom: 8 }}>
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
                {CURRENCY_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
              </select>
            </div>

            <div style={{ marginBottom: 24 }}>
              <label style={{ display: "block", fontSize: 13, color: "var(--muted)", marginBottom: 8 }}>
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
            </div>

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
          </div>
        )}
      </div>
    </div>
  );
}

export default PriceConfirm;
