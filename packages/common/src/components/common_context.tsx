import { FC, ReactNode } from "react";

import { context, ContextOptions } from "@frontend/common/contexts";

type CommonContextProps = {
  options: ContextOptions;
  children: ReactNode;
};

export const CommonContextProvider: FC<CommonContextProps> = (props) => <context.Provider value={props.options}>{props.children}</context.Provider>;
