import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { usePriceStore } from "../store/priceStore";
import { TDSButton } from "../components/tds";
import { isTossEnvironment } from "../utils/env";

type AdState = "prompt" | "loading" | "showing" | "done" | "failed";

function AdGate() {
  const { imageId } = useParams<{ imageId: string }>();
  const navigate = useNavigate();
  const { compareResult } = usePriceStore();
  const [adState, setAdState] = useState<AdState>("prompt");

  useEffect(() => {
    if (!imageId || !compareResult) {
      navigate("/");
      return;
    }
  }, [imageId, compareResult, navigate]);

  useEffect(() => {
    if (!isTossEnvironment()) {
      navigate(`/price-confirm/${imageId}`, { replace: true });
    }
  }, []);

  const handleWatchAd = () => {
    setAdState("loading");

    // @cursor-todo: 실제 SDK 호출로 교체
    // import { GoogleAdMob } from '@apps-in-toss/web-framework';
    // const ad = await GoogleAdMob.loadAppsInTossAdMob({
    //   adGroupId: 'ait-ad-test-interstitial-id', // 테스트용 → 실서비스 시 콘솔 발급 ID로 교체
    //   type: 'interstitial',
    // });
    // ad.show();
    // ad.addEventListener('dismissed', () => navigate(...));
    simulateAdFlow();
  };

  const simulateAdFlow = () => {
    setAdState("loading");

    setTimeout(() => {
      setAdState("showing");

      setTimeout(() => {
        setAdState("done");
        navigate(`/price-confirm/${imageId}`, { replace: true });
      }, 1500);
    }, 1000);
  };

  const handleClose = () => {
    navigate("/");
  };

  if (!compareResult || !imageId) {
    return null;
  }

  if (!isTossEnvironment()) {
    return null;
  }

  return (
    <div style={{
      minHeight: "100vh",
      backgroundColor: "#FFFFFF",
      display: "flex",
      flexDirection: "column",
    }}>
      <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "40px 24px" }}>

        {adState === "prompt" && (
          <>
            <div style={{
              width: 88,
              height: 88,
              borderRadius: 24,
              background: "linear-gradient(135deg, #E8F3FF 0%, #D4E8FF 100%)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              marginBottom: 28,
            }}>
              <svg width="40" height="40" viewBox="0 0 24 24" fill="none">
                <path d="M9 12l2 2 4-4" stroke="#3182F6" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
                <circle cx="12" cy="12" r="10" stroke="#3182F6" strokeWidth="2" fill="none"/>
              </svg>
            </div>

            <div style={{
              fontSize: 22,
              fontWeight: 700,
              color: "#191F28",
              textAlign: "center",
              lineHeight: 1.4,
              marginBottom: 12,
            }}>
              분석이 완료되었어요!
            </div>

            <div style={{
              fontSize: 15,
              color: "#8B95A1",
              textAlign: "center",
              lineHeight: 1.7,
              marginBottom: 40,
            }}>
              짧은 광고를 시청하면
              <br />
              가격 비교 결과를 확인할 수 있어요
            </div>

            <div style={{
              width: "100%",
              maxWidth: 320,
              display: "flex",
              flexDirection: "column",
              gap: 10,
            }}>
              <div style={{
                display: "flex",
                alignItems: "center",
                gap: 12,
                padding: "14px 16px",
                borderRadius: 14,
                backgroundColor: "#F8F9FA",
              }}>
                <div style={{
                  width: 36,
                  height: 36,
                  borderRadius: 10,
                  backgroundColor: "#E8F3FF",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexShrink: 0,
                }}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                    <rect x="2" y="3" width="20" height="14" rx="2" stroke="#3182F6" strokeWidth="2"/>
                    <path d="M8 21h8M12 17v4" stroke="#3182F6" strokeWidth="2" strokeLinecap="round"/>
                  </svg>
                </div>
                <div>
                  <div style={{ fontSize: 14, fontWeight: 600, color: "#333D4B" }}>광고 시청</div>
                  <div style={{ fontSize: 12, color: "#8B95A1", marginTop: 2 }}>약 15~30초 소요</div>
                </div>
              </div>

              <div style={{
                display: "flex",
                alignItems: "center",
                gap: 12,
                padding: "14px 16px",
                borderRadius: 14,
                backgroundColor: "#F8F9FA",
              }}>
                <div style={{
                  width: 36,
                  height: 36,
                  borderRadius: 10,
                  backgroundColor: "#E5F9ED",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexShrink: 0,
                }}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                    <path d="M12 2v20M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6" stroke="#1DB866" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
                <div>
                  <div style={{ fontSize: 14, fontWeight: 600, color: "#333D4B" }}>결과 확인</div>
                  <div style={{ fontSize: 12, color: "#8B95A1", marginTop: 2 }}>한국 최저가와 비교해볼 수 있어요</div>
                </div>
              </div>
            </div>
          </>
        )}

        {adState === "loading" && (
          <div style={{ textAlign: "center" }}>
            <div style={{
              width: 56,
              height: 56,
              borderRadius: "50%",
              border: "3px solid #E5E8EB",
              borderTopColor: "#3182F6",
              animation: "ad-gate-spin 1s linear infinite",
              margin: "0 auto 20px",
            }} />
            <div style={{ fontSize: 17, fontWeight: 600, color: "#191F28", marginBottom: 6 }}>
              광고를 불러오는 중이에요
            </div>
            <div style={{ fontSize: 14, color: "#8B95A1" }}>
              잠시만 기다려주세요
            </div>
          </div>
        )}

        {adState === "showing" && (
          <div style={{ textAlign: "center" }}>
            <div style={{
              width: 72,
              height: 72,
              borderRadius: 20,
              background: "linear-gradient(135deg, #E8F3FF 0%, #D4E8FF 100%)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              margin: "0 auto 20px",
            }}>
              <svg width="32" height="32" viewBox="0 0 24 24" fill="#3182F6">
                <polygon points="5 3 19 12 5 21 5 3" />
              </svg>
            </div>
            <div style={{ fontSize: 17, fontWeight: 600, color: "#191F28", marginBottom: 6 }}>
              광고 재생 중...
            </div>
            <div style={{ fontSize: 14, color: "#8B95A1" }}>
              곧 결과를 확인하실 수 있어요
            </div>
          </div>
        )}

        {adState === "failed" && (
          <div style={{ textAlign: "center" }}>
            <div style={{
              width: 72,
              height: 72,
              borderRadius: 20,
              backgroundColor: "#FFF0F0",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              margin: "0 auto 20px",
            }}>
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
                <circle cx="12" cy="12" r="10" stroke="#F04452" strokeWidth="2"/>
                <path d="M12 8v4M12 16h.01" stroke="#F04452" strokeWidth="2" strokeLinecap="round"/>
              </svg>
            </div>
            <div style={{ fontSize: 17, fontWeight: 600, color: "#191F28", marginBottom: 6 }}>
              광고를 불러오지 못했어요
            </div>
            <div style={{ fontSize: 14, color: "#8B95A1", marginBottom: 24 }}>
              결과 페이지로 바로 이동할게요
            </div>
            <TDSButton
              onClick={() => navigate(`/price-confirm/${imageId}`, { replace: true })}
              color="primary"
              variant="fill"
              size="large"
              display="full"
            >
              결과 보기
            </TDSButton>
          </div>
        )}
      </div>

      {adState === "prompt" && (
        <div style={{
          padding: "0 24px 40px",
          display: "flex",
          flexDirection: "column",
          gap: 10,
        }}>
          <TDSButton
            onClick={handleWatchAd}
            color="primary"
            variant="fill"
            size="xlarge"
            display="full"
          >
            광고 시청 후 결과 보기
          </TDSButton>
          <button
            onClick={handleClose}
            style={{
              background: "none",
              border: "none",
              padding: "12px",
              fontSize: 15,
              fontWeight: 500,
              color: "#8B95A1",
              cursor: "pointer",
              textAlign: "center",
            }}
          >
            다음에 할게요
          </button>
        </div>
      )}

      <style>{`
        @keyframes ad-gate-spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}

export default AdGate;
