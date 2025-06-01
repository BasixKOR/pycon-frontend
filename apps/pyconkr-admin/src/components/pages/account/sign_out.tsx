import * as Common from "@frontend/common";
import { Logout } from "@mui/icons-material";
import { Button, Stack, Typography } from "@mui/material";
import * as React from "react";
import { useNavigate } from "react-router-dom";

import { addErrorSnackbar, addSnackbar } from "../../../utils/snackbar";

export const SignOutPage: React.FC = () => {
  const navigate = useNavigate();
  const backendAdminAPIClient = Common.Hooks.BackendAdminAPI.useBackendAdminClient();
  const signOutMutation = Common.Hooks.BackendAdminAPI.useSignOutMutation(backendAdminAPIClient);

  const handleSignOut = () => {
    signOutMutation.mutate(undefined, {
      onSuccess: () => {
        addSnackbar("로그아웃 되었습니다.", "success");
        navigate("/");
      },
      onError: addErrorSnackbar,
    });
  };

  React.useEffect(() => {
    (async () => {
      const userInfo = await Common.BackendAdminAPIs.me(backendAdminAPIClient)();
      if (!userInfo) {
        addSnackbar("로그아웃 상태입니다!", "error");
        navigate("/");
      }
    })();
  }, [backendAdminAPIClient, navigate]);

  return (
    <Stack
      sx={{
        width: "100%",
        height: "100%",
        minHeight: "100%",
        maxHeight: "100%",
        flexGrow: 1,
        py: 2,
      }}
      justifyContent="center"
      alignItems="center"
    >
      <Typography variant="h5">정말 로그아웃하시겠습니까?</Typography>
      <br />
      <Button variant="contained" onClick={handleSignOut} disabled={signOutMutation.isPending} startIcon={<Logout />}>
        로그아웃
      </Button>
    </Stack>
  );
};
