import * as React from "react";

namespace GlobalContext {
  export type ContextOptions = {
    baseUrl: string;
  }

  export const context = React.createContext<ContextOptions>({
    baseUrl: "",
  });
}

export default GlobalContext;
