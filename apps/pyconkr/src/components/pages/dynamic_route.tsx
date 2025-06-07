import * as Common from "@frontend/common";
import { CircularProgress, Stack, Theme } from "@mui/material";
import { ErrorBoundary, Suspense } from "@suspensive/react";
import { AxiosError, AxiosResponse } from "axios";
import * as React from "react";
import { useLocation, useParams } from "react-router-dom";
import * as R from "remeda";

import { useAppContext } from "../../contexts/app_context";

const initialPageStyle: (additionalStyle: React.CSSProperties) => (theme: Theme) => React.CSSProperties =
  (additionalStyle) => (theme) => ({
    width: "100%",
    display: "flex",
    justifyContent: "flex-start",
    alignItems: "center",
    flexDirection: "column",

    marginTop: theme.spacing(4),

    ...(!R.isEmpty(additionalStyle)
      ? additionalStyle
      : {
          [theme.breakpoints.down("lg")]: {
            marginTop: theme.spacing(2),
          },
          [theme.breakpoints.down("sm")]: {
            marginTop: theme.spacing(1),
          },
        }),
  });

const initialSectionStyle: (additionalStyle: React.CSSProperties) => (theme: Theme) => React.CSSProperties =
  (additionalStyle) => (theme) => ({
    width: "100%",
    maxWidth: "1200px",
    display: "flex",
    justifyContent: "flex-start",
    alignItems: "center",
    paddingRight: theme.spacing(16),
    paddingLeft: theme.spacing(16),

    "& .markdown-body": { width: "100%" },
    ...(!R.isEmpty(additionalStyle)
      ? additionalStyle
      : {
          [theme.breakpoints.down("lg")]: {
            paddingRight: theme.spacing(4),
            paddingLeft: theme.spacing(4),
          },
          [theme.breakpoints.down("sm")]: {
            paddingRight: theme.spacing(2),
            paddingLeft: theme.spacing(2),
          },
        }),
  });

const LoginRequired: React.FC = () => <>401 Login Required</>;
const PermissionDenied: React.FC = () => <>403 Permission Denied</>;
const PageNotFound: React.FC = () => <>404 Not Found</>;
const CenteredLoadingPage: React.FC = () => (
  <Common.Components.CenteredPage>
    <CircularProgress />
  </Common.Components.CenteredPage>
);

const throwPageNotFound: (message: string) => never = (message) => {
  const errorStr = `RouteRenderer: ${message}`;
  const axiosError = new AxiosError(errorStr, errorStr, undefined, undefined, {
    status: 404,
  } as AxiosResponse);
  throw new Common.BackendAPIs.BackendAPIClientError(axiosError);
};

const RouteErrorFallback: React.FC<{ error: Error; reset: () => void }> = ({ error, reset }) => {
  if (error instanceof Common.BackendAPIs.BackendAPIClientError) {
    switch (error.status) {
      case 401:
        return <LoginRequired />;
      case 403:
        return <PermissionDenied />;
      case 404:
        return <PageNotFound />;
      default:
        return <Common.Components.ErrorFallback error={error} reset={reset} />;
    }
  }
  return <Common.Components.ErrorFallback error={error} reset={reset} />;
};

export const PageRenderer: React.FC<{ id: string }> = ErrorBoundary.with(
  { fallback: RouteErrorFallback },
  Suspense.with({ fallback: <CenteredLoadingPage /> }, ({ id }) => {
    const { setAppContext } = useAppContext();
    const backendClient = Common.Hooks.BackendAPI.useBackendClient();
    const { data } = Common.Hooks.BackendAPI.usePageQuery(backendClient, id);

    React.useEffect(() => {
      setAppContext((prev) => ({
        ...prev,
        title: data.title,
        shouldShowTitleBanner: data.show_top_title_banner,
        shouldShowSponsorBanner: data.show_bottom_sponsor_banner,
      }));
    }, [data, setAppContext]);

    return (
      <Stack sx={initialPageStyle(Common.Utils.parseCss(data.css))}>
        {data.sections.map((s) => (
          <Stack sx={initialSectionStyle(Common.Utils.parseCss(s.css))} key={s.id}>
            <Common.Components.MDXRenderer text={s.body} />
          </Stack>
        ))}
      </Stack>
    );
  })
);

export const RouteRenderer: React.FC = ErrorBoundary.with(
  { fallback: RouteErrorFallback },
  Suspense.with({ fallback: <CenteredLoadingPage /> }, () => {
    const location = useLocation();
    const { siteMapNode, currentSiteMapDepth } = useAppContext();

    if (!siteMapNode) return <CenteredLoadingPage />;

    const routeInfo = !R.isEmpty(currentSiteMapDepth) && currentSiteMapDepth[currentSiteMapDepth.length - 1];
    if (!routeInfo) throwPageNotFound(`Route ${location} not found`);

    return <PageRenderer id={routeInfo.page} />;
  })
);

export const PageIdParamRenderer: React.FC = Suspense.with({ fallback: <CenteredLoadingPage /> }, () => {
  const { id } = useParams();
  if (!id) throwPageNotFound("Page ID is required");
  return <PageRenderer id={id} />;
});
