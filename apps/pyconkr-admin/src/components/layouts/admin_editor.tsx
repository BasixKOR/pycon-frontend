import * as Common from "@frontend/common";
import { Add, Close, Delete, Edit } from "@mui/icons-material";
import {
  Box,
  Button,
  ButtonProps,
  Chip,
  CircularProgress,
  FormControl,
  IconButton,
  InputLabel,
  MenuItem,
  OutlinedSelectProps,
  Select,
  Stack,
  styled,
  Tab,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Tabs,
  Typography,
} from "@mui/material";
import Form, { IChangeEvent } from "@rjsf/core";
import MuiForm from "@rjsf/mui";
import { Field, FieldProps, RJSFSchema, UiSchema } from "@rjsf/utils";
import { customizeValidator } from "@rjsf/validator-ajv8";
import { ErrorBoundary, Suspense } from "@suspensive/react";
import AjvDraft04 from "ajv-draft-04";
import { JSONSchema7 } from "json-schema";
import * as React from "react";
import { useNavigate, useParams } from "react-router-dom";
import * as R from "remeda";

import { addErrorSnackbar, addSnackbar } from "../../utils/snackbar";
import { BackendAdminSignInGuard } from "../elements/admin_signin_guard";

type EditorFormDataEventType = IChangeEvent<Record<string, string>, RJSFSchema, { [k in string]: unknown }>;
type onSubmitType = (data: Record<string, string>, event: React.FormEvent<unknown>) => void;

type AppResourceType = { app: string; resource: string };
type AppResourceIdType = AppResourceType & { id?: string };
type AdminEditorPropsType = React.PropsWithChildren<{
  hidingFields?: string[];
  context?: Record<string, string>;
  onClose?: () => void;
  beforeSubmit?: onSubmitType;
  afterSubmit?: onSubmitType;
  notModifiable?: boolean;
  notDeletable?: boolean;
  extraActions?: ButtonProps[];
}>;

const processFile = (event: React.ChangeEvent<HTMLInputElement>) => {
  if (!event.target.files || event.target.files.length === 0) return Promise.resolve("");

  const f = event.target.files[0];
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onload = (event) => resolve(event.target ? event.target.result : "");
    reader.readAsDataURL(f);
  });
};

const FileField: Field = (p) => (
  <input
    type="file"
    required={p.required}
    disabled={p.disabled}
    defaultValue={p.defaultValue}
    onChange={(event) => processFile(event).then(p.onChange)}
  />
);

type DescriptedEnum = { const: string; title: string };
type DescriptedEnumObject = Record<string, DescriptedEnum>;

const SelectdChipRenderer: React.FC<{ selectable: DescriptedEnumObject; selected: string[] }> = ({ selectable, selected }) => {
  const children = selected.map((v) => <Chip key={v} label={selectable[v].title || ""} />);
  return <Stack sx={{ flexWrap: "wrap" }} direction="row" spacing={0.5} children={children} />;
};

const fieldPropsToSelectedProps = (props: FieldProps): OutlinedSelectProps & { defaultValue: string[] } => {
  const {
    name,
    formData,
    autofocus: autoFocus,
    readonly: readOnly,
    onFocus: rawOnFocus,
    onBlur: rawOnBlur,
    onChange: rawOnChange,

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    required: _,

    schema,
    errorSchema,
    uiSchema,
    idSchema,
    formContext,
    wasPropertyKeyModified,
    registry,
    rawErrors,
    hideError,
    idPrefix,
    idSeparator,
    color,
    ...rest
  } = props;
  const data = {
    schema,
    errorSchema,
    uiSchema,
    idSchema,
    formContext,
    wasPropertyKeyModified,
    registry,
    rawErrors,
    hideError,
    idPrefix,
    idSeparator,
  };
  const onFocus = (event: React.FocusEvent<HTMLInputElement>) => rawOnFocus(event.currentTarget.name, event.currentTarget.value);
  const onBlur = (event: React.FocusEvent<HTMLInputElement>) => rawOnBlur(event.currentTarget.name, event.currentTarget.value);
  const onChange = (event: React.ChangeEvent<HTMLInputElement>) => rawOnChange(event.target.value, undefined, event.target.name);
  const sx: OutlinedSelectProps["sx"] = color ? { color, borderColor: color } : {};
  const defaultValue = (formData ? (R.isArray(formData) ? formData : [formData.toString()]) : []) as string[];
  return R.addProp({ ...rest, name, label: name, defaultValue, autoFocus, readOnly, onFocus, onBlur, onChange, sx }, "data-rjsf", data);
};

