import * as Shop from "@frontend/shop";
import { Login, Logout } from "@mui/icons-material";
import { Button, Stack } from "@mui/material";
import { ErrorBoundary, Suspense } from "@suspensive/react";
import { useNavigate } from "react-router-dom";

import { useAppContext } from "../../../contexts/app_context";

type InnerSignInButtonImplPropType = {
  loading?: boolean;
  signedIn?: boolean;
  onSignOut?: () => void;
  isMobile?: boolean;
  isMainPath?: boolean;
  onClose?: () => void;
};

const InnerSignInButtonImpl: React.FC<InnerSignInButtonImplPropType> = ({
  loading,
  signedIn,
  onSignOut,
  isMobile = false,
  isMainPath = true,
  onClose,
}) => {
  const navigate = useNavigate();
  const { language } = useAppContext();

  const signInBtnStr = language === "ko" ? "로그인" : "Sign In";
  const signOutBtnStr = language === "ko" ? "로그아웃" : "Sign Out";

  const handleClick = () => {
    if (signedIn) {
      onSignOut?.();
    } else {
      onClose?.();
      navigate("/account/sign-in");
    }
  };

  if (isMobile) {
    return (
      <Button
        variant="text"
        sx={{
          color: isMainPath ? "white" : "rgba(18, 109, 127, 0.9)",
          height: 29,
          fontSize: 13,
          fontWeight: 500,
          textTransform: "none",
          minWidth: "auto",
          padding: "0 13px",

          "&:hover": {
            backgroundColor: isMainPath ? "rgba(255, 255, 255, 0.1)" : "rgba(18, 109, 127, 0.1)",
          },
        }}
        loading={loading}
        onClick={handleClick}
      >
        <Stack direction="row" alignItems="center" sx={{ gap: "3px" }}>
          {signedIn ? <Logout fontSize="small" /> : <Login fontSize="small" />}
          {signedIn ? signOutBtnStr : signInBtnStr}
        </Stack>
      </Button>
    );
  }

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

export const SignInButton: React.FC<{ isMobile?: boolean; isMainPath?: boolean; onClose?: () => void }> = ({
  isMobile = false,
  isMainPath = true,
  onClose,
}) => {
  const SignInWithErrorBoundary = ErrorBoundary.with(
    { fallback: <InnerSignInButtonImpl isMobile={isMobile} isMainPath={isMainPath} onClose={onClose} /> },
    Suspense.with({ fallback: <InnerSignInButtonImpl loading isMobile={isMobile} isMainPath={isMainPath} onClose={onClose} /> }, () => {
      const shopAPIClient = Shop.Hooks.useShopClient();
      const signOutMutation = Shop.Hooks.useSignOutMutation(shopAPIClient);
      const { data } = Shop.Hooks.useUserStatus(shopAPIClient);

      return (
        <InnerSignInButtonImpl
          signedIn={data !== null}
          onSignOut={signOutMutation.mutate}
          isMobile={isMobile}
          isMainPath={isMainPath}
          onClose={onClose}
        />
      );
    })
  );

  return <SignInWithErrorBoundary />;
};
