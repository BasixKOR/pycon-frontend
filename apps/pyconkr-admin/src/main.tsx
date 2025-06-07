import * as Common from "@frontend/common";
import * as Shop from "@frontend/shop";
import { CircularProgress } from "@mui/material";
import { ErrorBoundary, Suspense } from "@suspensive/react";
import { MutationCache, QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { SnackbarProvider } from "notistack";
import * as React from "react";
import * as ReactDom from "react-dom/client";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";

import { Layout } from "./components/layouts/global";
import { LandingPage } from "./components/pages/home";
import { PyConKRMDXComponents } from "./consts/mdx_components";
import { RegisteredRoutes, RouteDefinitions } from "./routes";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 60 * 1000,
      gcTime: 5 * 60 * 1000,
      retry: 1,
    },
  },
  mutationCache: new MutationCache({
    onSuccess: () => {
      queryClient.invalidateQueries({ predicate: () => true });
      queryClient.resetQueries({ predicate: () => true });
    },
  }),
});

const CommonOptions: Common.Contexts.ContextOptions = {
  debug: true,
  language: "ko",
  baseUrl: ".",
  frontendDomain: import.meta.env.VITE_PYCONKR_FRONTEND_DOMAIN,
  backendApiDomain: import.meta.env.VITE_PYCONKR_BACKEND_API_DOMAIN,
  backendApiTimeout: 10000,
  backendApiCSRFCookieName: import.meta.env.VITE_PYCONKR_BACKEND_CSRF_COOKIE_NAME,
  mdxComponents: PyConKRMDXComponents,
};

const ShopOptions: Shop.Contexts.ContextOptions = {
  shopApiDomain: import.meta.env.VITE_PYCONKR_SHOP_API_DOMAIN,
  shopApiCSRFCookieName: import.meta.env.VITE_PYCONKR_SHOP_CSRF_COOKIE_NAME,
  shopApiTimeout: 10000,
  shopImpAccountId: import.meta.env.VITE_PYCONKR_SHOP_IMP_ACCOUNT_ID,
};

ReactDom.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <ErrorBoundary
      fallback={
        <Common.Components.CenteredPage>문제가 발생했습니다, 새로고침을 해주세요.</Common.Components.CenteredPage>
      }
    >
      <Suspense
        fallback={
          <Common.Components.CenteredPage>
            <CircularProgress />
          </Common.Components.CenteredPage>
        }
      >
        <QueryClientProvider client={queryClient}>
          <ReactQueryDevtools buttonPosition="top-right" position="right" />
          <Common.Components.CommonContextProvider options={CommonOptions}>
            <Shop.Components.Common.ShopContextProvider options={ShopOptions}>
              <SnackbarProvider>
                <BrowserRouter>
                  <Routes>
                    <Route element={<Layout routes={RouteDefinitions} />}>
                      <Route path="/" element={<LandingPage />} />
                      {Object.entries(RegisteredRoutes).map(([path, element]) => (
                        <Route key={path} path={path} element={element} />
                      ))}
                      <Route path="*" element={<Navigate to="/" />} />
                    </Route>
                  </Routes>
                </BrowserRouter>
              </SnackbarProvider>
            </Shop.Components.Common.ShopContextProvider>
          </Common.Components.CommonContextProvider>
        </QueryClientProvider>
      </Suspense>
    </ErrorBoundary>
  </React.StrictMode>
);
