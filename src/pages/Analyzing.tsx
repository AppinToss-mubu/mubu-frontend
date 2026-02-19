/**
 * 분석 중 페이지 (Analyzing)
 * - 스크린샷 3번 기준 UI
 * - 이미지 업로드 후 AI 분석 로딩 화면
 */

import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useCompareWithImage } from "../hooks/usePriceCompare";
import { usePriceStore } from "../store/priceStore";
import { TDSButton } from "../components/tds";
import { isTossEnvironment } from "../utils/env";

function Analyzing() {
  const navigate = useNavigate();
  const { pendingFile, setImageId, setCompareResult, setPendingFile } =
    usePriceStore();
  const { mutateAsync: compareWithImage } = useCompareWithImage();
  const [statusText, setStatusText] = useState("가격표를 찾는 중...");
  const [localError, setLocalError] = useState<Error | null>(null);
  const [isRateLimited, setIsRateLimited] = useState(false);
  const hasStartedRef = useRef(false);
  const isNavigatingRef = useRef(false);

  useEffect(() => {
    // 이미 시작했거나 네비게이션 중이면 스킵
    if (hasStartedRef.current || isNavigatingRef.current) {
      return;
    }

    if (!pendingFile) {
      navigate("/");
      return;
    }

    hasStartedRef.current = true;

    const statusMessages = [
      "가격표를 찾는 중...",
      "상품 정보를 분석하는 중...",
      "최저가를 검색하는 중...",
    ];
    let idx = 0;
    const interval = setInterval(() => {
      idx = (idx + 1) % statusMessages.length;
      setStatusText(statusMessages[idx]);
    }, 2000);

    console.log("[Analyzing] API 호출 시작");

    compareWithImage(pendingFile)
      .then((data) => {
        console.log("[Analyzing] 성공! data:", data);
        clearInterval(interval);
        isNavigatingRef.current = true;

        const targetUrl = `/ad-gate/${data.imageId}`;
        console.log("[Analyzing] 네비게이션 시작:", targetUrl);

        setImageId(data.imageId);
        setCompareResult(data);
        setPendingFile(null);

        console.log("[Analyzing] store 업데이트 완료, navigate 호출");
        navigate(targetUrl);
      })
      .catch((err) => {
        console.log("[Analyzing] 실패:", err);
        clearInterval(interval);
        console.error("분석 실패:", err);
        const errorMessage = err?.message || "";
        if (
          errorMessage.includes("429") ||
          errorMessage.includes("Too Many") ||
          errorMessage.includes("RESOURCE_EXHAUSTED") ||
          errorMessage.includes("서버 오류")
        ) {
          setIsRateLimited(true);
        }
        setLocalError(err as Error);
      });

    return () => clearInterval(interval);
  }, [
    pendingFile,
    compareWithImage,
    setImageId,
    setCompareResult,
    setPendingFile,
    navigate,
  ]);

  const handleClose = () => {
    setPendingFile(null);
    navigate("/");
  };

  // 네비게이션 중이면 null 반환 (리렌더 방지)
  if (isNavigatingRef.current) {
    return null;
  }

  if (!pendingFile && !localError) {
    return null;
  }

  const isToss = isTossEnvironment();

  if (isToss) {
    return (
      <div style={{ minHeight: "100vh", backgroundColor: "#FFFFFF" }}>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "16px 20px",
            borderBottom: "1px solid #F2F4F6",
          }}
        >
          <h1 style={{ fontSize: 17, fontWeight: 600, margin: 0, color: "#191F28" }}>분석 중</h1>
          <button
            onClick={handleClose}
            style={{
              background: "transparent",
              border: "none",
              fontSize: 20,
              cursor: "pointer",
              color: "#8B95A1",
              padding: 4,
              width: 32,
              height: 32,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
            aria-label="닫기"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            minHeight: "60vh",
            gap: 24,
            padding: "40px 20px",
          }}
        >
          {localError ? (
            <>
              <div
                style={{
                  width: 80,
                  height: 80,
                  borderRadius: "50%",
                  backgroundColor: "#F2F4F6",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="#8B95A1" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10" />
                  <line x1="12" y1="8" x2="12" y2="12" />
                  <line x1="12" y1="16" x2="12.01" y2="16" />
                </svg>
              </div>
              <div style={{ textAlign: "center" }}>
                <div style={{ fontSize: 18, fontWeight: 700, marginBottom: 12, color: "#191F28" }}>
                  분석에 실패했어요
                </div>
                <div style={{ fontSize: 14, color: "#8B95A1", marginBottom: 28, lineHeight: 1.8 }}>
                  {isRateLimited ? (
                    <>
                      요청이 많아 잠시 쉬어가야 해요
                      <br />
                      30초 정도 후에 다시 시도해주세요
                    </>
                  ) : (
                    localError.message || "상품 분석에 실패했어요. 다시 시도해주세요."
                  )}
                </div>
                <TDSButton
                  onClick={() => {
                    setPendingFile(null);
                    navigate("/?open=1");
                  }}
                  color="primary"
                  variant="fill"
                  size="large"
                >
                  다시 촬영하기
                </TDSButton>
              </div>
            </>
          ) : (
            <>
              <div
                style={{
                  width: 64,
                  height: 64,
                  position: "relative",
                }}
              >
                <div
                  style={{
                    width: 64,
                    height: 64,
                    borderRadius: "50%",
                    border: "3px solid #E5E8EB",
                    borderTopColor: "#3182F6",
                    animation: "tds-analyzing-spin 1s linear infinite",
                  }}
                />
              </div>
              <div style={{ textAlign: "center" }}>
                <div style={{ fontSize: 18, fontWeight: 700, color: "#191F28", marginBottom: 8 }}>
                  AI가 상품을 분석하고 있어요
                </div>
                <div style={{ fontSize: 14, color: "#8B95A1", lineHeight: 1.6 }}>
                  {statusText}
                </div>
              </div>
              <div
                style={{
                  marginTop: 16,
                  display: "flex",
                  gap: 6,
                  alignItems: "center",
                }}
              >
                {[0, 1, 2].map((i) => (
                  <div
                    key={i}
                    style={{
                      width: 8,
                      height: 8,
                      borderRadius: "50%",
                      backgroundColor: "#3182F6",
                      animation: `tds-analyzing-bounce 1.4s infinite ease-in-out`,
                      animationDelay: `${i * 0.16}s`,
                    }}
                  />
                ))}
              </div>
            </>
          )}
        </div>

        <style>{`
          @keyframes tds-analyzing-spin {
            to { transform: rotate(360deg); }
          }
          @keyframes tds-analyzing-bounce {
            0%, 80%, 100% { transform: scale(0.6); opacity: 0.4; }
            40% { transform: scale(1); opacity: 1; }
          }
        `}</style>
      </div>
    );
  }

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "var(--bg)" }}>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "16px 20px",
          borderBottom: "1px solid var(--border)",
        }}
      >
        <h1 style={{ fontSize: 17, fontWeight: 600, margin: 0 }}>분석 중...</h1>
        <button
          onClick={handleClose}
          style={{
            background: "transparent",
            border: "none",
            fontSize: 24,
            cursor: "pointer",
            color: "var(--muted)",
            padding: 4,
          }}
          aria-label="닫기"
        >
          ×
        </button>
      </div>

      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          minHeight: "60vh",
          gap: 24,
          padding: 20,
        }}
      >
        {localError ? (
          <>
            <div
              style={{
                width: 80,
                height: 80,
                borderRadius: "50%",
                backgroundColor: "var(--card)",
                border: "1px solid var(--border)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <svg
                width="36"
                height="36"
                viewBox="0 0 24 24"
                fill="none"
                stroke="var(--muted)"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <circle cx="12" cy="12" r="10" />
                <line x1="12" y1="8" x2="12" y2="12" />
                <line x1="12" y1="16" x2="12.01" y2="16" />
              </svg>
            </div>
            <div style={{ textAlign: "center" }}>
              <div
                style={{
                  fontSize: 18,
                  fontWeight: 700,
                  marginBottom: 12,
                  color: "var(--fg)",
                }}
              >
                분석 실패
              </div>
              <div
                style={{
                  fontSize: 14,
                  color: "var(--muted)",
                  marginBottom: 28,
                  lineHeight: 1.8,
                }}
              >
                {isRateLimited ? (
                  <>
                    무료버전은 요청이 많으면 쉬어가야해요 ㅠㅠ
                    <br />
                    30초 정도 기다려주세요
                  </>
                ) : (
                  localError.message || "상품 분석에 실패했습니다."
                )}
              </div>
              <button
                onClick={() => {
                  setPendingFile(null);
                  navigate("/?open=1");
                }}
                style={{
                  padding: "14px 40px",
                  borderRadius: 12,
                  border: "none",
                  backgroundColor: "#1f2937",
                  color: "#ffffff",
                  fontSize: 15,
                  fontWeight: 600,
                  cursor: "pointer",
                }}
              >
                다시 분석하기
              </button>
            </div>
          </>
        ) : (
          <>
            <div
              style={{
                width: 80,
                height: 80,
                borderRadius: "50%",
                backgroundColor: "var(--card)",
                border: "2px solid var(--border)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                position: "relative",
              }}
            >
              <div
                style={{
                  position: "absolute",
                  width: "100%",
                  height: "100%",
                  borderRadius: "50%",
                  border: "3px solid transparent",
                  borderTopColor: "var(--primary)",
                  animation: "spin 1.2s linear infinite",
                }}
              />
              <span style={{ fontSize: 32 }}>🔍</span>
            </div>
            <div style={{ textAlign: "center" }}>
              <div
                style={{ fontSize: 18, fontWeight: 700, marginBottom: 8 }}
              >
                AI가 상품을 분석하고 있습니다
              </div>
              <div style={{ fontSize: 14, color: "var(--muted)" }}>
                {statusText}
              </div>
            </div>
          </>
        )}
      </div>

      <style>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}

export default Analyzing;
