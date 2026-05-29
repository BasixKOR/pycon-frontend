import { CartStatus } from "@frontend/shop/components/features";
import { Box, Divider, Typography, useMediaQuery, useTheme } from "@mui/material";
import { FC, useEffect } from "react";

import { PageLayout } from "@apps/pyconkr-2026/components/layout/PageLayout";
import { useAppContext } from "@apps/pyconkr-2026/contexts/app_context";

export const StoreCartPage: FC = () => {
  const { setAppContext, language } = useAppContext();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const title = language === "ko" ? "장바구니" : "Cart";

  useEffect(() => {
    setAppContext((prev) => ({
      ...prev,
      title,
      shouldShowTitleBanner: true,
      shouldShowSponsorBanner: true,
    }));
  }, [setAppContext, title]);

  return (
    <PageLayout spacing={3}>
      {isMobile && (
        <>
          <Typography variant="h4" sx={{ alignSelf: "flex-start", fontWeight: 700 }}>
            {title}
          </Typography>
          <Divider flexItem />
        </>
      )}
      <Box sx={{ width: "100%" }}>
        <CartStatus />
      </Box>
    </PageLayout>
  );
};
