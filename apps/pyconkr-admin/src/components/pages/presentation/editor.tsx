import * as Common from "@frontend/common";
import { Autocomplete, Box, Button, Card, CardContent, CircularProgress, Stack, styled, Tab, Tabs, TextField, Typography } from "@mui/material";
import { ErrorBoundary, Suspense } from "@suspensive/react";
import { enqueueSnackbar, OptionsObject } from "notistack";
import * as React from "react";
import { useParams } from "react-router-dom";

import { AdminEditor } from "../../layouts/admin_editor";

const DUMMY_UUID = "00000000-0000-4000-8000-000000000000";

type enumItemType = { const: string | null; title: string };

type SpeakerSchemaType = {
  schema: {
    type: "object";
    properties: {
      id: { type: ["string", "null"]; format: "uuid"; readOnly: true };
      str_repr: { type: "string"; readOnly: true };
      user: { type: "integer"; oneOf: enumItemType[] };
      image: { type: ["string", "null"]; oneOf: enumItemType[] };
      biography_ko?: { type: ["string", "null"] };
      biography_en?: { type: ["string", "null"] };
    };
    required?: string[];
    $schema?: string;
  };
  ui_schema?: Record<string, { "ui:widget"?: string; "ui:field"?: string }>;
  translation_fields?: string[];
};

type OnMemoeryPresentationSpeaker = {
  id?: string;
  trackId: string;
  presentation: string;
  user: string | null;
  image: string | null;
  biography_ko: string;
  biography_en: string;
};

type PresentationSpeaker = Omit<OnMemoeryPresentationSpeaker, "trackId"> & {
  id: string;
  user: string;
};

const MUIStyledFieldset = styled("fieldset")(({ theme }) => ({
  color: theme.palette.text.secondary,
  margin: 0,

  border: `1px solid ${theme.palette.info}`,
  borderRadius: theme.shape.borderRadius,
}));

const MDXRendererContainer = styled(Box)(({ theme }) => ({
  width: "50%",
  maxWidth: "50%",

  "& .markdown-body": {
    width: "100%",
    p: { margin: theme.spacing(2, 0) },
  },
}));

type PresentationSpeakerFormPropType = {
  schema: SpeakerSchemaType;
  disabled?: boolean;
  speaker: OnMemoeryPresentationSpeaker;
  onChange: (speaker: OnMemoeryPresentationSpeaker) => void;
  onRemove: (speaker: OnMemoeryPresentationSpeaker) => void;
};

type PresentationSpeakerFormStateType = {
  tab: "ko" | "en";
};

type AutoCompleteType = {
  name: string;
  value: string | null;
  label: string;
};

const PresentationSpeakerForm: React.FC<PresentationSpeakerFormPropType> = ({ disabled, schema, speaker, onChange, onRemove }) => {
  const [formState, setFormState] = React.useState<PresentationSpeakerFormStateType>({ tab: "ko" });
  const setLanguage = (_: React.SyntheticEvent, tab: "ko" | "en") => setFormState((ps) => ({ ...ps, tab }));

  const userOptions: AutoCompleteType[] = schema.schema.properties.user.oneOf.map((item) => ({
    name: "user",
    value: item.const || "",
    label: item.title,
  }));
  const currentSelectedUser = userOptions.find((u) => u.value === speaker.user?.toString());
  const imageOptions: AutoCompleteType[] = schema.schema.properties.image.oneOf.map((item) => ({
    name: "image",
    value: item.const || "",
    label: item.title,
  }));
  const currentSelectedImage = imageOptions.find((u) => u.value === speaker.image?.toString());

  const bioField = formState.tab === "ko" ? "biography_ko" : "biography_en";
  const onSpeakerBioChange = (value?: string) => onChange({ ...speaker, [bioField]: value || "" });
  const onSpeakerChange = (fieldName: string) => (_: React.SyntheticEvent, selected: AutoCompleteType | null) => {
    onChange({ ...speaker, [fieldName]: selected?.value || "" });
  };
  const onSpeakerRemove = () => {
    if (window.confirm("발표자를 삭제하시겠습니까?")) onRemove(speaker);
  };

  return (
    <Card>
      <CardContent>
        <Stack spacing={2}>
          <Autocomplete
            fullWidth
            defaultValue={currentSelectedUser}
            value={currentSelectedUser}
            onChange={onSpeakerChange("user")}
            // inputValue={currentSelectedUser?.label || ""}
            options={userOptions}
            renderInput={(params) => <TextField {...params} label="발표자" />}
          />
          <Autocomplete
            fullWidth
            defaultValue={currentSelectedImage}
            value={currentSelectedImage}
            // inputValue={currentSelectedImage?.label || ""}
            options={imageOptions}
            renderInput={(params) => <TextField {...params} label="발표자 이미지" />}
            onChange={onSpeakerChange("image")}
          />
          <Stack direction="row" spacing={2}>
            <Tabs orientation="vertical" onChange={setLanguage} value={formState.tab} scrollButtons={false}>
              <Tab value="ko" label="한국어" />
              <Tab value="en" label="영어" />
            </Tabs>
            <Stack direction="column" spacing={2} sx={{ width: "100%", maxWidth: "100%" }}>
              <MUIStyledFieldset>
                <Typography variant="subtitle2" component="legend" children="발표자 소개" />
                <Stack direction="row" spacing={2}>
                  <Box sx={{ width: "50%", maxWidth: "50%" }}>
                    <Common.Components.MarkdownEditor disabled={disabled} value={speaker[bioField]} name={bioField} onChange={onSpeakerBioChange} />
                  </Box>
                  <MDXRendererContainer>
                    <Common.Components.MDXRenderer text={speaker[bioField]} format="md" />
                  </MDXRendererContainer>
                </Stack>
              </MUIStyledFieldset>
            </Stack>
          </Stack>
          <Button variant="outlined" color="error" onClick={onSpeakerRemove} children="발표자 삭제" />
        </Stack>
      </CardContent>
    </Card>
  );
};

