import * as Common from "@frontend/common";
import { Login } from "@mui/icons-material";
import { Button, Stack, TextField, Typography } from "@mui/material";
import * as React from "react";
import { useNavigate } from "react-router-dom";

import { addErrorSnackbar, addSnackbar } from "../../../utils/snackbar";

type PageStateType = {
  userJustSignedIn: boolean;
};

export const SignInPage: React.FC = () => {
  const navigate = useNavigate();
  const formRef = React.useRef<HTMLFormElement>(null);
  const [pageState, setPageState] = React.useState<PageStateType>({ userJustSignedIn: false });
  const setUserJustSignedIn = () => setPageState((ps) => ({ ...ps, userJustSignedIn: true }));

  const backendAdminAPIClient = Common.Hooks.BackendAdminAPI.useBackendAdminClient();
  const signInMutation = Common.Hooks.BackendAdminAPI.useSignInMutation(backendAdminAPIClient);

  const handleSignIn = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!formRef.current) return;

    const formData = Common.Utils.getFormValue<{
      identity: string;
      password: string;
    }>({ form: formRef.current });
    signInMutation.mutate(formData, {
      onSuccess: (data) => {
        setUserJustSignedIn();
        addSnackbar(`안녕하세요, ${data.username}님!`, "success");
        navigate("/");
      },
      onError: addErrorSnackbar,
    });
  };

  React.useEffect(() => {
    (async () => {
      if (pageState.userJustSignedIn) return;

      const userInfo = await Common.BackendAdminAPIs.me(backendAdminAPIClient)();
      if (userInfo) {
        addSnackbar(`이미 ${userInfo.username}님으로 로그인되어 있습니다!`, "success");
        navigate("/");
      }
    })();
  }, [backendAdminAPIClient, navigate, pageState.userJustSignedIn]);

  return (
    <Stack sx={{ width: "100%", height: "100%", flexGrow: 1 }}>
      <form ref={formRef} onSubmit={handleSignIn}>
        <Stack direction="column" spacing={2}>
          <Typography variant="h5">로그인</Typography>
          <TextField label="Email or Username" name="identity" required disabled={signInMutation.isPending} />
          <TextField label="Password" name="password" type="password" required disabled={signInMutation.isPending} />
          <Button type="submit" variant="contained" disabled={signInMutation.isPending} startIcon={<Login />}>
            로그인
          </Button>
        </Stack>
      </form>
    </Stack>
  );
};
