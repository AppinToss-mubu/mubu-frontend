import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
<<<<<<< Updated upstream
=======
import { TDSMobileAITProvider } from "@toss/tds-mobile-ait";
import { isTossEnvironment } from "./utils/env";
>>>>>>> Stashed changes
import "./index.css";
import App from "./App.tsx";

// React Query 클라이언트 생성
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false, // 창 포커스 시 자동 refetch 방지
      retry: 1, // 실패 시 1번만 재시도
    },
  },
});

// Toss 환경에서만 TDS Provider 사용
const AppWithProviders = () => {
  const content = (
    <QueryClientProvider client={queryClient}>
      <App />
    </QueryClientProvider>
  );

  // Toss 환경에서만 TDSMobileAITProvider로 감싸기
  if (isTossEnvironment()) {
    return <TDSMobileAITProvider>{content}</TDSMobileAITProvider>;
  }

  // 일반 웹 환경에서는 Provider 없이 렌더링
  return content;
};

createRoot(document.getElementById("root")!).render(
  <StrictMode>
<<<<<<< Updated upstream
    <QueryClientProvider client={queryClient}>
      <App />
    </QueryClientProvider>
=======
    <AppWithProviders />
>>>>>>> Stashed changes
  </StrictMode>,
);
