import "@emotion/react";
import "@mui/material/styles";

declare module "@mui/material/styles" {
  interface PaletteColor {
    nonFocus?: string;
  }
  interface SimplePaletteColorOptions {
    nonFocus?: string;
  }
}
