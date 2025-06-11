import * as Shop from "@frontend/shop";
import { AccountCircleOutlined, Google } from "@mui/icons-material";
import { Backdrop, Button, ButtonProps, CircularProgress, Stack, styled, Typography } from "@mui/material";
import { Suspense } from "@suspensive/react";
import { enqueueSnackbar, OptionsObject } from "notistack";
import * as React from "react";
import { useNavigate } from "react-router-dom";

import { useAppContext } from "../../contexts/app_context";

const SignInPageContainer = styled(Stack)(({ theme }) => ({
  height: "75%",
  width: "100%",
  maxWidth: "1200px",

  justifyContent: "flex-start",
  alignItems: "center",

  paddingTop: theme.spacing(8),
  paddingBottom: theme.spacing(8),

  paddingRight: theme.spacing(16),
  paddingLeft: theme.spacing(16),

  [theme.breakpoints.down("lg")]: {
    padding: theme.spacing(4),
  },
  [theme.breakpoints.down("sm")]: {
    padding: theme.spacing(2),
  },
}));

type PageeStateType = {
  openBackdrop: boolean;
};

export const ShopSignInPage: React.FC = Suspense.with({ fallback: <CircularProgress /> }, () => {
  const { setAppContext, language } = useAppContext();
  const [state, setState] = React.useState<PageeStateType>({ openBackdrop: false });
  const navigate = useNavigate();
  const shopAPIClient = Shop.Hooks.useShopClient();
  const SignInMutation = Shop.Hooks.useSignInWithSNSMutation(shopAPIClient);
  const { data } = Shop.Hooks.useUserStatus(shopAPIClient);

  const shouldOpenBackdrop = SignInMutation.isPending || state.openBackdrop;

  const addSnackbar = (c: string | React.ReactNode, variant: OptionsObject["variant"]) =>
    enqueueSnackbar(c, { variant, anchorOrigin: { vertical: "bottom", horizontal: "center" } });

  const triggerSignIn = (provider: "google" | "kakao" | "naver") => {
    setState((ps) => ({ ...ps, openBackdrop: true }));
    SignInMutation.mutate({ provider, callback_url: window.location.origin });
  };
  const signInWithGoogle = () => triggerSignIn("google");
  const signInWithKakao = () => triggerSignIn("kakao");
  const signInWithNaver = () => triggerSignIn("naver");

  const signInTitleStr = language === "ko" ? "로그인" : "Sign In";
  const signInWithGoogleStr = language === "ko" ? "구글로 로그인" : "Sign In with Google";
  const signInWithKakaoStr = language === "ko" ? "카카오로 로그인" : "Sign In with Kakao";
  const signInWithNaverStr = language === "ko" ? "네이버로 로그인" : "Sign In with Naver";

  React.useEffect(() => {
    if (data && data.meta.is_authenticated) {
      addSnackbar(
        language === "ko"
          ? `이미 ${data.data.user.username}님으로 로그인되어 있습니다!`
          : `You are already signed in as ${data.data.user.username}!`,
        "success"
      );
      navigate("/");
      return;
    }

    setAppContext((prev) => ({
      ...prev,
      title: signInTitleStr,
      shouldShowTitleBanner: true,
      shouldShowSponsorBanner: false,
    }));
  }, [signInTitleStr]);

  const commonBtnProps: ButtonProps = {
    variant: "contained",
    fullWidth: true,
    size: "large",
    disabled: SignInMutation.isPending,
  };
  const commonBtnSxProps: ButtonProps["sx"] = {
    textTransform: "none",
  };
  const btnProps: ButtonProps[] = [
    {
      children: signInWithGoogleStr,
      onClick: signInWithGoogle,
      startIcon: <Google />,
      sx: { ...commonBtnSxProps, backgroundColor: "#4285F4", color: "#fff" },
    },
    {
      children: signInWithNaverStr,
      onClick: signInWithNaver,
      startIcon: <AccountCircleOutlined />,
      sx: { ...commonBtnSxProps, backgroundColor: "#03C75A", color: "#fff" },
    },
    {
      children: signInWithKakaoStr,
      onClick: signInWithKakao,
      startIcon: <AccountCircleOutlined />,
      sx: { ...commonBtnSxProps, backgroundColor: "#FEE500", color: "#000" },
    },
  ];

  return (
    <>
      <SignInPageContainer spacing={6}>
        <Typography variant="h4" sx={{ textAlign: "center", fontWeight: "bolder" }} children={signInTitleStr} />
        <Stack spacing={1} sx={{ width: "100%", maxWidth: "400px" }}>
          {btnProps.map((props, index) => (
            <Button key={index} {...commonBtnProps} {...props} />
          ))}
        </Stack>
      </SignInPageContainer>
      <Backdrop sx={({ zIndex }) => ({ zIndex: zIndex.drawer + 1 })} open={shouldOpenBackdrop} onClick={() => {}} />
    </>
  );
});
