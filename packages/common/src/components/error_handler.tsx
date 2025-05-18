import * as React from "react";

import { Button, Typography } from "@mui/material";
import { Suspense } from "@suspensive/react";

import CommonContext from '../hooks/';

const DetailedErrorFallback: React.FC<{ error: Error, reset: () => void }> = ({ error, reset }) => {
  const errorObject = Object.getOwnPropertyNames(error).reduce((acc, key) => ({ ...acc, [key]: (error as unknown as { [key: string]: unknown })[key] }), {});
  return <>
    <Typography variant="body2" color="error">error.message = {error.message}</Typography>
    <details open>
      <summary>오류 상세</summary>
      <pre style={{
        whiteSpace: "pre-wrap",
        backgroundColor: "#f5f5f5",
        padding: "1em",
        borderRadius: "4px",
        userSelect: "text",
      }}>
        <code>{JSON.stringify(errorObject, null, 2)}</code>
      </pre>
    </details>
    <br />
    <Button variant="outlined" onClick={reset}>다시 시도</Button>
  </>;
};

const SimplifiedErrorFallback: React.FC<{ reset: () => void }> = ({ reset }) => {
  return <>
    <Typography variant="body2" color="error">
      문제가 발생했습니다, 잠시 후 다시 시도해주세요.<br />
      만약 문제가 계속 발생한다면, 파이콘 한국 준비 위원회에게 알려주세요!<br />
      <br />
      An error occurred, please try again later.<br />
      If the problem persists, please let the PyCon Korea organizing committee know!
    </Typography>
    <br />
    <Button variant="outlined" onClick={reset}>다시 시도 | Retry</Button>
  </>;
}

export const ErrorFallback: React.FC<{ error: Error, reset: () => void }> = ({ error, reset }) => {
  const InnerErrorFallback: React.FC<{ error: Error, reset: () => void }> = ({ error, reset }) => {
    const { debug } = CommonContext.useCommonContext();
    return debug ? <DetailedErrorFallback error={error} reset={reset} /> : <SimplifiedErrorFallback reset={reset} />;
  }

  return <Suspense fallback={<>로딩 중...</>}><InnerErrorFallback error={error} reset={reset} /></Suspense>
}
