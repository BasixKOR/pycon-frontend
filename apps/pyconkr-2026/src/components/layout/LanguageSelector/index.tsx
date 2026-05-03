import { Language } from "@mui/icons-material";
import { Button, Stack, styled } from "@mui/material";

import { LOCAL_STORAGE_LANGUAGE_KEY } from "../../../consts/local_stroage";
import { useAppContext } from "../../../contexts/app_context";

export default function LanguageSelector() {
  const { language, setAppContext } = useAppContext();
  const toggleLanguage = () => {
    const newLanguage = language === "ko" ? "en" : "ko";
    localStorage.setItem(LOCAL_STORAGE_LANGUAGE_KEY, newLanguage);
    setAppContext((ps) => ({ ...ps, language: newLanguage }));
  };

  return (
    <Stack direction="row" alignItems="center" spacing={0.5}>
      <Language sx={{ color: (theme) => theme.palette.primary.nonFocus, w: "1.5rem", h: "1.5rem" }} />
      <LanguageItem onClick={toggleLanguage} selected={language === "ko"}>
        KO
      </LanguageItem>
      <LanguageItem onClick={toggleLanguage} selected={language === "en"}>
        EN
      </LanguageItem>
    </Stack>
  );
}

const LanguageItem = styled(Button)<{ selected: boolean }>(({ selected, theme }) => ({
  color: selected ? theme.palette.primary.dark : theme.palette.primary.nonFocus,
  minWidth: 0,
  padding: "0.375rem 0.25rem",
  transition: "color 0.2s ease",
}));
