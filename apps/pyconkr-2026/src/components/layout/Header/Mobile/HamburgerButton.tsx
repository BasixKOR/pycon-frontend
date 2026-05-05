import { IconButton, styled } from "@mui/material";
import * as React from "react";

interface HamburgerButtonProps {
  isOpen: boolean;
  onClick: () => void;
}

export const HamburgerButton: React.FC<HamburgerButtonProps> = ({ isOpen, onClick }) => {
  return (
    <StyledIconButton onClick={onClick}>
      <HamburgerIcon isOpen={isOpen}>
        <span />
        <span />
        <span />
      </HamburgerIcon>
    </StyledIconButton>
  );
};

const StyledIconButton = styled(IconButton)({
  padding: 0,
  width: 26,
  height: 18,
  color: "#ededde",
});

const HamburgerIcon = styled("div")<{ isOpen: boolean }>(({ isOpen }) => ({
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
    backgroundColor: "#ededde",
    borderRadius: 1,
    transition: "height 0.3s ease",
  },
}));
