import { Confetti, StyledFullWidthButton } from "@frontend/common/components/mdx_components";
import { Stack, Typography } from "@mui/material";
import { FC, useEffect } from "react";

import { useAppContext } from "@apps/pyconkr-2026/contexts/app_context";

export const StoreThankYouPage: FC = () => {
  const { setAppContext, language } = useAppContext();
  const title = language === "ko" ? "구매해주셔서 감사합니다!" : "Thanks for your purchase!";
  const orderHistoryLabel = language === "ko" ? "구매 내역 페이지로 가기" : "Go to order history";
  const homeLabel = language === "ko" ? "홈으로 가기" : "Go to home";

  useEffect(() => {
    setAppContext((prev) => ({
      ...prev,
      title,
      shouldShowTitleBanner: false,
      shouldShowSponsorBanner: false,
    }));
  }, [setAppContext, title]);

  return (
    <Stack sx={{ minHeight: "70dvh", width: "100%", alignItems: "center", justifyContent: "center", py: 8, px: { xs: 2, sm: 4, lg: 16 } }}>
      <Confetti />
      <Stack spacing={4} sx={{ width: "100%", maxWidth: 600, alignItems: "stretch" }}>
        <Typography variant="h4" sx={{ textAlign: "center", fontWeight: 700 }}>
          {title}
        </Typography>
        <Stack spacing={2}>
          <StyledFullWidthButton link="/store/order-histories" transparency={10}>
            {orderHistoryLabel}
          </StyledFullWidthButton>
          <StyledFullWidthButton link="/" transparency={10}>
            {homeLabel}
          </StyledFullWidthButton>
        </Stack>
      </Stack>
    </Stack>
  );
};
