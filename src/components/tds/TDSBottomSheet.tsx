/**
 * TDS 스타일 BottomSheet 래퍼
 * - Toss 환경: TDS BottomSheet 스타일 적용
 * - 일반 웹: 기존 스타일 유지
 */

import { isTossEnvironment } from "../../utils/env";

interface TDSBottomSheetProps {
  open: boolean;
  onClose: () => void;
  header?: React.ReactNode;
  headerDescription?: React.ReactNode;
  children: React.ReactNode;
  cta?: React.ReactNode;
}

export function TDSBottomSheet({
  open,
  onClose,
  header,
  headerDescription,
  children,
  cta,
}: TDSBottomSheetProps) {
  const isToss = isTossEnvironment();

  if (!open) return null;

  const baseStyle: React.CSSProperties = {
    position: "fixed",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 1000,
  };

  const dimmerStyle: React.CSSProperties = {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  };

  const sheetStyle: React.CSSProperties = isToss
    ? {
        position: "absolute",
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: "#FFFFFF",
        borderTopLeftRadius: 24,
        borderTopRightRadius: 24,
        padding: "0",
        maxHeight: "80vh",
        boxShadow: "0 -4px 24px rgba(0, 0, 0, 0.12)",
      }
    : {
        position: "absolute",
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: "var(--bg)",
        borderTopLeftRadius: 24,
        borderTopRightRadius: 24,
        padding: "16px 20px 32px",
        maxHeight: "80vh",
      };

  const headerStyle: React.CSSProperties = isToss
    ? {
        padding: "20px 20px 0",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
      }
    : {
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        marginBottom: 20,
      };

  const titleStyle: React.CSSProperties = isToss
    ? {
        fontSize: 18,
        fontWeight: 700,
        margin: 0,
        color: "#191F28",
      }
    : {
        fontSize: 17,
        fontWeight: 600,
        margin: 0,
      };

  const closeButtonStyle: React.CSSProperties = isToss
    ? {
        background: "transparent",
        border: "none",
        width: 24,
        height: 24,
        cursor: "pointer",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }
    : {
        background: "transparent",
        border: "none",
        fontSize: 24,
        cursor: "pointer",
        color: "var(--muted)",
        padding: 4,
      };

  const contentStyle: React.CSSProperties = isToss
    ? {
        padding: "16px 20px 32px",
      }
    : {};

  return (
    <div style={baseStyle}>
      <div onClick={onClose} style={dimmerStyle} />
      <div style={sheetStyle}>
        {isToss && (
          <div
            style={{
              width: 36,
              height: 4,
              backgroundColor: "#E5E8EB",
              borderRadius: 2,
              margin: "8px auto 0",
            }}
          />
        )}
        {header && (
          <div style={headerStyle}>
            <h2 style={titleStyle}>{header}</h2>
            <button onClick={onClose} style={closeButtonStyle} aria-label="닫기">
              {isToss ? (
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                  <path
                    d="M18 6L6 18M6 6l12 12"
                    stroke="#8B95A1"
                    strokeWidth="2"
                    strokeLinecap="round"
                  />
                </svg>
              ) : (
                "×"
              )}
            </button>
          </div>
        )}
        {headerDescription && (
          <div
            style={{
              padding: isToss ? "8px 20px 0" : "0",
              fontSize: 14,
              color: isToss ? "#8B95A1" : "var(--muted)",
            }}
          >
            {headerDescription}
          </div>
        )}
        <div style={contentStyle}>{children}</div>
        {cta && (
          <div
            style={{
              padding: isToss ? "0 20px 32px" : "0",
            }}
          >
            {cta}
          </div>
        )}
      </div>
    </div>
  );
}

export default TDSBottomSheet;
