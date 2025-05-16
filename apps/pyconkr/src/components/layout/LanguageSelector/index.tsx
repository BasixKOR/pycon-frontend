import * as React from "react";

import styled from "@emotion/styled";
import { Language } from '@mui/icons-material';

export default function LanguageSelector() {
  const [selectedLang, setSelectedLang] = React.useState<"KO" | "EN">("KO");

  return (
    <LanguageContainer>
      <Language sx={{ color: (theme) => theme.palette.primary.nonFocus, w: 25, h: 25, }} />
      <LanguageItem isSelected={selectedLang === "KO"} onClick={() => setSelectedLang("KO")}>KO</LanguageItem>
      <LanguageItem isSelected={selectedLang === "EN"} onClick={() => setSelectedLang("EN")}>EN</LanguageItem>
    </LanguageContainer>
  );
}

const LanguageContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 0.6rem;
`;

const LanguageItem = styled.div<{ isSelected: boolean }>`
  cursor: pointer;
  color: ${({ isSelected, theme }) =>
    isSelected ? theme.palette.primary.dark : theme.palette.primary.nonFocus};
  transition: color 0.2s ease;
`;
