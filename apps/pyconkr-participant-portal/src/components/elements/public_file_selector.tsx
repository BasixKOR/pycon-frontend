import * as Common from "@frontend/common";
import { PermMedia } from "@mui/icons-material";
import { Box, Button, CircularProgress, FormControl, InputLabel, MenuItem, Select, SelectProps, Stack, styled, useMediaQuery } from "@mui/material";
import { ErrorBoundary, Suspense } from "@suspensive/react";
import * as React from "react";

import { Fieldset } from "./fieldset";
import { useAppContext } from "../../contexts/app_context";
import { PublicFileUploadDialog } from "../dialogs/public_file_upload";

type PublicFileSelectorProps = Omit<SelectProps<string | null>, "inputRef">;

const ImageFallback: React.FC<{ language: "ko" | "en" }> = ({ language }) => (
  <Box children={language === "ko" ? "이미지가 없습니다." : "No image available."} />
);

type PublicFileSelectorState = {
  value?: string | null;
  openUploadDialog?: boolean;
};

const ScaledFallbackImage = styled(Common.Components.FallbackImage)({
  width: "100%",
  maxWidth: "20rem",
  objectFit: "contain",
});

export const PublicFileSelector: React.FC<PublicFileSelectorProps> = ErrorBoundary.with(
  { fallback: Common.Components.ErrorFallback },
  Suspense.with({ fallback: <CircularProgress /> }, ({ value, onChange, ...props }) => {
    const selectInputRef = React.useRef<HTMLSelectElement | null>(null);
    const [selectorState, setSelectorState] = React.useState<PublicFileSelectorState>({ value });
    const { language } = useAppContext();
    const participantPortalClient = Common.Hooks.BackendParticipantPortalAPI.useParticipantPortalClient();
    const { data } = Common.Hooks.BackendParticipantPortalAPI.usePublicFilesQuery(participantPortalClient);
    const isMobile = useMediaQuery((theme) => theme.breakpoints.down("md"));

    const setSelectedFile: SelectProps<string | null>["onChange"] = (event, child) => {
      setSelectorState((ps) => ({ ...ps, value: event.target.value }));
      onChange?.(event, child);
    };
    const setSelectInputValue = (value: string | null) => {
      if (selectInputRef.current) selectInputRef.current.value = value || "";

      setSelectorState((ps) => ({ ...ps, value }));
      onChange?.({ target: { value } } as React.ChangeEvent<HTMLSelectElement & HTMLInputElement>, null);
    };
    const openUploadDialog = () => setSelectorState((ps) => ({ ...ps, openUploadDialog: true }));
    const closeUploadDialog = () => setSelectorState((ps) => ({ ...ps, openUploadDialog: false }));

    const emptyValueStr = language === "ko" ? "선택 안 함" : "Not selected";
    const uploadStr = language === "ko" ? "파일 업로드" : "Upload File";
    const files = [...(props.required ? [] : [{ id: "", file: emptyValueStr, name: emptyValueStr }]), ...data];
    const selectedFile = data.find((file) => file.id === (selectorState.value || ""));

    return (
      <>
        <PublicFileUploadDialog open={!!selectorState.openUploadDialog} onClose={closeUploadDialog} setFileIdAsValue={setSelectInputValue} />
        <Fieldset legend={props.label?.toString() || ""}>
          <Stack direction="column" spacing={2} alignItems="center" justifyContent="center">
            <ScaledFallbackImage
              key={selectedFile?.file || ""}
              src={selectedFile?.file}
              alt="Selected File"
              loading="lazy"
              errorFallback={<ImageFallback language={language} />}
            />
            <Stack direction={isMobile ? "column" : "row"} spacing={2} sx={{ width: "100%" }} alignItems="center">
              <FormControl fullWidth>
                <InputLabel id="public-file-label">{props.label}</InputLabel>
                <Select labelId="public-file-label" ref={selectInputRef} value={selectorState.value || ""} onChange={setSelectedFile} {...props}>
                  {files.map((file) => (
                    <MenuItem key={file.id} value={file.id} children={file.name} />
                  ))}
                </Select>
              </FormControl>
              <Button
                variant="contained"
                size="small"
                disabled={props.disabled}
                onClick={openUploadDialog}
                startIcon={<PermMedia />}
                fullWidth={isMobile}
                children={uploadStr}
                sx={{ wordBreak: "keep-all" }}
              />
            </Stack>
          </Stack>
        </Fieldset>
      </>
    );
  })
);
