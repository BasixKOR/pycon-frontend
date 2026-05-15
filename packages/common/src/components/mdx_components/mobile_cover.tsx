import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import { ButtonBase, Stack, Typography } from "@mui/material";
import * as React from "react";

import * as Hooks from "@frontend/common/hooks";

type MobileCoverProps = {
  coverImageSrc: string;
  coverTitleSrc: string;
  coverImageObjectFit?: React.CSSProperties["objectFit"];
  buttonTextKo?: string;
  buttonTextEn?: string;
};

export const MobileCover: React.FC<MobileCoverProps> = ({
  coverImageSrc,
  coverTitleSrc,
  coverImageObjectFit = "cover",
  buttonTextKo = "티켓 구매하기",
  buttonTextEn = "Buy Ticket",
}) => {
  const { language } = Hooks.Common.useCommonContext();
  const buttonTitle = language === "ko" ? buttonTextKo : buttonTextEn;

  return (
    <Stack sx={{ display: "flex", flexDirection: "column", position: "relative", width: "100vw", height: "100vh", overflow: "hidden" }}>
      <Stack sx={{ zIndex: 1, position: "absolute", top: 0, left: 0, flex: 1, display: "flex", width: "100%", height: "100%" }}>
        <img
          src={coverImageSrc}
          alt="Mobile Cover Image"
          style={{ flex: 1, width: "100%", height: "100%", objectFit: coverImageObjectFit, objectPosition: "center center" }}
        />
      </Stack>
      <Stack sx={{ zIndex: 2, position: "absolute", top: 96, left: 46 }}>
        <img src={coverTitleSrc} alt="Mobile Cover Title" style={{ objectFit: "contain" }} />
      </Stack>
      <Stack sx={{ zIndex: 3, position: "absolute", top: 351, left: 48 }}>
        <ButtonBase
          sx={{
            flexDirection: "row",
            backgroundColor: "white",
            padding: "10px 20px",
            gap: "10px",
            borderRadius: "10px",
            boxShadow: "0 4px 4px 0px rgba(0, 0, 0, 0.15)",
          }}
        >
          <Typography sx={{ fontWeight: 600, fontSize: "15px" }}>{buttonTitle}</Typography>
          <ArrowForwardIcon sx={{ height: "15px" }} />
        </ButtonBase>
      </Stack>
    </Stack>
  );
};