const M2MSelect: Field = ErrorBoundary.with(
  { fallback: Common.Components.ErrorFallback },
  Suspense.with({ fallback: <CircularProgress /> }, (props) => {
    const selectable = (props.schema.items as JSONSchema7).oneOf as DescriptedEnum[];
    const selectableListObj: DescriptedEnumObject = selectable.reduce((a, i) => ({ ...a, [i.const]: i }), {} as DescriptedEnumObject);
    const children = selectable.map((i) => <MenuItem key={i.const} value={i.const} children={i.title || i.const} />);
    const selectRenderer = (selected: string[]) => <SelectdChipRenderer selectable={selectableListObj} selected={selected} />;
    return (
      <FormControl fullWidth>
        <InputLabel id={`${props.name}-label`} children={props.name} />
        <Select {...fieldPropsToSelectedProps(props)} children={children} multiple fullWidth renderValue={selectRenderer} />
      </FormControl>
    );
  })
);

const MUIStyledFieldset = styled("fieldset")(({ theme }) => ({
  color: theme.palette.text.secondary,
  margin: 0,

  border: `1px solid ${theme.palette.info}`,
  borderRadius: theme.shape.borderRadius,
}));

const MDRendererContainer = styled(Box)(({ theme }) => ({
  width: "50%",
  maxWidth: "50%",
  backgroundColor: "#fff",

  "& .markdown-body": {
    width: "100%",
    p: { margin: theme.spacing(2, 0) },
    a: { color: theme.palette.primary.main },
  },
}));

const MDEditorField: Field = ErrorBoundary.with(
  { fallback: Common.Components.ErrorFallback },
  ({ disabled, formData, name, onChange: rawOnChange }) => {
    const [valueState, setValueState] = React.useState<string | undefined>(formData?.toString() || "");
    const onChange = (value?: string) => {
      setValueState(value);
      rawOnChange(value, undefined, name);
    };
    return (
      <MUIStyledFieldset>
        <Typography variant="subtitle2" component="legend" children={name} />
        <Stack direction="row" spacing={2} sx={{ width: "100%", height: "100%", minHeight: "100%", maxHeight: "100%", flexGrow: 1, py: 2 }}>
          <Box sx={{ width: "50%", maxWidth: "50%" }}>
            <Common.Components.MarkdownEditor disabled={disabled} name={name} value={valueState} onChange={onChange} extraCommands={[]} />
          </Box>
          <MDRendererContainer>
            <Common.Components.MDXRenderer text={valueState || ""} format="md" />
          </MDRendererContainer>
        </Stack>
      </MUIStyledFieldset>
    );
  }
);

type ReadOnlyValueFieldStateType = {
  loading: boolean;
  blob: Blob | null;
  blobText: string | null;
  objectUrl: string | null;
};

const ReadOnlyValueField: React.FC<{
  name: string;
  value: unknown;
  uiSchema: UiSchema;
}> = Suspense.with({ fallback: <CircularProgress /> }, ({ name, value, uiSchema }) => {
  const [fieldState, setFieldState] = React.useState<ReadOnlyValueFieldStateType>({
    loading: true,
    blob: null,
    blobText: null,
    objectUrl: null,
  });

  React.useEffect(() => {
    (async () => {
      if (!(R.isString(value) && value.startsWith("http") && uiSchema?.[name]["ui:field"] === "file")) {
        setFieldState((ps) => ({ ...ps, loading: false }));
        return;
      }

      const blob = await (await fetch(value)).blob();
      const blobText = await blob.text();
      const objectUrl = URL.createObjectURL(blob);
      setFieldState((ps) => ({ ...ps, loading: false, blob, blobText, objectUrl }));
    })();
  }, [value, name, uiSchema]);

  if (fieldState.loading) return <CircularProgress />;

  if (uiSchema?.[name]?.["ui:field"] === "file" && fieldState.blob) {
    return (
      <Stack spacing={2} alignItems="flex-start">
        {fieldState.blob.type.startsWith("image/") && fieldState.objectUrl && (
          <img src={fieldState.objectUrl} alt={name} style={{ maxWidth: "600px", objectFit: "contain" }} />
        )}
        {fieldState.blob.type.startsWith("application/json") && fieldState.blobText && (
          <Box sx={{ maxWidth: "600px", overflow: "auto" }}>
            <Common.Components.LottieDebugPanel data={JSON.parse(fieldState.blobText)} />
          </Box>
        )}
        <a href={value as string}>링크</a>
      </Stack>
    );
  }

  return value as string;
});

type InnerAdminEditorStateType = {
  tab: number;
  formData: Record<string, string> | undefined;
};

