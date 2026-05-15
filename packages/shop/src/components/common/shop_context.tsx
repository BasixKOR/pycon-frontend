import * as React from "react";

import { context, type ContextOptions } from "../../contexts";

type ShopContextProps = {
  options: ContextOptions;
  children: React.ReactNode;
};

export const ShopContextProvider: React.FC<ShopContextProps> = (props) => <context.Provider value={props.options}>{props.children}</context.Provider>;
