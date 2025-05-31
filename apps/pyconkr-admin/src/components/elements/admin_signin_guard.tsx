import * as Common from "@frontend/common";
import { CircularProgress } from "@mui/material";
import { ErrorBoundary, Suspense } from "@suspensive/react";
import * as React from "react";
import { Navigate } from "react-router-dom";

import { addSnackbar } from "../../utils/snackbar";

export const BackendAdminSignInGuard: React.FC<{ children: React.ReactNode }> =
  ErrorBoundary.with(
    { fallback: <>로그인 정보를 불러오는 중 문제가 발생했습니다.</> },
    Suspense.with({ fallback: <CircularProgress /> }, ({ children }) => {
      const backendAdminAPIClient =
        Common.Hooks.BackendAdminAPI.useBackendAdminClient();
      const { data } = Common.Hooks.BackendAdminAPI.useSignedInUserQuery(
        backendAdminAPIClient
      );

      if (!data) {
        addSnackbar("로그인 후 이용해주세요.", "error");
        return <Navigate to="/account/sign-in" replace />;
      }
      return children;
    })
  );
