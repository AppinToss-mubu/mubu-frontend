/**
 * 메인 페이지 (Home)
 * - 상품 이미지 업로드/촬영
 * - Toss 카메라 또는 파일 업로드
 * - 업로드 후 /result/:imageId로 이동
 */

import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { ImageSourceSheet } from "../components/ImageSourceSheet";
import { useCompareWithImage } from "../hooks/usePriceCompare";
import { useRecentComparisons } from "../hooks/useRecentComparisons";
import { useToss } from "../hooks/useToss";
import { usePriceStore } from "../store/priceStore";

function Home() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const { mutate: compareWithImage, isPending, error } = useCompareWithImage();
  const { setImageId, setCompareResult, reset } = usePriceStore();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const { items: recent } = useRecentComparisons();
  const { isAvailable: isTossAvailable, openCamera } = useToss();

  const albumInputRef = useRef<HTMLInputElement | null>(null);
  const cameraInputRef = useRef<HTMLInputElement | null>(null);

  const [localError, setLocalError] = useState<string | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const shouldAutoOpen = useMemo(
    () => searchParams.get("open") === "1",
    [searchParams],
  );

  useEffect(() => {
    if (!shouldAutoOpen) return;
    setIsSheetOpen(true);
    // URL 정리 (뒤로가기 스택 오염 방지)
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

  const setFile = (file: File) => {
    const validationError = validateFile(file);
    if (validationError) {
      setLocalError(validationError);
      return;
    }
    setLocalError(null);
    setSelectedFile(file);
    const url = URL.createObjectURL(file);
    setPreviewUrl(url);
  };

  const onAlbumChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) setFile(file);
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
      if (file) setFile(file);
      return;
    }

    // web: camera capture input (모바일은 카메라 UI로 열림)
    cameraInputRef.current?.click();
  };

  const isMobileWeb = useMemo(() => {
    if (typeof navigator === "undefined") return false;
    return /iPhone|Android|Mobile/i.test(navigator.userAgent);
  }, []);

  const handleCompare = () => {
    if (!selectedFile) {
      alert("이미지를 선택해주세요.");
      return;
    }

    // 스토어 초기화
    reset();

    compareWithImage(selectedFile, {
      onSuccess: (data) => {
        // compare 결과를 스토어에 저장하고 가격 확인 페이지로 이동
        console.log("API 응답 데이터:", data);
        setImageId(data.imageId);
        setCompareResult(data);

        // 분석 완료 후 가격 확인 페이지로 이동
        navigate(`/price-confirm/${data.imageId}`);
      },
      onError: (error) => {
        console.error("가격 비교 실패:", error);
        alert(error.message || "가격 비교에 실패했습니다. 다시 시도해주세요.");
      },
    });
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
        <button
          type="button"
          onClick={() => setIsSheetOpen(true)}
          disabled={isPending}
          style={{
            width: "100%",
            padding: "16px 18px",
            borderRadius: "16px",
            border: "1px solid var(--border)",
            background: "var(--primary)",
            color: "var(--primary-contrast)",
            fontSize: "16px",
            fontWeight: 800,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "10px",
            cursor: isPending ? "not-allowed" : "pointer",
            opacity: isPending ? 0.7 : 1,
          }}
        >
          <span aria-hidden>📷</span>
          상품 촬영하기
        </button>

        {/* hidden inputs: album + camera */}
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

        {previewUrl && (
          <div style={{ marginTop: 14 }}>
            <img
              src={previewUrl}
              alt="미리보기"
              style={{
                width: "100%",
                maxHeight: 320,
                objectFit: "cover",
                borderRadius: 16,
              }}
            />
          </div>
        )}
      </div>

      {selectedFile && (
        <div style={{ marginTop: 14 }}>
          <button
            onClick={handleCompare}
            disabled={isPending}
            style={{
              width: "100%",
              padding: "14px 18px",
              borderRadius: "14px",
              border: "1px solid var(--border)",
              background: "var(--card)",
              color: "var(--fg)",
              fontSize: 16,
              fontWeight: 700,
              cursor: isPending ? "not-allowed" : "pointer",
              opacity: isPending ? 0.7 : 1,
            }}
          >
            {isPending ? "분석 중..." : "분석 시작하기"}
          </button>
        </div>
      )}

      {(error || localError) && (
        <div
          style={{
            marginTop: 16,
            padding: 12,
            borderRadius: 12,
            backgroundColor: "var(--danger-bg)",
            color: "var(--danger-fg)",
            border: "1px solid var(--border)",
          }}
        >
          {localError ||
            error?.message ||
            "오류가 발생했습니다. 다시 시도해주세요."}
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
            recent.slice(0, 3).map((r) => (
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
            ))
          )}
        </div>
      </div>

      <ImageSourceSheet
        open={isSheetOpen}
        onClose={() => setIsSheetOpen(false)}
        onPickCamera={openCameraFromSheet}
        onPickAlbum={openAlbum}
        showCamera={isTossAvailable || isMobileWeb}
      />
    </div>
  );
}

export default Home;
