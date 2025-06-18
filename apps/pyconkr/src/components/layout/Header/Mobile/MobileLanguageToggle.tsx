import { ButtonBase, styled } from "@mui/material";
import * as React from "react";

interface MobileLanguageToggleProps {
  currentLanguage: string;
  onLanguageChange: (newLanguage: string) => void;
  isMainPath?: boolean;
}

export const MobileLanguageToggle: React.FC<MobileLanguageToggleProps> = ({ currentLanguage, onLanguageChange, isMainPath = true }) => {
  return (
    <ToggleContainer isMainPath={isMainPath}>
      <LanguageButton isActive={currentLanguage === "ko"} isMainPath={isMainPath} onClick={() => onLanguageChange("ko")}>
        KO
      </LanguageButton>
      <LanguageButton isActive={currentLanguage === "en"} isMainPath={isMainPath} onClick={() => onLanguageChange("en")}>
        EN
      </LanguageButton>
    </ToggleContainer>
  );
};

const ToggleContainer = styled("div")<{ isMainPath: boolean }>(({ isMainPath }) => ({
  display: "flex",
  width: 94,
  height: 29,
  border: "1px solid white",
  borderRadius: 15,
  padding: 2,
  gap: 2,
  backgroundColor: isMainPath ? "transparent" : "rgba(255, 255, 255, 0.1)",
}));

const LanguageButton = styled(ButtonBase)<{ isActive: boolean; isMainPath: boolean }>(({ isActive, isMainPath }) => ({
  flex: 1,
  height: "100%",
  borderRadius: 13,
  fontSize: 12,
  fontWeight: 400,
  transition: "all 0.2s ease",

  color: isMainPath ? "white" : "rgba(18, 109, 127, 0.6)",
  backgroundColor: "transparent",

  ...(isActive && {
    backgroundColor: isMainPath ? "rgba(255, 255, 255, 0.7)" : "rgba(255, 255, 255, 0.9)",
    color: isMainPath ? "#888888" : "#126D7F",
    fontWeight: 600,
  }),

  "&:hover": {
    backgroundColor: isActive
      ? isMainPath
        ? "rgba(255, 255, 255, 0.8)"
        : "rgba(255, 255, 255, 1)"
      : isMainPath
        ? "rgba(255, 255, 255, 0.1)"
        : "rgba(255, 255, 255, 0.3)",
  },

  WebkitFontSmoothing: "antialiased",
  MozOsxFontSmoothing: "grayscale",
  textRendering: "optimizeLegibility",
  WebkitTextStroke: "0.5px transparent",
}));
