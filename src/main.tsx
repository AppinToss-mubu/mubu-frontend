import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { isTossEnvironment } from "./utils/env";
import "./index.css";
import App from "./App.tsx";

// React Query 클라이언트 생성
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});

// Toss 환경에서만 TDS Provider 사용 (동적 import)
const AppWithProviders = () => {
  const content = (
    <QueryClientProvider client={queryClient}>
      <App />
    </QueryClientProvider>
  );

  return content;
};

// TDS Provider를 동적으로 로드하는 래퍼
const renderApp = async () => {
  const root = createRoot(document.getElementById("root")!);

  if (isTossEnvironment()) {
    // Toss 환경에서만 TDSMobileAITProvider 동적 import
    const { TDSMobileAITProvider } = await import("@toss/tds-mobile-ait");
    root.render(
      <StrictMode>
        <TDSMobileAITProvider>
          <AppWithProviders />
        </TDSMobileAITProvider>
      </StrictMode>,
    );
  } else {
    // 일반 웹 환경
    root.render(
      <StrictMode>
        <AppWithProviders />
      </StrictMode>,
    );
  }
};

renderApp();
