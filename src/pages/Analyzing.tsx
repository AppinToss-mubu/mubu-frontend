/**
 * 분석 중 페이지 (Analyzing)
 * - Toss 환경: TDS v2 Top 컴포넌트 사용
 * - 일반 웹: 기존 스타일 유지
 */

import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useCompareWithImage } from "../hooks/usePriceCompare";
import { usePriceStore } from "../store/priceStore";
import { isTossEnvironment } from "../utils/env";

let Top: any, Button: any, Loader: any;
let adaptive: any;
try {
  const tds = require("@toss/tds-mobile");
  Top = tds.Top;
  Button = tds.Button;
  Loader = tds.Loader;
  const colors = require("@toss/tds-colors");
  adaptive = colors.adaptive;
} catch {
  // TDS not available
}

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

        const targetUrl = isTossEnvironment()
          ? `/ad-gate/${data.imageId}`
          : `/price-confirm/${data.imageId}`;
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

  if (isNavigatingRef.current) {
    return null;
  }

  if (!pendingFile && !localError) {
    return null;
  }

  const isToss = isTossEnvironment();

  if (isToss && Top && Button && Loader && adaptive) {
    return (
      <div style={{ minHeight: "100vh", backgroundColor: "#FFFFFF" }}>
        <Top
          title={
            <Top.TitleParagraph size={22} color={adaptive.grey900}>
              AI가 상품을 분석하고 있어요.
            </Top.TitleParagraph>
          }
          subtitleBottom={
            <Top.SubtitleParagraph color={adaptive.grey500}>
              잠시만 기다려주세요.
            </Top.SubtitleParagraph>
          }
        />

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            minHeight: "50vh",
            gap: 24,
            padding: "0 20px",
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
                <Button
                  onClick={() => {
                    setPendingFile(null);
                    navigate("/?open=1");
                  }}
                >
                  다시 촬영하기
                </Button>
              </div>
            </>
          ) : (
            <>
              {Loader ? (
                <Loader size="large" />
              ) : (
                <div style={{ width: 64, height: 64, position: "relative" }}>
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
              )}
              <div style={{ textAlign: "center" }}>
                <div style={{ fontSize: 14, color: "#8B95A1", lineHeight: 1.6 }}>
                  {statusText}
                </div>
              </div>
            </>
          )}
        </div>

        <style>{`
          @keyframes tds-analyzing-spin {
            to { transform: rotate(360deg); }
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
