import * as React from 'react';

namespace ShopContext {
  export type ContextOptions = {
    shopApiDomain: string;
    shopApiCSRFCookieName: string;
    shopApiTimeout: number;
    shopImpAccountId: string;
  };

  export const context = React.createContext<ContextOptions>({
    shopApiDomain: "",
    shopApiCSRFCookieName: "",
    shopApiTimeout: 10000,
    shopImpAccountId: "",
  });
}

export default ShopContext;
