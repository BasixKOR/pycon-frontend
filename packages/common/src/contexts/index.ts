import { MDXComponents } from 'mdx/types';
import * as React from "react";

namespace GlobalContext {
  export type ContextOptions = {
    baseUrl: string;
    debug?: boolean;
    backendApiDomain: string;
    backendApiTimeout: number;
    mdxComponents?: MDXComponents;
  }

  export const context = React.createContext<ContextOptions>({
    baseUrl: "",
    debug: false,
    backendApiDomain: "",
    backendApiTimeout: 10000,
  });
}

export default GlobalContext;
