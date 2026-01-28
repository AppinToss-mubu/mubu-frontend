import { useNavigate } from "react-router-dom";

export default function Profile() {
  const navigate = useNavigate();

  return (
    <div style={{ padding: 20 }}>
      <h1 style={{ fontSize: 24, fontWeight: 700, marginBottom: 8 }}>프로필</h1>
      <p style={{ color: "var(--muted)", marginBottom: 32 }}>
        로그인하면 비교 기록을 저장하고 관리할 수 있어요
      </p>

      <div
        style={{
          padding: 40,
          borderRadius: 16,
          backgroundColor: "var(--card)",
          border: "1px solid var(--border)",
          textAlign: "center",
        }}
      >
        <div style={{ fontSize: 48, marginBottom: 16 }}>👤</div>
        <div style={{ fontSize: 16, fontWeight: 600, marginBottom: 8 }}>
          로그인이 필요해요
        </div>
        <p style={{ fontSize: 14, color: "var(--muted)", marginBottom: 24, lineHeight: 1.6 }}>
          지금은 로그인 없이 사용할 수 있어요<br />
          곧 로그인 기능이 추가될 예정이에요!
        </p>
        <button
          onClick={() => navigate("/")}
          style={{
            padding: "12px 24px",
            borderRadius: 12,
            border: "none",
            backgroundColor: "#1f2937",
            color: "#ffffff",
            fontSize: 14,
            fontWeight: 600,
            cursor: "pointer",
          }}
        >
          홈으로 돌아가기
        </button>
      </div>
    </div>
  );
}

