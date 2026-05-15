import { NestedSiteMapSchema, SponsorTierSchema } from "@frontend/common/schemas/backendAPI";
import * as React from "react";

type LanguageType = "ko" | "en";

export type AppContextType = {
  language: LanguageType;
  shouldShowTitleBanner: boolean;
  shouldShowSponsorBanner: boolean;

  siteMapNode?: NestedSiteMapSchema;
  sponsorTiers?: SponsorTierSchema[];
  title: string;
  currentSiteMapDepth: (NestedSiteMapSchema | undefined)[];

  setAppContext: React.Dispatch<React.SetStateAction<Omit<AppContextType, "setAppContext">>>;
};

export const AppContext = React.createContext<AppContextType | undefined>(undefined);

export const useAppContext = (): AppContextType => {
  const context = React.useContext(AppContext);
  if (!context) {
    throw new Error("useAppContext must be used within an AppContextProvider");
  }
  return context;
};
