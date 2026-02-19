/**
 * 이미지 선택 시트 컴포넌트
 * - Toss 환경: TDS v2 BottomSheet 사용
 * - 일반 웹: 기존 스타일 유지
 */

import { isTossEnvironment } from "../utils/env";
import { useTDS } from "../utils/tds";

interface ImageSourceSheetProps {
  open: boolean;
  onClose: () => void;
  onPickCamera: () => void;
  onPickAlbum: () => void;
  showCamera?: boolean;
}

export function ImageSourceSheet({
  open,
  onClose,
  onPickCamera,
  onPickAlbum,
  showCamera = true,
}: ImageSourceSheetProps) {
  const isToss = isTossEnvironment();
  const { tds, ready: tdsReady } = useTDS();

  if (isToss && tdsReady) {
    const { BottomSheet, Button } = tds;
    return (
      <BottomSheet
        header={
          <BottomSheet.Header>
            가격표가 보이도록 상품을 촬영하거나 앨범에서 이미지를 선택해주세요
          </BottomSheet.Header>
        }
        open={open}
        onClose={onClose}
        cta={
          showCamera
            ? [
                <Button key="album" color="dark" variant="weak" display="block" onClick={onPickAlbum}>
                  앨범에서 선택하기
                </Button>,
                <Button key="camera" display="block" onClick={onPickCamera}>
                  사진 촬영하기
                </Button>,
              ]
            : [
                <Button key="album" display="block" onClick={onPickAlbum}>
                  앨범에서 선택하기
                </Button>,
              ]
        }
      >
        <></>
      </BottomSheet>
    );
  }

  if (!open) return null;

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        zIndex: 1000,
      }}
    >
      <div
        onClick={onClose}
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: "rgba(0, 0, 0, 0.5)",
        }}
      />

      <div
        style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
          backgroundColor: "var(--bg)",
          borderTopLeftRadius: 24,
          borderTopRightRadius: 24,
          padding: "16px 20px 32px",
          maxHeight: "80vh",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            marginBottom: 20,
          }}
        >
          <h2 style={{ fontSize: 17, fontWeight: 600, margin: 0 }}>
            상품 촬영
          </h2>
          <button
            onClick={onClose}
            style={{
              background: "transparent",
              border: "none",
              fontSize: 24,
              cursor: "pointer",
              color: "var(--muted)",
              padding: 4,
            }}
            aria-label="닫기"
          >
            ×
          </button>
        </div>

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            padding: "16px 0 24px",
          }}
        >
          <div
            style={{
              width: 56,
              height: 56,
              borderRadius: 16,
              border: "3px solid var(--border)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              marginBottom: 16,
            }}
          >
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" />
              <circle cx="12" cy="13" r="4" />
            </svg>
          </div>
          <div
            style={{
              fontSize: 14,
              color: "var(--muted)",
              textAlign: "center",
              lineHeight: "21px",
            }}
          >
            가격표가 보이도록 상품을 촬영하거나
            <br />
            앨범에서 이미지를 선택해주세요
          </div>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: showCamera ? "1fr 1fr" : "1fr",
            gap: 12,
          }}
        >
          <button
            onClick={onPickAlbum}
            style={{
              padding: "16px",
              backgroundColor: "var(--card)",
              border: "1px solid var(--border)",
              borderRadius: 12,
              fontSize: 14,
              fontWeight: 600,
              color: "var(--fg)",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 8,
            }}
          >
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
              <circle cx="8.5" cy="8.5" r="1.5" />
              <polyline points="21,15 16,10 5,21" />
            </svg>
            앨범에서 선택
          </button>
          {showCamera && (
            <button
              onClick={onPickCamera}
              style={{
                padding: "16px",
                backgroundColor: "var(--primary)",
                border: "none",
                borderRadius: 12,
                fontSize: 14,
                fontWeight: 600,
                color: "var(--primary-contrast)",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 8,
              }}
            >
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" />
                <circle cx="12" cy="13" r="4" />
              </svg>
              촬영하기
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
