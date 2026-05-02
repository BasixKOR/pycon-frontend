import { IconButton, styled } from "@mui/material";
import * as React from "react";

interface HamburgerButtonProps {
  isOpen: boolean;
  onClick: () => void;
  isMainPath?: boolean;
}

export const HamburgerButton: React.FC<HamburgerButtonProps> = ({ isOpen, onClick, isMainPath = true }) => {
  return (
    <StyledIconButton onClick={onClick} isMainPath={isMainPath}>
      <HamburgerIcon isOpen={isOpen} isMainPath={isMainPath}>
        <span />
        <span />
        <span />
      </HamburgerIcon>
    </StyledIconButton>
  );
};

const StyledIconButton = styled(IconButton)<{ isMainPath: boolean }>(({ theme, isMainPath }) => ({
  padding: 0,
  width: 26,
  height: 18,
  color: isMainPath ? theme.palette.mobileHeader.main.text : theme.palette.mobileHeader.sub.text,
}));

const HamburgerIcon = styled("div")<{ isOpen: boolean; isMainPath: boolean }>(({ isOpen, theme, isMainPath }) => ({
  width: 26,
  height: 18,
  position: "relative",
  cursor: "pointer",
  display: "flex",
  flexDirection: "column",
  justifyContent: "space-between",

  "& span": {
    display: "block",
    height: isOpen ? 3 : 2,
    width: "100%",
    backgroundColor: isMainPath ? theme.palette.mobileHeader.main.text : theme.palette.mobileHeader.sub.text,
    borderRadius: 1,
    transition: "height 0.3s ease",
  },
}));
