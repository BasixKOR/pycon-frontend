import * as Common from "@frontend/common";
import { CloudUpload, PermMedia } from "@mui/icons-material";
import { Box, Button, Input, Stack, Typography } from "@mui/material";
import * as React from "react";
import { useNavigate } from "react-router-dom";

import { addErrorSnackbar, addSnackbar } from "../../../utils/snackbar";
import { BackendAdminSignInGuard } from "../../elements/admin_signin_guard";

type PublicFileUploadPageStateType = {
  isMouseOnDragBox: boolean;
  _forceRerender: number;
};

const ignoreEvent = (e: React.BaseSyntheticEvent | Event) => {
  e.preventDefault();
  e.stopPropagation();
};

const InnerPublicFileUploadPage: React.FC = () => {
  const navigate = useNavigate();
  const [state, setState] = React.useState<PublicFileUploadPageStateType>({
    isMouseOnDragBox: false,
    _forceRerender: 0, // 강제 리렌더링을 위한 상태
  });
  const fileInputRef = React.useRef<HTMLInputElement>(null);
  const fileDragBoxRef = React.useRef<HTMLDivElement>(null);
  const backendAdminClient = Common.Hooks.BackendAdminAPI.useBackendAdminClient();
  const uploadPublicFileMutation = Common.Hooks.BackendAdminAPI.useUploadPublicFileMutation(backendAdminClient);

  const forceRerender = React.useCallback(
    () =>
      setState((prev) => {
        let newValue = Math.random();
        while (prev._forceRerender === newValue)
          // 중복된 값 방지
          newValue = Math.random();

        return { ...prev, _forceRerender: newValue };
      }),
    []
  );

  const onFileSelectButtonClick: React.MouseEventHandler = (event) => {
    ignoreEvent(event);
    if (fileInputRef.current) {
      fileInputRef.current.click();
    } else {
      addSnackbar("파일 선택 버튼을 찾을 수 없습니다.", "error");
    }
  };

  const onDragEnter = (e: React.DragEvent<HTMLDivElement>) => {
    ignoreEvent(e);
    setState((prev) => ({ ...prev, isMouseOnDragBox: true }));
  };
  const onDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    // onDragLeave 이벤트는 자식 요소에 마우스가 들어갈 때도 발생합니다.
    // 따라서, 드래그 박스에 마우스가 있는지 확인하기 위해 마우스 위치를 확인하여 실제 onDragLeave 이벤트가 트리거되어야 하는지 확인합니다.
    // (e.relatedTarget는 Safari에서 지원되지 않아 사용할 수 없습니다.)
    ignoreEvent(e);
    if (!fileDragBoxRef.current) return;

    const x = e.clientX,
      y = e.clientY,
      currentHoveredElement = document.elementFromPoint(x, y);
    if (!fileDragBoxRef.current.contains(currentHoveredElement) || (x === 0 && y === 0))
      setState((prev) => ({ ...prev, isMouseOnDragBox: false }));
  };

  const handleFile = React.useCallback(
    (file: File) => {
      if (!file || file.size === 0) {
        addSnackbar("파일을 찾을 수 없거나, 파일 크기가 0입니다.", "error");
        return;
      } else if (!(file.type.startsWith("image/") || file.type === "application/json")) {
        addSnackbar("이미지 또는 JSON 파일만 업로드가 가능합니다.", "error");
        return;
      }

      const fileReader = new FileReader();
      fileReader.onload = (event) => {
        if (fileInputRef.current && event.target?.result) {
          addSnackbar(`파일 ${file.name} 선택 완료`, "info");

          const list = new DataTransfer();
          list.items.add(file);
          fileInputRef.current.files = list.files;
          forceRerender();
        } else {
          addSnackbar("파일을 읽는 중 오류가 발생했습니다.", "error");
          console.error("파일 읽기 오류:", event);
        }
      };
      fileReader.onerror = (error) => {
        addSnackbar(`파일 읽기 중 오류가 발생했습니다: ${error}`, "error");
        console.error("파일 읽기 중 오류 발생:", error);
      };
      fileReader.readAsDataURL(file);
    },
    [forceRerender]
  );

  const onClipboardPaste = React.useCallback(
    (event: DocumentEventMap["paste"]) => {
      ignoreEvent(event);
      setState((prev) => ({ ...prev, isMouseOnDragBox: false }));

      const items = event.clipboardData?.items;
      if (!items || items.length === 0) {
        addSnackbar("클립보드에 파일이 없습니다. 파일을 선택해주세요.", "error");
        return;
      }

      if (items instanceof DataTransferItemList) {
        for (let i = 0; i < items.length; i++) {
          if (items[i].kind === "file") {
            const file = items[i].getAsFile();
            if (!file || !file.size || !(file.type.startsWith("image/") || file.type === "application/json")) continue;

            handleFile(file);
            return;
          }
        }
        addSnackbar("클립보드에 이미지 또는 JSON 파일이 없습니다. 이미지 또는 JSON 파일을 선택해주세요.", "error");
      }
    },
    [handleFile]
  );

  const onDrop: React.DragEventHandler<HTMLDivElement> = (event) => {
    ignoreEvent(event);
    setState((prev) => ({ ...prev, isMouseOnDragBox: false }));

    const items = event.dataTransfer.files;
    if (!items || items.length === 0) {
      addSnackbar("파일이 없습니다. 파일을 선택해주세요.", "error");
      return;
    }

    handleFile(items[0]);
  };

  const onSubmit = () => {
    if (!fileInputRef.current?.files?.length) {
      addSnackbar("파일을 선택해주세요.", "error");
      return;
    }

    uploadPublicFileMutation.mutate(fileInputRef.current.files[0], {
      onSuccess: (data) => {
        addSnackbar("파일 업로드 성공", "success");
        navigate(`/file/publicfile/${data.id}`);
      },
      onError: (error) => addErrorSnackbar(error),
    });
  };

  React.useEffect(() => {
    document.addEventListener("paste", onClipboardPaste);
    return () => document.removeEventListener("paste", onClipboardPaste);
  }, [onClipboardPaste, state.isMouseOnDragBox]);

  const selectedFile = (fileInputRef.current?.files?.length && fileInputRef.current.files[0]) || null;

  return (
    <Stack spacing={2} sx={{ flexGrow: 1, width: "100%", minHeight: "100%" }}>
      <Typography variant="h5" gutterBottom>
        File &gt; PublicFile &gt; 새 파일 업로드
      </Typography>
      <Input inputRef={fileInputRef} type="file" name="file" sx={{ display: "none" }} />
      <Button variant="outlined" onClick={onFileSelectButtonClick} startIcon={<PermMedia />}>
        파일 선택
      </Button>
      <Box
        ref={fileDragBoxRef}
        onDragOver={ignoreEvent}
        onDragEnter={onDragEnter}
        onDragLeave={onDragLeave}
        onDrop={onDrop}
        sx={{
          width: "100%",
          height: "100%",
          p: 2,
          flexGrow: 1,
          border: "2px dashed #ccc",
          borderRadius: "8px",
          backgroundColor: state.isMouseOnDragBox ? "#f0f0f0" : "#fff",
          transition: "background-color 0.3s ease-in-out",
        }}
      >
        위의 버튼을 눌러 사진을 선택하거나,
        <br />
        이 상자에 직접 파일을 드래그 앤 드롭하여 업로드하거나,
        <br />
        또는 <kbd>Ctrl</kbd>+<kbd>V</kbd>로 사진을 붙여넣어 주세요!
        <br />
        <ul>
          <li>이미지와 JSON 파일만 업로드가 가능합니다.</li>
          <li>업로드 후에는 파일을 수정할 수 없습니다.</li>
          <li>파일은 공개적으로 접근 가능한 URL로 제공됩니다.</li>
        </ul>
        현재 선택된 파일 : {(selectedFile && selectedFile.name) || "없음"}
      </Box>
      <Button
        variant="contained"
        onClick={onSubmit}
        disabled={!selectedFile || uploadPublicFileMutation.isPending}
        startIcon={<CloudUpload />}
      >
        업로드
      </Button>
    </Stack>
  );
};

export const PublicFileUploadPage: React.FC = () => (
  <BackendAdminSignInGuard>
    <InnerPublicFileUploadPage />
  </BackendAdminSignInGuard>
);
