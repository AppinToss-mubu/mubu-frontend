/**
 * TDS 스타일 BottomNav 래퍼
 * - Toss 환경: TDS 스타일 적용
 * - 일반 웹: 기존 스타일 유지
 */

import { isTossEnvironment } from "../../utils/env";

interface TDSBottomNavProps {
  items: {
    id: string;
    label: string;
    icon: React.ReactNode;
    active?: boolean;
    onClick: () => void;
  }[];
  centerAction?: {
    icon: React.ReactNode;
    onClick: () => void;
    ariaLabel?: string;
  };
  style?: React.CSSProperties;
  className?: string;
}

export function TDSBottomNav({
  items,
  centerAction,
  style,
  className,
}: TDSBottomNavProps) {
  const isToss = isTossEnvironment();

  const navStyle: React.CSSProperties = isToss
    ? {
        position: "fixed",
        left: 0,
        right: 0,
        bottom: 0,
        height: 76,
        backgroundColor: "#FFFFFF",
        borderTop: "1px solid #F2F4F6",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-around",
        padding: "8px 24px calc(8px + env(safe-area-inset-bottom))",
        zIndex: 100,
        ...style,
      }
    : {
        position: "fixed",
        left: 0,
        right: 0,
        bottom: 0,
        height: 76,
        backgroundColor: "var(--bg)",
        borderTop: "1px solid var(--border)",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-around",
        padding: "8px 24px calc(8px + env(safe-area-inset-bottom))",
        zIndex: 100,
        ...style,
      };

  const navItemStyle = (active: boolean): React.CSSProperties =>
    isToss
      ? {
          display: "flex",
          flexDirection: "column",
          gap: 4,
          alignItems: "center",
          justifyContent: "center",
          fontSize: 11,
          fontWeight: active ? 600 : 400,
          color: active ? "#191F28" : "#8B95A1",
          cursor: "pointer",
          userSelect: "none",
          minWidth: 60,
          transition: "color 0.15s",
        }
      : {
          display: "flex",
          flexDirection: "column",
          gap: 4,
          alignItems: "center",
          justifyContent: "center",
          fontSize: 11,
          fontWeight: active ? 700 : 400,
          color: active ? "var(--fg)" : "var(--muted)",
          cursor: "pointer",
          userSelect: "none",
          minWidth: 60,
        };

  const fabStyle: React.CSSProperties = isToss
    ? {
        width: 56,
        height: 56,
        borderRadius: 999,
        border: "none",
        backgroundColor: "#3182F6",
        color: "#FFFFFF",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        boxShadow: "0 4px 12px rgba(49, 130, 246, 0.4)",
        transform: "translateY(-18px)",
        cursor: "pointer",
        fontSize: 20,
        transition: "transform 0.15s, box-shadow 0.15s",
      }
    : {
        width: 56,
        height: 56,
        borderRadius: 999,
        border: "none",
        backgroundColor: "var(--primary)",
        color: "var(--primary-contrast)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
        transform: "translateY(-18px)",
        cursor: "pointer",
        fontSize: 20,
      };

  const iconStyle: React.CSSProperties = {
    width: 22,
    height: 22,
  };

  const leftItems = items.slice(0, Math.ceil(items.length / 2));
  const rightItems = items.slice(Math.ceil(items.length / 2));

  return (
    <nav className={className} style={navStyle} aria-label="하단 내비게이션">
      {leftItems.map((item) => (
        <div
          key={item.id}
          style={navItemStyle(!!item.active)}
          onClick={item.onClick}
          role="button"
          tabIndex={0}
        >
          <span style={iconStyle}>{item.icon}</span>
          <span>{item.label}</span>
        </div>
      ))}

      {centerAction && (
        <div
          style={fabStyle}
          onClick={centerAction.onClick}
          role="button"
          tabIndex={0}
          aria-label={centerAction.ariaLabel || "중앙 액션"}
        >
          {centerAction.icon}
        </div>
      )}

      {rightItems.map((item) => (
        <div
          key={item.id}
          style={navItemStyle(!!item.active)}
          onClick={item.onClick}
          role="button"
          tabIndex={0}
        >
          <span style={iconStyle}>{item.icon}</span>
          <span>{item.label}</span>
        </div>
      ))}
    </nav>
  );
}

export default TDSBottomNav;
