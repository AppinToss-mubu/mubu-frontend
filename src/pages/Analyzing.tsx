/**
 * 분석 중 페이지 (Analyzing)
 * - 스크린샷 3번 기준 UI
 * - 이미지 업로드 후 AI 분석 로딩 화면
 */

import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useCompareWithImage } from "../hooks/usePriceCompare";
import { usePriceStore } from "../store/priceStore";

function Analyzing() {
  const navigate = useNavigate();
  const { pendingFile, setImageId, setCompareResult, setPendingFile } = usePriceStore();
  const { mutate: compareWithImage } = useCompareWithImage();
  const [statusText, setStatusText] = useState("가격표를 찾는 중...");
  const [localError, setLocalError] = useState<Error | null>(null);
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
    
    compareWithImage(pendingFile, {
      onSuccess: (data) => {
        console.log("[Analyzing] onSuccess 호출됨, data:", data);
        clearInterval(interval);
        isNavigatingRef.current = true;
        
        const targetUrl = `/price-confirm/${data.imageId}`;
        console.log("[Analyzing] 네비게이션 시작:", targetUrl);
        
        setImageId(data.imageId);
        setCompareResult(data);
        setPendingFile(null);
        
        console.log("[Analyzing] store 업데이트 완료, navigate 호출");
        navigate(targetUrl);
      },
      onError: (err) => {
        console.log("[Analyzing] onError 호출됨:", err);
        clearInterval(interval);
        console.error("분석 실패:", err);
        setLocalError(err as Error);
      },
    });

    return () => clearInterval(interval);
  }, [pendingFile, compareWithImage, setImageId, setCompareResult, setPendingFile, navigate]);

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
                backgroundColor: "#fee2e2",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 36,
              }}
            >
              ⚠
            </div>
            <div style={{ textAlign: "center" }}>
              <div style={{ fontSize: 18, fontWeight: 700, marginBottom: 8, color: "#b91c1c" }}>
                분석 실패
              </div>
              <div style={{ fontSize: 14, color: "var(--muted)", marginBottom: 24 }}>
                {localError.message || "상품 분석에 실패했습니다."}
              </div>
              <button
                onClick={handleClose}
                style={{
                  padding: "12px 32px",
                  borderRadius: 12,
                  border: "none",
                  backgroundColor: "#1f2937",
                  color: "#ffffff",
                  fontSize: 15,
                  fontWeight: 600,
                  cursor: "pointer",
                }}
              >
                홈으로 돌아가기
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
              <div style={{ fontSize: 18, fontWeight: 700, marginBottom: 8 }}>
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
