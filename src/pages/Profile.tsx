/**
 * 프로필 페이지
 * - Toss 환경: TDS 스타일 적용
 * - 일반 웹: 기존 스타일 유지
 */

import { useNavigate } from "react-router-dom";
import { isTossEnvironment } from "../utils/env";
import { TDSButton } from "../components/tds";

export default function Profile() {
  const navigate = useNavigate();
  const isToss = isTossEnvironment();

  if (isToss) {
    return (
      <div>
        <h1
          style={{
            fontSize: 24,
            fontWeight: 700,
            marginBottom: 8,
            color: "#191F28",
          }}
        >
          프로필
        </h1>
        <p style={{ color: "#8B95A1", marginBottom: 32 }}>
          로그인하면 비교 기록을 저장하고 관리할 수 있어요
        </p>

        <div
          style={{
            padding: "40px 24px",
            borderRadius: 16,
            backgroundColor: "#FFFFFF",
            border: "1px solid #F2F4F6",
            textAlign: "center",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <div
            style={{
              width: 72,
              height: 72,
              borderRadius: "50%",
              backgroundColor: "#F2F4F6",
              border: "2px solid #E5E8EB",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              marginBottom: 20,
            }}
          >
            <svg
              width="32"
              height="32"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#8B95A1"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" />
              <circle cx="12" cy="7" r="4" />
            </svg>
          </div>
          <div
            style={{
              fontSize: 16,
              fontWeight: 600,
              marginBottom: 8,
              color: "#191F28",
            }}
          >
            로그인이 필요해요
          </div>
          <p
            style={{
              fontSize: 14,
              color: "#8B95A1",
              marginBottom: 24,
              lineHeight: 1.6,
              margin: "0 0 24px 0",
            }}
          >
            지금은 로그인 없이 사용할 수 있어요
            <br />곧 로그인 기능이 추가될 예정이에요!
          </p>
          <TDSButton
            onClick={() => navigate("/")}
            color="primary"
            variant="fill"
            size="large"
            display="full"
          >
            홈으로 돌아가기
          </TDSButton>
        </div>
      </div>
    );
  }

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
        <div
          style={{
            width: 72,
            height: 72,
            borderRadius: "50%",
            backgroundColor: "var(--bg)",
            border: "2px solid var(--border)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            margin: "0 auto 20px",
          }}
        >
          <svg
            width="32"
            height="32"
            viewBox="0 0 24 24"
            fill="none"
            stroke="var(--muted)"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" />
            <circle cx="12" cy="7" r="4" />
          </svg>
        </div>
        <div style={{ fontSize: 16, fontWeight: 600, marginBottom: 8 }}>
          로그인이 필요해요
        </div>
        <p
          style={{
            fontSize: 14,
            color: "var(--muted)",
            marginBottom: 24,
            lineHeight: 1.6,
          }}
        >
          지금은 로그인 없이 사용할 수 있어요
          <br />곧 로그인 기능이 추가될 예정이에요!
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
