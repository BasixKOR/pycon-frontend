import "@emotion/react";
import { type Theme as MuiTheme } from "@mui/material/styles";

declare module "@mui/material/styles" {
  interface Palette {
    highlight: PaletteColor;
  }

  interface PaletteOptions {
    highlight: PaletteColor;
  }

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
