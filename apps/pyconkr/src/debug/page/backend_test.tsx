import * as React from "react";
import * as R from "remeda";

import { Button, CircularProgress, MenuItem, Select, Stack } from '@mui/material';
import { ErrorBoundary, Suspense } from '@suspensive/react';

import * as Common from "@frontend/common";

const SiteMapRenderer: React.FC = () => {
  const { data } = Common.Hooks.BackendAPI.useFlattenSiteMapQuery();
  return <pre style={{ whiteSpace: "pre-wrap" }}>{JSON.stringify(Common.Utils.buildNestedSiteMap(data), null, 2)}</pre>
};

const PageIdSelector: React.FC<{ inputRef: React.Ref<HTMLSelectElement> }> = ({ inputRef }) => {
  const { data } = Common.Hooks.BackendAPI.useFlattenSiteMapQuery();

  return <Select inputRef={inputRef}>
    {data.map((siteMap) => <MenuItem key={siteMap.id} value={siteMap.page}>{siteMap.name}</MenuItem>)}
  </Select>
}

const SuspenseWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <ErrorBoundary fallback={Common.Components.ErrorFallback}>
    <Suspense fallback={<CircularProgress />}>
      {children}
    </Suspense>
  </ErrorBoundary>
)

export const BackendTestPage: React.FC = () => {
  const inputRef = React.useRef<HTMLSelectElement>(null);
  const [pageId, setPageId] = React.useState<string | null>(null);

  return <Stack>
    <br />
    <SuspenseWrapper><SiteMapRenderer /></SuspenseWrapper>
    <br />
    <SuspenseWrapper><PageIdSelector inputRef={inputRef} /></SuspenseWrapper>
    <br />
    <Button variant="outlined" onClick={() => setPageId(inputRef.current?.value ?? null)}>페이지 렌더링</Button>
    <br />
    {R.isString(pageId) ? <SuspenseWrapper><Common.Components.PageRenderer id={pageId} /></SuspenseWrapper> : <>페이지를 선택해주세요.</>}
  </Stack>
}
