import { Button, Card, CardContent, Stack, styled, Typography } from "@mui/material";
import * as React from "react";

import { ModificationAuditCancelConfirmDialog } from "../dialogs/modification_audit_cancel_confirm";

const StyledAlertCard = styled(Card)(({ theme }) => ({
  width: "100%",
  backgroundColor: theme.palette.info.light,
  color: theme.palette.info.contrastText,
  marginBottom: theme.spacing(2),
  fontWeight: 500,
}));

export const CurrentlyModAuditInProgress: React.FC<{ language: "ko" | "en"; modificationAuditId: string }> = ({ language, modificationAuditId }) => {
  const [cardState, setCardState] = React.useState<{ openCancelConfirmDialog: boolean }>({ openCancelConfirmDialog: false });
  const openCancelConfirmDialog = () => setCardState((ps) => ({ ...ps, openCancelConfirmDialog: true }));
  const closeCancelConfirmDialog = () => setCardState((ps) => ({ ...ps, openCancelConfirmDialog: false }));

  const cancelModAuditStr = language === "ko" ? "수정 요청 취소하기" : "Cancel Request";
  const sessionModAuditInProgress =
    language === "ko" ? (
      <Typography variant="body1" sx={{ flexGrow: 1 }}>
        현재 정보 수정 요청이 진행 중이에요. 수정 요청이 완료되기 전까지는 정보를 변경할 수 없어요.
        <br />
        만약 수정할 내용이 있다면, 수정 요청을 취소하고 다시 수정 요청을 해주세요.
      </Typography>
    ) : (
      <Typography variant="body1" sx={{ flexGrow: 1 }}>
        A modification request is currently in progress.
        <br />
        You cannot change the information until the modification request is completed.
        <br />
        If you have changes to make, please cancel the modification request and submit a new one.
      </Typography>
    );

  return (
    <>
      <ModificationAuditCancelConfirmDialog
        open={cardState.openCancelConfirmDialog}
        onClose={closeCancelConfirmDialog}
        modificationAuditId={modificationAuditId}
      />
      <StyledAlertCard>
        <CardContent>
          <Stack direction="row">
            {sessionModAuditInProgress}
            <Button variant="outlined" color="inherit" onClick={openCancelConfirmDialog} children={cancelModAuditStr} />
          </Stack>
        </CardContent>
      </StyledAlertCard>
    </>
  );
};
