import * as Common from "@frontend/common";
import {
  CircularProgress,
  MenuItem,
  Select,
  SelectProps,
  Stack,
} from "@mui/material";
import { Suspense } from "@suspensive/react";
import * as React from "react";

const SiteMapRenderer: React.FC = Suspense.with(
  { fallback: <CircularProgress /> },
  () => {
    const backendClient = Common.Hooks.BackendAPI.useBackendClient();
    const { data } =
      Common.Hooks.BackendAPI.useFlattenSiteMapQuery(backendClient);
    return (
      <pre style={{ whiteSpace: "pre-wrap" }}>
        {JSON.stringify(Common.Utils.buildNestedSiteMap(data), null, 2)}
      </pre>
    );
  }
);

const PageIdSelector: React.FC<{ onChange: SelectProps["onChange"] }> =
  Suspense.with({ fallback: <CircularProgress /> }, ({ onChange }) => {
    const backendClient = Common.Hooks.BackendAPI.useBackendClient();
    const { data } =
      Common.Hooks.BackendAPI.useFlattenSiteMapQuery(backendClient);

    return (
      <Select onChange={onChange}>
        {data.map((s) => (
          <MenuItem key={s.id} value={s.page}>
            {s.name}
          </MenuItem>
        ))}
      </Select>
    );
  });

export const BackendTestPage: React.FC = () => {
  const [pageId, setPageId] = React.useState<string | null>(null);

  return (
    <Stack spacing={2}>
      <SiteMapRenderer />
      <PageIdSelector onChange={(e) => setPageId(e.target.value as string)} />
      {Common.Utils.isFilledString(pageId) ? (
        <Common.Components.PageRenderer id={pageId} />
      ) : (
        <>페이지를 선택해주세요.</>
      )}
    </Stack>
  );
};
