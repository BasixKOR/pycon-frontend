import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

import { Global } from "@emotion/react";
import { CircularProgress, CssBaseline, ThemeProvider } from "@mui/material";
import { wrap } from "@suspensive/react";
import { matchQuery, MutationCache, QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { SnackbarProvider } from "notistack";

import { App } from "./App.tsx";
import { globalStyles, muiTheme } from "./styles/globalStyles";

declare module '@tanstack/react-query' {
  interface Register {
    mutationMeta: {
      invalidates?: string[][];
    }
  }
}

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
      queryClient.invalidateQueries({ predicate: (query) => mutation.meta?.invalidates?.some((queryKey) => matchQuery({ queryKey }, query)) ?? true })
    },
  }),
});

const CenteredPage: React.FC<React.PropsWithChildren> = ({ children }) => (
  <section
    style={{
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      height: "100%",
      width: "100%",
    }}
  >
    <aside>{children}</aside>
  </section>
);

const ErrorBoundariedApp: React.FC = wrap
  .ErrorBoundary({ fallback: <CenteredPage>문제가 발생했습니다, 새로고침을 해주세요.</CenteredPage> })
  .Suspense({ fallback: <CenteredPage><CircularProgress /></CenteredPage> })
  .on(() => <App />);

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <ReactQueryDevtools initialIsOpen={false} />
      <ThemeProvider theme={muiTheme}>
        <SnackbarProvider>
          <CssBaseline />
          <Global styles={globalStyles} />
          <ErrorBoundariedApp />
        </SnackbarProvider>
      </ThemeProvider>
    </QueryClientProvider>
  </StrictMode>
);
