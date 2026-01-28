/**
 * Toss SDK 래퍼 훅
 * - Toss 환경 감지 및 SDK 기능 래핑
 * - openCamera: Toss 카메라 API 호출
 * - openBrowser: Toss 브라우저 API 호출
 * - Toss 미지원 환경에서는 일반 웹 API로 폴백
 */

import { isTossEnvironment } from "../utils/env";

/**
 * Toss 이미지 결과를 File 객체로 변환하는 헬퍼 함수
 */
const convertTossImageToFile = (result: any): File | null => {
  if (!result || !result.data) {
    return null;
  }

  // Toss SDK가 반환하는 이미지 데이터를 File 객체로 변환
  // 실제 구현은 Toss SDK 응답 형식에 따라 조정 필요
  try {
    // Base64 데이터인 경우
    if (typeof result.data === "string") {
      const base64Data = result.data.replace(/^data:image\/\w+;base64,/, "");
      const byteCharacters = atob(base64Data);
      const byteNumbers = new Array(byteCharacters.length);
      for (let i = 0; i < byteCharacters.length; i++) {
        byteNumbers[i] = byteCharacters.charCodeAt(i);
      }
      const byteArray = new Uint8Array(byteNumbers);
      const blob = new Blob([byteArray], { type: result.type || "image/jpeg" });
      return new File([blob], result.name || "image.jpg", {
        type: result.type || "image/jpeg",
      });
    }

    // Blob인 경우
    if (result.data instanceof Blob) {
      return new File([result.data], result.name || "image.jpg", {
        type: result.type || "image/jpeg",
      });
    }

    return null;
  } catch (error) {
    console.error("이미지 변환 실패:", error);
    return null;
  }
};

export const useToss = () => {
  const isAvailable = isTossEnvironment();

  const openCamera = async (): Promise<File | null> => {
    if (!isAvailable) {
      return null;
    }

    try {
      const Toss = (window as any).Toss;
      
      // Toss SDK 카메라 API 호출
      // 실제 API는 Toss SDK 문서 참조 필요
      const result = await Toss.camera.open({
        // Toss SDK 옵션 (필요시 추가)
      });

      // Toss 응답을 File 객체로 변환
      return convertTossImageToFile(result);
    } catch (error) {
      console.error("Toss 카메라 오픈 실패:", error);
      return null;
    }
  };

  const openBrowser = (url: string) => {
    if (!isAvailable) {
      window.open(url, "_blank");
      return;
    }

    try {
      const Toss = (window as any).Toss;
      Toss.browser.open(url);
    } catch (error) {
      console.error("Toss 브라우저 오픈 실패:", error);
      // 폴백: 일반 브라우저로 열기
      window.open(url, "_blank");
    }
  };

  return {
    isAvailable,
    openCamera,
    openBrowser,
  };
};
