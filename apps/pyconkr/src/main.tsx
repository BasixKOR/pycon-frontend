import { Global } from "@emotion/react";
import * as Common from "@frontend/common";
import * as Shop from "@frontend/shop";
import { CircularProgress, CssBaseline, ThemeProvider } from "@mui/material";
import { ErrorBoundary, Suspense } from "@suspensive/react";
import {
  matchQuery,
  MutationCache,
  QueryClient,
  QueryClientProvider,
} from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { SnackbarProvider } from "notistack";
import * as React from "react";
import * as ReactDom from "react-dom/client";

import { App } from "./App.tsx";
import { IS_DEBUG_ENV } from "./consts";
import { PyConKRMDXComponents } from "./consts/mdx_components.ts";
import { globalStyles, muiTheme } from "./styles/globalStyles.ts";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 60 * 1000,
      gcTime: 5 * 60 * 1000,
      retry: 1,
    },
  },
  mutationCache: new MutationCache({
    onSuccess: (_data, _variables, _context, mutation) => {
      queryClient.invalidateQueries({
        predicate: (query) =>
          mutation.meta?.invalidates?.some((queryKey) =>
            matchQuery({ queryKey }, query)
          ) ?? true,
      });
    },
  }),
});

const CommonOptions: Common.Contexts.ContextOptions = {
  debug: IS_DEBUG_ENV,
  baseUrl: ".",
  backendApiDomain: import.meta.env.VITE_PYCONKR_BACKEND_API_DOMAIN,
  backendApiTimeout: 10000,
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
    <QueryClientProvider client={queryClient}>
      <ReactQueryDevtools initialIsOpen={false} />
      <Common.Components.CommonContextProvider options={CommonOptions}>
        <Shop.Components.Common.ShopContextProvider options={ShopOptions}>
          <ThemeProvider theme={muiTheme}>
            <SnackbarProvider>
              <CssBaseline />
              <Global styles={globalStyles} />
              <ErrorBoundary
                fallback={
                  <Common.Components.CenteredPage>
                    문제가 발생했습니다, 새로고침을 해주세요.
                  </Common.Components.CenteredPage>
                }
              >
                <Suspense
                  fallback={
                    <Common.Components.CenteredPage>
                      <CircularProgress />
                    </Common.Components.CenteredPage>
                  }
                >
                  <App />
                </Suspense>
              </ErrorBoundary>
            </SnackbarProvider>
          </ThemeProvider>
        </Shop.Components.Common.ShopContextProvider>
      </Common.Components.CommonContextProvider>
    </QueryClientProvider>
  </React.StrictMode>
);
