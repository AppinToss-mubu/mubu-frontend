/**
 * 이미지 선택 시트 컴포넌트
 * - 스크린샷 2번 기준 UI
 * - 업로드/촬영 탭 형태
 */

import { useState, useEffect } from "react";

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
  const [activeTab, setActiveTab] = useState<"upload" | "camera">("upload");

  useEffect(() => {
    if (open) {
      setActiveTab(showCamera ? "camera" : "upload");
    }
  }, [open, showCamera]);

  if (!open) return null;

  const handleCameraClick = () => {
    onPickCamera();
  };

  const handleUploadClick = () => {
    onPickAlbum();
  };

  const handleTabClick = (tab: "upload" | "camera") => {
    setActiveTab(tab);
  };

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
          <h2 style={{ fontSize: 17, fontWeight: 600, margin: 0 }}>상품 촬영</h2>
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
            minHeight: 200,
            marginBottom: 24,
          }}
        >
          {activeTab === "camera" ? (
            <>
              <div
                style={{
                  width: 64,
                  height: 64,
                  borderRadius: "50%",
                  border: "3px solid var(--border)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  marginBottom: 16,
                }}
              >
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/>
                  <circle cx="12" cy="13" r="4"/>
                </svg>
              </div>
              <div style={{ fontSize: 16, fontWeight: 600, marginBottom: 8 }}>
                상품 촬영하기
              </div>
              <div style={{ fontSize: 13, color: "var(--muted)", textAlign: "center", lineHeight: 1.5 }}>
                가격표가 보이도록 상품을 촬영해주세요<br />
                (Android/iOS 모두 지원)
              </div>
            </>
          ) : (
            <>
              <div
                style={{
                  width: 64,
                  height: 64,
                  borderRadius: "50%",
                  border: "3px solid var(--border)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  marginBottom: 16,
                }}
              >
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
                  <circle cx="8.5" cy="8.5" r="1.5"/>
                  <polyline points="21,15 16,10 5,21"/>
                </svg>
              </div>
              <div style={{ fontSize: 16, fontWeight: 600, marginBottom: 8 }}>
                앨범에서 선택
              </div>
              <div style={{ fontSize: 13, color: "var(--muted)", textAlign: "center", lineHeight: 1.5 }}>
                갤러리에서 상품 이미지를 선택해주세요
              </div>
            </>
          )}
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: showCamera ? "1fr 1fr" : "1fr",
            gap: 0,
            borderRadius: 12,
            overflow: "hidden",
            border: "1px solid var(--border)",
          }}
        >
          <button
            onClick={() => {
              if (activeTab === "upload") {
                handleUploadClick();
              } else {
                handleTabClick("upload");
              }
            }}
            style={{
              padding: "14px 16px",
              backgroundColor: activeTab === "upload" ? "var(--card)" : "var(--bg)",
              border: "none",
              borderRight: showCamera ? "1px solid var(--border)" : "none",
              fontSize: 14,
              fontWeight: 600,
              color: "var(--fg)",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 6,
            }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
              <circle cx="8.5" cy="8.5" r="1.5"/>
              <polyline points="21,15 16,10 5,21"/>
            </svg>
            앨범
          </button>
          {showCamera && (
            <button
              onClick={() => {
                if (activeTab === "camera") {
                  handleCameraClick();
                } else {
                  handleTabClick("camera");
                }
              }}
              style={{
                padding: "14px 16px",
                backgroundColor: activeTab === "camera" ? "var(--card)" : "var(--bg)",
                border: "none",
                fontSize: 14,
                fontWeight: 600,
                color: "var(--fg)",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 6,
              }}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/>
                <circle cx="12" cy="13" r="4"/>
              </svg>
              촬영
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
