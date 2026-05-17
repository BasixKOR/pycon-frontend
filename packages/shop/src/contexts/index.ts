import { createContext } from "react";

export type ContextOptions = {
  language: "ko" | "en";
  shopImpAccountId: string;
};

export const context = createContext<ContextOptions>({
  language: "ko",
  shopImpAccountId: "",
});
