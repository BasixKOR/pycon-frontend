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

  // 백엔드 응답 쿠키의 Domain 속성(예: pycon.kr) 제거 — localhost origin에서 브라우저가 저장 가능하도록.
  const proxyOptions = { target: backendApiDomain, changeOrigin: true, cookieDomainRewrite: "" };

  return {
    base: "/",
    envDir: "../../dotenv",
    plugins: [react(), mdx(), mkcert({ hosts: ["localhost"] }), svgr()],
    resolve: {
      alias: {
        "@frontend/common": path.resolve(__dirname, "../../packages/common/src"),
        "@frontend/shop": path.resolve(__dirname, "../../packages/shop/src"),
        "@apps/pyconkr-2025": path.resolve(__dirname, "./src"),
      },
    },
    server: {
      host: "localhost",
      proxy: {
        "/v1": proxyOptions,
        "/api": proxyOptions,
      },
    },
  };
});
