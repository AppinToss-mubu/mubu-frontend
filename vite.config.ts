import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: "0.0.0.0",
    port: 5000,
    strictPort: false, // 포트가 사용 중이면 자동으로 다음 포트(5001) 사용
    allowedHosts: true,
  },
});
