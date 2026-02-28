import * as Common from "@frontend/common";
import { ContentCopy, KeyOff } from "@mui/icons-material";
import {
  Button,
  ButtonProps,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  IconButton,
  InputAdornment,
  TextField,
} from "@mui/material";
import { ErrorBoundary, Suspense } from "@suspensive/react";
import * as React from "react";
import { useParams } from "react-router-dom";

import { addErrorSnackbar, addSnackbar } from "../../../utils/snackbar";
import { AdminEditor } from "../../layouts/admin_editor";

type PageStateType = {
  isConfirmDialogOpen: boolean;
  isResultDialogOpen: boolean;
  newPassword: string | null;
};

export const AdminUserExtEditor: React.FC = ErrorBoundary.with(
  { fallback: Common.Components.ErrorFallback },
  Suspense.with({ fallback: <CircularProgress /> }, () => {
    const { id } = useParams<{ id?: string }>();
    const [pageState, setPageState] = React.useState<PageStateType>({
      isConfirmDialogOpen: false,
      isResultDialogOpen: false,
      newPassword: null,
    });
    const openConfirmDialog = () => setPageState((ps) => ({ ...ps, isConfirmDialogOpen: true }));
    const closeConfirmDialog = () => setPageState((ps) => ({ ...ps, isConfirmDialogOpen: false }));
    const closeResultDialog = () => setPageState((ps) => ({ ...ps, isResultDialogOpen: false, newPassword: null }));

    const backendAdminClient = Common.Hooks.BackendAdminAPI.useBackendAdminClient();
    const useResetPasswordMutation = Common.Hooks.BackendAdminAPI.useResetUserPasswordMutation(backendAdminClient, id || "");

    const resetUserPassword = () => {
      closeConfirmDialog();
      if (id) {
        useResetPasswordMutation.mutate(undefined, {
          onSuccess: (data) => {
            setPageState((ps) => ({
              ...ps,
              isResultDialogOpen: true,
              newPassword: data.password,
            }));
          },
          onError: addErrorSnackbar,
        });
      }
    };

    const copyPasswordToClipboard = () => {
      if (pageState.newPassword) {
        navigator.clipboard.writeText(pageState.newPassword).then(
          () => addSnackbar("비밀번호가 클립보드에 복사되었습니다.", "success"),
          () => addSnackbar("클립보드 복사에 실패했습니다.", "error")
        );
      }
    };

    const resetUserPasswordButton: ButtonProps = {
      variant: "outlined",
      color: "error",
      size: "small",
      startIcon: <KeyOff />,
      children: "비밀번호 초기화",
      onClick: () => id && openConfirmDialog(),
    };

    return (
      <>
        <Dialog open={pageState.isConfirmDialogOpen}>
          <DialogTitle>비밀번호 초기화</DialogTitle>
          <DialogContent>
            <DialogContentText>정말 이 사용자의 비밀번호를 초기화하시겠습니까?</DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button color="error" onClick={closeConfirmDialog} autoFocus>
              취소
            </Button>
            <Button onClick={resetUserPassword}>초기화</Button>
          </DialogActions>
        </Dialog>

        <Dialog open={pageState.isResultDialogOpen} maxWidth="sm" fullWidth>
          <DialogTitle>비밀번호가 초기화되었습니다</DialogTitle>
          <DialogContent>
            <DialogContentText sx={{ mb: 2 }}>
              새로운 비밀번호가 생성되었습니다. 이 비밀번호는 다시 확인할 수 없으니 반드시 복사해 두세요.
            </DialogContentText>
            <TextField
              fullWidth
              value={pageState.newPassword || ""}
              slotProps={{
                input: {
                  readOnly: true,
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton onClick={copyPasswordToClipboard} edge="end">
                        <ContentCopy />
                      </IconButton>
                    </InputAdornment>
                  ),
                },
              }}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={closeResultDialog}>닫기</Button>
          </DialogActions>
        </Dialog>

        <AdminEditor app="user" resource="userext" id={id} extraActions={[resetUserPasswordButton]} />
      </>
    );
  })
);
