/**
 * 대시보드 페이지
 * - 최근 비교 전체 목록을 날짜순으로 보여주는 페이지
 * - 선택/삭제 기능 지원
 * - Toss 환경: TDS 스타일 적용
 * - 일반 웹: 기존 스타일 유지
 */

import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useRecentComparisons } from "../hooks/useRecentComparisons";
import { isTossEnvironment } from "../utils/env";
import { TDSListRow } from "../components/tds";

export default function Dashboard() {
  const navigate = useNavigate();
  const { items, remove } = useRecentComparisons();
  const isToss = isTossEnvironment();

  const [editMode, setEditMode] = useState(false);
  const [selected, setSelected] = useState<Set<string>>(new Set());

  const sorted = useMemo(
    () => [...items].sort((a, b) => b.createdAt - a.createdAt),
    [items]
  );

  const formatDate = (timestamp: number) => {
    const date = new Date(timestamp);
    return `${date.getFullYear()}.${String(date.getMonth() + 1).padStart(2, "0")}.${String(date.getDate()).padStart(2, "0")} ${String(date.getHours()).padStart(2, "0")}:${String(date.getMinutes()).padStart(2, "0")}`;
  };

  const toggleSelect = (id: string) => {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const toggleSelectAll = () => {
    if (selected.size === sorted.length) {
      setSelected(new Set());
    } else {
      setSelected(new Set(sorted.map((r) => r.id)));
    }
  };

  const handleDelete = () => {
    if (selected.size === 0) return;
    remove(Array.from(selected));
    setSelected(new Set());
    setEditMode(false);
  };

  const exitEditMode = () => {
    setEditMode(false);
    setSelected(new Set());
  };

  // 체크박스 스타일
  const checkboxStyle = (checked: boolean): React.CSSProperties => ({
    width: 22,
    height: 22,
    borderRadius: 6,
    border: checked ? "none" : "2px solid #D1D6DB",
    background: checked ? "#3182F6" : "#FFFFFF",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    cursor: "pointer",
    flexShrink: 0,
    transition: "all 150ms",
  });

  const checkmark = (
    <svg width="14" height="10" viewBox="0 0 14 10" fill="none">
      <path d="M1 5L5 9L13 1" stroke="#FFFFFF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );

  if (isToss) {
    return (
      <div>
        {/* 헤더 */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div>
            <h2 style={{ margin: 0, fontSize: 20, fontWeight: 700, color: "#191F28" }}>
              최근 비교 내역
            </h2>
            <p style={{ marginTop: 8, color: "#8B95A1", fontSize: 14 }}>
              최근에 비교한 상품들을 한눈에 볼 수 있어요.
            </p>
          </div>
          {sorted.length > 0 && !editMode && (
            <button
              onClick={() => setEditMode(true)}
              style={{
                background: "none",
                border: "none",
                color: "#3182F6",
                fontSize: 14,
                fontWeight: 600,
                cursor: "pointer",
                padding: "4px 0",
                flexShrink: 0,
              }}
            >
              편집
            </button>
          )}
          {editMode && (
            <button
              onClick={exitEditMode}
              style={{
                background: "none",
                border: "none",
                color: "#8B95A1",
                fontSize: 14,
                fontWeight: 600,
                cursor: "pointer",
                padding: "4px 0",
                flexShrink: 0,
              }}
            >
              취소
            </button>
          )}
        </div>

        {sorted.length === 0 ? (
          <div style={{ marginTop: 40, textAlign: "center", color: "#8B95A1", fontSize: 14 }}>
            아직 비교한 기록이 없어요.
          </div>
        ) : (
          <>
            {/* 편집 모드: 전체선택 + 삭제 버튼 */}
            {editMode && (
              <div style={{
                marginTop: 16,
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
              }}>
                <button
                  onClick={toggleSelectAll}
                  style={{
                    background: "none",
                    border: "none",
                    display: "flex",
                    alignItems: "center",
                    gap: 8,
                    cursor: "pointer",
                    padding: 0,
                    fontSize: 14,
                    color: "#4E5968",
                  }}
                >
                  <div style={checkboxStyle(selected.size === sorted.length)}>
                    {selected.size === sorted.length && checkmark}
                  </div>
                  전체 선택
                </button>
                <button
                  onClick={handleDelete}
                  disabled={selected.size === 0}
                  style={{
                    background: selected.size > 0 ? "#FF4545" : "#F2F4F6",
                    color: selected.size > 0 ? "#FFFFFF" : "#B0B8C1",
                    border: "none",
                    borderRadius: 8,
                    padding: "8px 16px",
                    fontSize: 14,
                    fontWeight: 600,
                    cursor: selected.size > 0 ? "pointer" : "default",
                    transition: "all 150ms",
                  }}
                >
                  삭제{selected.size > 0 ? ` (${selected.size})` : ""}
                </button>
              </div>
            )}

            <div style={{ marginTop: editMode ? 12 : 18, display: "grid", gap: 8 }}>
              {sorted.map((r) => (
                <div
                  key={r.id + r.createdAt}
                  style={{ display: "flex", alignItems: "center", gap: 12 }}
                >
                  {editMode && (
                    <div
                      onClick={() => toggleSelect(r.id)}
                      style={checkboxStyle(selected.has(r.id))}
                    >
                      {selected.has(r.id) && checkmark}
                    </div>
                  )}
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <TDSListRow
                      onClick={() => !editMode && navigate(`/result/${r.id}`)}
                      withArrow={!editMode}
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
                        border: editMode && selected.has(r.id)
                          ? "1px solid #3182F6"
                          : "1px solid #F2F4F6",
                        background: "#FFFFFF",
                        transition: "border-color 150ms",
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    );
  }

  // 웹 환경
  return (
    <div>
      {/* 헤더 */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div>
          <h2 style={{ margin: 0, fontSize: 20, fontWeight: 800 }}>최근 비교 내역</h2>
          <p style={{ marginTop: 8, color: "var(--muted)", fontSize: 14 }}>
            최근에 비교한 상품들을 한눈에 볼 수 있어요.
          </p>
        </div>
        {sorted.length > 0 && !editMode && (
          <button
            onClick={() => setEditMode(true)}
            style={{
              background: "none",
              border: "none",
              color: "var(--primary)",
              fontSize: 14,
              fontWeight: 600,
              cursor: "pointer",
              padding: "4px 0",
              flexShrink: 0,
            }}
          >
            편집
          </button>
        )}
        {editMode && (
          <button
            onClick={exitEditMode}
            style={{
              background: "none",
              border: "none",
              color: "var(--muted)",
              fontSize: 14,
              fontWeight: 600,
              cursor: "pointer",
              padding: "4px 0",
              flexShrink: 0,
            }}
          >
            취소
          </button>
        )}
      </div>

      {sorted.length === 0 ? (
        <div style={{ marginTop: 40, textAlign: "center", color: "var(--muted)", fontSize: 14 }}>
          아직 비교한 기록이 없어요.
        </div>
      ) : (
        <>
          {/* 편집 모드: 전체선택 + 삭제 버튼 */}
          {editMode && (
            <div style={{
              marginTop: 16,
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}>
              <button
                onClick={toggleSelectAll}
                style={{
                  background: "none",
                  border: "none",
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                  cursor: "pointer",
                  padding: 0,
                  fontSize: 14,
                  color: "var(--fg)",
                }}
              >
                <div style={checkboxStyle(selected.size === sorted.length)}>
                  {selected.size === sorted.length && checkmark}
                </div>
                전체 선택
              </button>
              <button
                onClick={handleDelete}
                disabled={selected.size === 0}
                style={{
                  background: selected.size > 0 ? "#FF4545" : "var(--card)",
                  color: selected.size > 0 ? "#FFFFFF" : "var(--muted)",
                  border: "none",
                  borderRadius: 8,
                  padding: "8px 16px",
                  fontSize: 14,
                  fontWeight: 600,
                  cursor: selected.size > 0 ? "pointer" : "default",
                  transition: "all 150ms",
                }}
              >
                삭제{selected.size > 0 ? ` (${selected.size})` : ""}
              </button>
            </div>
          )}

          <div style={{ marginTop: editMode ? 12 : 18, display: "grid", gap: 12 }}>
            {sorted.map((r) => (
              <div
                key={r.id + r.createdAt}
                style={{ display: "flex", alignItems: "center", gap: 12 }}
              >
                {editMode && (
                  <div
                    onClick={() => toggleSelect(r.id)}
                    style={checkboxStyle(selected.has(r.id))}
                  >
                    {selected.has(r.id) && checkmark}
                  </div>
                )}
                <div
                  onClick={() => !editMode && navigate(`/result/${r.id}`)}
                  role="button"
                  tabIndex={0}
                  style={{
                    flex: 1,
                    padding: 16,
                    borderRadius: 16,
                    border: editMode && selected.has(r.id)
                      ? "1px solid var(--primary)"
                      : "1px solid var(--border)",
                    background: "var(--bg)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    gap: 12,
                    cursor: editMode ? "default" : "pointer",
                    transition: "border-color 150ms",
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
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
