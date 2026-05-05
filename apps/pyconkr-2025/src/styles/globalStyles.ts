import { css } from "@emotion/react";
import { createTheme } from "@mui/material/styles";

export const muiTheme = createTheme({
  typography: {
    fontFamily:
      'Pretendard, -apple-system, BlinkMacSystemFont, system-ui, Roboto, "Helvetica Neue", "Segoe UI", "Apple SD Gothic Neo", "Noto Sans KR", "Malgun Gothic", "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", sans-serif',
  },
  palette: {
    primary: {
      main: "#259299",
      light: "#B6D8D7",
      dark: "#126D7F",
      nonFocus: "#7AB2B3",
    },
    secondary: {
      main: "#259299",
      light: "#B6D8D7",
      dark: "#126D7F",
    },
    highlight: {
      main: "#E17101",
      light: "#EE8D74",
      dark: "#C66900",
      contrastText: "#FFFFFF",
    },
    mobileHeader: {
      main: {
        background: "rgba(182, 216, 215, 0.1)",
        text: "#FFFFFF",
        activeLanguage: "#888888",
      },
      sub: {
        background: "#B6D8D7",
        text: "rgba(18, 109, 127, 0.6)",
        activeLanguage: "#126D7F",
      },
    },
    mobileNavigation: {
      main: {
        background:
          "linear-gradient(0deg, rgba(255, 255, 255, 0.5), rgba(255, 255, 255, 0.5)), linear-gradient(0deg, rgba(0, 0, 0, 0.15), rgba(0, 0, 0, 0.15))",
        text: "#FFFFFF",
        chip: {
          background: "rgba(212, 212, 212, 0.5)",
          hover: "rgba(212, 212, 212, 0.7)",
        },
        divider: "rgba(255, 255, 255, 0.3)",
        languageToggle: {
          background: "transparent",
          active: {
            background: "rgba(255, 255, 255, 0.7)",
            hover: "rgba(255, 255, 255, 0.8)",
          },
          inactive: {
            hover: "rgba(255, 255, 255, 0.1)",
          },
        },
      },
      sub: {
        background: "#B6D8D7",
        text: "rgba(18, 109, 127, 0.9)",
        chip: {
          background: "rgba(18, 109, 127, 0.2)",
          hover: "rgba(18, 109, 127, 0.3)",
        },
        divider: "rgba(18, 109, 127, 0.3)",
        languageToggle: {
          background: "rgba(255, 255, 255, 0.1)",
          active: {
            background: "rgba(255, 255, 255, 0.9)",
            hover: "rgba(255, 255, 255, 1)",
          },
          inactive: {
            hover: "rgba(255, 255, 255, 0.3)",
          },
        },
      },
    },
    text: {
      primary: "#000000",
      secondary: "#666666",
      disabled: "#999999",
    },
    background: {
      default: "#FFFFFF",
      paper: "#FFFFFF",
    },
    common: {
      black: "#000000",
      white: "#FFFFFF",
    },
    error: {
      main: "#d32f2f",
      light: "#ef5350",
      dark: "#c62828",
    },
    warning: {
      main: "#ed6c02",
      light: "#ff9800",
      dark: "#e65100",
    },
    info: {
      main: "#0288d1",
      light: "#03a9f4",
      dark: "#01579b",
    },
    success: {
      main: "#2e7d32",
      light: "#4caf50",
      dark: "#1b5e20",
    },
  },
});

export const globalStyles = css`
  @import url("https://cdn.jsdelivr.net/gh/orioncactus/pretendard/dist/web/static/pretendard.css");

  html,
  body {
    font-family:
      "Pretendard",
      -apple-system,
      BlinkMacSystemFont,
      system-ui,
      Roboto,
      "Helvetica Neue",
      "Segoe UI",
      "Apple SD Gothic Neo",
      "Noto Sans KR",
      "Malgun Gothic",
      "Apple Color Emoji",
      "Segoe UI Emoji",
      "Segoe UI Symbol",
      sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    -webkit-touch-callout: none;

    overscroll-behavior: none;
    word-break: keep-all;
    overflow-wrap: break-all;

    -webkit-user-drag: none;
    -khtml-user-drag: none;
    -moz-user-drag: none;
    -o-user-drag: none;
    user-drag: none;

    font-variant-numeric: tabular-nums;
  }

  a {
    text-decoration: none;
    color: inherit;
  }
`;
