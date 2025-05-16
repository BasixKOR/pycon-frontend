import * as React from "react";

import GlobalContext from "../contexts";

export const useCommonContext = () => {
  const context = React.useContext(GlobalContext.context);
  if (!context) {
    throw new Error('useCommonContext must be used within a CommonProvider');
  }
  return context;
};
