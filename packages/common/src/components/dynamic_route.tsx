import { Box, CircularProgress, Stack, Theme } from "@mui/material";
import { ErrorBoundary, Suspense } from "@suspensive/react";
import { AxiosError, AxiosResponse } from "axios";
import * as React from "react";
import { useLocation, useParams } from "react-router-dom";
import * as R from "remeda";

import { BackendAPIClientError } from "../apis/client";
import Hooks from "../hooks";
import BackendAPISchemas from "../schemas/backendAPI";
import Utils from "../utils";
import { ErrorFallback } from "./error_handler";
import { MDXRenderer } from "./mdx";

const initialPageStyle: (additionalStyle: React.CSSProperties) => (theme: Theme) => React.CSSProperties =
  (additionalStyle) => (theme) => ({
    width: "100%",
    marginTop: theme.spacing(8),
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "column",
    ...additionalStyle,
  });

const initialSectionStyle: (additionalStyle: React.CSSProperties) => (theme: Theme) => React.CSSProperties =
  (additionalStyle) => () => ({
    width: "100%",
    ...additionalStyle,
  });

const LoginRequired: React.FC = () => <>401 Login Required</>;
const PermissionDenied: React.FC = () => <>403 Permission Denied</>;
const PageNotFound: React.FC = () => <>404 Not Found</>;

const throwPageNotFound: (message: string) => never = (message) => {
  const errorStr = `RouteRenderer: ${message}`;
  const axiosError = new AxiosError(errorStr, errorStr, undefined, undefined, {
    status: 404,
  } as AxiosResponse);
  throw new BackendAPIClientError(axiosError);
};

const RouteErrorFallback: React.FC<{ error: Error; reset: () => void }> = ({ error, reset }) => {
  if (error instanceof BackendAPIClientError) {
    switch (error.status) {
      case 401:
        return <LoginRequired />;
      case 403:
        return <PermissionDenied />;
      case 404:
        return <PageNotFound />;
      default:
        return <ErrorFallback error={error} reset={reset} />;
    }
  }
  return <ErrorFallback error={error} reset={reset} />;
};

export const PageRenderer: React.FC<{ id?: string }> = ErrorBoundary.with(
  { fallback: RouteErrorFallback },
  Suspense.with({ fallback: <CircularProgress /> }, ({ id }) => {
    const backendClient = Hooks.BackendAPI.useBackendClient();
    const { data } = Hooks.BackendAPI.usePageQuery(backendClient, id || "");
    const commonStackStyle = {
      justifyContent: "flex-start",
      alignItems: "center",
    };

    return (
      <Stack {...commonStackStyle} sx={initialPageStyle(Utils.parseCss(data.css))}>
        {data.sections.map((s) => (
          <Stack {...commonStackStyle} sx={initialSectionStyle(Utils.parseCss(s.css))} key={s.id}>
            <Box sx={{ maxWidth: "1000px" }}>
              <MDXRenderer text={s.body} />
            </Box>
          </Stack>
        ))}
      </Stack>
    );
  })
);

export const RouteRenderer: React.FC = ErrorBoundary.with(
  { fallback: RouteErrorFallback },
  Suspense.with({ fallback: <CircularProgress /> }, () => {
    const location = useLocation();

    const backendClient = Hooks.BackendAPI.useBackendClient();
    const { data } = Hooks.BackendAPI.useFlattenSiteMapQuery(backendClient);
    const nestedSiteMap = Utils.buildNestedSiteMap(data);

    const currentRouteCodes = ["", ...location.pathname.split("/").filter((code) => !R.isEmpty(code))];
    let currentSitemap: BackendAPISchemas.NestedSiteMapSchema | undefined = nestedSiteMap[currentRouteCodes[0]];
    if (currentSitemap === undefined) throwPageNotFound(`Route ${location} not found`);

    for (const routeCode of currentRouteCodes.slice(1))
      if ((currentSitemap = currentSitemap.children[routeCode]) === undefined)
        throwPageNotFound(`Route ${location} not found`);

    return <PageRenderer id={currentSitemap.page} />;
  })
);

export const PageIdParamRenderer: React.FC = Suspense.with({ fallback: <CircularProgress /> }, () => {
  const { id } = useParams();
  return <PageRenderer id={id} />;
});
