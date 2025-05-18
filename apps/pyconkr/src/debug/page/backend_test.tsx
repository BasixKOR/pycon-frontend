import * as React from "react";
import * as R from "remeda";

import { Button, CircularProgress, MenuItem, Select, Stack } from '@mui/material';
import { ErrorBoundary, Suspense } from '@suspensive/react';

import * as Common from "@frontend/common";

const SiteMapRenderer: React.FC = () => {
  const { data } = Common.Hooks.BackendAPI.useNestedSiteMapQuery();
  return <pre style={{ whiteSpace: "pre-wrap" }}>{JSON.stringify(data, null, 2)}</pre>
};

const parseCss = (t: unknown): React.CSSProperties => R.isString(t) && !R.isEmpty(t) && JSON.parse(t)

const PageRenderer: React.FC<{ id: string }> = ({ id }) => {
  const { data } = Common.Hooks.BackendAPI.usePageQuery(id);

  return <div style={parseCss(data.css)}>
    {
      data.sections.map(
        (s) => <div style={parseCss(s.css)} key={s.id}>
          <Common.Components.MDXRenderer text={s.body} />
        </div>
      )
    }
  </div>
};

const PageIdSelector: React.FC<{ inputRef: React.Ref<HTMLSelectElement> }> = ({ inputRef }) => {
  const { data } = Common.Hooks.BackendAPI.useFlattenSiteMapQuery();
  const pageIdList = data.map((sitemap) => sitemap.page);

  return <Select inputRef={inputRef}>
    {pageIdList.map((pageId) => <MenuItem key={pageId} value={pageId}>{pageId}</MenuItem>)}
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
    {R.isString(pageId) ? <SuspenseWrapper><PageRenderer id={pageId} /></SuspenseWrapper> : <>페이지를 선택해주세요.</>}
  </Stack>
}
