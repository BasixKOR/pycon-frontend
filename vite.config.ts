import mdx from "@mdx-js/rollup";
import react from "@vitejs/plugin-react";
import path from 'path';
import { defineConfig } from "vite";
import mkcert from 'vite-plugin-mkcert';

// https://vite.dev/config/
export default defineConfig({
  base: "/frontend/",
  envDir: "./dotenv",
  plugins: [react(), mdx(), mkcert({ hosts: ["local.dev.pycon.kr"] })],
  resolve: {
    alias: {
      '@pyconkr-common': path.resolve(__dirname, './package/pyconkr-common'),
      '@pyconkr-shop': path.resolve(__dirname, './package/pyconkr-shop'),
      '@src': path.resolve(__dirname, './src'),
    },
  },
});
