import { useContext } from "react";

import { context } from "@frontend/common/contexts";

export const useCommonContext = () => {
  const ctx = useContext(context);
  if (!ctx) {
    throw new Error("useCommonContext must be used within a CommonProvider");
  }
  return ctx;
};
