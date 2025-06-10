import { CircularProgress, Typography } from "@mui/material";
import { ErrorBoundary, Suspense } from "@suspensive/react";
import * as React from "react";

import ShopHooks from "../../hooks";

type SignInGuardProps = {
  children: React.ReactNode;
  fallback?: React.ReactNode;
};

export const SignInGuard: React.FC<SignInGuardProps> = Suspense.with(
  { fallback: <CircularProgress /> },
  ({ children, fallback }) => {
    const { language } = ShopHooks.useShopContext();
    const shopAPIClient = ShopHooks.useShopClient();
    const { data } = ShopHooks.useUserStatus(shopAPIClient);

    const errorFallbackStr =
      language === "ko"
        ? "로그인 정보를 불러오는 중 문제가 발생했습니다. 잠시 후 다시 시도해주세요."
        : "An error occurred while loading sign-in information. Please try again later.";
    const signInRequiredStr =
      language === "ko"
        ? "로그인이 필요합니다. 로그인 후 다시 시도해주세요."
        : "You need to sign in. Please sign in and try again.";

    const signInRequiredFallback = fallback || (
      <Typography variant="h6" gutterBottom>
        {signInRequiredStr}
      </Typography>
    );

    return (
      <ErrorBoundary fallback={errorFallbackStr}>
        {data?.meta?.is_authenticated === true ? children : signInRequiredFallback}
      </ErrorBoundary>
    );
  }
);
