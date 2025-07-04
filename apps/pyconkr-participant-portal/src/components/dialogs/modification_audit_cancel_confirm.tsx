import * as Common from "@frontend/common";
import { Button, Chip, Dialog, DialogActions, DialogContent, DialogTitle, Typography } from "@mui/material";
import { enqueueSnackbar, OptionsObject } from "notistack";
import * as React from "react";

import { useAppContext } from "../../contexts/app_context";

type ModificationAuditCancelConfirmDialogProps = {
  modificationAuditId: string;
  open: boolean;
  onClose: () => void;
};

export const ModificationAuditCancelConfirmDialog: React.FC<ModificationAuditCancelConfirmDialogProps> = ({ open, onClose, modificationAuditId }) => {
  const reasonInputRef = React.useRef<HTMLInputElement>(null);
  const { language } = useAppContext();
  const participantPortalClient = Common.Hooks.BackendParticipantPortalAPI.useParticipantPortalClient();
  const cancelModificationAuditMutation = Common.Hooks.BackendParticipantPortalAPI.useCancelModificationAuditMutation(participantPortalClient);

  const addSnackbar = (c: string | React.ReactNode, variant: OptionsObject["variant"]) =>
    enqueueSnackbar(c, { variant, anchorOrigin: { vertical: "bottom", horizontal: "center" } });

  const titleStr = language === "ko" ? "수정 요청 철회 확인" : "Confirm Withdrawal of Modification Request";
  const content =
    language === "ko" ? (
      <Typography variant="body1" gutterBottom>
        제출하신 수정 요청을 철회하시겠습니까?
        <br />
        철회 후에는 다시 수정 요청을 하셔야 합니다.
        <br />
        계속하시려면 <Chip label="철회" color="error" size="small" /> 버튼을 클릭해 주세요.
      </Typography>
    ) : (
      <Typography>
        Are you sure you want to withdraw your modification request?
        <br />
        After withdrawal, you will need to submit a new modification request.
        <br />
        To continue, please click the <Chip label="Cancel" color="error" size="small" /> button below.
      </Typography>
    );
  // const reasonStr = language === "ko" ? "철회 사유 (선택)" : "Reason for Withdrawal (Optional)";
  const submitStr = language === "ko" ? "철회" : "Withdraw Request";
  const cancelStr = language === "ko" ? "취소" : "Cancel";
  const successStr = language === "ko" ? "수정 요청이 철회되었습니다." : "Modification request has been canceled.";

  const onClick = () => {
    cancelModificationAuditMutation.mutate(
      {
        id: modificationAuditId,
        reason: reasonInputRef.current?.value || "",
      },
      {
        onSuccess: () => {
          addSnackbar(successStr, "success");
          onClose();
        },
        onError: (error) => {
          console.error("Canceling ModAudit failed:", error);

          let errorMessage = error instanceof Error ? error.message : "An unknown error occurred.";
          if (error instanceof Common.BackendAPIs.BackendAPIClientError) errorMessage = error.message;

          addSnackbar(errorMessage, "error");
        },
      }
    );
  };

  const disabled = cancelModificationAuditMutation.isPending;

  return (
    <Dialog open={open} maxWidth="sm" fullWidth>
      <DialogTitle children={titleStr} />
      <DialogContent>
        {content}
        {/* <br />
        <TextField ref={reasonInputRef} disabled={disabled} label={reasonStr} fullWidth variant="filled" /> */}
      </DialogContent>
      <DialogActions>
        <Button disabled={disabled} onClick={onClose} color="error" children={cancelStr} />
        <Button disabled={disabled} onClick={onClick} color="error" children={submitStr} variant="contained" />
      </DialogActions>
    </Dialog>
  );
};
