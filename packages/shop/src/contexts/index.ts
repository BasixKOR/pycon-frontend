import * as React from "react";

export type ContextOptions = {
  language: "ko" | "en";
  shopApiDomain: string;
  shopApiCSRFCookieName: string;
  shopApiTimeout: number;
  shopImpAccountId: string;
};

export const context = React.createContext<ContextOptions>({
  language: "ko",
  shopApiDomain: "",
  shopApiCSRFCookieName: "",
  shopApiTimeout: 10000,
  shopImpAccountId: "",
});
