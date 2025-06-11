import * as Shop from "@frontend/shop";
import { Button } from "@mui/material";
import { ErrorBoundary, Suspense } from "@suspensive/react";
import { useNavigate } from "react-router-dom";

import { useAppContext } from "../../../contexts/app_context";

type InnerSignInButtonImplPropType = {
  loading?: boolean;
  signedIn?: boolean;
  onSignOut?: () => void;
};

const InnerSignInButtonImpl: React.FC<InnerSignInButtonImplPropType> = ({ loading, signedIn, onSignOut }) => {
  const navigate = useNavigate();
  const { language } = useAppContext();

  const signInBtnStr = language === "ko" ? "로그인" : "Sign In";
  const signOutBtnStr = language === "ko" ? "로그아웃" : "Sign Out";

  return (
    <Button
      variant="text"
      sx={({ palette }) => ({ color: palette.primary.dark })}
      loading={loading}
      onClick={() => (signedIn ? onSignOut?.() : navigate("/account/sign-in"))}
      children={signedIn ? signOutBtnStr : signInBtnStr}
    />
  );
};

export const SignInButton: React.FC = ErrorBoundary.with(
  { fallback: <InnerSignInButtonImpl /> },
  Suspense.with({ fallback: <InnerSignInButtonImpl loading /> }, () => {
    const shopAPIClient = Shop.Hooks.useShopClient();
    const signOutMutation = Shop.Hooks.useSignOutMutation(shopAPIClient);
    const { data } = Shop.Hooks.useUserStatus(shopAPIClient);

    return <InnerSignInButtonImpl signedIn={data !== null} onSignOut={signOutMutation.mutate} />;
  })
);
