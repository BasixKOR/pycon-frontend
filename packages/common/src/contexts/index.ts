import * as React from "react";

import { MDXComponents } from 'mdx/types';

namespace GlobalContext {
  export type ContextOptions = {
    frontendDomain?: string;
    baseUrl: string;
    debug?: boolean;
    backendApiDomain: string;
    backendApiTimeout: number;
    backendApiCSRFCookieName?: string;
    mdxComponents?: MDXComponents;
  }

  export const context = React.createContext<ContextOptions>({
    frontendDomain: "",
    baseUrl: "",
    debug: false,
    backendApiDomain: "",
    backendApiTimeout: 10000,
    backendApiCSRFCookieName: "",
  });
}

export default GlobalContext;
