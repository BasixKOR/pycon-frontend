import { ContentCopy } from "@mui/icons-material";
import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, IconButton, InputAdornment, TextField } from "@mui/material";
import { FC } from "react";

import { addSnackbar } from "@apps/pyconkr-admin/utils/snackbar";

type PasswordResultDialogProps = {
  open: boolean;
  password: string | null;
  onClose: () => void;
};

export const PasswordResultDialog: FC<PasswordResultDialogProps> = ({ open, password, onClose }) => {
  const copyPasswordToClipboard = () => {
    if (password) {
      navigator.clipboard.writeText(password).then(
        () => addSnackbar("비밀번호가 클립보드에 복사되었습니다.", "success"),
        () => addSnackbar("클립보드 복사에 실패했습니다.", "error")
      );
    }
  };

  return (
    <Dialog open={open} maxWidth="sm" fullWidth>
      <DialogTitle>비밀번호가 설정되었습니다</DialogTitle>
      <DialogContent>
        <DialogContentText sx={{ mb: 2 }}>
          새로운 비밀번호가 생성되었습니다. 이 비밀번호는 다시 확인할 수 없으니 반드시 복사해 두세요.
        </DialogContentText>
        <TextField
          fullWidth
          value={password || ""}
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
        <Button onClick={onClose}>닫기</Button>
      </DialogActions>
    </Dialog>
  );
};
