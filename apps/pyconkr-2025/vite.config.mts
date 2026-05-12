import path from "path";

import mdx from "@mdx-js/rollup";
import react from "@vitejs/plugin-react";
import { defineConfig, loadEnv } from "vite";
import mkcert from "vite-plugin-mkcert";
import svgr from "vite-plugin-svgr";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, path.resolve(__dirname, "../../dotenv"), "");
  const backendApiDomain = env.VITE_PYCONKR_BACKEND_API_DOMAIN ?? "";
  // 로컬 HTTP 백엔드면 http://localhost 로 서빙 + /v1, /api 를 proxy (mixed-content 회피 & CSRF 쿠키 동일 origin)
  const isLocalHttpBackend = backendApiDomain.startsWith("http://");
  const host = isLocalHttpBackend ? "localhost" : "local.dev.pycon.kr";

  return {
    base: "/",
    envDir: "../../dotenv",
    plugins: [react(), mdx(), ...(isLocalHttpBackend ? [] : [mkcert({ hosts: [host] })]), svgr()],
    resolve: {
      alias: {
        "@frontend/common/src": path.resolve(__dirname, "../../packages/common/src"),
        "@frontend/common": path.resolve(__dirname, "../../packages/common/src/index.ts"),
        "@frontend/shop": path.resolve(__dirname, "../../packages/shop/src/index.ts"),
        "@apps/pyconkr-2025": path.resolve(__dirname, "./src"),
      },
    },
    server: {
      host,
      allowedHosts: [host],
      proxy: isLocalHttpBackend
        ? {
            "/v1": { target: backendApiDomain, changeOrigin: true },
            "/api": { target: backendApiDomain, changeOrigin: true },
          }
        : undefined,
    },
  };
});
