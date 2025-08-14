import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import { ButtonBase, Stack, Typography } from "@mui/material";
import * as React from "react";
import { useAppContext } from "../../../../../apps/pyconkr/src/contexts/app_context";
import PyCon2025MobileLogoImage from "../../assets/pyconkr2025_main_cover_image.png";
import PyCon2025MobileLogoTitle from "../../assets/pyconkr2025_main_cover_title.png";

const MobileImage: React.FC = () => {
  const { language } = useAppContext();
  const buttonTitle = language === "ko" ? "티켓 구매하기" : "Buy Ticket";

  return (
    <Stack sx={{ flexDirection: "column", position: "relative" }}>
      <Stack sx={{ zIndex: 1, position: "absolute", top: 0, left: 0 }}>
        <img src={PyCon2025MobileLogoImage} alt="Pycon 2025 Mobile Image" style={{ objectFit: "contain" }} />
      </Stack>
      <Stack sx={{ zIndex: 2, position: "absolute", top: 0, left: 0 }}>
        <img src={PyCon2025MobileLogoTitle} alt="Pycon 2025 Mobile Title" style={{ objectFit: "contain" }} />
      </Stack>
      <Stack sx={{ zIndex: 3, position: "absolute", top: "3rem", left: 0 }}>
        <ButtonBase sx={{ flexDirection: "row", backgroundColor: "white", borderRadius: "10px", boxShadow: "0 4px 4px 0px rgba(0, 0, 0, 0.15)" }}>
          <Typography>{buttonTitle}</Typography>
          <ArrowForwardIcon />
        </ButtonBase>
      </Stack>
    </Stack>
  );
};

export const MobileCover: React.FC = () => {
  return (
    <Stack>
      <MobileImage />
    </Stack>
  );
};
