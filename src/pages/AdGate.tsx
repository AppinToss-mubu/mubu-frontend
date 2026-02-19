import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { usePriceStore } from "../store/priceStore";
import { TDSButton } from "../components/tds";
import { TDSConfirmDialog } from "../components/tds/TDSDialog";
import { isTossEnvironment } from "../utils/env";

type AdState = "prompt" | "loading" | "showing" | "done" | "failed";

function AdGate() {
  const { imageId } = useParams<{ imageId: string }>();
  const navigate = useNavigate();
  const { compareResult } = usePriceStore();
  const [adState, setAdState] = useState<AdState>("prompt");
  const [showDialog, setShowDialog] = useState(true);

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

  const handleViewResult = () => {
    setShowDialog(false);
    setAdState("loading");

    // @cursor-todo: 여기에 실제 SDK 호출 연결
    // GoogleAdMob.loadAppsInTossAdMob → loaded → showAppsInTossAdMob → dismissed → navigate
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
    setShowDialog(false);
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
      alignItems: "center",
      justifyContent: "center",
      padding: 20,
    }}>
      {adState === "loading" && (
        <div style={{ textAlign: "center" }}>
          <div style={{
            width: 48,
            height: 48,
            borderRadius: "50%",
            border: "3px solid #E5E8EB",
            borderTopColor: "#3182F6",
            animation: "ad-gate-spin 1s linear infinite",
            margin: "0 auto 16px",
          }} />
          <div style={{ fontSize: 16, color: "#8B95A1" }}>
            광고를 불러오는 중...
          </div>
        </div>
      )}

      {adState === "showing" && (
        <div style={{ textAlign: "center" }}>
          <div style={{
            width: 64,
            height: 64,
            borderRadius: "50%",
            backgroundColor: "#F2F4F6",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            margin: "0 auto 16px",
          }}>
            <svg width="28" height="28" viewBox="0 0 24 24" fill="#3182F6">
              <polygon points="5 3 19 12 5 21 5 3" />
            </svg>
          </div>
          <div style={{ fontSize: 16, color: "#191F28", fontWeight: 600 }}>
            광고 재생 중...
          </div>
        </div>
      )}

      {adState === "failed" && (
        <div style={{ textAlign: "center" }}>
          <div style={{ fontSize: 16, color: "#8B95A1", marginBottom: 20 }}>
            광고를 불러오지 못했어요
          </div>
          <TDSButton
            onClick={() => {
              navigate(`/price-confirm/${imageId}`, { replace: true });
            }}
            color="primary"
            variant="fill"
            size="large"
          >
            결과 보기
          </TDSButton>
        </div>
      )}

      {showDialog && adState === "prompt" && (
        <TDSConfirmDialog
          open={true}
          title="분석이 완료되었어요!"
          description={`광고를 시청하면\n가격 비교 결과를 볼 수 있어요`}
          cancelText="닫기"
          confirmText="결과 보기"
          onCancel={handleClose}
          onConfirm={handleViewResult}
          onClose={handleClose}
        />
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
