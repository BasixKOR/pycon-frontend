import * as React from "react";
import * as runtime from "react/jsx-runtime";

import { evaluate, EvaluateOptions } from "@mdx-js/mdx";
import { CircularProgress, Typography } from "@mui/material";
import { ErrorBoundary, Suspense } from "@suspensive/react";
import { useSuspenseQuery } from "@tanstack/react-query";
import components, { MuiMdxComponentsOptions } from 'mui-mdx-components';
import * as R from "remeda";

import { useCommonContext } from '../hooks/useCommonContext';

const MDXComponents: MuiMdxComponentsOptions = {
  overrides: {
    'h1': (props) => <h1 {...props} />,
    'h2': (props) => <h2 {...props} />,
    'h3': (props) => <h3 {...props} />,
    'h4': (props) => <h4 {...props} />,
    'h5': (props) => <h5 {...props} />,
    'h6': (props) => <h6 {...props} />,
    'strong': (props) => <strong {...props} />,
    'em': (props) => <em {...props} />,
    'ul': (props) => <ul {...props} />,
    'ol': (props) => <ol {...props} />,
    'li': (props) => <li {...props} />,
  }
}

const useMDX = (text: string) => {
  const { baseUrl } = useCommonContext();
  const options: EvaluateOptions = { ...runtime, baseUrl }

  return useSuspenseQuery({
    queryKey: ["mdx", text],
    queryFn: async () => {
      const { default: RenderResult } = await evaluate(text, options);
      return <div className="markdown-body">
        <RenderResult components={components(MDXComponents)} />
      </div>
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

const InnerMDXRenderer: React.FC<{ text: string }> = ({ text }) => {
  const { data } = useMDX(text);
  return <>{data}</>;
}

export const MDXRenderer: React.FC<{ text: string }> = ({ text }) => {
  // 원래 MDX는 각 줄의 마지막에 공백 2개가 있어야 줄바꿈이 되고, 또 연속 줄바꿈은 무시되지만,
  // 편의성을 위해 렌더러 단에서 공백 2개를 추가하고 연속 줄바꿈을 <br />로 변환합니다.
  let processedText = text.split("\n").map((line) => R.isEmpty(line.trim()) ? "" : `${line.trim()}  `).join("\n").replaceAll("\n\n", "\n<br />\n");

  return <ErrorBoundary fallback={MDXErrorFallback}>
    <Suspense fallback={<CircularProgress />}>
      <InnerMDXRenderer text={processedText} />
    </Suspense>
  </ErrorBoundary>
};
