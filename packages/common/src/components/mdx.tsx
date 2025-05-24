import * as React from "react";
import * as runtime from "react/jsx-runtime";
import * as R from "remeda";

import { evaluate } from "@mdx-js/mdx";
import * as provider from "@mdx-js/react";
import { CircularProgress } from "@mui/material";
import { ErrorBoundary } from "@suspensive/react";
import type { MDXComponents } from "mdx/types";
import muiComponents from 'mui-mdx-components';

import Hooks from "../hooks";
import { ErrorFallback } from "./error_handler";

const CustomMDXComponents: MDXComponents = {
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

const lineFormatterForMDX = (line: string) => {
  const trimmedLine = line.trim();

  if (R.isEmpty(trimmedLine)) return "\n";

  // import문을 위한 꼼수 - import문 다음 줄은 반드시 빈 줄이어야 합니다.
  // 그러나 \n\n으로 변환할 경우, 다음 단계에서 <br />로 변환되므로, import문 다음에 공백이 있는 줄을 넣어서 <br />로 변환되지 않도록 합니다.
  if (trimmedLine.startsWith("import")) return `${trimmedLine}\n \n`;

  return `${trimmedLine}  \n`;
}

export const MDXRenderer: React.FC<{ text: string; resetKey?: number }> = ({ text, resetKey }) => {
  const { baseUrl, mdxComponents } = Hooks.Common.useCommonContext();
  const [state, setState] = React.useState<{ component: React.ReactNode, resetKey: number }>({
    component: <CircularProgress />,
    resetKey: Math.random(),
  })

  const setRenderResult = (component: React.ReactNode) => setState((prev) => ({ ...prev, component: component }));
  const setRandomResetKey = () => setState((prev) => ({ ...prev, resetKey: Math.random() }))

  React.useEffect(() => {
    (
      async () => {
        try {
          // 원래 MDX는 각 줄의 마지막에 공백 2개가 있어야 줄바꿈이 되고, 또 연속 줄바꿈은 무시되지만,
          // 편의성을 위해 렌더러 단에서 공백 2개를 추가하고 연속 줄바꿈을 <br />로 변환합니다.
          const processedText = text.split("\n").map(lineFormatterForMDX).join("").replaceAll("\n\n", "\n<br />\n");
          const { default: RenderResult } = await evaluate(processedText, { ...runtime, ...provider, baseUrl });
          setRenderResult(<RenderResult components={muiComponents({ overrides: { ...CustomMDXComponents, ...(mdxComponents || {}) } })} />);
        } catch (error) {
          setRenderResult(<ErrorFallback error={error as Error} reset={setRandomResetKey} />);
        }
      }
    )();
  }, [text, resetKey, state.resetKey]);

  return <ErrorBoundary fallback={ErrorFallback} resetKeys={[text, resetKey, state.resetKey]}>{state.component}</ErrorBoundary>
};
