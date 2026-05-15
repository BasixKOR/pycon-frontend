import { ErrorFallback as BaseErrorFallback } from "@frontend/common/components";
import { useCommonContext } from "@frontend/common/hooks/useCommonContext";
import { FC } from "react";
export const ErrorFallback: FC<{ error: Error; reset: () => void }> = ({ error, reset }) => {
  const { debug } = useCommonContext();
  return <BaseErrorFallback error={error} reset={reset} debug={debug} />;
};
