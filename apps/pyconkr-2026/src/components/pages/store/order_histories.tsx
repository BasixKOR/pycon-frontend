import { UserSignInAccount, UserSignInMethod } from "@frontend/shop/components/common";
import { OrderList } from "@frontend/shop/components/features";
import { Box, Divider, Stack, Typography, useMediaQuery, useTheme } from "@mui/material";
import { FC, useEffect } from "react";

import { PageLayout } from "@apps/pyconkr-2026/components/layout/PageLayout";
import { useAppContext } from "@apps/pyconkr-2026/contexts/app_context";

export const StoreOrderHistoriesPage: FC = () => {
  const { setAppContext, language } = useAppContext();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const title = language === "ko" ? "주문 내역" : "Order History";
  const noticeText =
    language === "ko"
      ? "상품 주문 후 노출에 최대 3분정도 소요될 수 있으며, 문제가 발생할 경우 파이콘 한국 준비위원회에 문의 부탁드립니다."
      : "It may take up to 3 minutes for an order to appear after purchase. Please contact the PyCon Korea organizing committee if you encounter any issues.";
  const signInInfoLabel = language === "ko" ? "로그인 정보" : "Signed in as";

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
      <Stack component="ul" sx={{ alignSelf: "flex-start", pl: 3, m: 0, gap: 0.5 }}>
        <li>
          <Typography variant="body2">{noticeText}</Typography>
        </li>
        <li>
          <Typography variant="body2" component="span">
            {signInInfoLabel}: <UserSignInMethod /> / <UserSignInAccount />
          </Typography>
        </li>
      </Stack>
      <Box sx={{ width: "100%" }}>
        <OrderList />
      </Box>
    </PageLayout>
  );
};
