/**
 * TDS 스타일 Loader 래퍼
 * - Toss 환경: TDS Loader 스타일 적용
 * - 일반 웹: 기존 스타일 유지
 */

import { isTossEnvironment } from "../../utils/env";

interface TDSLoaderProps {
  size?: "small" | "medium" | "large";
  type?: "primary" | "dark" | "light";
  label?: string;
  style?: React.CSSProperties;
  className?: string;
}

const tdsLoaderSizes = {
  small: 20,
  medium: 32,
  large: 48,
};

const tdsLoaderColors = {
  primary: "#3182F6",
  dark: "#191F28",
  light: "#FFFFFF",
};

export function TDSLoader({
  size = "medium",
  type = "primary",
  label,
  style,
  className,
}: TDSLoaderProps) {
  const isToss = isTossEnvironment();
  const loaderSize = tdsLoaderSizes[size];
  const loaderColor = tdsLoaderColors[type];

  const containerStyle: React.CSSProperties = {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    gap: label ? 16 : 0,
    ...style,
  };

  const spinnerStyle: React.CSSProperties = isToss
    ? {
        width: loaderSize,
        height: loaderSize,
        border: `3px solid ${loaderColor}20`,
        borderTopColor: loaderColor,
        borderRadius: "50%",
        animation: "tds-spin 1s linear infinite",
      }
    : {
        width: loaderSize,
        height: loaderSize,
        border: "3px solid var(--border)",
        borderTopColor: "var(--primary)",
        borderRadius: "50%",
        animation: "tds-spin 1s linear infinite",
      };

  const labelStyle: React.CSSProperties = isToss
    ? {
        fontSize: 15,
        fontWeight: 500,
        color: "#191F28",
        textAlign: "center",
        lineHeight: 1.6,
        whiteSpace: "pre-line",
      }
    : {
        fontSize: 14,
        color: "var(--muted)",
        textAlign: "center",
        lineHeight: 1.6,
        whiteSpace: "pre-line",
      };

  return (
    <div className={className} style={containerStyle}>
      <div style={spinnerStyle} />
      {label && <div style={labelStyle}>{label}</div>}
      <style>{`
        @keyframes tds-spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}

export default TDSLoader;
