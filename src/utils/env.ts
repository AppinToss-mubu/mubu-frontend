/**
 * 환경 감지 유틸리티
 * - Toss MiniApp 환경 감지 (AppsInToss Sandbox/Production)
 * - 환경별 기능 분기 기준
 */

export const isTossEnvironment = (): boolean => {
  if (typeof window === "undefined") return false;

  // 방법 1: window.Toss 객체 확인
  if (typeof (window as any).Toss !== "undefined") {
    return true;
  }

  // 방법 2: User-Agent 확인 (AppsInToss 관련 문자열)
  const userAgent = navigator.userAgent || "";
  if (
    userAgent.includes("AppsInToss") ||
    userAgent.includes("TossApp") ||
    userAgent.includes("TossMiniApp")
  ) {
    return true;
  }

  // 방법 3: URL 확인 (granite dev로 실행 시 특정 패턴)
  // granite dev는 8081 포트에서 실행되고, 실제 앱은 이 포트를 통해 접근
  const href = window.location.href || "";
  const hostname = window.location.hostname || "";

  // granite dev 서버를 통해 접근하는 경우 (로컬 개발 환경)
  // 또는 특정 포트 범위를 사용하는 경우
  if (
    href.includes("localhost:8081") ||
    href.includes("127.0.0.1:8081") ||
    (hostname.includes("192.168") && href.includes(":8081")) ||
    href.includes("granite")
  ) {
    // granite dev로 실행 중이면 Toss 환경으로 간주
    return true;
  }

  // 방법 4: 전역 변수 확인 (AppsInToss에서 주입하는 변수들)
  if (
    typeof (window as any).__TOSS__ !== "undefined" ||
    typeof (window as any).AppsInToss !== "undefined"
  ) {
    return true;
  }

  return false;
};

export const getEnvironment = (): "toss" | "web" => {
  return isTossEnvironment() ? "toss" : "web";
};
