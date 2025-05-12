import mdx from "@mdx-js/rollup";
import react from "@vitejs/plugin-react";
import path from "path";
import { defineConfig } from "vite";
import mkcert from "vite-plugin-mkcert";
import svgr from "vite-plugin-svgr";

// https://vitejs.dev/config/
export default defineConfig({
  base: "/",
  envDir: "./dotenv",
  plugins: [react(), mdx(), mkcert({ hosts: ["local.dev.pycon.kr"] }), svgr()],
  resolve: {
    alias: {
      "@pyconkr-common": path.resolve(__dirname, "./package/pyconkr-common"),
      "@pyconkr-shop": path.resolve(__dirname, "./package/pyconkr-shop"),
      "@src": path.resolve(__dirname, "./src"),
      "@": path.resolve(__dirname, "./src"),
    },
  },
});
