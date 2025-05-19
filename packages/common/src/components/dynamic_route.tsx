import * as React from "react";
import { useLocation } from 'react-router-dom';
import * as R from "remeda";

import { CircularProgress } from '@mui/material';
import { ErrorBoundary, Suspense } from '@suspensive/react';

import styled from '@emotion/styled';
import Components from '../components';
import Hooks from "../hooks";
import Schemas from "../schemas";
import Utils from '../utils';

const InitialPageStyle: React.CSSProperties = {
  width: '100%',
  height: '100%',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  flexDirection: 'column',
}

const InitialSectionStyle: React.CSSProperties = {
  width: '100%',
}

export const PageRenderer: React.FC<{ id: string }> = ({ id }) => {
  const { data } = Hooks.BackendAPI.usePageQuery(id);

  return <div style={{ ...InitialPageStyle, ...Utils.parseCss(data.css) }}>
    {
      data.sections.map(
        (s) => <div style={{ ...InitialSectionStyle, ...Utils.parseCss(s.css) }} key={s.id}>
          <Components.MDXRenderer text={s.body} />
        </div>
      )
    }
  </div>
};

const AsyncDynamicRoutePage: React.FC = () => {
  const location = useLocation();
  const { data } = Hooks.BackendAPI.useFlattenSiteMapQuery();
  const nestedSiteMap = Utils.buildNestedSiteMap(data);

  const currentRouteCodes = ['', ...location.pathname.split('/').filter((code) => !R.isEmpty(code))];

  let currentSitemap: Schemas.NestedSiteMapSchema | null | undefined = nestedSiteMap[currentRouteCodes[0]];
  if (currentSitemap === undefined) {
    return <>404 Not Found</>;
  }

  for (const routeCode of currentRouteCodes.slice(1)) {
    if ((currentSitemap = currentSitemap.children[routeCode]) === undefined) {
      break;
    }
  }

  return R.isNullish(currentSitemap)
    ? <>404 Not Found</>
    : <PageRenderer id={currentSitemap.page} />
}

const FullPage = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
`

export const DynamicRoutePage: React.FC = () => <FullPage>
  <ErrorBoundary fallback={Components.ErrorFallback}>
    <Suspense fallback={<CircularProgress />}>
      <AsyncDynamicRoutePage />
    </Suspense>
  </ErrorBoundary>
</FullPage>;
