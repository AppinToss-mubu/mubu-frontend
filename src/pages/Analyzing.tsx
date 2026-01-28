/**
 * 분석 중 페이지 (Analyzing)
 * - 이미지 업로드 후 AI 분석이 진행되는 동안 보여주는 로딩 화면
 * - 분석 완료 후 PriceConfirm 또는 Result로 이동
 */

import { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useCompareWithImage } from "../hooks/usePriceCompare";
import { usePriceStore } from "../store/priceStore";

function Analyzing() {
  const { imageId } = useParams<{ imageId: string }>();
  const navigate = useNavigate();
  const { setImageId, setCompareResult, reset } = usePriceStore();
  const { mutate: compareWithImage, isPending, error } = useCompareWithImage();

  // imageId가 없으면 홈으로 리다이렉트
  useEffect(() => {
    if (!imageId) {
      navigate("/");
    }
  }, [imageId, navigate]);

  // 이미지 파일을 가져와서 분석 시작
  useEffect(() => {
    // 스토어에서 이미지 파일을 가져오거나, URL 파라미터로 전달받은 이미지를 사용
    // 현재는 Home에서 이미 분석을 시작했으므로, 여기서는 결과를 기다리는 역할만 함
    // 실제로는 Home에서 분석을 시작하고, 결과를 받으면 바로 PriceConfirm으로 이동해야 함
  }, []);

  // 에러 발생 시 처리
  useEffect(() => {
    if (error) {
      console.error("분석 실패:", error);
      // 에러 발생 시 홈으로 돌아가기
      setTimeout(() => {
        navigate("/");
      }, 2000);
    }
  }, [error, navigate]);

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        minHeight: "60vh",
        gap: 24,
      }}
    >
      <div
        style={{
          width: 64,
          height: 64,
          border: "4px solid var(--border)",
          borderTopColor: "var(--primary)",
          borderRadius: "50%",
          animation: "spin 1s linear infinite",
        }}
      />

      <div style={{ textAlign: "center" }}>
        <div style={{ fontSize: 20, fontWeight: 800, marginBottom: 8 }}>
          분석 중...
        </div>
        <div style={{ fontSize: 14, color: "var(--muted)" }}>
          상품 정보를 분석하고 있어요
        </div>
      </div>

      {error && (
        <div
          style={{
            marginTop: 16,
            padding: 12,
            borderRadius: 12,
            backgroundColor: "var(--danger-bg)",
            color: "var(--danger-fg)",
            border: "1px solid var(--border)",
            maxWidth: "90%",
            textAlign: "center",
          }}
        >
          {error.message || "분석에 실패했습니다. 잠시 후 다시 시도해주세요."}
        </div>
      )}
    </div>
  );
}

export default Analyzing;
