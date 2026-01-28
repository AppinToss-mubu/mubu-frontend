/**
 * TDS 스타일 ListRow 래퍼
 * - Toss 환경: TDS ListRow 스타일 적용
 * - 일반 웹: 기존 스타일 유지
 */

import { isTossEnvironment } from "../../utils/env";

interface TDSListRowProps {
  left?: React.ReactNode;
  contents: React.ReactNode;
  right?: React.ReactNode;
  onClick?: () => void;
  withArrow?: boolean;
  withTouchEffect?: boolean;
  border?: "indented" | "none";
  verticalPadding?: "small" | "medium" | "large" | "xlarge";
  horizontalPadding?: "small" | "medium";
  disabled?: boolean;
  style?: React.CSSProperties;
  className?: string;
}

interface TDSListRowTextsProps {
  type?: "1RowTypeA" | "2RowTypeA";
  top: string;
  bottom?: string;
  topColor?: string;
  bottomColor?: string;
}

const verticalPaddingValues = {
  small: 8,
  medium: 12,
  large: 16,
  xlarge: 24,
};

const horizontalPaddingValues = {
  small: 20,
  medium: 24,
};

export function TDSListRowTexts({
  type = "1RowTypeA",
  top,
  bottom,
  topColor,
  bottomColor,
}: TDSListRowTextsProps) {
  const isToss = isTossEnvironment();

  const topStyle: React.CSSProperties = isToss
    ? {
        fontSize: 16,
        fontWeight: 500,
        color: topColor || "#191F28",
        lineHeight: 1.4,
      }
    : {
        fontSize: 15,
        fontWeight: 500,
        color: topColor || "var(--fg)",
        lineHeight: 1.4,
      };

  const bottomStyle: React.CSSProperties = isToss
    ? {
        fontSize: 14,
        color: bottomColor || "#8B95A1",
        marginTop: 4,
        lineHeight: 1.4,
      }
    : {
        fontSize: 13,
        color: bottomColor || "var(--muted)",
        marginTop: 4,
        lineHeight: 1.4,
      };

  return (
    <div style={{ flex: 1 }}>
      <div style={topStyle}>{top}</div>
      {type === "2RowTypeA" && bottom && <div style={bottomStyle}>{bottom}</div>}
    </div>
  );
}

export function TDSListRow({
  left,
  contents,
  right,
  onClick,
  withArrow = false,
  withTouchEffect,
  border = "indented",
  verticalPadding = "medium",
  horizontalPadding = "medium",
  disabled = false,
  style,
  className,
}: TDSListRowProps) {
  const isToss = isTossEnvironment();
  const hasInteraction = onClick || withTouchEffect;

  const containerStyle: React.CSSProperties = isToss
    ? {
        display: "flex",
        alignItems: "center",
        gap: 12,
        padding: `${verticalPaddingValues[verticalPadding]}px ${horizontalPaddingValues[horizontalPadding]}px`,
        backgroundColor: disabled ? "rgba(0,0,0,0.02)" : "transparent",
        cursor: hasInteraction && !disabled ? "pointer" : "default",
        opacity: disabled ? 0.5 : 1,
        borderBottom: border === "indented" ? "1px solid #F2F4F6" : "none",
        transition: "background-color 0.15s",
        ...style,
      }
    : {
        display: "flex",
        alignItems: "center",
        gap: 12,
        padding: `${verticalPaddingValues[verticalPadding]}px ${horizontalPaddingValues[horizontalPadding]}px`,
        backgroundColor: disabled ? "var(--card)" : "transparent",
        cursor: hasInteraction && !disabled ? "pointer" : "default",
        opacity: disabled ? 0.5 : 1,
        borderBottom: border === "indented" ? "1px solid var(--border)" : "none",
        ...style,
      };

  const arrowStyle: React.CSSProperties = isToss
    ? {
        color: "#B0B8C1",
        fontSize: 16,
        marginLeft: 4,
      }
    : {
        color: "var(--muted)",
        fontSize: 16,
        marginLeft: 4,
      };

  const handleClick = () => {
    if (!disabled && onClick) {
      onClick();
    }
  };

  return (
    <div
      className={className}
      style={containerStyle}
      onClick={handleClick}
      role={onClick ? "button" : undefined}
      tabIndex={onClick && !disabled ? 0 : undefined}
    >
      {left && <div style={{ flexShrink: 0 }}>{left}</div>}
      <div style={{ flex: 1, minWidth: 0 }}>{contents}</div>
      {right && <div style={{ flexShrink: 0 }}>{right}</div>}
      {withArrow && (
        <span style={arrowStyle}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M9 18l6-6-6-6" />
          </svg>
        </span>
      )}
    </div>
  );
}

TDSListRow.Texts = TDSListRowTexts;

export default TDSListRow;
