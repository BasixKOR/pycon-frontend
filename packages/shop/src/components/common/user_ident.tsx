import { CircularProgress } from "@mui/material";
import { ErrorBoundary, Suspense } from "@suspensive/react";
import * as React from "react";
import * as R from "remeda";

import ShopHooks from "../../hooks";

const ProviderTranslation: Record<string, { ko: string; en: string }> = {
  google: { ko: "구글", en: "Google" },
  kakao: { ko: "카카오", en: "Kakao" },
  naver: { ko: "네이버", en: "Naver" },
};

const ErrorBoundariedText: React.FC<{ ko: string; en: string }> = (props) => {
  const { language } = ShopHooks.useShopContext();
  return props[language];
};

export const UserSignInMethod: React.FC = ErrorBoundary.with(
  { fallback: <ErrorBoundariedText ko="손님" en="Guest" /> },
  Suspense.with({ fallback: <CircularProgress /> }, () => {
    const { language } = ShopHooks.useShopContext();
    const shopAPIClient = ShopHooks.useShopClient();
    const { data } = ShopHooks.useUserStatus(shopAPIClient);

    const notSignedInStr = language === "ko" ? "손님" : "Guest";
    const directSignInStr = language === "ko" ? "계정 로그인" : "Direct Sign-in";

    if (!data?.meta?.is_authenticated) return notSignedInStr;
    if (!R.isArray(data.data.methods) || R.isEmpty(data.data.methods)) return directSignInStr;

    const signInMethod = data.data.methods[0];
    return signInMethod.method === "socialaccount"
      ? ProviderTranslation[signInMethod.provider]?.[language] || signInMethod.provider
      : signInMethod.method;
  })
);

export const UserSignInAccount: React.FC = ErrorBoundary.with(
  { fallback: <ErrorBoundariedText ko="로그아웃됨" en="Signed-out" /> },
  Suspense.with({ fallback: <CircularProgress /> }, () => {
    const { language } = ShopHooks.useShopContext();
    const shopAPIClient = ShopHooks.useShopClient();
    const { data } = ShopHooks.useUserStatus(shopAPIClient);

    const notSignedInStr = language === "ko" ? "로그아웃됨" : "Signed-out";
    return data?.meta?.is_authenticated ? data.data.user.email : notSignedInStr;
  })
);
