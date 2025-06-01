import "@emotion/react";
import { type Theme as MuiTheme } from "@mui/material/styles";

declare module "@mui/material/styles" {
  interface PaletteColor {
    nonFocus?: string;
  }
  interface SimplePaletteColorOptions {
    nonFocus?: string;
  }
}

declare module "@emotion/react" {
  export type Theme = MuiTheme;
}
