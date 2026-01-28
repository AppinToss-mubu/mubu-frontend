/**
 * 대시보드 페이지
 * - 최근 비교 전체 목록을 날짜순으로 보여주는 페이지
 * - Toss 환경: TDS 스타일 적용
 * - 일반 웹: 기존 스타일 유지
 */

import { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useRecentComparisons } from "../hooks/useRecentComparisons";
import { isTossEnvironment } from "../utils/env";
import { TDSListRow } from "../components/tds";

export default function Dashboard() {
  const navigate = useNavigate();
  const { items } = useRecentComparisons();
  const isToss = isTossEnvironment();

  const sorted = useMemo(
    () => [...items].sort((a, b) => b.createdAt - a.createdAt),
    [items]
  );

  const formatDate = (timestamp: number) => {
    const date = new Date(timestamp);
    return `${date.getFullYear()}.${String(date.getMonth() + 1).padStart(2, "0")}.${String(date.getDate()).padStart(2, "0")} ${String(date.getHours()).padStart(2, "0")}:${String(date.getMinutes()).padStart(2, "0")}`;
  };

  if (isToss) {
    return (
      <div>
        <h2 style={{ margin: 0, fontSize: 20, fontWeight: 700, color: "#191F28" }}>
          최근 비교 내역
        </h2>
        <p style={{ marginTop: 8, color: "#8B95A1", fontSize: 14 }}>
          최근에 비교한 상품들을 한눈에 볼 수 있어요.
        </p>

        {sorted.length === 0 ? (
          <div style={{ marginTop: 20, color: "#8B95A1", fontSize: 14 }}>
            아직 비교한 기록이 없어요. 홈에서 상품을 먼저 촬영해 주세요.
          </div>
        ) : (
          <div style={{ marginTop: 18, display: "grid", gap: 8 }}>
            {sorted.map((r) => (
              <TDSListRow
                key={r.id + r.createdAt}
                onClick={() => navigate(`/result/${r.id}`)}
                withArrow
                border="none"
                contents={
                  <TDSListRow.Texts
                    type="2RowTypeA"
                    top={r.productName}
                    bottom={formatDate(r.createdAt)}
                  />
                }
                right={
                  <div
                    style={{
                      padding: "8px 12px",
                      borderRadius: 999,
                      background: r.savedAmount >= 0 ? "#E8F3FF" : "#F2F4F6",
                      color: r.savedAmount >= 0 ? "#3182F6" : "#8B95A1",
                      fontWeight: 700,
                      fontSize: 13,
                      whiteSpace: "nowrap",
                    }}
                  >
                    {r.savedAmount >= 0 ? "+" : "-"}
                    {new Intl.NumberFormat("ko-KR").format(Math.abs(r.savedAmount))}원
                  </div>
                }
                style={{
                  padding: 16,
                  borderRadius: 16,
                  border: "1px solid #F2F4F6",
                  background: "#FFFFFF",
                }}
              />
            ))}
          </div>
        )}
      </div>
    );
  }

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
          {sorted.map((r) => (
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
                  {formatDate(r.createdAt)}
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
          ))}
        </div>
      )}
    </div>
  );
}
