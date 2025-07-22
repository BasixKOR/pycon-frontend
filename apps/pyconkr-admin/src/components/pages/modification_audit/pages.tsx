import * as Common from "@frontend/common";
import { Box, Button, CircularProgress, Divider, Stack, Typography } from "@mui/material";
import { ErrorBoundary, Suspense } from "@suspensive/react";
import * as React from "react";
import { Navigate, useParams } from "react-router-dom";

import { ModificationAuditProperties } from "./components";
import { ApproveSubmitConfirmDialog, RejectSubmitConfirmDialog } from "./dialogs";
import { SubModificationAuditPage } from "./sub_pages";
import { BackendAdminSignInGuard } from "../../elements/admin_signin_guard";

type EditorStateType = { actionStatus?: "approve" | "reject" };

const InnerAdminModificationAuditEditor: React.FC = () => {
  const [editorState, setEditorState] = React.useState<EditorStateType>({});
  const { id } = useParams<{ id?: string }>();

  const backendAdminClient = Common.Hooks.BackendAdminAPI.useBackendAdminClient();
  const { data } = Common.Hooks.BackendAdminAPI.useModificationAuditPreviewQuery<Record<string, string>>(backendAdminClient, id || "");

  if (!data) return <Navigate to="/admin/modification-audit" replace />;

  const { modification_audit } = data;
  const { status, instance } = modification_audit;
  const { app, model } = instance;
  const btnDisabled = status !== "requested";

  const closeSubmitConfirmDialog = () => setEditorState((ps) => ({ ...ps, actionStatus: undefined }));
  const openApproveSubmitConfirmDialog = () => setEditorState((ps) => ({ ...ps, actionStatus: "approve" }));
  const openRejectSubmitConfirmDialog = () => setEditorState((ps) => ({ ...ps, actionStatus: "reject" }));

  return (
    <>
      <ApproveSubmitConfirmDialog
        open={editorState.actionStatus === "approve"}
        onClose={closeSubmitConfirmDialog}
        modificationAuditId={modification_audit.id}
      />
      <RejectSubmitConfirmDialog
        open={editorState.actionStatus === "reject"}
        onClose={closeSubmitConfirmDialog}
        modificationAuditId={modification_audit.id}
      />
      <Box sx={{ flexGrow: 1, width: "100%", minHeight: "100%" }}>
        <Typography variant="h5" fontWeight="bold">
          {app.toUpperCase()} &gt; {model.toUpperCase()} &gt; 수정 심사
        </Typography>
        <Divider sx={{ my: 1, borderColor: "black" }} />
        <Stack sx={{ width: "100%", minHeight: "100%" }} spacing={2}>
          <Typography variant="h6" fontWeight="bold" children="심사 속성" />
          <ModificationAuditProperties audit={modification_audit} />
          <SubModificationAuditPage {...data} />
          <Stack alignItems="flex-end" spacing={1}>
            {btnDisabled && <Typography variant="body2" children={`현재 심사 상태가 ${status}입니다. 승인 또는 반려가 불가능합니다.`} />}
            <Stack direction="row" spacing={2} justifyContent="flex-end">
              <Button disabled={btnDisabled} variant="contained" color="error" onClick={openRejectSubmitConfirmDialog} children="반려" />
              <Button disabled={btnDisabled} variant="contained" onClick={openApproveSubmitConfirmDialog} children="승인" />
            </Stack>
          </Stack>
        </Stack>
      </Box>
    </>
  );
};

export const AdminModificationAuditEditor: React.FC = () => {
  return (
    <BackendAdminSignInGuard>
      <ErrorBoundary fallback={Common.Components.ErrorFallback}>
        <Suspense fallback={<CircularProgress />}>
          <InnerAdminModificationAuditEditor />
        </Suspense>
      </ErrorBoundary>
    </BackendAdminSignInGuard>
  );
};
