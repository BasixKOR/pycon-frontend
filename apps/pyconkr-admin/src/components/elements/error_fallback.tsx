import { Components } from "@frontend/common";
import { useCommonContext } from "@frontend/common/src/hooks/useCommonContext";
import * as React from "react";

export const ErrorFallback: React.FC<{ error: Error; reset: () => void }> = ({ error, reset }) => {
  const { debug } = useCommonContext();
  return <Components.ErrorFallback error={error} reset={reset} debug={debug} />;
};
