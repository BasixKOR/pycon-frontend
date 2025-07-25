import "@emotion/react";
import { type Theme as MuiTheme } from "@mui/material/styles";

declare module "@mui/material/styles" {
  interface Palette {
    highlight: PaletteColor;
    mobileHeader: {
      main: {
        background: string;
        text: string;
        activeLanguage: string;
      };
      sub: {
        background: string;
        text: string;
        activeLanguage: string;
      };
    };
    mobileNavigation: {
      main: {
        background: string;
        text: string;
        chip: {
          background: string;
          hover: string;
        };
        divider: string;
        languageToggle: {
          background: string;
          active: {
            background: string;
            hover: string;
          };
          inactive: {
            hover: string;
          };
        };
      };
      sub: {
        background: string;
        text: string;
        chip: {
          background: string;
          hover: string;
        };
        divider: string;
        languageToggle: {
          background: string;
          active: {
            background: string;
            hover: string;
          };
          inactive: {
            hover: string;
          };
        };
      };
    };
  }

  interface PaletteOptions {
    highlight: PaletteColor;
    mobileHeader?: {
      main: {
        background: string;
        text: string;
        activeLanguage: string;
      };
      sub: {
        background: string;
        text: string;
        activeLanguage: string;
      };
    };
    mobileNavigation?: {
      main: {
        background: string;
        text: string;
        chip: {
          background: string;
          hover: string;
        };
        divider: string;
        languageToggle: {
          background: string;
          active: {
            background: string;
            hover: string;
          };
          inactive: {
            hover: string;
          };
        };
      };
      sub: {
        background: string;
        text: string;
        chip: {
          background: string;
          hover: string;
        };
        divider: string;
        languageToggle: {
          background: string;
          active: {
            background: string;
            hover: string;
          };
          inactive: {
            hover: string;
          };
        };
      };
    };
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
