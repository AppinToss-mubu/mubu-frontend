import { isTossEnvironment } from "../utils/env";

interface AdBannerSlotProps {
  placement: string;
}

function AdBannerSlot({ placement }: AdBannerSlotProps) {
  if (!isTossEnvironment()) {
    return null;
  }

  // @cursor-todo: 향후 토스 배너 광고 또는 자체 제휴 배너 연결
  // 현재는 자리만 마련 (빈 슬롯)
  return (
    <div
      data-ad-placement={placement}
      style={{
        width: "100%",
        minHeight: 50,
        borderRadius: 12,
        backgroundColor: "#F2F4F6",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        marginTop: 16,
        overflow: "hidden",
      }}
    >
      <span style={{ fontSize: 12, color: "#B0B8C1" }}>AD</span>
    </div>
  );
}

export default AdBannerSlot;
