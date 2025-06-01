import * as React from "react";

import GlobalContext from "../contexts";

type CommonContextProps = {
  options: GlobalContext.ContextOptions;
  children: React.ReactNode;
};

export const CommonContextProvider: React.FC<CommonContextProps> = (props) => (
  <GlobalContext.context.Provider value={props.options}>{props.children}</GlobalContext.context.Provider>
);
