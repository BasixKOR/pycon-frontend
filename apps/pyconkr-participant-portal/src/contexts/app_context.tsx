import { Dispatch, SetStateAction, createContext, useContext } from "react";
type LanguageType = "ko" | "en";

export type AppContextType = {
  language: LanguageType;
  setAppContext: Dispatch<SetStateAction<Omit<AppContextType, "setAppContext">>>;
};

export const AppContext = createContext<AppContextType | undefined>(undefined);

export const useAppContext = (): AppContextType => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("useAppContext must be used within an AppContextProvider");
  }
  return context;
};
