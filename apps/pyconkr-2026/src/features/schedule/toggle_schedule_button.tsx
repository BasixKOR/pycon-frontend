import { useBackendClient } from "@frontend/common/hooks/useAPI";
import { SessionSchema } from "@frontend/common/schemas/backendAPI";
import { useShopClient, useUserStatus } from "@frontend/shop/hooks";
import EventAvailableRoundedIcon from "@mui/icons-material/EventAvailableRounded";
import EventBusyRoundedIcon from "@mui/icons-material/EventBusyRounded";
import { Button, CircularProgress, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from "@mui/material";
import { enqueueSnackbar } from "notistack";
import { FC, useState } from "react";
import { useNavigate } from "react-router-dom";

import { useAppContext } from "@apps/pyconkr-2026/contexts/app_context";
import { useMyScheduleQuery, useToggleMyScheduleMutation } from "@apps/pyconkr-2026/features/schedule/use_my_schedule";

export type ToggleScheduleState = { kind: "add" } | { kind: "remove" } | { kind: "pending"; was: "add" | "remove" };

const VIEW = {
  add: { variant: "contained", label: { ko: "추가", en: "Add" }, Icon: EventAvailableRoundedIcon },
  remove: { variant: "outlined", label: { ko: "빼기", en: "Remove" }, Icon: EventBusyRoundedIcon },
} as const;

export const ToggleScheduleButton: FC<{ state: ToggleScheduleState; onClick?: () => void }> = ({ state, onClick }) => {
  const { language } = useAppContext();
  const isKo = language === "ko";
  const pending = state.kind === "pending";
  const view = VIEW[pending ? state.was : state.kind];

  return (
    <Button
      size="small"
      variant={view.variant}
      onClick={onClick}
      disabled={pending}
      startIcon={pending ? <CircularProgress size={16} color="inherit" /> : <view.Icon fontSize="small" />}
      sx={{ minWidth: "4.5rem", fontWeight: 700, whiteSpace: "nowrap", flexShrink: 0 }}
      children={isKo ? view.label.ko : view.label.en}
    />
  );
};

export const SessionScheduleToggleButton: FC<{ session: SessionSchema }> = ({ session }) => {
  const { language } = useAppContext();
  const navigate = useNavigate();
  const [loginDialogOpen, setLoginDialogOpen] = useState(false);
  const backendClient = useBackendClient();
  const { data: user } = useUserStatus(useShopClient());
  const eventId = session.presentation_type.event.id;
  const isAuthenticated = user?.meta.is_authenticated === true;
  const { data } = useMyScheduleQuery(backendClient, eventId, isAuthenticated);
  const mutation = useToggleMyScheduleMutation(backendClient, eventId);
  const isSaved = data?.presentation_ids.includes(session.id) ?? false;
  const action = isSaved ? "remove" : "add";
  const state: ToggleScheduleState = mutation.isPending ? { kind: "pending", was: mutation.variables?.action ?? action } : { kind: action };
  const isKo = language === "ko";

  const handleClick = () => {
    if (!isAuthenticated) {
      setLoginDialogOpen(true);
      return;
    }

    mutation.mutate(
      { presentationId: session.id, action },
      {
        onSuccess: () =>
          enqueueSnackbar(
            action === "add"
              ? isKo
                ? "내 시간표에 담았어요"
                : "Added to your schedule"
              : isKo
                ? "내 시간표에서 삭제되었습니다"
                : "Removed from your schedule",
            { variant: action === "add" ? "success" : "info" }
          ),
        onError: () =>
          enqueueSnackbar(isKo ? "문제가 발생했어요. 잠시 후 다시 시도해 주세요." : "Something went wrong. Please try again.", {
            variant: "error",
          }),
      }
    );
  };

  return (
    <>
      <ToggleScheduleButton state={state} onClick={handleClick} />
      <Dialog open={loginDialogOpen} onClose={() => setLoginDialogOpen(false)} maxWidth="xs" fullWidth>
        <DialogTitle children={isKo ? "로그인이 필요해요" : "Sign in required"} />
        <DialogContent>
          <DialogContentText
            children={isKo ? "세션을 내 시간표에 담으려면 로그인이 필요합니다." : "You need to sign in to add sessions to your schedule."}
          />
        </DialogContent>
        <DialogActions>
          <Button color="inherit" onClick={() => setLoginDialogOpen(false)} children={isKo ? "취소" : "Cancel"} />
          <Button
            variant="contained"
            onClick={() => {
              setLoginDialogOpen(false);
              navigate("/account/sign-in");
            }}
            children={isKo ? "로그인하러 가기" : "Go to sign in"}
          />
        </DialogActions>
      </Dialog>
    </>
  );
};
