import { createContext, useContext, useState, ReactNode } from "react";

interface SponsorContextType {
  isVisible: boolean;
  setIsVisible: (value: boolean) => void;
}

const SponsorContext = createContext<SponsorContextType | undefined>(undefined);

interface SponsorProviderProps {
  children: ReactNode;
  initialVisibility?: boolean;
}

export function SponsorProvider({ children, initialVisibility = false }: SponsorProviderProps) {
  const [isVisible, setIsVisible] = useState(initialVisibility);

  return <SponsorContext.Provider value={{ isVisible, setIsVisible }}>{children}</SponsorContext.Provider>;
}

export function useSponsor() {
  const context = useContext(SponsorContext);
  if (context === undefined) {
    throw new Error("useSponsor must be used within a SponsorProvider");
  }
  return context;
}
