import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");

  return {
    plugins: [react()],
    server: {
      proxy: {
        "/api/v1": {
          target: env.VITE_API_GIK_TALENT_URL,
          changeOrigin: true,
          secure: true,
        },
      },
      host: true,
      port: 5173,
      strictPort: true,
      hmr: {
      clientPort: 443,
    },
    },
  };
});
