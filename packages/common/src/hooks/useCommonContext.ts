import * as React from "react";

import { context } from "@frontend/common/contexts";

export const useCommonContext = () => {
  const ctx = React.useContext(context);
  if (!ctx) {
    throw new Error("useCommonContext must be used within a CommonProvider");
  }
  return ctx;
};
