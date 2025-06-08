import * as Common from "@frontend/common";
import { KeyOff } from "@mui/icons-material";
import {
  Button,
  ButtonProps,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@mui/material";
import { ErrorBoundary, Suspense } from "@suspensive/react";
import * as React from "react";
import { useParams } from "react-router-dom";

import { addErrorSnackbar, addSnackbar } from "../../../utils/snackbar";
import { AdminEditor } from "../../layouts/admin_editor";

type PageStateType = {
  isDialogOpen: boolean;
};

export const AdminUserExtEditor: React.FC = ErrorBoundary.with(
  { fallback: Common.Components.ErrorFallback },
  Suspense.with({ fallback: <CircularProgress /> }, () => {
    const { id } = useParams<{ id?: string }>();
    const [pageState, setPageState] = React.useState<PageStateType>({ isDialogOpen: false });
    const openDialog = () => setPageState((ps) => ({ ...ps, isDialogOpen: true }));
    const closeDialog = () => setPageState((ps) => ({ ...ps, isDialogOpen: false }));

    const backendAdminClient = Common.Hooks.BackendAdminAPI.useBackendAdminClient();
    const useResetPasswordMutation = Common.Hooks.BackendAdminAPI.useResetUserPasswordMutation(
      backendAdminClient,
      id || ""
    );

    const resetUserPassword = () => {
      closeDialog();
      if (id) {
        useResetPasswordMutation.mutate(undefined, {
          onSuccess: () => addSnackbar("비밀번호가 초기화되었습니다.", "success"),
          onError: addErrorSnackbar,
        });
      }
    };

    const resetUserPasswordButton: ButtonProps = {
      variant: "outlined",
      color: "error",
      size: "small",
      startIcon: <KeyOff />,
      children: "비밀번호 초기화",
      onClick: () => id && openDialog(),
    };

    return (
      <>
        <Dialog open={pageState.isDialogOpen}>
          <DialogTitle>비밀번호 초기화</DialogTitle>
          <DialogContent>
            <DialogContentText>정말 이 사용자의 비밀번호를 초기화하시겠습니까?</DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button color="error" onClick={closeDialog} autoFocus>
              취소
            </Button>
            <Button onClick={resetUserPassword}>초기화</Button>
          </DialogActions>
        </Dialog>
        <AdminEditor app="user" resource="userext" id={id} extraActions={[resetUserPasswordButton]} />
      </>
    );
  })
);
