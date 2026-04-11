import { useBackendAdminClient, useSignedInUserQuery } from "@frontend/common/src/hooks/useAdminAPI";
import { CircularProgress } from "@mui/material";
import { ErrorBoundary, Suspense } from "@suspensive/react";
import * as React from "react";
import { Navigate } from "react-router-dom";

import { ErrorFallback } from "../../elements/error_fallback";

export const AccountRedirectPage: React.FC = ErrorBoundary.with(
  { fallback: ErrorFallback },
  Suspense.with({ fallback: <CircularProgress /> }, () => {
    const backendAdminAPIClient = useBackendAdminClient();
    const { data } = useSignedInUserQuery(backendAdminAPIClient);

    return data ? <Navigate to="/account/manage" replace /> : <Navigate to="/account/sign-in" replace />;
  })
);
