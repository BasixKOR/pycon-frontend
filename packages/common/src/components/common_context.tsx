import * as React from "react";

import { context, ContextOptions } from "@frontend/common/contexts";

type CommonContextProps = {
  options: ContextOptions;
  children: React.ReactNode;
};

export const CommonContextProvider: React.FC<CommonContextProps> = (props) => (
  <context.Provider value={props.options}>{props.children}</context.Provider>
);
