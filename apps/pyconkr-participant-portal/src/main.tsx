import { CenteredPage, CommonContextProvider } from "@frontend/common/components";
import type { ContextOptions } from "@frontend/common/contexts";
import { registerChunkLoadErrorReloadHandler } from "@frontend/common/utils";
import { CircularProgress, createTheme, CssBaseline, ThemeProvider } from "@mui/material";
import { ErrorBoundary, Suspense } from "@suspensive/react";
import { matchQuery, MutationCache, QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { SnackbarProvider } from "notistack";
import * as React from "react";
import * as ReactDom from "react-dom/client";
import { BrowserRouter } from "react-router-dom";

import { App } from "./App.tsx";
import { ErrorPage } from "./components/elements/error_page.tsx";
import { IS_DEBUG_ENV } from "./consts/index.ts";
import { LOCAL_STORAGE_LANGUAGE_KEY } from "./consts/local_stroage.ts";
import { AppContext, AppContextType } from "./contexts/app_context.tsx";

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
      queryClient.resetQueries({
        predicate: (query) => mutation.meta?.invalidates?.some((queryKey) => matchQuery({ queryKey }, query)) ?? true,
      });
    },
  }),
});

const muiTheme = createTheme();

const backendApiDomainEnv: string = import.meta.env.VITE_PYCONKR_BACKEND_API_DOMAIN;
const backendApiDomain = backendApiDomainEnv.startsWith("http://") ? "" : backendApiDomainEnv;

const CommonOptions: ContextOptions = {
  language: "ko",
  debug: IS_DEBUG_ENV,
  baseUrl: ".",
  backendApiDomain,
  backendApiTimeout: 10000,
  backendApiCSRFCookieName: import.meta.env.VITE_PYCONKR_BACKEND_CSRF_COOKIE_NAME,
  mdxComponents: {},
};

const SuspenseFallback = (
  <CenteredPage>
    <CircularProgress />
  </CenteredPage>
);

export const MainApp: React.FC = () => {
  const [appState, setAppContext] = React.useState<Omit<AppContextType, "setAppContext">>({
    language: (localStorage.getItem(LOCAL_STORAGE_LANGUAGE_KEY) as "ko" | "en" | null) ?? "ko",
  });

  return (
    <React.StrictMode>
      <QueryClientProvider client={queryClient}>
        <ReactQueryDevtools initialIsOpen={false} />
        <SnackbarProvider>
          <BrowserRouter>
            <AppContext.Provider value={{ ...appState, setAppContext }}>
              <CommonContextProvider options={{ ...CommonOptions, language: appState.language }}>
                <ErrorBoundary fallback={ErrorPage}>
                  <Suspense fallback={SuspenseFallback}>
                    <ThemeProvider theme={muiTheme}>
                      <CssBaseline />
                      <App />
                    </ThemeProvider>
                  </Suspense>
                </ErrorBoundary>
              </CommonContextProvider>
            </AppContext.Provider>
          </BrowserRouter>
        </SnackbarProvider>
      </QueryClientProvider>
    </React.StrictMode>
  );
};

registerChunkLoadErrorReloadHandler();

ReactDom.createRoot(document.getElementById("root")!).render(<MainApp />);
