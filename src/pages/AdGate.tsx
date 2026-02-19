import { useEffect, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { usePriceStore } from "../store/priceStore";
import { isTossEnvironment } from "../utils/env";

let Asset: any, Text: any, FixedBottomCTA: any, Button: any, Loader: any;
let adaptive: any;
try {
  const tds = require("@toss/tds-mobile");
  Asset = tds.Asset;
  Text = tds.Text;
  FixedBottomCTA = tds.FixedBottomCTA;
  Button = tds.Button;
  Loader = tds.Loader;
  const colors = require("@toss/tds-colors");
  adaptive = colors.adaptive;
} catch {
  // TDS not available
}

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
      {Text && adaptive ? (
        <>
          <Text display="block" color={adaptive.grey800} typography="t5" fontWeight="semibold" textAlign="center">
            광고를 불러오지 못했어요
          </Text>
          <div style={{ height: 6 }} />
          <Text display="block" color={adaptive.grey500} typography="st11" textAlign="center">
            {countdown}초 후 결과 페이지로 이동해요
          </Text>
        </>
      ) : (
        <>
          <div style={{ fontSize: 17, fontWeight: 600, color: "#191F28", lineHeight: "25.5px", marginBottom: 6 }}>
            광고를 불러오지 못했어요
          </div>
          <div style={{ fontSize: 14, color: "#8B95A1", lineHeight: "21px", marginBottom: 8 }}>
            {countdown}초 후 결과 페이지로 이동해요
          </div>
        </>
      )}
      {errorMsg && (
        <div style={{ fontSize: 12, color: "#B0B8C1", lineHeight: "18px", marginTop: 8, marginBottom: 20, wordBreak: "break-all" }}>
          {errorMsg}
        </div>
      )}
      {Button ? (
        <div style={{ marginTop: 20 }}>
          <Button
            display="block"
            onClick={() => {
              if (!navigatedRef.current) {
                navigatedRef.current = true;
                navigate(`/price-confirm/${imageId}`, { replace: true });
              }
            }}
          >
            바로 결과 보기
          </Button>
        </div>
      ) : (
        <button
          onClick={() => {
            if (!navigatedRef.current) {
              navigatedRef.current = true;
              navigate(`/price-confirm/${imageId}`, { replace: true });
            }
          }}
          style={{
            marginTop: 20,
            width: "100%",
            padding: "16px 24px",
            borderRadius: 14,
            border: "none",
            backgroundColor: "#3182F6",
            color: "#FFFFFF",
            fontSize: 16,
            fontWeight: 600,
            cursor: "pointer",
          }}
        >
          바로 결과 보기
        </button>
      )}
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

  const useTDS = !!(Asset && Text && FixedBottomCTA && Button && Loader && adaptive);

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
            {useTDS ? (
              <>
                <Asset.Image
                  frameShape={Asset.frameShape.CleanW100}
                  backgroundColor="transparent"
                  src="https://static.toss.im/3d-emojis/u1F31E.png"
                  alt="분석 완료"
                  style={{ aspectRatio: "1/1" }}
                />
                <div style={{ height: 24 }} />
                <Text
                  display="block"
                  color={adaptive.grey800}
                  typography="t2"
                  fontWeight="bold"
                  textAlign="center"
                >
                  분석이 완료되었어요!
                </Text>
                <Text
                  display="block"
                  color={adaptive.grey700}
                  typography="t5"
                  fontWeight="regular"
                  textAlign="center"
                >
                  짧은 광고를 시청하면{"\n"}가격 비교 결과를 확인할 수 있어요.
                </Text>
              </>
            ) : (
              <>
                <div style={{ fontSize: 48, marginBottom: 24 }}>🌞</div>
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
              </>
            )}
          </>
        )}

        {adState === "loading" && (
          Loader ? (
            <Loader size="large" />
          ) : (
            <div style={{ textAlign: "center", color: "#8B95A1" }}>
              광고를 불러오는 중이에요...
            </div>
          )
        )}

        {adState === "showing" && (
          Loader ? (
            <Loader size="large" />
          ) : (
            <div style={{ textAlign: "center", color: "#8B95A1" }}>
              광고 재생 중...
            </div>
          )
        )}

        {adState === "failed" && (
          <AdFailedView imageId={imageId!} navigate={navigate} errorMsg={adError} />
        )}
      </div>

      {adState === "prompt" && (
        useTDS && FixedBottomCTA ? (
          <FixedBottomCTA.Single loading={false} onClick={handleWatchAd}>
            광고 시청 후 결과 보기
          </FixedBottomCTA.Single>
        ) : (
          <div style={{
            padding: "0 24px",
            paddingBottom: "max(24px, env(safe-area-inset-bottom))",
            display: "flex",
            flexDirection: "column",
            gap: 8,
          }}>
            <button
              onClick={handleWatchAd}
              style={{
                width: "100%",
                padding: "16px 24px",
                borderRadius: 14,
                border: "none",
                backgroundColor: "#3182F6",
                color: "#FFFFFF",
                fontSize: 16,
                fontWeight: 600,
                cursor: "pointer",
              }}
            >
              광고 시청 후 결과 보기
            </button>
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
        )
      )}
    </div>
  );
}

export default AdGate;
