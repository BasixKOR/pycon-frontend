import { FC, ReactNode } from "react";

import { context, type ContextOptions } from "@frontend/shop/contexts";

type ShopContextProps = {
  options: ContextOptions;
  children: ReactNode;
};

export const ShopContextProvider: FC<ShopContextProps> = (props) => <context.Provider value={props.options}>{props.children}</context.Provider>;
