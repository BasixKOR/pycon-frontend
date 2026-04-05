import { useParticipantPortalClient, useSignedInUserQuery } from "@frontend/common/src/hooks/useParticipantPortalAPI";
import { ErrorBoundary, Suspense } from "@suspensive/react";
import * as React from "react";
import { Navigate } from "react-router-dom";

import { ErrorPage } from "./error_page";
import { LoadingPage } from "./loading_page";

export const SignInGuard: React.FC<React.PropsWithChildren> = ErrorBoundary.with(
  { fallback: ErrorPage },
  Suspense.with({ fallback: <LoadingPage /> }, ({ children }) => {
    const participantPortalClient = useParticipantPortalClient();
    const { data } = useSignedInUserQuery(participantPortalClient);

    return data ? children : <Navigate to="/signin" replace />;
  })
);
