/**
 * 가격 입력 컴포넌트
 * - AI가 인식한 가격/통화가 있으면 초기값으로 보여주고, 사용자가 수정 가능
 * - 여러 국가 통화 중에서 검색/선택 후 금액 입력
 * - 입력 완료 시 summary API 호출
 */

import { useState, useEffect, useMemo } from "react";

interface PriceInputProps {
  initialPrice?: number | null;
  initialCurrency?: string;
  onSubmit: (price: number, currency: string) => void;
  disabled?: boolean;
}

// 자주 사용하는 여행/거래 통화 목록
// - 코드 기준으로 백엔드 환율 API에 전달
const CURRENCIES = [
  { code: "KRW", name: "원 (KRW)", symbol: "₩" },
  { code: "JPY", name: "엔 (JPY)", symbol: "¥" },
  { code: "USD", name: "달러 (USD)", symbol: "$" },
  { code: "EUR", name: "유로 (EUR)", symbol: "€" },
  { code: "CNY", name: "위안 (CNY)", symbol: "¥" },
  { code: "THB", name: "태국 바트 (THB)", symbol: "฿" },
  { code: "SGD", name: "싱가포르 달러 (SGD)", symbol: "$" },
  { code: "HKD", name: "홍콩 달러 (HKD)", symbol: "$" },
  { code: "TWD", name: "대만 달러 (TWD)", symbol: "$" },
  { code: "PHP", name: "필리핀 페소 (PHP)", symbol: "₱" },
  { code: "IDR", name: "인도네시아 루피아 (IDR)", symbol: "Rp" },
  { code: "VND", name: "베트남 동 (VND)", symbol: "₫" },
  { code: "AUD", name: "호주 달러 (AUD)", symbol: "$" },
  { code: "CAD", name: "캐나다 달러 (CAD)", symbol: "$" },
  { code: "GBP", name: "파운드 (GBP)", symbol: "£" },
  { code: "CHF", name: "스위스 프랑 (CHF)", symbol: "₣" },
];

export const PriceInput = ({
  initialPrice = null,
  initialCurrency = "JPY",
  onSubmit,
  disabled = false,
}: PriceInputProps) => {
  const [price, setPrice] = useState<string>(
    initialPrice !== null && initialPrice !== undefined
      ? initialPrice.toString()
      : ""
  );
  const [currency, setCurrency] = useState<string>(initialCurrency);
  const [query, setQuery] = useState<string>("");

  // 초기값이 바뀌었을 때 입력란 갱신
  useEffect(() => {
    if (initialPrice !== null && initialPrice !== undefined) {
      setPrice(initialPrice.toString());
    }
  }, [initialPrice]);

  // 초기 통화가 바뀌었을 때 선택값 갱신
  useEffect(() => {
    if (initialCurrency) {
      setCurrency(initialCurrency);
    }
  }, [initialCurrency]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const priceNum = parseFloat(price);
    if (isNaN(priceNum) || priceNum <= 0) {
      alert("올바른 가격을 입력해주세요.");
      return;
    }
    onSubmit(priceNum, currency);
  };

  const isFormValid = price !== "" && parseFloat(price) > 0;

  // 통화 검색어에 따른 필터링
  const filteredCurrencies = useMemo(() => {
    if (!query.trim()) return CURRENCIES;
    const lower = query.trim().toLowerCase();
    return CURRENCIES.filter((c) =>
      c.code.toLowerCase().includes(lower) || c.name.toLowerCase().includes(lower)
    );
  }, [query]);

  // 통화 코드는 항상 확실하게 보이도록 코드 자체를 사용
  const currentCurrencyCode = currency.toUpperCase();

  return (
    <form
      onSubmit={handleSubmit}
      style={{ display: "flex", flexDirection: "column", gap: "16px" }}
    >
      <div>
        <label
          htmlFor="currency-search"
          style={{ display: "block", marginBottom: "4px", fontSize: "14px" }}
        >
          통화
        </label>
        <input
          id="currency-search"
          type="text"
          placeholder="통화 코드나 이름으로 검색"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          disabled={disabled}
        style={{
          width: "100%",
          padding: "6px 8px",
          fontSize: "14px",
          borderRadius: "6px",
          border: "1px solid var(--border)",
          background: "var(--bg)",
          color: "var(--fg)",
          marginBottom: "6px",
        }}
        />
        <select
          id="currency"
          value={currency}
          onChange={(e) => setCurrency(e.target.value)}
          disabled={disabled}
        style={{
          width: "100%",
          padding: "8px",
          fontSize: "16px",
          borderRadius: "6px",
          border: "1px solid var(--border)",
          background: "var(--bg)",
          color: "var(--fg)",
        }}
        >
          {filteredCurrencies.map((curr) => (
            <option key={curr.code} value={curr.code}>
              {curr.name}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label
          htmlFor="price"
          style={{ display: "block", marginBottom: "8px", fontSize: "14px" }}
        >
          가격
        </label>
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <span
            style={{
              fontSize: "14px",
              padding: "4px 8px",
              borderRadius: 999,
              border: "1px solid var(--border)",
              backgroundColor: "var(--card)",
              color: "var(--fg)",
            }}
          >
            {currentCurrencyCode}
          </span>
          <input
            id="price"
            type="number"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            placeholder="가격을 입력하세요"
            disabled={disabled}
            min="0"
            step="0.01"
            style={{
              flex: 1,
              padding: "8px",
              fontSize: "16px",
              borderRadius: "6px",
              border: "1px solid var(--border)",
              background: "var(--bg)",
              color: "var(--fg)",
            }}
          />
        </div>
      </div>

      <button
        type="submit"
        disabled={disabled || !isFormValid}
        style={{
          padding: "12px 24px",
          fontSize: "16px",
          backgroundColor: isFormValid && !disabled ? "var(--primary)" : "var(--muted)",
          color: isFormValid && !disabled ? "var(--primary-contrast)" : "var(--fg)",
          border: "none",
          borderRadius: "6px",
          cursor: isFormValid && !disabled ? "pointer" : "not-allowed",
          fontWeight: 700,
        }}
      >
        비교하기
      </button>
    </form>
  );
};
