import { useEffect, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { usePriceStore } from "../store/priceStore";
import { TDSButton, TDSLoader } from "../components/tds";
import { isTossEnvironment } from "../utils/env";

type AdState = "prompt" | "loading" | "showing" | "done" | "failed";

function AdFailedView({ imageId, navigate, errorMsg }: { imageId: string; navigate: (path: string, opts?: any) => void; errorMsg?: string }) {
  const [countdown, setCountdown] = useState(3);
  const navigatedRef = useRef(false);

  useEffect(() => {
    const t1 = setTimeout(() => setCountdown(2), 1000);
    const t2 = setTimeout(() => setCountdown(1), 2000);
    const t3 = setTimeout(() => {
      if (!navigatedRef.current) {
        navigatedRef.current = true;
        navigate(`/price-confirm/${imageId}`, { replace: true });
      }
    }, 3000);
    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); };
  }, [imageId, navigate]);

  return (
    <div style={{ textAlign: "center", padding: "0 24px" }}>
      <div style={{
        width: 56,
        height: 56,
        borderRadius: 16,
        backgroundColor: "#FFEEEE",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        margin: "0 auto 20px",
      }}>
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
          <circle cx="12" cy="12" r="10" stroke="#F04452" strokeWidth="2"/>
          <path d="M12 8v4M12 16h.01" stroke="#F04452" strokeWidth="2" strokeLinecap="round"/>
        </svg>
      </div>
      <div style={{ fontSize: 17, fontWeight: 600, color: "#191F28", lineHeight: "25.5px", marginBottom: 6 }}>
        광고를 불러오지 못했어요
      </div>
      <div style={{ fontSize: 14, color: "#8B95A1", lineHeight: "21px", marginBottom: 8 }}>
        {countdown}초 후 결과 페이지로 이동해요
      </div>
      {errorMsg && (
        <div style={{ fontSize: 12, color: "#B0B8C1", lineHeight: "18px", marginBottom: 20, wordBreak: "break-all" }}>
          {errorMsg}
        </div>
      )}
      <TDSButton
        onClick={() => {
          if (!navigatedRef.current) {
            navigatedRef.current = true;
            navigate(`/price-confirm/${imageId}`, { replace: true });
          }
        }}
        color="primary"
        variant="fill"
        size="large"
        display="full"
      >
        바로 결과 보기
      </TDSButton>
    </div>
  );
}

const TEST_AD_GROUP_ID = "ait-ad-test-interstitial-id";

