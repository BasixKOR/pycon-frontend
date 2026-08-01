import { extractOrderImportRowErrors, OrderImportRowError } from "@frontend/common/apis/admin_api";
import { useBackendAdminClient, useImportOrdersMutation, useOrderImportTemplateMutation } from "@frontend/common/hooks/useAdminAPI";
import { parseCsvFile, ParsedCsv, triggerBlobDownload } from "@frontend/common/utils";
import { Description, FileDownload, FileUpload } from "@mui/icons-material";
import {
  Alert,
  alpha,
  Box,
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import { ErrorBoundary, Suspense } from "@suspensive/react";
import { DragEvent, FC, useMemo, useRef, useState } from "react";

import { ChoicePicker } from "@apps/pyconkr-admin/components/elements/choice_picker";
import { ErrorFallback } from "@apps/pyconkr-admin/components/elements/error_fallback";
import { addErrorSnackbar, addSnackbar } from "@apps/pyconkr-admin/utils/snackbar";

const csvBlob = (csv: string) => new Blob([csv], { type: "text/csv;charset=utf-8" });

const MAX_PREVIEW_ROWS = 50;

const ImportDialogBody: FC<{ onClose: () => void }> = ErrorBoundary.with({ fallback: ErrorFallback }, ({ onClose }) => {
  const client = useBackendAdminClient();
  const templateMutation = useOrderImportTemplateMutation(client);
  const importMutation = useImportOrdersMutation(client);

  const [productId, setProductId] = useState<string | number | null | undefined>(null);
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<ParsedCsv | null>(null);
  const [rowErrors, setRowErrors] = useState<OrderImportRowError[] | null>(null);
  const [onlyErrorRows, setOnlyErrorRows] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  // 서버가 되돌려준 실패 사유를 미리보기 행에 붙이기 위한 색인.
  const messagesByRow = useMemo(() => new Map(rowErrors?.map(({ row, messages }) => [row, messages])), [rowErrors]);

  // 미리보기 행에 1-based 번호를 붙이고, 오류만 보기 토글을 적용.
  const previewRows = useMemo(() => {
    const numbered = (preview?.rows ?? []).map((cells, index) => ({ row: index + 1, cells }));
    return onlyErrorRows ? numbered.filter(({ row }) => messagesByRow.has(row)) : numbered;
  }, [preview, onlyErrorRows, messagesByRow]);

  // 미리보기가 서버보다 행을 적게 인식한 경우(파서 차이) 사유가 통째로 사라지지 않도록 따로 모은다.
  const orphanErrors = useMemo(() => (rowErrors ?? []).filter(({ row }) => row > (preview?.rows.length ?? 0)), [rowErrors, preview]);

  const pickFile = async (f: File | null | undefined) => {
    if (!f) return;
    if (f.size === 0) {
      addSnackbar("선택한 파일의 크기가 0입니다.", "error");
      return;
    }
    setRowErrors(null);
    setOnlyErrorRows(false);
    setPreview(null);
    setFile(null);
    try {
      // 읽는 데 실패한 파일은 서버도 거부하므로 선택 자체를 취소한다.
      const parsed = await parseCsvFile(f);
      setFile(f);
      setPreview(parsed);
    } catch (error) {
      addSnackbar(error instanceof Error ? error.message : "CSV 파일을 읽을 수 없습니다.", "error");
    }
  };

  const onDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setDragOver(false);
    pickFile(e.dataTransfer.files?.[0]);
  };

  const handleDownloadTemplate = () => {
    if (productId == null || productId === "") return;
    templateMutation.mutate(String(productId), {
      onSuccess: (csv) => triggerBlobDownload(csvBlob(csv), "order_import_template.csv"),
      onError: addErrorSnackbar,
    });
  };

  const handleImport = () => {
    if (!file) return;
    // 재시도 시 오류 필터가 남아 있으면 표가 빈 채로 보이므로 함께 되돌린다.
    setRowErrors(null);
    setOnlyErrorRows(false);
    importMutation.mutate(file, {
      onSuccess: () => {
        addSnackbar("주문 가져오기를 완료했습니다.", "success");
        onClose();
      },
      onError: (error) => {
        // 행별 검증 실패는 미리보기에 붙여 보여주고, 그 외(권한·파싱 실패 등)는 기존 에러 스낵바로 처리한다.
        const errors = extractOrderImportRowErrors(error);
        if (!errors) {
          addErrorSnackbar(error);
          return;
        }
        setRowErrors(errors);
        setOnlyErrorRows(true); // 실패 행이 표시 상한 밖에 있어도 바로 보이도록.
      },
    });
  };

  return (
    <>
      <DialogContent dividers>
        <Stack spacing={2} sx={{ pt: 1 }}>
          <Alert severity="info" sx={{ py: 0.5 }}>
            <Typography variant="body2">
              가져온 행은 <b>결제 완료 상태의 주문으로 즉시 생성</b>되며, 실제 결제는 발생하지 않습니다.
              <br />
              가입되지 않은 이메일은 계정이 함께 만들어지며, 중복된 계정은 나중에 사용자 &gt; 계정 병합에서 정리할 수 있습니다.
            </Typography>
          </Alert>

          <Box>
            <Typography variant="subtitle2" gutterBottom>
              1. 상품을 골라 템플릿 받기
            </Typography>
            <Typography variant="caption" color="text.secondary" component="p" sx={{ mb: 1 }}>
              상품마다 옵션 그룹이 달라 템플릿 헤더가 달라집니다. 여러 상품을 한 번에 올리려면 헤더가 같은 상품끼리만 한 파일에 담아주세요.
            </Typography>
            <Stack spacing={1}>
              <Suspense fallback={<CircularProgress size={20} />}>
                <ChoicePicker label="템플릿 기준 상품" source={{ app: "shop", resource: "product" }} value={productId} onChange={setProductId} />
              </Suspense>
              <Button
                variant="outlined"
                size="small"
                startIcon={<FileDownload />}
                onClick={handleDownloadTemplate}
                disabled={productId == null || productId === "" || templateMutation.isPending}
                sx={{ alignSelf: "flex-start" }}
              >
                {templateMutation.isPending ? "받는 중…" : "CSV 템플릿 다운로드"}
              </Button>
            </Stack>
          </Box>

          <Divider />

          <Box>
            <Typography variant="subtitle2" gutterBottom>
              2. 채운 CSV 올리기
            </Typography>
            <input
              ref={inputRef}
              type="file"
              accept=".csv,text/csv"
              hidden
              onChange={(e) => {
                pickFile(e.target.files?.[0]);
                e.target.value = ""; // 같은 파일 재선택 허용
              }}
            />
            <Stack
              onClick={() => inputRef.current?.click()}
              onDragOver={(e) => {
                e.preventDefault();
                setDragOver(true);
              }}
              onDragLeave={() => setDragOver(false)}
              onDrop={onDrop}
              alignItems="center"
              justifyContent="center"
              sx={{
                textAlign: "center",
                py: 3,
                px: 2,
                border: "2px dashed",
                borderColor: dragOver ? "primary.main" : "divider",
                borderRadius: 1,
                bgcolor: dragOver ? "action.selected" : "action.hover",
                cursor: "pointer",
                transition: "background-color 0.2s, border-color 0.2s",
                "&:hover": { bgcolor: "action.selected" },
              }}
            >
              <Description sx={{ fontSize: 36, color: "text.secondary", mb: 1 }} />
              <Typography variant="body2" color="text.secondary">
                클릭해서 CSV 를 선택하거나 이 영역에 끌어다 놓으세요.
              </Typography>
              {file && (
                <Typography variant="body2" sx={{ mt: 1 }}>
                  선택된 파일: <b>{file.name}</b>
                </Typography>
              )}
            </Stack>
          </Box>

          {preview && (
            <Box>
              <Typography variant="subtitle2" gutterBottom>
                3. 가져올 내용 확인
              </Typography>
              {preview.rows.length === 0 ? (
                <Alert severity="warning" sx={{ py: 0.5 }}>
                  <Typography variant="body2">헤더만 있고 데이터 행이 없습니다. 내용을 채운 뒤 다시 올려주세요.</Typography>
                </Alert>
              ) : (
                <>
                  {rowErrors && (
                    <Alert
                      severity="error"
                      sx={{ py: 0.5, mb: 1 }}
                      action={
                        <Button color="inherit" size="small" onClick={() => setOnlyErrorRows((v) => !v)}>
                          {onlyErrorRows ? "전체 행 보기" : "오류 행만 보기"}
                        </Button>
                      }
                    >
                      <Typography variant="body2">
                        {rowErrors.length}개 행에서 오류가 발생했습니다. <b>아무 주문도 생성되지 않았습니다</b> — 파일을 고쳐 다시 올려주세요.
                      </Typography>
                      {orphanErrors.map(({ row, messages }) => (
                        <Typography key={row} variant="body2" sx={{ wordBreak: "break-all" }}>
                          {row}행: {messages.join(" / ")}
                        </Typography>
                      ))}
                    </Alert>
                  )}
                  <Typography variant="caption" color="text.secondary" component="p" sx={{ mb: 1 }}>
                    {onlyErrorRows ? `오류 ${previewRows.length}개 행` : `총 ${preview.rows.length}개 행`}
                    {previewRows.length > MAX_PREVIEW_ROWS && ` 중 상위 ${MAX_PREVIEW_ROWS}행`} · 파일을 읽은 그대로 표시하며, 실제 검증은 가져오기 시
                    서버가 수행합니다.
                  </Typography>
                  <TableContainer sx={{ maxHeight: 320, border: 1, borderColor: "divider", borderRadius: 1 }}>
                    <Table stickyHeader size="small">
                      <TableHead>
                        <TableRow>
                          <TableCell sx={{ width: 56 }}>행</TableCell>
                          {rowErrors && <TableCell sx={{ minWidth: 200 }}>오류</TableCell>}
                          {preview.header.map((column, i) => (
                            <TableCell key={i} sx={{ whiteSpace: "nowrap" }}>
                              {column}
                            </TableCell>
                          ))}
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {previewRows.slice(0, MAX_PREVIEW_ROWS).map(({ row, cells }) => {
                          const messages = messagesByRow.get(row);
                          return (
                            <TableRow key={row} hover sx={messages ? { bgcolor: (theme) => alpha(theme.palette.error.main, 0.12) } : undefined}>
                              <TableCell>{row}</TableCell>
                              {rowErrors && (
                                <TableCell>
                                  {messages?.map((message, i) => (
                                    <Typography key={i} variant="body2" color="error" sx={{ wordBreak: "break-all" }}>
                                      {message}
                                    </Typography>
                                  ))}
                                </TableCell>
                              )}
                              {preview.header.map((_, column) => (
                                <TableCell key={column} sx={{ whiteSpace: "nowrap" }}>
                                  {cells[column] ?? ""}
                                </TableCell>
                              ))}
                            </TableRow>
                          );
                        })}
                      </TableBody>
                    </Table>
                  </TableContainer>
                </>
              )}
            </Box>
          )}
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="inherit">
          취소
        </Button>
        <Button
          variant="contained"
          startIcon={<FileUpload />}
          onClick={handleImport}
          disabled={!file || preview?.rows.length === 0 || importMutation.isPending}
        >
          {importMutation.isPending ? "가져오는 중…" : `가져오기${preview?.rows.length ? ` (${preview.rows.length}건)` : ""}`}
        </Button>
      </DialogActions>
    </>
  );
});

export const OrderImportDialog: FC<{ open: boolean; onClose: () => void }> = ({ open, onClose }) => (
  <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
    <DialogTitle>CSV로 주문 가져오기</DialogTitle>
    <ImportDialogBody onClose={onClose} />
  </Dialog>
);
