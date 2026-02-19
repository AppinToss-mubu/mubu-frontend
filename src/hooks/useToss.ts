import { isTossEnvironment } from "../utils/env";

const dataUriToFile = (
  dataUri: string,
  fileName: string = "image.jpg"
): File => {
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

  const handleOpenCamera = async (): Promise<File | null> => {
    if (!isAvailable) {
      return null;
    }

    try {
      const { openCamera } = await import("@apps-in-toss/web-framework");

      try {
        const permission = await openCamera.getPermission();
        console.log("[useToss] 카메라 권한 상태:", permission);

        if (permission !== "allowed") {
          const result = await openCamera.openPermissionDialog();
          console.log("[useToss] 카메라 권한 요청 결과:", result);
          if (result !== "allowed") {
            alert("카메라 권한이 필요해요.\n토스 앱 설정에서 카메라 권한을 허용해주세요.");
            return null;
          }
        }
      } catch (permErr) {
        console.warn("[useToss] 카메라 권한 확인 실패 (무시하고 진행):", permErr);
      }

      const response = await openCamera({ base64: true, maxWidth: 1080 });

      if (!response || !response.dataUri) {
        console.error("[useToss] 카메라 응답에 dataUri가 없습니다:", response);
        return null;
      }

      const imageUri = "data:image/jpeg;base64," + response.dataUri;
      return dataUriToFile(imageUri, `camera_${response.id || Date.now()}.jpg`);
    } catch (error: any) {
      try {
        const { OpenCameraPermissionError } = await import("@apps-in-toss/web-framework");
        if (error instanceof OpenCameraPermissionError) {
          console.warn("[useToss] 카메라 권한 거부됨");
          alert("카메라 권한이 필요해요.\n토스 앱 설정에서 카메라 권한을 허용해주세요.");
          return null;
        }
      } catch {
      }
      console.error("[useToss] 카메라 오픈 실패:", error);
      return null;
    }
  };

  const handleFetchAlbumPhotos = async (): Promise<File | null> => {
    if (!isAvailable) {
      return null;
    }

    try {
      const { fetchAlbumPhotos } = await import("@apps-in-toss/web-framework");

      try {
        const permission = await fetchAlbumPhotos.getPermission();
        console.log("[useToss] 사진첩 권한 상태:", permission);

        if (permission !== "allowed") {
          const result = await fetchAlbumPhotos.openPermissionDialog();
          console.log("[useToss] 사진첩 권한 요청 결과:", result);
          if (result !== "allowed") {
            alert("사진첩 권한이 필요해요.\n토스 앱 설정에서 사진첩 권한을 허용해주세요.");
            return null;
          }
        }
      } catch (permErr) {
        console.warn("[useToss] 사진첩 권한 확인 실패 (무시하고 진행):", permErr);
      }

      const response = await fetchAlbumPhotos({
        base64: true,
        maxWidth: 1080,
        maxCount: 1,
      });

      if (!response || response.length === 0) {
        console.warn("[useToss] 앨범에서 선택된 사진 없음");
        return null;
      }

      const photo = response[0];
      if (!photo.dataUri) {
        console.error("[useToss] 앨범 응답에 dataUri가 없습니다:", photo);
        return null;
      }

      const imageUri = "data:image/jpeg;base64," + photo.dataUri;
      return dataUriToFile(imageUri, `album_${photo.id || Date.now()}.jpg`);
    } catch (error: any) {
      try {
        const { FetchAlbumPhotosPermissionError } = await import("@apps-in-toss/web-framework");
        if (error instanceof FetchAlbumPhotosPermissionError) {
          console.warn("[useToss] 사진첩 권한 거부됨");
          alert("사진첩 권한이 필요해요.\n토스 앱 설정에서 사진첩 권한을 허용해주세요.");
          return null;
        }
      } catch {
      }
      console.error("[useToss] 앨범 가져오기 실패:", error);
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
      console.error("[useToss] 브라우저 오픈 실패:", error);
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
