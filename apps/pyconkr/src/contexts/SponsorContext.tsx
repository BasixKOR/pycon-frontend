import { createContext, useContext, useState, ReactNode } from "react";

interface SponsorContextType {
  isVisible: boolean;
  toggleVisibility: () => void;
}

const SponsorContext = createContext<SponsorContextType | undefined>(undefined);

export function SponsorProvider({ children }: { children: ReactNode }) {
  const [isVisible, setIsVisible] = useState(true);

  const toggleVisibility = () => {
    setIsVisible((prev) => !prev);
  };

  return (
    <SponsorContext.Provider value={{ isVisible, toggleVisibility }}>
      {children}
    </SponsorContext.Provider>
  );
}

export function useSponsor() {
  const context = useContext(SponsorContext);
  if (context === undefined) {
    throw new Error("useSponsor must be used within a SponsorProvider");
  }
  return context;
}
