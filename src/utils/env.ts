/**
 * 환경 감지 유틸리티
 * - Toss MiniApp 환경 감지 (window.Toss 존재 여부)
 * - 환경별 기능 분기 기준
 */

export const isTossEnvironment = (): boolean => {
  return (
    typeof window !== "undefined" && typeof (window as any).Toss !== "undefined"
  );
};

export const getEnvironment = (): "toss" | "web" => {
  return isTossEnvironment() ? "toss" : "web";
};
