/**
 * TDS 스타일 Button 래퍼
 * - Toss 환경: TDS Button 스타일 적용
 * - 일반 웹: 기존 스타일 유지 (children으로 전달받은 버튼 그대로 렌더링)
 */

import { isTossEnvironment } from "../../utils/env";

interface TDSButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  loading?: boolean;
  color?: "primary" | "dark" | "danger" | "light";
  variant?: "fill" | "weak";
  size?: "small" | "medium" | "large" | "xlarge";
  display?: "inline" | "block" | "full";
  style?: React.CSSProperties;
  className?: string;
}

const tdsColors = {
  primary: {
    fill: { bg: "#3182F6", color: "#FFFFFF" },
    weak: { bg: "rgba(49, 130, 246, 0.12)", color: "#3182F6" },
  },
  dark: {
    fill: { bg: "#191F28", color: "#FFFFFF" },
    weak: { bg: "rgba(25, 31, 40, 0.08)", color: "#191F28" },
  },
  danger: {
    fill: { bg: "#F04452", color: "#FFFFFF" },
    weak: { bg: "rgba(240, 68, 82, 0.12)", color: "#F04452" },
  },
  light: {
    fill: { bg: "#FFFFFF", color: "#191F28" },
    weak: { bg: "rgba(255, 255, 255, 0.2)", color: "#FFFFFF" },
  },
};

const tdsSizes = {
  small: { padding: "8px 12px", fontSize: 13, borderRadius: 8 },
  medium: { padding: "10px 16px", fontSize: 14, borderRadius: 10 },
  large: { padding: "12px 20px", fontSize: 15, borderRadius: 12 },
  xlarge: { padding: "16px 24px", fontSize: 16, borderRadius: 14 },
};

export function TDSButton({
  children,
  onClick,
  disabled = false,
  loading = false,
  color = "primary",
  variant = "fill",
  size = "xlarge",
  display = "inline",
  style,
  className,
}: TDSButtonProps) {
  const isToss = isTossEnvironment();

  if (!isToss) {
    return (
      <button
        onClick={onClick}
        disabled={disabled || loading}
        className={className}
        style={style}
      >
        {loading ? "로딩 중..." : children}
      </button>
    );
  }

  const colorStyle = tdsColors[color][variant];
  const sizeStyle = tdsSizes[size];

  const tdsStyle: React.CSSProperties = {
    backgroundColor: colorStyle.bg,
    color: colorStyle.color,
    padding: sizeStyle.padding,
    fontSize: sizeStyle.fontSize,
    borderRadius: sizeStyle.borderRadius,
    border: "none",
    fontWeight: 600,
    cursor: disabled ? "not-allowed" : "pointer",
    opacity: disabled ? 0.4 : 1,
    width: display === "full" ? "100%" : display === "block" ? "100%" : "auto",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    transition: "opacity 0.2s, transform 0.1s",
    ...style,
  };

  return (
    <button
      onClick={onClick}
      disabled={disabled || loading}
      className={className}
      style={tdsStyle}
    >
      {loading ? (
        <span style={{ display: "flex", gap: 4 }}>
          <span style={{ animation: "pulse 1s infinite" }}>●</span>
          <span style={{ animation: "pulse 1s infinite 0.2s" }}>●</span>
          <span style={{ animation: "pulse 1s infinite 0.4s" }}>●</span>
        </span>
      ) : (
        children
      )}
    </button>
  );
}

export default TDSButton;
