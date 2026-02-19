import { useEffect, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { usePriceStore } from "../store/priceStore";
import { isTossEnvironment } from "../utils/env";
import { useTDS } from "../utils/tds";

type AdState = "prompt" | "loading" | "showing" | "done" | "failed";

function AdFailedView({ imageId, navigate, errorMsg, tds, colors }: { imageId: string; navigate: (path: string, opts?: any) => void; errorMsg?: string; tds: any; colors: any }) {
  const [countdown, setCountdown] = useState(3);
  const navigatedRef = useRef(false);

  const { Text, Button } = tds;
  const { adaptive } = colors;

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
      <>
        <Text display="block" color={adaptive.grey800} typography="t5" fontWeight="semibold" textAlign="center">
          광고를 불러오지 못했어요
        </Text>
        <div style={{ height: 6 }} />
        <Text display="block" color={adaptive.grey500} typography="st11" textAlign="center">
          {countdown}초 후 결과 페이지로 이동해요
        </Text>
      </>
      {errorMsg && (
        <div style={{ fontSize: 12, color: "#B0B8C1", lineHeight: "18px", marginTop: 8, marginBottom: 20, wordBreak: "break-all" }}>
          {errorMsg}
        </div>
      )}
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
  const { tds, colors, ready: tdsReady } = useTDS();

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

  if (!compareResult || !imageId) {
    return null;
  }

  if (!isTossEnvironment()) {
    return null;
  }

  if (!tdsReady) {
    return (
      <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div style={{ width: 40, height: 40, border: "3px solid #E5E8EB", borderTopColor: "#3182F6", borderRadius: "50%", animation: "spin 1s linear infinite" }} />
      </div>
    );
  }

  const { Asset, Text, Button, Loader } = tds;
  const { adaptive } = colors;

  return (
    <div style={{
      minHeight: "100vh",
      backgroundColor: "#FFFFFF",
      display: "flex",
      flexDirection: "column",
      paddingBottom: 100,
    }}>
      <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "40px 24px" }}>

        {adState === "prompt" && (
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
            <div style={{ height: 8 }} />
            <Text
              display="block"
              color={adaptive.grey700}
              typography="t5"
              fontWeight="regular"
              textAlign="center"
            >
              짧은 광고를 시청하면{"\n"}가격 비교 결과를 확인할 수 있어요.
            </Text>
            <div style={{ height: 32 }} />
            <div style={{ width: "100%", padding: "0 20px", boxSizing: "border-box" }}>
              <Button display="block" onClick={handleWatchAd}>
                광고 시청 후 결과 보기
              </Button>
            </div>
          </>
        )}

        {adState === "loading" && (
          <Loader size="large" />
        )}

        {adState === "showing" && (
          <Loader size="large" />
        )}

        {adState === "failed" && (
          <AdFailedView imageId={imageId!} navigate={navigate} errorMsg={adError} tds={tds} colors={colors} />
        )}
      </div>
    </div>
  );
}

export default AdGate;
