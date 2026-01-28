import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { TDSMobileAITProvider } from "@toss/tds-mobile-ait";
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

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <TDSMobileAITProvider>
      <QueryClientProvider client={queryClient}>
        <App />
      </QueryClientProvider>
    </TDSMobileAITProvider>
  </StrictMode>,
);
