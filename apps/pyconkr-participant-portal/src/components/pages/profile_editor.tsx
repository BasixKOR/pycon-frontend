import * as Common from "@frontend/common";
import { Key, SendAndArchive } from "@mui/icons-material";
import { Button, SelectChangeEvent, Stack } from "@mui/material";
import { ErrorBoundary, Suspense } from "@suspensive/react";
import { enqueueSnackbar, OptionsObject } from "notistack";
import * as React from "react";

import { useAppContext } from "../../contexts/app_context";
import { ChangePasswordDialog } from "../dialogs/change_password";
import { SubmitConfirmDialog } from "../dialogs/submit_confirm";
import { ErrorPage } from "../elements/error_page";
import { LoadingPage } from "../elements/loading_page";
import { MultiLanguageField } from "../elements/multilang_field";
import { PublicFileSelector } from "../elements/public_file_selector";
import { CurrentlyModAuditInProgress } from "../elements/requested_modification_audit_available_header";
import { SignInGuard } from "../elements/signin_guard";
import { PrimaryTitle } from "../elements/titles";
import { Page } from "../page";

type ProfileType = {
  email: string;
  nickname_ko: string | null;
  nickname_en: string | null;
  image: string | null;
};

type ProfileEditorState = ProfileType & {
  openChangePasswordDialog: boolean;
  openSubmitConfirmDialog: boolean;
};

const DummyProfile: ProfileType = {
  email: "",
  nickname_ko: "",
  nickname_en: "",
  image: null,
};

const InnerProfileEditor: React.FC = () => {
  const { language } = useAppContext();
  const participantPortalClient = Common.Hooks.BackendParticipantPortalAPI.useParticipantPortalClient();
  const { data: profile } = Common.Hooks.BackendParticipantPortalAPI.useSignedInUserQuery(participantPortalClient);
  const updateMeMutation = Common.Hooks.BackendParticipantPortalAPI.useUpdateMeMutation(participantPortalClient);
  const [editorState, setEditorState] = React.useState<ProfileEditorState>({
    openChangePasswordDialog: false,
    openSubmitConfirmDialog: false,
    ...(profile || DummyProfile),
  });

  const titleStr = language === "ko" ? "프로필 정보 수정" : "Edit Profile Information";
  const submitStr = language === "ko" ? "제출" : "Submit";
  const speakerImageStr = language === "ko" ? "프로필 이미지" : "Profile Image";
  const changePasswordStr = language === "ko" ? "비밀번호 변경" : "Change Password";
  const submitSucceedStr =
    language === "ko"
      ? "프로필 정보 수정을 요청했어요. 검토 후 반영될 예정이에요."
      : "Profile information update requested. It will be applied after review.";

  const openSubmitConfirmDialog = () => setEditorState((ps) => ({ ...ps, openSubmitConfirmDialog: true }));
  const closeSubmitConfirmDialog = () => setEditorState((ps) => ({ ...ps, openSubmitConfirmDialog: false }));

  const openChangePasswordDialog = () => setEditorState((ps) => ({ ...ps, openChangePasswordDialog: true }));
  const closeChangePasswordDialog = () => setEditorState((ps) => ({ ...ps, openChangePasswordDialog: false }));

  const addSnackbar = (c: string | React.ReactNode, variant: OptionsObject["variant"]) =>
    enqueueSnackbar(c, { variant, anchorOrigin: { vertical: "bottom", horizontal: "center" } });

  const setImageId = (image: string | null) => setEditorState((ps) => ({ ...ps, image }));
  const onImageSelectChange = (e: SelectChangeEvent<string | null>) => setImageId(e.target.value);
  const setNickname = (value: string | undefined, lang: "ko" | "en") => setEditorState((ps) => ({ ...ps, [`nickname_${lang}`]: value }));

  const updateMe = () => {
    const { nickname_ko, nickname_en, image } = editorState;
    updateMeMutation.mutate(
      {
        nickname_ko: nickname_ko || null,
        nickname_en: nickname_en || null,
        image: image || null,
      },
      {
        onSuccess: () => {
          addSnackbar(submitSucceedStr, "success");
          closeSubmitConfirmDialog();
        },
        onError: (error) => {
          console.error("Updating profile failed:", error);

          let errorMessage = error instanceof Error ? error.message : "An unknown error occurred.";
          if (error instanceof Common.BackendAPIs.BackendAPIClientError) errorMessage = error.message;

          addSnackbar(errorMessage, "error");
        },
      }
    );
  };

  const modificationAuditId = profile?.requested_modification_audit_id || "";
  const formDisabled = profile?.has_requested_modification_audit || updateMeMutation.isPending;

  return (
    <>
      <ChangePasswordDialog open={editorState.openChangePasswordDialog} onClose={closeChangePasswordDialog} />
      <SubmitConfirmDialog open={editorState.openSubmitConfirmDialog} onClose={closeSubmitConfirmDialog} onSubmit={updateMe} />
      <Page>
        {profile?.has_requested_modification_audit && <CurrentlyModAuditInProgress language={language} modificationAuditId={modificationAuditId} />}
        <PrimaryTitle variant="h4" children={titleStr} />
        <Stack spacing={2} sx={{ width: "100%", flexGrow: 1 }}>
          <PublicFileSelector label={speakerImageStr} value={editorState.image} onChange={onImageSelectChange} />
          <MultiLanguageField
            label={{ ko: "닉네임", en: "Nickname" }}
            value={{
              ko: editorState.nickname_ko || "",
              en: editorState.nickname_en || "",
            }}
            disabled={formDisabled}
            onChange={setNickname}
            description={{
              ko: "닉네임은 발표자 소개에 사용됩니다. 청중이 기억하기 쉬운 이름을 입력해주세요.",
              en: "The nickname will be used in the speaker biography. Please enter a name that is easy for the audience to remember.",
            }}
            name="nickname"
            fullWidth
          />
          <Stack direction="row" spacing={2} sx={{ width: "100%" }}>
            <Button
              variant="contained"
              fullWidth
              startIcon={<Key />}
              color="error"
              onClick={openChangePasswordDialog}
              children={changePasswordStr}
              disabled={formDisabled}
            />
            <Button
              variant="contained"
              fullWidth
              startIcon={<SendAndArchive />}
              onClick={openSubmitConfirmDialog}
              children={submitStr}
              disabled={formDisabled}
            />
          </Stack>
        </Stack>
      </Page>
    </>
  );
};

