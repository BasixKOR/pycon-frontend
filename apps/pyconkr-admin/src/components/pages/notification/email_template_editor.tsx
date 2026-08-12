import {
  useBackendAdminClient,
  useCreateMutation,
  useRenderTemplateMutation,
  useRetrieveQuery,
  useUpdateMutation,
} from "@frontend/common/hooks/useAdminAPI";
import { type EmailDocument, MailEditor, type MailEditorHandle, parseEmailDocument } from "@mu-software/mail-editor";
import { Add, Close, Save, UploadFile, Visibility } from "@mui/icons-material";
import {
  Alert,
  Box,
  Button,
  Chip,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { ErrorBoundary, Suspense } from "@suspensive/react";
import { FC, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import { BackendAdminSignInGuard } from "@apps/pyconkr-admin/components/elements/admin_signin_guard";
import { ErrorFallback } from "@apps/pyconkr-admin/components/elements/error_fallback";
import { DEFAULT_INITIAL_DOCUMENT } from "@apps/pyconkr-admin/components/pages/notification/email_template_default_document";
import { addErrorSnackbar, addSnackbar } from "@apps/pyconkr-admin/utils/snackbar";

const APP = "notification";
const RESOURCE = "emailnotificationtemplate";
const MAX_RECOMMENDED_SUBJECT_LENGTH = 70;

type EmailTemplateMetaFormData = {
  code: string;
  title: string;
  description: string;
  sent_from: string;
};

type EmailTemplatePayload = EmailTemplateMetaFormData & {
  data: string;
  // 백엔드 editor_source는 TextField이므로 직렬화한 문자열로 전송합니다.
  editor_source: string;
};

type EmailTemplateSchema = EmailTemplatePayload & {
  id: string;
  created_at: string;
  created_by: string | null;
  updated_at: string;
  updated_by: string | null;
  deleted_at: string | null;
  deleted_by: string | null;
  str_repr: string;
  template_variables: string[];
};

const isValidJson = (s: string): boolean => {
  if (!s.trim()) return true;
  try {
    JSON.parse(s);
    return true;
  } catch {
    return false;
  }
};

const toInitialDocument = (source: EmailTemplateSchema["editor_source"] | undefined): EmailDocument => {
  if (!source) return DEFAULT_INITIAL_DOCUMENT;
  try {
    return parseEmailDocument(source);
  } catch {
    return DEFAULT_INITIAL_DOCUMENT;
  }
};

const InnerAdminEmailTemplateEditor: FC = ErrorBoundary.with(
  { fallback: ErrorFallback },
  Suspense.with({ fallback: <CircularProgress /> }, () => {
    const navigate = useNavigate();
    const { id } = useParams<{ id?: string }>();
    const backendAdminClient = useBackendAdminClient();
    const { data: retrievedData } = useRetrieveQuery<EmailTemplateSchema>(backendAdminClient, APP, RESOURCE, id || "");

    const [meta, setMeta] = useState<EmailTemplateMetaFormData>(() => ({
      code: retrievedData?.code ?? "",
      title: retrievedData?.title ?? "",
      description: retrievedData?.description ?? "",
      sent_from: retrievedData?.sent_from ?? "",
    }));
    const [contextJson, setContextJson] = useState("{}");
    const [importDialogOpen, setImportDialogOpen] = useState(false);
    const [importJson, setImportJson] = useState("");
    const [overwriteDialogOpen, setOverwriteDialogOpen] = useState(false);
    // MailEditor는 initialDocument가 바뀌거나 서스펜스에서 재개될 때 이 문서로 되돌아가므로,
    // 불러오기/저장 때마다 최신 문서로 갱신해야 편집 내용이 유실되지 않습니다.
    const [initialDocument, setInitialDocument] = useState<EmailDocument>(() => toInitialDocument(retrievedData?.editor_source));

    const editorRef = useRef<MailEditorHandle>(null);

    const createMutation = useCreateMutation<EmailTemplatePayload>(backendAdminClient, APP, RESOURCE);
    const updateMutation = useUpdateMutation<EmailTemplatePayload>(backendAdminClient, APP, RESOURCE, id || "");
    const renderMutation = useRenderTemplateMutation(backendAdminClient, APP, RESOURCE);

    const setField = <K extends keyof EmailTemplateMetaFormData>(key: K, value: EmailTemplateMetaFormData[K]) =>
      setMeta((p) => ({ ...p, [key]: value }));
    const onClose = () => navigate(`/${APP}/${RESOURCE}`);

    const isPending = createMutation.isPending || updateMutation.isPending;
    const jsonValid = isValidJson(contextJson);
    // editor_source 없이 data만 있는 템플릿(마이그레이션 seed 등)은 에디터가 기본 문서를 띄우므로,
    // 그대로 저장하면 기존 본문 HTML이 기본 문서로 덮어씌워집니다.
    const isEditorSourceMissing = !!id && !retrievedData?.editor_source?.trim() && !!retrievedData?.data?.trim();

    const handleSubmit = async () => {
      if (isPending) return;
      if (!editorRef.current) {
        addSnackbar("에디터가 아직 준비되지 않았습니다.", "error");
        return;
      }
      const exportedDocument = editorRef.current.exportEmailDocument();
      const subject = exportedDocument.meta.subject?.trim();
      if (!subject) {
        addSnackbar("에디터에서 메일 제목(subject)을 입력해주세요.", "error");
        return;
      }
      if (subject.length > MAX_RECOMMENDED_SUBJECT_LENGTH) {
        addSnackbar(`메일 제목이 ${subject.length}자입니다. 대부분의 메일 클라이언트에서 뒷부분이 잘립니다.`, "warning");
      }
      // data.title과 editor_source의 제목이 어긋나지 않도록 trim한 제목으로 맞춥니다.
      const emailDocument: EmailDocument = { ...exportedDocument, meta: { ...exportedDocument.meta, subject } };

      let data: string;
      try {
        // 백엔드는 data의 렌더 결과를 그대로 발송 payload로 쓰므로 {title, body} JSON object여야 합니다.
        data = JSON.stringify({ title: subject, body: await editorRef.current.exportHTML() });
      } catch (e) {
        addErrorSnackbar(e instanceof Error ? e : new Error(String(e)));
        return;
      }

      // 저장 성공 시 쿼리가 reset되며 에디터가 initialDocument로 되돌아가므로, 방금 저장한 문서로 맞춰둡니다.
      setInitialDocument(emailDocument);
      const payload: EmailTemplatePayload = { ...meta, data, editor_source: JSON.stringify(emailDocument, null, 2) };
      if (id) {
        updateMutation.mutate(payload, {
          onSuccess: () => addSnackbar("수정했습니다.", "success"),
          onError: addErrorSnackbar,
        });
      } else {
        createMutation.mutate(payload, {
          onSuccess: (created) => {
            addSnackbar("생성했습니다.", "success");
            const newId = (created as EmailTemplatePayload & { id?: string }).id;
            if (newId) navigate(`/${APP}/${RESOURCE}/${newId}`);
          },
          onError: addErrorSnackbar,
        });
      }
    };

    const handleSubmitClick = () => {
      // 제목이 비어 있으면 어차피 handleSubmit이 저장 전에 막으므로, 확인창부터 띄우지 않습니다.
      if (isEditorSourceMissing && editorRef.current?.exportEmailDocument().meta.subject?.trim()) {
        setOverwriteDialogOpen(true);
        return;
      }
      void handleSubmit();
    };

    const handleImport = () => {
      try {
        // parseEmailDocument는 검증 실패 사유를 메시지에 담아 throw합니다.
        setInitialDocument(parseEmailDocument(importJson));
        setImportJson("");
        setImportDialogOpen(false);
        addSnackbar("JSON을 불러왔습니다. 저장해야 반영됩니다.", "success");
      } catch (e) {
        addErrorSnackbar(e instanceof Error ? e : new Error(String(e)));
      }
    };

    const handlePreview = () => {
      if (!id || renderMutation.isPending || !jsonValid) return;
      const context = contextJson.trim() ? JSON.parse(contextJson) : {};
      renderMutation.mutate({ id, context });
    };

    const title = `${APP.toUpperCase()} > ${RESOURCE.toUpperCase()} > ${id ? "편집: " + id : "새 객체 추가"}`;

    return (
      <Box sx={{ flexGrow: 1, width: "100%", minHeight: "100%" }}>
        <Stack direction="row" justifyContent="space-between">
          <Typography variant="h5">{title}</Typography>
          <IconButton onClick={onClose} children={<Close />} />
        </Stack>
        <Stack spacing={2} sx={{ my: 2 }}>
          <TextField label="code" value={meta.code} onChange={(e) => setField("code", e.target.value)} fullWidth />
          <TextField label="title" value={meta.title} onChange={(e) => setField("title", e.target.value)} fullWidth />
          <TextField
            label="description"
            value={meta.description}
            onChange={(e) => setField("description", e.target.value)}
            multiline
            minRows={2}
            fullWidth
          />
          <TextField
            label="sent_from"
            value={meta.sent_from}
            onChange={(e) => setField("sent_from", e.target.value)}
            helperText="발신 이메일 주소"
            fullWidth
          />

          {isEditorSourceMissing && (
            <Alert severity="warning">
              이 템플릿에는 에디터 원본(editor_source)이 없어, 아래 에디터에는 저장된 본문이 아니라 기본 문서가 표시되고 있습니다. 이대로 저장하면
              기존 본문(data)이 에디터 내용으로 덮어씌워집니다. 기존 본문을 유지하려면 저장하지 마시고, 새로 만드시려면 저장 시 확인창에서
              진행해주세요.
            </Alert>
          )}

          <Box>
            <Stack direction="row" sx={{ justifyContent: "space-between", alignItems: "center", mb: 1 }}>
              <Typography variant="subtitle1">본문 에디터</Typography>
              <Button size="small" variant="outlined" startIcon={<UploadFile />} onClick={() => setImportDialogOpen(true)}>
                JSON으로 불러오기
              </Button>
            </Stack>
            <Typography variant="caption" color="text.secondary" sx={{ display: "block", mb: 1 }}>
              변수는 {"{{ name }}"} 형식으로 사용합니다. 저장 시 EmailDocument JSON은 editor_source에, 에디터의 메일 제목과 렌더된 HTML은 data 필드에{" "}
              {'{"title": ..., "body": ...}'} 형태로 기록됩니다.
            </Typography>
            <Box sx={{ height: 800, border: "1px solid", borderColor: "divider", borderRadius: 1, overflow: "hidden" }}>
              <MailEditor ref={editorRef} initialDocument={initialDocument} />
            </Box>
          </Box>

          {retrievedData && retrievedData.template_variables.length > 0 && (
            <Box>
              <Typography variant="subtitle2" sx={{ mb: 1 }}>
                템플릿 변수
              </Typography>
              <Stack direction="row" spacing={1} useFlexGap flexWrap="wrap">
                {retrievedData.template_variables.map((v) => (
                  <Chip key={v} label={v} size="small" />
                ))}
              </Stack>
            </Box>
          )}

          {id && (
            <Box>
              <Typography variant="subtitle1" sx={{ mb: 1 }}>
                미리보기
              </Typography>
              <Stack spacing={2}>
                <TextField
                  label="context (JSON)"
                  value={contextJson}
                  onChange={(e) => setContextJson(e.target.value)}
                  error={!jsonValid}
                  helperText={jsonValid ? '예: {"name": "홍길동"}' : "유효한 JSON이 아닙니다."}
                  multiline
                  minRows={3}
                  fullWidth
                />
                <Button variant="outlined" startIcon={<Visibility />} onClick={handlePreview} disabled={renderMutation.isPending || !jsonValid}>
                  미리보기 갱신
                </Button>
                {renderMutation.isPending ? (
                  <CircularProgress size={20} />
                ) : renderMutation.error ? (
                  <Typography color="error">미리보기를 불러오지 못했습니다.</Typography>
                ) : renderMutation.data ? (
                  <iframe
                    srcDoc={renderMutation.data}
                    style={{ width: "100%", height: 500, border: "1px solid #ccc", borderRadius: 4 }}
                    title="이메일 템플릿 미리보기"
                  />
                ) : (
                  <Typography variant="body2" color="text.secondary">
                    미리보기 갱신 버튼을 눌러주세요. 최신 본문을 미리보려면 먼저 저장해주세요.
                  </Typography>
                )}
              </Stack>
            </Box>
          )}
        </Stack>
        <Stack direction="row" spacing={2} sx={{ justifyContent: "flex-end" }}>
          <Button variant="contained" color="primary" onClick={handleSubmitClick} disabled={isPending} startIcon={id ? <Save /> : <Add />}>
            {id ? "수정" : "새 객체 추가"}
          </Button>
        </Stack>

        <Dialog open={overwriteDialogOpen} onClose={() => setOverwriteDialogOpen(false)} maxWidth="sm">
          <DialogTitle>기존 본문을 덮어쓸까요?</DialogTitle>
          <DialogContent>
            <Typography variant="body2">
              이 템플릿에는 에디터 원본(editor_source)이 없어 에디터에 기본 문서가 표시되고 있습니다. 저장하면 기존 본문(data)이 지금 에디터에 있는
              내용으로 대체되며, 되돌릴 수 없습니다.
            </Typography>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setOverwriteDialogOpen(false)}>취소</Button>
            <Button
              variant="contained"
              color="warning"
              onClick={() => {
                setOverwriteDialogOpen(false);
                void handleSubmit();
              }}
            >
              덮어쓰고 저장
            </Button>
          </DialogActions>
        </Dialog>

        <Dialog open={importDialogOpen} onClose={() => setImportDialogOpen(false)} fullWidth maxWidth="md">
          <DialogTitle>JSON으로 불러오기</DialogTitle>
          <DialogContent>
            <Stack spacing={2} sx={{ pt: 1 }}>
              <Typography variant="caption" color="text.secondary">
                EmailDocument JSON(에디터 하단 JSON 탭의 내용과 같은 형식)을 붙여넣어 본문을 통째로 교체합니다. 편집 중이던 내용은 사라지며, 저장해야
                서버에 반영됩니다.
              </Typography>
              <TextField
                label="EmailDocument JSON"
                value={importJson}
                onChange={(e) => setImportJson(e.target.value)}
                placeholder='{"version": 1, "meta": {}, "styles": {}, "rows": [], "sampleValues": {}}'
                multiline
                minRows={12}
                maxRows={24}
                fullWidth
                slotProps={{ input: { sx: { fontFamily: "monospace", fontSize: 12 } } }}
              />
            </Stack>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setImportDialogOpen(false)}>취소</Button>
            <Button variant="contained" startIcon={<UploadFile />} onClick={handleImport} disabled={!importJson.trim()}>
              불러오기
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    );
  })
);

export const AdminEmailTemplateEditor: FC = () => (
  <BackendAdminSignInGuard>
    <InnerAdminEmailTemplateEditor />
  </BackendAdminSignInGuard>
);
