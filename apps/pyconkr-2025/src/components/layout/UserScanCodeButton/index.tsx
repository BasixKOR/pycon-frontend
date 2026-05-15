import { useShopClient, useUserInfo } from "@frontend/shop/hooks";
import { QrCode2 } from "@mui/icons-material";
import { Button, IconButton, IconButtonProps } from "@mui/material";
import { ErrorBoundary, Suspense } from "@suspensive/react";
import { FC, Fragment } from "react";

import { useAppContext } from "@apps/pyconkr-2025/contexts/app_context";

export const ScanCodeIconButton: FC<{ sx?: IconButtonProps["sx"] }> = Suspense.with(
  { fallback: <Fragment /> },
  ErrorBoundary.with({ fallback: <Fragment /> }, ({ sx }) => {
    const shopAPIClient = useShopClient();
    const { data } = useUserInfo(shopAPIClient);

    const iconBtnStyle: IconButtonProps["sx"] = (theme) => ({
      color: theme.palette.primary.nonFocus,
      "&:hover": { color: theme.palette.primary.dark },
      "&:active": { color: theme.palette.primary.main },
      transition: "color 0.4s ease, background-color 0.4s ease",
    });

    return (
      <a href={data.scancode_url} target="_blank" rel="noopener noreferrer" style={{ textDecoration: "none" }}>
        <IconButton children={<QrCode2 />} sx={sx ?? iconBtnStyle} />
      </a>
    );
  })
);

export const ScanCodeButton: FC = Suspense.with(
  { fallback: null },
  ErrorBoundary.with({ fallback: null }, () => {
    const { language } = useAppContext();
    const shopAPIClient = useShopClient();
    const { data } = useUserInfo(shopAPIClient);

    const buttonText = language === "ko" ? "등록 코드" : "Entrance QR Code";

    return (
      <a
        href={data.scancode_url}
        target="_blank"
        rel="noopener noreferrer"
        style={{
          textDecoration: "none",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flex: 1,
        }}
      >
        <Button startIcon={<QrCode2 />} sx={{ color: "white", p: 0, textTransform: "none", lineHeight: 1 }} children={buttonText} />
      </a>
    );
  })
);