function AdGate() {
  const { imageId } = useParams<{ imageId: string }>();
  const navigate = useNavigate();
  const { compareResult } = usePriceStore();
  const [adState, setAdState] = useState<AdState>("prompt");
  const [adError, setAdError] = useState<string>("");

  useEffect(() => {
    if (!imageId || !compareResult) {
      navigate("/");
      return;
    }
  }, [imageId, compareResult, navigate]);

  useEffect(() => {
    if (!isTossEnvironment() && imageId) {
      navigate(`/price-confirm/${imageId}`, { replace: true });
    }
  }, [imageId]);

  const handleWatchAd = async () => {
    if (!isTossEnvironment()) {
      navigate(`/price-confirm/${imageId}`, { replace: true });
      return;
    }

    setAdState("loading");
    setAdError("");

    try {
      const { GoogleAdMob } = await import("@apps-in-toss/web-framework");

      try {
        const loaded = await GoogleAdMob.isAppsInTossAdMobLoaded({ adGroupId: TEST_AD_GROUP_ID });
        console.log("[AdGate] isAppsInTossAdMobLoaded:", loaded);
      } catch (checkErr) {
        console.log("[AdGate] isAppsInTossAdMobLoaded check failed (proceeding anyway):", checkErr);
      }

      const showAd = () => {
        setAdState("showing");

        GoogleAdMob.showAppsInTossAdMob({
          options: {
            adGroupId: TEST_AD_GROUP_ID,
          },
          onEvent: (event: any) => {
            console.log("[AdGate] show event:", event.type);
            switch (event.type) {
              case "show":
                break;
              case "impression":
                break;
              case "clicked":
                break;
              case "dismissed":
                setAdState("done");
                navigate(`/price-confirm/${imageId}`, { replace: true });
                break;
              case "failedToShow":
                console.error("[AdGate] failedToShow:", JSON.stringify(event));
                setAdError("광고 표시 실패: " + (event.data?.message || event.type));
                setAdState("failed");
                break;
            }
          },
          onError: (error: any) => {
            console.error("[AdGate] show onError:", JSON.stringify(error));
            setAdError("show 에러: " + (error?.message || String(error)));
            setAdState("failed");
          },
        });
      };

      const loadCleanup = GoogleAdMob.loadAppsInTossAdMob({
        options: {
          adGroupId: TEST_AD_GROUP_ID,
        },
        onEvent: (event: any) => {
          console.log("[AdGate] load event:", event.type, JSON.stringify(event.data || {}));
          switch (event.type) {
            case "loaded":
              console.log("[AdGate] 광고 로드 성공");
              loadCleanup();
              showAd();
              break;
          }
        },
        onError: (error: any) => {
          console.error("[AdGate] load onError:", JSON.stringify(error));
          const msg = error?.message || error?.code || String(error);
          setAdError("load 에러: " + msg);
          loadCleanup();
          setAdState("failed");
        },
      });
    } catch (error: any) {
      console.error("[AdGate] SDK import 실패:", error);
      setAdError("SDK 로드 실패: " + (error?.message || String(error)));
      setAdState("failed");
    }
  };

  const handleSkip = () => {
    navigate(`/price-confirm/${imageId}`, { replace: true });
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
              width: 56,
              height: 56,
              borderRadius: 16,
              backgroundColor: "#E8F3FF",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              marginBottom: 24,
            }}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <path d="M9 12l2 2 4-4" stroke="#3182F6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <circle cx="12" cy="12" r="10" stroke="#3182F6" strokeWidth="2" fill="none"/>
              </svg>
            </div>

            <div style={{
              fontSize: 22,
              fontWeight: 700,
              color: "#191F28",
              textAlign: "center",
              lineHeight: "31px",
              marginBottom: 8,
            }}>
              분석이 완료되었어요!
            </div>

            <div style={{
              fontSize: 15,
              fontWeight: 500,
              color: "#8B95A1",
              textAlign: "center",
              lineHeight: "22.5px",
              marginBottom: 32,
            }}>
              짧은 광고를 시청하면{"\n"}가격 비교 결과를 확인할 수 있어요
            </div>

            <div style={{
              width: "100%",
              display: "flex",
              flexDirection: "column",
              gap: 8,
            }}>
              <div style={{
                display: "flex",
                alignItems: "center",
                gap: 16,
                padding: "16px 20px",
                borderRadius: 16,
                backgroundColor: "#F9FAFB",
              }}>
                <div style={{
                  width: 40,
                  height: 40,
                  borderRadius: 12,
                  backgroundColor: "#E8F3FF",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexShrink: 0,
                }}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                    <rect x="2" y="3" width="20" height="14" rx="2" stroke="#3182F6" strokeWidth="1.5"/>
                    <path d="M8 21h8M12 17v4" stroke="#3182F6" strokeWidth="1.5" strokeLinecap="round"/>
                  </svg>
                </div>
                <div>
                  <div style={{ fontSize: 16, fontWeight: 500, color: "#191F28", lineHeight: "24px" }}>광고 시청</div>
                  <div style={{ fontSize: 14, color: "#8B95A1", marginTop: 2, lineHeight: "21px" }}>약 15~30초 소요</div>
                </div>
              </div>

              <div style={{
                display: "flex",
                alignItems: "center",
                gap: 16,
                padding: "16px 20px",
                borderRadius: 16,
                backgroundColor: "#F9FAFB",
              }}>
                <div style={{
                  width: 40,
                  height: 40,
                  borderRadius: 12,
                  backgroundColor: "#F0FAF6",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexShrink: 0,
                }}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                    <path d="M12 2v20M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6" stroke="#03B26C" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
                <div>
                  <div style={{ fontSize: 16, fontWeight: 500, color: "#191F28", lineHeight: "24px" }}>결과 확인</div>
                  <div style={{ fontSize: 14, color: "#8B95A1", marginTop: 2, lineHeight: "21px" }}>한국 최저가와 비교해볼 수 있어요</div>
                </div>
              </div>
            </div>
          </>
        )}

        {adState === "loading" && (
          <TDSLoader size="large" type="primary" label={"광고를 불러오는 중이에요\n잠시만 기다려주세요"} />
        )}

        {adState === "showing" && (
          <TDSLoader size="large" type="primary" label={"광고 재생 중...\n곧 결과를 확인하실 수 있어요"} />
        )}

        {adState === "failed" && (
          <AdFailedView imageId={imageId!} navigate={navigate} errorMsg={adError} />
        )}
      </div>

      {adState === "prompt" && (
        <div style={{
          padding: "0 24px",
          paddingBottom: "max(24px, env(safe-area-inset-bottom))",
          display: "flex",
          flexDirection: "column",
          gap: 8,
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
            onClick={handleSkip}
            style={{
              background: "none",
              border: "none",
              padding: "12px",
              fontSize: 15,
              fontWeight: 500,
              color: "#8B95A1",
              cursor: "pointer",
              textAlign: "center",
              lineHeight: "22.5px",
            }}
          >
            다음에 할게요
          </button>
        </div>
      )}
    </div>
  );
}

export default AdGate;
