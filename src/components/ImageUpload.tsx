/**
 * 이미지 업로드 컴포넌트
 * - Toss 환경: Toss 카메라 API 사용
 * - 일반 웹: 파일 업로드 input 사용
 * - 10MB 크기 제한 사전 검증
 */

import { useEffect, useRef, useState } from "react";
import { useToss } from "../hooks/useToss";

interface ImageUploadProps {
  onFileSelect: (file: File) => void;
  disabled?: boolean;
  /**
   * UI 모드
   * - inline: 기존처럼 input/버튼을 그대로 노출
   * - cta: 큰 CTA 버튼으로 노출 (웹은 파일피커, Toss는 카메라)
   */
  mode?: "inline" | "cta";
  /** 값이 바뀌면(증가 등) 파일피커/카메라를 트리거 */
  requestOpenKey?: number;
}

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
const RECOMMENDED_FILE_SIZE = 1 * 1024 * 1024; // 1MB (권장)

export const ImageUpload = ({
  onFileSelect,
  disabled = false,
  mode = "inline",
  requestOpenKey,
}: ImageUploadProps) => {
  const { isAvailable, openCamera } = useToss();
  const [error, setError] = useState<string | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);

  const validateFile = (file: File): boolean => {
    setError(null);

    // 파일 크기 검증
    if (file.size > MAX_FILE_SIZE) {
      setError(`파일 크기가 너무 큽니다. (최대 ${MAX_FILE_SIZE / 1024 / 1024}MB)`);
      return false;
    }

    // 파일 타입 검증
    if (!file.type.startsWith("image/")) {
      setError("이미지 파일만 업로드 가능합니다.");
      return false;
    }

    // 권장 크기 안내 (에러는 아니지만 경고)
    if (file.size > RECOMMENDED_FILE_SIZE) {
      console.warn(`권장 크기(${RECOMMENDED_FILE_SIZE / 1024 / 1024}MB)보다 큽니다.`);
    }

    return true;
  };

  const handleTossCamera = async () => {
    try {
      const file = await openCamera();
      if (file && validateFile(file)) {
        setPreview(URL.createObjectURL(file));
        onFileSelect(file);
      } else if (file) {
        setError("이미지 처리에 실패했습니다.");
      }
    } catch (error) {
      console.error("카메라 오픈 실패:", error);
      setError("카메라를 열 수 없습니다.");
    }
  };

  const openPickerOrCamera = async () => {
    if (disabled) return;
    setError(null);

    if (isAvailable) {
      await handleTossCamera();
      return;
    }

    inputRef.current?.click();
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile && validateFile(selectedFile)) {
      setPreview(URL.createObjectURL(selectedFile));
      onFileSelect(selectedFile);
    }
    // input 초기화 (같은 파일 재선택 가능하도록)
    e.target.value = "";
  };

  // 외부에서 "열기" 요청이 오면 실행
  useEffect(() => {
    if (requestOpenKey === undefined) return;
    // requestOpenKey 변경 때마다 실행
    void openPickerOrCamera();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [requestOpenKey]);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
      {mode === "cta" ? (
        <div>
          <button
            onClick={openPickerOrCamera}
            disabled={disabled}
            style={{
              width: "100%",
              padding: "16px 18px",
              borderRadius: "16px",
              border: "1px solid var(--border)",
              background: "var(--primary)",
              color: "var(--primary-contrast)",
              fontSize: "16px",
              fontWeight: 700,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "10px",
              cursor: disabled ? "not-allowed" : "pointer",
              opacity: disabled ? 0.7 : 1,
            }}
          >
            <span aria-hidden>📷</span>
            상품 촬영하기
          </button>

          {/* 웹용 hidden input (Toss는 카메라) */}
          {!isAvailable && (
            <>
              <input
                ref={inputRef}
                type="file"
                accept="image/*"
                onChange={handleFileSelect}
                disabled={disabled}
                style={{ display: "none" }}
              />
              <p style={{ fontSize: "12px", color: "var(--muted)", margin: "10px 2px 0" }}>
                권장 크기: 1MB 이하 (최대 10MB)
              </p>
            </>
          )}
        </div>
      ) : (
        <>
          {isAvailable ? (
            <button
              onClick={handleTossCamera}
              disabled={disabled}
              style={{
                padding: "12px 24px",
                fontSize: "16px",
                cursor: disabled ? "not-allowed" : "pointer",
                opacity: disabled ? 0.6 : 1,
              }}
            >
              카메라로 촬영
            </button>
          ) : (
            <div>
              <input
                ref={inputRef}
                type="file"
                accept="image/*"
                onChange={handleFileSelect}
                disabled={disabled}
                style={{ marginBottom: "8px" }}
              />
              <p style={{ fontSize: "12px", color: "var(--muted)", margin: "4px 0" }}>
                권장 크기: 1MB 이하 (최대 10MB)
              </p>
            </div>
          )}
        </>
      )}

      {preview && (
        <div>
          <img
            src={preview}
            alt="미리보기"
            style={{
              maxWidth: "100%",
              maxHeight: "300px",
              borderRadius: "8px",
            }}
          />
        </div>
      )}

      {error && (
        <div style={{ color: "var(--danger-fg)", fontSize: "14px" }}>{error}</div>
      )}
    </div>
  );
};
