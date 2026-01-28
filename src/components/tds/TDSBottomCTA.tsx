/**
 * TDS 스타일 BottomCTA 래퍼
 * - Toss 환경: TDS 스타일 하단 고정 CTA
 * - 일반 웹: 기존 스타일 유지
 */

import { isTossEnvironment } from "../../utils/env";

interface TDSBottomCTASingleProps {
  children: React.ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  fixed?: boolean;
  background?: "default" | "none";
  hasSafeAreaPadding?: boolean;
  topAccessory?: React.ReactNode;
  style?: React.CSSProperties;
}

interface TDSBottomCTADoubleProps {
  leftButton: React.ReactNode;
  rightButton: React.ReactNode;
  fixed?: boolean;
  background?: "default" | "none";
  hasSafeAreaPadding?: boolean;
  topAccessory?: React.ReactNode;
  style?: React.CSSProperties;
}

export function TDSBottomCTASingle({
  children,
  onClick,
  disabled = false,
  fixed = true,
  background = "default",
  hasSafeAreaPadding = true,
  topAccessory,
  style,
}: TDSBottomCTASingleProps) {
  const isToss = isTossEnvironment();

  const containerStyle: React.CSSProperties = {
    position: fixed ? "fixed" : "relative",
    left: fixed ? 0 : undefined,
    right: fixed ? 0 : undefined,
    bottom: fixed ? 0 : undefined,
    padding: "12px 24px",
    paddingBottom: hasSafeAreaPadding
      ? "max(20px, env(safe-area-inset-bottom))"
      : 20,
    background:
      background === "default"
        ? isToss
          ? "linear-gradient(to top, #FFFFFF 60%, rgba(255,255,255,0))"
          : "linear-gradient(to top, var(--bg) 60%, transparent)"
        : "transparent",
    zIndex: 100,
    ...style,
  };

  const buttonStyle: React.CSSProperties = isToss
    ? {
        width: "100%",
        padding: "16px 24px",
        borderRadius: 16,
        border: "none",
        backgroundColor: disabled ? "#E5E8EB" : "#191F28",
        color: disabled ? "#8B95A1" : "#FFFFFF",
        fontSize: 17,
        fontWeight: 600,
        cursor: disabled ? "not-allowed" : "pointer",
        transition: "background-color 0.15s, transform 0.1s",
      }
    : {
        width: "100%",
        padding: "16px 24px",
        borderRadius: 16,
        border: "none",
        backgroundColor: disabled ? "var(--muted)" : "#1f2937",
        color: "#ffffff",
        fontSize: 17,
        fontWeight: 600,
        cursor: disabled ? "not-allowed" : "pointer",
        opacity: disabled ? 0.5 : 1,
      };

  return (
    <div style={containerStyle}>
      {topAccessory && <div style={{ marginBottom: 12 }}>{topAccessory}</div>}
      <button onClick={onClick} disabled={disabled} style={buttonStyle}>
        {children}
      </button>
    </div>
  );
}

export function TDSBottomCTADouble({
  leftButton,
  rightButton,
  fixed = true,
  background = "default",
  hasSafeAreaPadding = true,
  topAccessory,
  style,
}: TDSBottomCTADoubleProps) {
  const isToss = isTossEnvironment();

  const containerStyle: React.CSSProperties = {
    position: fixed ? "fixed" : "relative",
    left: fixed ? 0 : undefined,
    right: fixed ? 0 : undefined,
    bottom: fixed ? 0 : undefined,
    padding: "12px 24px",
    paddingBottom: hasSafeAreaPadding
      ? "max(20px, env(safe-area-inset-bottom))"
      : 20,
    background:
      background === "default"
        ? isToss
          ? "linear-gradient(to top, #FFFFFF 60%, rgba(255,255,255,0))"
          : "linear-gradient(to top, var(--bg) 60%, transparent)"
        : "transparent",
    zIndex: 100,
    ...style,
  };

  const buttonContainerStyle: React.CSSProperties = {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: 8,
  };

  return (
    <div style={containerStyle}>
      {topAccessory && <div style={{ marginBottom: 12 }}>{topAccessory}</div>}
      <div style={buttonContainerStyle}>
        {leftButton}
        {rightButton}
      </div>
    </div>
  );
}

export const TDSBottomCTA = {
  Single: TDSBottomCTASingle,
  Double: TDSBottomCTADouble,
};

export default TDSBottomCTA;
