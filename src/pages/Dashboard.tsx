/**
 * 대시보드 페이지
 * - 최근 비교 전체 목록을 날짜순으로 보여주는 페이지
 */

import { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useRecentComparisons } from "../hooks/useRecentComparisons";

export default function Dashboard() {
  const navigate = useNavigate();
  const { items } = useRecentComparisons();

  const sorted = useMemo(
    () => [...items].sort((a, b) => b.createdAt - a.createdAt),
    [items]
  );

  return (
    <div>
      <h2 style={{ margin: 0, fontSize: 20, fontWeight: 800 }}>최근 비교 내역</h2>
      <p style={{ marginTop: 8, color: "var(--muted)", fontSize: 14 }}>
        최근에 비교한 상품들을 한눈에 볼 수 있어요.
      </p>

      {sorted.length === 0 ? (
        <div style={{ marginTop: 20, color: "var(--muted)", fontSize: 14 }}>
          아직 비교한 기록이 없어요. 홈에서 상품을 먼저 촬영해 주세요.
        </div>
      ) : (
        <div style={{ marginTop: 18, display: "grid", gap: 12 }}>
          {sorted.map((r) => {
            const date = new Date(r.createdAt);
            const dateLabel = `${date.getFullYear()}.${String(
              date.getMonth() + 1
            ).padStart(2, "0")}.${String(date.getDate()).padStart(2, "0")} ${
              String(date.getHours()).padStart(2, "0")
            }:${String(date.getMinutes()).padStart(2, "0")}`;

            return (
              <div
                key={r.id + r.createdAt}
                onClick={() => navigate(`/result/${r.id}`)}
                role="button"
                tabIndex={0}
                style={{
                  padding: 16,
                  borderRadius: 16,
                  border: "1px solid var(--border)",
                  background: "var(--bg)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  gap: 12,
                  cursor: "pointer",
                }}
              >
                <div style={{ minWidth: 0 }}>
                  <div
                    style={{
                      fontWeight: 800,
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {r.productName}
                  </div>
                  <div style={{ marginTop: 6, color: "var(--muted)", fontSize: 12 }}>
                    {dateLabel}
                  </div>
                </div>

                <div
                  style={{
                    padding: "8px 12px",
                    borderRadius: 999,
                    background: r.savedAmount >= 0 ? "var(--chip-bg)" : "var(--card)",
                    color: r.savedAmount >= 0 ? "var(--chip-fg)" : "var(--muted)",
                    fontWeight: 800,
                    fontSize: 13,
                    whiteSpace: "nowrap",
                  }}
                >
                  {r.savedAmount >= 0 ? "+" : "-"}
                  {new Intl.NumberFormat("ko-KR").format(Math.abs(r.savedAmount))}원
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