type PresentationEditorStateType = {
  speakers: OnMemoeryPresentationSpeaker[];
};

export const AdminPresentationEditor: React.FC = ErrorBoundary.with(
  { fallback: Common.Components.ErrorFallback },
  Suspense.with({ fallback: <CircularProgress /> }, () => {
    const { id } = useParams<{ id?: string }>();

    const addSnackbar = (c: string | React.ReactNode, variant: OptionsObject["variant"]) =>
      enqueueSnackbar(c, { variant, anchorOrigin: { vertical: "bottom", horizontal: "center" } });

    const backendAdminAPIClient = Common.Hooks.BackendAdminAPI.useBackendAdminClient();
    const speakerQueryParams = [backendAdminAPIClient, "event", "presentationspeaker"] as const;
    const presentation = id || DUMMY_UUID;
    const speakerCreateMutation = Common.Hooks.BackendAdminAPI.useCreateMutation<OnMemoeryPresentationSpeaker>(...speakerQueryParams);
    const speakerUpdateMutation = Common.Hooks.BackendAdminAPI.useUpdatePreparedMutation<PresentationSpeaker>(...speakerQueryParams);
    const speakerDeleteMutation = Common.Hooks.BackendAdminAPI.useRemovePreparedMutation(...speakerQueryParams);
    const { data: speakerJsonSchema } = Common.Hooks.BackendAdminAPI.useSchemaQuery(...speakerQueryParams);
    const { data: speakerInitialData } = Common.Hooks.BackendAdminAPI.useListQuery<PresentationSpeaker>(...speakerQueryParams, { presentation });
    const speakers = speakerInitialData.map((s) => ({ ...s, trackId: s.id || Math.random().toString(36).substring(2, 15) }));

    const createEmptySpeaker = (): OnMemoeryPresentationSpeaker => ({
      trackId: Math.random().toString(36).substring(2, 15),
      presentation,
      user: null,
      image: null,
      biography_ko: "",
      biography_en: "",
    });

    const [editorState, setEditorState] = React.useState<PresentationEditorStateType>({ speakers });
    const onSpeakerCreate = () => setEditorState((ps) => ({ ...ps, speakers: [...ps.speakers, createEmptySpeaker()] }));
    const onSpeakerRemove = (oldSpeaker: OnMemoeryPresentationSpeaker) =>
      setEditorState((ps) => ({ ...ps, speakers: ps.speakers.filter((s) => s.trackId !== oldSpeaker.trackId) }));
    const onSpeakerChange = (newSpeaker: OnMemoeryPresentationSpeaker) =>
      setEditorState((ps) => ({ ...ps, speakers: ps.speakers.map((s) => (s.trackId === newSpeaker.trackId ? newSpeaker : s)) }));

    const onSpeakerSubmit = () => {
      if (!id) return;

      addSnackbar("발표자 정보를 저장하는 중입니다...", "info");
      const newSpeakers = editorState.speakers;
      const editorSpeakerIds = newSpeakers.filter((s) => s.id).map((s) => s.id!);
      const deletedSpeakerIds = speakerInitialData.filter((s) => !editorSpeakerIds.includes(s.id)).map((s) => s.id!);

      const deleteMut = deletedSpeakerIds.map((id) => speakerDeleteMutation.mutateAsync(id));
      const createMut = newSpeakers.filter((s) => s.id === undefined).map((s) => speakerCreateMutation.mutateAsync(s));
      const updateMut = newSpeakers.filter((s) => s.id !== undefined).map((s) => speakerUpdateMutation.mutateAsync(s as PresentationSpeaker));
      Promise.all([...deleteMut, ...createMut, ...updateMut]).then(() => addSnackbar("발표자 정보가 저장되었습니다.", "success"));
    };

    return (
      <AdminEditor app="event" resource="presentation" id={id} afterSubmit={onSpeakerSubmit}>
        {id ? (
          <Stack sx={{ mb: 2 }} spacing={2}>
            <Typography variant="h6">발표자 정보</Typography>
            <Stack spacing={2}>
              {editorState.speakers.map((s) => (
                <PresentationSpeakerForm
                  key={s.id}
                  schema={speakerJsonSchema as SpeakerSchemaType}
                  speaker={s}
                  onChange={onSpeakerChange}
                  onRemove={onSpeakerRemove}
                />
              ))}
              <Button variant="outlined" onClick={onSpeakerCreate} children="발표자 추가" />
            </Stack>
          </Stack>
        ) : (
          <Stack>
            <Typography variant="h6">발표자 정보</Typography>
            <Typography variant="body1">발표자를 추가하려면 발표를 먼저 저장하세요.</Typography>
          </Stack>
        )}
      </AdminEditor>
    );
  })
);
