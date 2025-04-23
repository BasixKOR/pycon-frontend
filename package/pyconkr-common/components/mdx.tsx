import React from 'react';
import * as runtime from "react/jsx-runtime";

import { evaluate } from "@mdx-js/mdx";
import { MDXProvider } from "@mdx-js/react";
import { CircularProgress, Typography } from '@mui/material';
import { wrap } from '@suspensive/react';
import { useSuspenseQuery } from "@tanstack/react-query";

const useMDX = (text: string) => useSuspenseQuery({
  queryKey: ['mdx', text],
  queryFn: async () => {
    const { default: RenderResult } = await evaluate(text, { ...runtime, baseUrl: import.meta.url });
    return <MDXProvider><RenderResult /></MDXProvider>
  }
})

export const MDXRenderer: React.FC<{ text: string }> = wrap
  .ErrorBoundary({
    fallback: ({ error }) => {
      console.error('MDX 변환 오류:', error);
      return <Typography variant="body2" color="error">MDX 변환 오류: {error.message}</Typography>
    }
  })
  .Suspense({ fallback: <CircularProgress /> })
  .on(({ text }) => useMDX(text).data);
