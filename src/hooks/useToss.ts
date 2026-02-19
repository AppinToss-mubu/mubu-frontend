/**
 * Toss SDK 래퍼 훅
 * - Toss 환경 감지 및 SDK 기능 래핑
 * - openCamera: @apps-in-toss/web-framework의 openCamera API
 * - fetchAlbumPhotos: @apps-in-toss/web-framework의 fetchAlbumPhotos API
 * - openBrowser: Toss 브라우저 API 호출
 * - Toss 미지원 환경에서는 일반 웹 API로 폴백
 */

import { isTossEnvironment } from "../utils/env";

/**
 * dataUri(base64)를 File 객체로 변환하는 헬퍼 함수
 * Toss SDK openCamera/fetchAlbumPhotos 응답: { id, dataUri }
 */
const dataUriToFile = (dataUri: string, fileName: string = "image.jpg"): File => {
  const base64Data = dataUri.replace(/^data:image\/\w+;base64,/, "");
  const byteCharacters = atob(base64Data);
  const byteNumbers = new Array(byteCharacters.length);
  for (let i = 0; i < byteCharacters.length; i++) {
    byteNumbers[i] = byteCharacters.charCodeAt(i);
  }
  const byteArray = new Uint8Array(byteNumbers);
  const blob = new Blob([byteArray], { type: "image/jpeg" });
  return new File([blob], fileName, { type: "image/jpeg" });
};

export const useToss = () => {
  const isAvailable = isTossEnvironment();

  /**
   * Toss SDK 카메라 열기
   * @apps-in-toss/web-framework의 openCamera 사용
   * 반환: { id, dataUri } → File 객체로 변환
   */
  const handleOpenCamera = async (): Promise<File | null> => {
    if (!isAvailable) {
      return null;
    }

    try {
      const { openCamera } = await import("@apps-in-toss/web-framework");

      const response = await openCamera({ base64: true, maxWidth: 1080 });

      if (!response || !response.dataUri) {
        console.error("카메라 응답에 dataUri가 없습니다:", response);
        return null;
      }

      const imageUri = "data:image/jpeg;base64," + response.dataUri;
      return dataUriToFile(imageUri, `camera_${response.id || Date.now()}.jpg`);
    } catch (error: any) {
      try {
        const { OpenCameraPermissionError } = await import("@apps-in-toss/web-framework");
        if (error instanceof OpenCameraPermissionError) {
          console.warn("카메라 권한이 거부되었습니다. 설정에서 권한을 허용해주세요.");
          alert("카메라 권한이 필요해요. 토스 앱 설정에서 카메라 권한을 허용해주세요.");
          return null;
        }
      } catch {
        // OpenCameraPermissionError import 실패 시 무시
      }
      console.error("Toss 카메라 오픈 실패:", error);
      return null;
    }
  };

  /**
   * Toss SDK 앨범에서 사진 가져오기
   * @apps-in-toss/web-framework의 fetchAlbumPhotos 사용
   * 반환: [{ id, dataUri }] → 첫 번째 사진을 File 객체로 변환
   */
  const handleFetchAlbumPhotos = async (): Promise<File | null> => {
    if (!isAvailable) {
      return null;
    }

    try {
      const { fetchAlbumPhotos } = await import("@apps-in-toss/web-framework");

      const response = await fetchAlbumPhotos({
        base64: true,
        maxWidth: 1080,
        maxCount: 1,
      });

      if (!response || response.length === 0) {
        console.warn("앨범에서 선택된 사진이 없습니다.");
        return null;
      }

      const photo = response[0];
      if (!photo.dataUri) {
        console.error("앨범 응답에 dataUri가 없습니다:", photo);
        return null;
      }

      const imageUri = "data:image/jpeg;base64," + photo.dataUri;
      return dataUriToFile(imageUri, `album_${photo.id || Date.now()}.jpg`);
    } catch (error: any) {
      try {
        const { FetchAlbumPhotosPermissionError } = await import("@apps-in-toss/web-framework");
        if (error instanceof FetchAlbumPhotosPermissionError) {
          console.warn("사진첩 권한이 거부되었습니다. 설정에서 권한을 허용해주세요.");
          alert("사진첩 권한이 필요해요. 토스 앱 설정에서 사진첩 권한을 허용해주세요.");
          return null;
        }
      } catch {
        // FetchAlbumPhotosPermissionError import 실패 시 무시
      }
      console.error("Toss 앨범 가져오기 실패:", error);
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
      window.open(url, "_blank");
    }
  };

  return {
    isAvailable,
    openCamera: handleOpenCamera,
    fetchAlbumPhotos: handleFetchAlbumPhotos,
    openBrowser,
  };
};