export const ProfileEditor: React.FC = ErrorBoundary.with(
  { fallback: ErrorPage },
  Suspense.with({ fallback: <LoadingPage /> }, () => <SignInGuard children={<InnerProfileEditor />} />)
);

type ProfileEditorFormProps = {
  disabled?: boolean;
  showSubmitButton?: boolean;
  onSubmit?: (profile: ProfileType) => void;
  language: "ko" | "en";
  defaultValue: ProfileType;
};

// TODO: FIXME: 언젠간 위의 ProfileEditor를 아래 ProfileEditorForm에 마이그레이션해야 함
export const ProfileEditorForm: React.FC<ProfileEditorFormProps> = ({ disabled, language, defaultValue, showSubmitButton, onSubmit }) => {
  const [formState, setFormState] = React.useState<ProfileType>(defaultValue);
  const setImageId = (image: string | null) => setFormState((ps) => ({ ...ps, image }));
  const onImageSelectChange = (e: SelectChangeEvent<string | null>) => setImageId(e.target.value);
  const setNickname = (value: string | undefined, lang: "ko" | "en") => setFormState((ps) => ({ ...ps, [`nickname_${lang}`]: value }));

  const onSubmitClick = () => onSubmit?.(formState);

  const titleStr = language === "ko" ? "프로필 정보 수정" : "Edit Profile Information";
  const submitStr = language === "ko" ? "제출" : "Submit";
  const speakerImageStr = language === "ko" ? "프로필 이미지" : "Profile Image";

  return (
    <>
      <PrimaryTitle variant="h4" children={titleStr} />
      <Stack spacing={2} sx={{ width: "100%", flexGrow: 1 }}>
        <PublicFileSelector label={speakerImageStr} value={formState.image} onChange={onImageSelectChange} />
        <MultiLanguageField
          label={{ ko: "닉네임", en: "Nickname" }}
          value={{
            ko: formState.nickname_ko || "",
            en: formState.nickname_en || "",
          }}
          disabled={disabled}
          onChange={setNickname}
          description={{
            ko: "닉네임은 발표자 소개에 사용됩니다. 청중이 기억하기 쉬운 이름을 입력해주세요.",
            en: "The nickname will be used in the speaker biography. Please enter a name that is easy for the audience to remember.",
          }}
          name="nickname"
          fullWidth
        />
        {showSubmitButton && (
          <Button variant="contained" fullWidth startIcon={<SendAndArchive />} onClick={onSubmitClick} children={submitStr} disabled={disabled} />
        )}
      </Stack>
    </>
  );
};
