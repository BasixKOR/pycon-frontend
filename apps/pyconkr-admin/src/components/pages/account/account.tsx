import * as Common from "@frontend/common";
import { CircularProgress } from "@mui/material";
import { ErrorBoundary, Suspense } from "@suspensive/react";
import * as React from "react";
import { Navigate } from "react-router-dom";

export const AccountRedirectPage: React.FC = ErrorBoundary.with(
  { fallback: Common.Components.ErrorFallback },
  Suspense.with({ fallback: <CircularProgress /> }, () => {
    const backendAdminAPIClient = Common.Hooks.BackendAdminAPI.useBackendAdminClient();
    const { data } = Common.Hooks.BackendAdminAPI.useSignedInUserQuery(backendAdminAPIClient);

    return data ? <Navigate to="/account/manage" replace /> : <Navigate to="/account/sign-in" replace />;
  })
);
