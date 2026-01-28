/**
 * 404 페이지 (NotFound)
 * - 존재하지 않는 경로 접근 시 표시
 * - 홈으로 돌아가기 링크 제공
 */

import { useNavigate } from "react-router-dom";

function NotFound() {
  const navigate = useNavigate();

  return (
    <div style={{ padding: "24px", maxWidth: "600px", margin: "0 auto", textAlign: "center" }}>
      <h1 style={{ fontSize: "32px", marginBottom: "16px" }}>404</h1>
      <p style={{ fontSize: "18px", color: "#666", marginBottom: "24px" }}>
        페이지를 찾을 수 없습니다.
      </p>
      <button
        onClick={() => navigate("/")}
        style={{
          padding: "12px 24px",
          fontSize: "16px",
          backgroundColor: "#007bff",
          color: "white",
          border: "none",
          borderRadius: "4px",
          cursor: "pointer",
        }}
      >
        홈으로 돌아가기
      </button>
    </div>
  );
}

export default NotFound;