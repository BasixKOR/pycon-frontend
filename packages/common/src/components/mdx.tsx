import * as React from "react";
import * as runtime from "react/jsx-runtime";

import { evaluate } from "@mdx-js/mdx";
import { MDXProvider } from "@mdx-js/react";
import { CircularProgress, Typography } from "@mui/material";
import { ErrorBoundary, Suspense } from "@suspensive/react";
import { useSuspenseQuery } from "@tanstack/react-query";

import { useCommonContext } from '../hooks/useCommonContext';

const useMDX = (text: string) => {
  const { baseUrl } = useCommonContext();

  return useSuspenseQuery({
    queryKey: ["mdx", text],
    queryFn: async () => {
      const { default: RenderResult } = await evaluate(text, { ...runtime, baseUrl });
      return (
        <MDXProvider>
          <RenderResult />
        </MDXProvider>
      );
    },
  });
}

const MDXErrorFallback: React.FC<{ error: Error }> = ({ error }) => {
  console.error(error);
  return (
    <Typography variant="body2" color="error">
      MDX 변환 오류: {error.message}
    </Typography>
  );
};

export const MDXRenderer: React.FC<{ text: string }> = ({ text }) => (
  <ErrorBoundary fallback={MDXErrorFallback}>
    <Suspense fallback={<CircularProgress />}>{useMDX(text).data}</Suspense>
  </ErrorBoundary>
);
