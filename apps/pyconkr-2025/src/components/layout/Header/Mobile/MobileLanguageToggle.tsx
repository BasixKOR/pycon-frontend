import { ButtonBase, styled } from "@mui/material";
import * as React from "react";

import { LOCAL_STORAGE_LANGUAGE_KEY } from "../../../../consts/local_stroage";
import { useAppContext } from "../../../../contexts/app_context";

interface MobileLanguageToggleProps {
  isMainPath?: boolean;
}

export const MobileLanguageToggle: React.FC<MobileLanguageToggleProps> = ({ isMainPath = true }) => {
  const { language, setAppContext } = useAppContext();

  const toggleLanguage = () => {
    const newLanguage = language === "ko" ? "en" : "ko";
    localStorage.setItem(LOCAL_STORAGE_LANGUAGE_KEY, newLanguage);
    setAppContext((ps) => ({ ...ps, language: newLanguage }));
  };

  return (
    <ToggleContainer isMainPath={isMainPath} onClick={toggleLanguage}>
      <LanguageButton isActive={language === "ko"} isMainPath={isMainPath} children="KO" />
      <LanguageButton isActive={language === "en"} isMainPath={isMainPath} children="EN" />
    </ToggleContainer>
  );
};

const ToggleContainer = styled("div")<{ isMainPath: boolean }>(({ theme, isMainPath }) => ({
  display: "flex",
  width: "4rem",
  height: "1.5rem",
  border: "1px solid white",
  borderRadius: 15,
  padding: 2,
  gap: 2,
  backgroundColor: isMainPath
    ? theme.palette.mobileNavigation.main.languageToggle.background
    : theme.palette.mobileNavigation.sub.languageToggle.background,
}));

const LanguageButton = styled(ButtonBase)<{ isActive: boolean; isMainPath: boolean }>(({ theme, isActive, isMainPath }) => ({
  flex: 1,
  height: "100%",
  borderRadius: 13,
  fontSize: 12,
  fontWeight: 400,
  transition: "all 0.2s ease",

  color: isMainPath ? theme.palette.mobileHeader.main.text : theme.palette.mobileHeader.sub.text,
  backgroundColor: "transparent",

  ...(isActive && {
    backgroundColor: isMainPath
      ? theme.palette.mobileNavigation.main.languageToggle.active.background
      : theme.palette.mobileNavigation.sub.languageToggle.active.background,
    color: isMainPath ? theme.palette.mobileHeader.main.activeLanguage : theme.palette.mobileHeader.sub.activeLanguage,
    fontWeight: 600,
  }),

  "&:hover": {
    backgroundColor: isActive
      ? isMainPath
        ? theme.palette.mobileNavigation.main.languageToggle.active.hover
        : theme.palette.mobileNavigation.sub.languageToggle.active.hover
      : isMainPath
        ? theme.palette.mobileNavigation.main.languageToggle.inactive.hover
        : theme.palette.mobileNavigation.sub.languageToggle.inactive.hover,
  },

  WebkitFontSmoothing: "antialiased",
  MozOsxFontSmoothing: "grayscale",
  textRendering: "optimizeLegibility",
  WebkitTextStroke: "0.5px transparent",
}));
