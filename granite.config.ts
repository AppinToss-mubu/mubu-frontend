import { defineConfig } from "@apps-in-toss/web-framework/config";
import os from "os";

// IP 주소 자동 감지 함수 (시뮬레이터: localhost, 실기기: 실제 IP 주소)
function getLocalIP(): string {
  const interfaces = os.networkInterfaces();
  for (const name of Object.keys(interfaces)) {
    const nets = interfaces[name];
    if (nets) {
      for (const net of nets) {
        if (net.family === "IPv4" && !net.internal) {
          return net.address;
        }
      }
    }
  }
  return "localhost"; // IP를 찾지 못하면 localhost 사용
}

export default defineConfig({
  appName: "mubu", // 앱인토스 콘솔에서 설정한 앱 이름
  brand: {
    displayName: "무부", // 화면에 노출될 앱의 한글 이름
    primaryColor: "#3182F6", // 화면에 노출될 앱의 기본 색상으로 바꿔주세요.
    icon: "https://static.toss.im/appsintoss/3795/0134e9b2-bac9-421b-84e0-44da1297a706.png",
  },
  web: {
    host: getLocalIP(), // 앱 내 웹뷰에 사용될 host (자동으로 IP 감지: 시뮬레이터는 localhost, 실기기는 실제 IP)
    port: 5001, // vite.config.ts의 port와 동일하게 설정
    commands: {
      dev: "vite", // 개발 모드 실행 (webpack serve도 가능)
      build: "tsc -b && vite build", // 빌드 명령어 (webpack도 가능)
    },
  },
  permissions: [
    {
      name: "camera",
      access: "access",
    },
    {
      name: "photos",
      access: "read",
    },
  ], // 카메라 및 앨범 권한 설정
  outdir: "dist", // 빌드 결과물 출력 디렉토리
});