const InnerAdminEditor: React.FC<AppResourceIdType & AdminEditorPropsType> = ErrorBoundary.with(
  { fallback: Common.Components.ErrorFallback },
  Suspense.with(
    { fallback: <CircularProgress /> },
    ({ app, resource, id, hidingFields, context, onClose, beforeSubmit, afterSubmit, extraActions, notModifiable, notDeletable, children }) => {
      const navigate = useNavigate();
      const formRef = React.useRef<Form<Record<string, string>, RJSFSchema, { [k in string]: unknown }> | null>(null);
      const [editorState, setEditorState] = React.useState<InnerAdminEditorStateType>({
        tab: 0,
        formData: undefined,
      });
      const backendAdminClient = Common.Hooks.BackendAdminAPI.useBackendAdminClient();
      const { data: schemaInfo } = Common.Hooks.BackendAdminAPI.useSchemaQuery(backendAdminClient, app, resource);

      const setTab = (_: React.SyntheticEvent, tab: number) => setEditorState((ps) => ({ ...ps, tab }));
      const setFormData = (formData?: Record<string, string>) => setEditorState((ps) => ({ ...ps, formData }));
      const appendFormDataState = (data?: Record<string, string>) => setEditorState((ps) => ({ ...ps, formData: { ...ps.formData, ...data } }));
      const selectedLanguage = editorState.tab === 0 ? "ko" : "en";
      const notSelectedLanguage = editorState.tab === 0 ? "en" : "ko";

      const createMutation = Common.Hooks.BackendAdminAPI.useCreateMutation<Record<string, string>>(backendAdminClient, app, resource);
      const modifyMutation = Common.Hooks.BackendAdminAPI.useUpdateMutation<Record<string, string>>(backendAdminClient, app, resource, id || "");
      const deleteMutation = Common.Hooks.BackendAdminAPI.useRemoveMutation(backendAdminClient, app, resource, id || "undefined");
      const submitMutation = id ? modifyMutation : createMutation;

      React.useEffect(() => {
        (async () => {
          if (!id) {
            setFormData(context || {});
            return;
          }

          const initialData = await Common.BackendAdminAPIs.retrieve<Record<string, string>>(backendAdminClient, app, resource, id)();
          setFormData({ ...initialData, ...context });
        })();
        // eslint-disable-next-line react-hooks/exhaustive-deps
      }, [app, resource, id, context]);

      const onSubmitButtonClick: React.MouseEventHandler<HTMLButtonElement> = () => formRef.current && formRef.current.submit();

      const onSubmitFunc = (data: EditorFormDataEventType, event: React.FormEvent) => {
        // react-jsonschema-form에서 주는 formData에는 translation_fields로 필터링된 필드가 빠져있어,
        // 사용자가 특정 탭에서 수정한 후 다른 탭으로 이동해서 수정하게 되면 이전 탭의 수정 내용이 사라지는 문제가 발생함.
        // 따라서, onChange로 항상 값이 추적되는 editorState.formData를 가장 우선적으로 사용함.
        const newFormData = editorState.formData || data.formData || {};
        beforeSubmit?.(newFormData, event);
        submitMutation.mutate(newFormData, {
          onSuccess: (newFormData) => {
            addSnackbar(id ? "저장했습니다." : "페이지를 생성했습니다.", "success");
            afterSubmit?.(newFormData, event);

            if (!id && newFormData.id) navigate(`/${app}/${resource}/${newFormData.id}`);
          },
          onError: addErrorSnackbar,
        });
      };

      const onDeleteFunc = () => {
        if (window.confirm("정말로 삭제하시겠습니까? 이 작업은 되돌릴 수 없습니다.")) {
          deleteMutation.mutate(undefined, {
            onSuccess: () => {
              addSnackbar("삭제했습니다.", "success");
              navigate(`/${app}/${resource}`);
            },
            onError: addErrorSnackbar,
          });
        }
      };

      const goToCreateNew = () => navigate(`/${app}/${resource}/create`);

      if (R.isNonNullish(hidingFields) && R.isObjectType(schemaInfo.schema.properties)) {
        schemaInfo.schema.properties = Object.entries(schemaInfo.schema.properties || {})
          .filter(([key]) => !hidingFields.includes(key))
          .reduce((acc, [key, value]) => ({ ...acc, [key]: value }), {} as RJSFSchema);
      }

      const writableSchema = Common.Utils.filterPropertiesByLanguageInJsonSchema(
        Common.Utils.filterWritablePropertiesInJsonSchema(schemaInfo.schema),
        schemaInfo.translation_fields,
        selectedLanguage
      );
      const readOnlySchema = Common.Utils.filterPropertiesByLanguageInJsonSchema(
        Common.Utils.filterReadOnlyPropertiesInJsonSchema(schemaInfo.schema),
        schemaInfo.translation_fields,
        selectedLanguage
      );
      const uiSchema: UiSchema = schemaInfo.ui_schema;
      const disabled = createMutation.isPending || modifyMutation.isPending || deleteMutation.isPending;
      const title = `${app.toUpperCase()} > ${resource.toUpperCase()} > ${id ? "편집: " + id : "새 객체 추가"}`;

      const notSelectedLangFields = schemaInfo.translation_fields.map((f) => `${f}_${notSelectedLanguage}`);
      const languageFilteredFormData = editorState.formData
        ? Object.entries(editorState.formData)
            .filter(([k]) => !notSelectedLangFields.includes(k))
            .reduce((acc, [k, v]) => ({ ...acc, [k]: v }), {} as Record<string, string>)
        : undefined;

      const handleCtrlSAction: (this: GlobalEventHandlers, ev: KeyboardEvent) => void = (event) => {
        if (event.key === "s" && (event.ctrlKey || event.metaKey)) {
          console.log("Ctrl+S pressed, executing save action");
          event.preventDefault();
          event.stopPropagation();
          formRef.current?.submit();
        }
      };

      React.useEffect(() => {
        document.addEventListener("keydown", handleCtrlSAction);
        return () => {
          console.log("Removing event listener for Ctrl+S action");
          document.removeEventListener("keydown", handleCtrlSAction);
        };
      }, []);

      if (editorState.formData === undefined) return <CircularProgress />;

      return (
        <Box sx={{ flexGrow: 1, width: "100%", minHeight: "100%" }}>
          <Stack direction="row" justifyContent="space-between">
            <Typography variant="h5">{title}</Typography>
            {onClose && <Box children={<IconButton children={<Close />} />} onClick={onClose} />}
          </Stack>
          <Stack direction="row" spacing={2} sx={{ width: "100%", height: "100%", maxWidth: "100%" }}>
            <Tabs orientation="vertical" value={editorState.tab} onChange={setTab} scrollButtons={false}>
              <Tab wrapped label="한국어" />
              <Tab wrapped label="영어" />
            </Tabs>
            <Box sx={{ flexGrow: 1 }}>
              {id && (
                <>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell>필드</TableCell>
                        <TableCell>값</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {Object.keys(readOnlySchema.properties || {}).map((key) => (
                        <TableRow key={key}>
                          <TableCell>{key}</TableCell>
                          <TableCell>
                            <ReadOnlyValueField name={key} value={languageFilteredFormData?.[key]} uiSchema={uiSchema} />
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                  <br />
                </>
              )}
              <MuiForm
                ref={formRef}
                schema={writableSchema}
                uiSchema={{
                  ...uiSchema,
                  "ui:submitButtonOptions": { norender: true },
                }}
                validator={customizeValidator({ AjvClass: AjvDraft04 })}
                formData={languageFilteredFormData}
                liveValidate
                focusOnFirstError
                formContext={{ readonlyAsDisabled: true }}
                onChange={({ formData }) => appendFormDataState(formData)}
                onSubmit={onSubmitFunc}
                disabled={disabled}
                showErrorList={false}
                fields={{ file: FileField, m2m_select: M2MSelect, markdown: MDEditorField }}
              />
            </Box>
          </Stack>
          {children}
          <Stack direction="row" spacing={2} sx={{ justifyContent: "flex-end" }}>
            {id ? (
              <>
                {(extraActions || []).map((p, i) => (
                  <Button key={i} {...p} />
                ))}
                <Button variant="outlined" color="info" onClick={goToCreateNew} disabled={disabled} startIcon={<Add />}>
                  새 객체 추가
                </Button>
                {!notDeletable && (
                  <Button variant="outlined" color="error" onClick={onDeleteFunc} disabled={disabled} startIcon={<Delete />}>
                    삭제
                  </Button>
                )}
                {!notModifiable && (
                  <Button variant="contained" color="primary" onClick={onSubmitButtonClick} disabled={disabled} startIcon={<Edit />}>
                    수정
                  </Button>
                )}
              </>
            ) : (
              <Button type="submit" variant="contained" color="primary" onClick={onSubmitButtonClick} disabled={disabled} startIcon={<Add />}>
                새 객체 추가
              </Button>
            )}
          </Stack>
        </Box>
      );
    }
  )
);

export const AdminEditor: React.FC<AppResourceIdType & AdminEditorPropsType> = (props) => (
  <BackendAdminSignInGuard>
    <InnerAdminEditor {...props} />
  </BackendAdminSignInGuard>
);

export const AdminEditorCreateRoutePage: React.FC<AppResourceType & AdminEditorPropsType> = (props) => <AdminEditor {...props} />;

export const AdminEditorModifyRoutePage: React.FC<AppResourceType & AdminEditorPropsType> = Suspense.with(
  { fallback: <CircularProgress /> },
  (props) => {
    const { id } = useParams<{ id?: string }>();
    return <AdminEditor {...props} id={id} />;
  }
);
