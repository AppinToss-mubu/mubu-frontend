/**
 * 메인 페이지 (Home)
 * - 스크린샷 1번 기준 UI
 * - 상품 촬영 버튼 + 최근 비교 목록
 */

import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { ImageSourceSheet } from "../components/ImageSourceSheet";
import { useRecentComparisons } from "../hooks/useRecentComparisons";
import { useToss } from "../hooks/useToss";
import { usePriceStore } from "../store/priceStore";
import { isTossEnvironment } from "../utils/env";
import { TDSButton, TDSListRow } from "../components/tds";

function Home() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const { setPendingFile, reset } = usePriceStore();
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const { items: recent } = useRecentComparisons();
  const { isAvailable: isTossAvailable, openCamera } = useToss();

  // 디버깅: Toss 환경 감지 확인
  useEffect(() => {
    const isToss = isTossEnvironment();
    console.log("🔍 [Home] Toss 환경 감지:", isToss);
    console.log("  - window.Toss:", typeof (window as any).Toss);
    console.log("  - User-Agent:", navigator.userAgent);
    console.log("  - Location:", window.location.href);
    console.log("  - Hostname:", window.location.hostname);
  }, []);

  const albumInputRef = useRef<HTMLInputElement | null>(null);
  const cameraInputRef = useRef<HTMLInputElement | null>(null);

  const [localError, setLocalError] = useState<string | null>(null);

  const shouldAutoOpen = useMemo(
    () => searchParams.get("open") === "1",
    [searchParams],
  );

  useEffect(() => {
    if (!shouldAutoOpen) return;
    setIsSheetOpen(true);
    searchParams.delete("open");
    setSearchParams(searchParams, { replace: true });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [shouldAutoOpen]);

  const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
  const validateFile = (file: File): string | null => {
    if (file.size > MAX_FILE_SIZE)
      return "파일 크기가 너무 큽니다. (최대 10MB)";
    if (!file.type.startsWith("image/"))
      return "이미지 파일만 업로드 가능합니다.";
    return null;
  };

  const handleFileSelect = (file: File) => {
    const validationError = validateFile(file);
    if (validationError) {
      setLocalError(validationError);
      return;
    }
    setLocalError(null);

    // 스토어 초기화 후 파일 저장, 분석 페이지로 이동
    reset();
    setPendingFile(file);
    navigate("/analyzing");
  };

  const onAlbumChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleFileSelect(file);
    e.target.value = "";
  };

  const openAlbum = () => {
    setIsSheetOpen(false);
    albumInputRef.current?.click();
  };

  const openCameraFromSheet = async () => {
    setIsSheetOpen(false);

    if (isTossAvailable) {
      const file = await openCamera();
      if (file) handleFileSelect(file);
      return;
    }

    cameraInputRef.current?.click();
  };


  return (
    <div>
      <div style={{ marginTop: 18 }}>
        <div style={{ fontSize: 18, color: "var(--muted)" }}>안녕하세요</div>
        <div style={{ fontSize: 34, fontWeight: 800, marginTop: 6 }}>
          여행자님
        </div>
        <div
          style={{
            fontSize: 16,
            color: "var(--muted)",
            marginTop: 10,
            lineHeight: 1.6,
          }}
        >
          해외에서 발견한 상품, 한국 가격과 비교해보세요
        </div>
      </div>

      <div style={{ marginTop: 22 }}>
        {isTossEnvironment() ? (
          <TDSButton
            onClick={() => setIsSheetOpen(true)}
            color="primary"
            variant="fill"
            size="xlarge"
            display="full"
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "10px",
            }}
          >
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" />
              <circle cx="12" cy="13" r="4" />
            </svg>
            상품 촬영하기
          </TDSButton>
        ) : (
          <button
            type="button"
            onClick={() => setIsSheetOpen(true)}
            style={{
              width: "100%",
              padding: "16px 18px",
              borderRadius: "16px",
              border: "none",
              background: "var(--primary)",
              color: "var(--primary-contrast)",
              fontSize: "16px",
              fontWeight: 800,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "10px",
              cursor: "pointer",
            }}
          >
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" />
              <circle cx="12" cy="13" r="4" />
            </svg>
            상품 촬영하기
          </button>
        )}

        <input
          ref={albumInputRef}
          type="file"
          accept="image/*"
          onChange={onAlbumChange}
          style={{ display: "none" }}
        />
        <input
          ref={cameraInputRef}
          type="file"
          accept="image/*"
          capture="environment"
          onChange={onAlbumChange}
          style={{ display: "none" }}
        />
      </div>

      {localError && (
        <div
          style={{
            marginTop: 16,
            padding: 12,
            borderRadius: 12,
            backgroundColor: "#fee2e2",
            color: "#b91c1c",
            border: "1px solid #fecaca",
          }}
        >
          {localError}
        </div>
      )}

      <div style={{ marginTop: 26 }}>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <div style={{ fontSize: 18, fontWeight: 800 }}>최근 비교</div>
          <button
            type="button"
            onClick={() => navigate("/dashboard")}
            style={{
              border: "none",
              background: "transparent",
              color: "var(--muted)",
              fontWeight: 700,
              cursor: "pointer",
            }}
          >
            전체보기 →
          </button>
        </div>

        <div style={{ marginTop: 14, display: "grid", gap: 12 }}>
          {recent.length === 0 ? (
            <div style={{ color: "var(--muted)", padding: "8px 2px" }}>
              아직 비교한 기록이 없어요.
            </div>
          ) : (
            recent.slice(0, 3).map((r) =>
              isTossEnvironment() ? (
                <TDSListRow
                  key={r.id}
                  onClick={() => navigate(`/result/${r.id}`)}
                  withArrow
                  border="none"
                  contents={
                    <TDSListRow.Texts
                      type="2RowTypeA"
                      top={r.productName}
                      bottom="최저가 비교"
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
              ) : (
                <div
                  key={r.id}
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
                    <div style={{ marginTop: 6, color: "var(--muted)" }}>
                      최저가 비교
                    </div>
                  </div>

                  <div
                    style={{
                      padding: "8px 12px",
                      borderRadius: 12,
                      background:
                        r.savedAmount >= 0 ? "var(--chip-bg)" : "var(--card)",
                      color:
                        r.savedAmount >= 0 ? "var(--chip-fg)" : "var(--muted)",
                      fontWeight: 800,
                      whiteSpace: "nowrap",
                    }}
                  >
                    {r.savedAmount >= 0 ? "+" : "-"}
                    {new Intl.NumberFormat("ko-KR").format(
                      Math.abs(r.savedAmount),
                    )}
                    원
                  </div>
                </div>
              )
            )
          )}
        </div>
      </div>

      <ImageSourceSheet
        open={isSheetOpen}
        onClose={() => setIsSheetOpen(false)}
        onPickCamera={openCameraFromSheet}
        onPickAlbum={openAlbum}
        showCamera={true}
      />
    </div>
  );
}

export default Home;
