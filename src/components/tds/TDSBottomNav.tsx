/**
 * TDS 스타일 BottomNav 래퍼
 * - Toss 환경: 플로팅 형태 탭바 (토스 브랜딩 가이드 준수)
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
  style?: React.CSSProperties;
  className?: string;
}

export function TDSBottomNav({
  items,
  style,
  className,
}: TDSBottomNavProps) {
  const isToss = isTossEnvironment();

  // 토스 환경: 플로팅 형태 (좌우/하단 margin, 둥근 모서리, 그림자)
  const navStyle: React.CSSProperties = isToss
    ? {
        position: "fixed",
        left: 16,
        right: 16,
        bottom: `calc(16px + env(safe-area-inset-bottom))`,
        height: 56,
        backgroundColor: "#FFFFFF",
        borderRadius: 999,
        boxShadow: "0 2px 16px rgba(0, 0, 0, 0.1)",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-around",
        padding: "0 12px",
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
          gap: 2,
          alignItems: "center",
          justifyContent: "center",
          fontSize: 10,
          fontWeight: active ? 600 : 400,
          color: active ? "#191F28" : "#8B95A1",
          cursor: "pointer",
          userSelect: "none",
          flex: 1,
          padding: "6px 0",
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

  const iconStyle: React.CSSProperties = {
    width: 22,
    height: 22,
  };

  return (
    <nav className={className} style={navStyle} aria-label="하단 내비게이션">
      {items.map((item) => (
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
