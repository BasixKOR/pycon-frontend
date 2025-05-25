import commonjs from "@rollup/plugin-commonjs";
import json from "@rollup/plugin-json";
import resolve, { nodeResolve } from "@rollup/plugin-node-resolve";
import css from "rollup-plugin-import-css";
import typescript from "rollup-plugin-typescript2";

export default {
  input: "src/index.ts",
  output: {
    file: "dist/shop.esm.js",
    format: "esm",
    sourcemap: true,
    name: "shop",
    globals: {
      remeda: "R",
      react: "React",
      "react-dom": "ReactDOM",
      "react/jsx-runtime": "runtime",
      axios: "axios",
      "@emotion/react": "emotionReact",
      "@emotion/styled": "emotionStyled",
      "@mdx-js/mdx": "mdx",
      "@mdx-js/react": "react$1",
      "@mui/material": "material",
      "@suspensive/react": "react",
      "@tanstack/react-query": "reactQuery",
    },
  },
  external: [
    "axios",
    "react",
    "react-dom",
    "react-dom/client",
    "react/jsx-runtime",
    "remeda",
    "@emotion/react",
    "@emotion/styled",
    "@mdx-js/rollup",
    "@mui/icons-material",
    "@mui/material",
    "@suspensive/react",
    "@tanstack/react-query",
    "@uiw/react-md-editor",
    "@frontend/common",
  ],
  plugins: [
    css(),
    json(),
    typescript({ tsconfig: "./tsconfig.json" }),
    resolve(),
    commonjs(),
    nodeResolve({
      preferBuiltins: false,
      browser: true,
    }),
  ],
};
