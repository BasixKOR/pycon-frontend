import { MDXComponents } from "mdx/types";
import { createContext } from "react";
export type ContextOptions = {
  language: "ko" | "en";
  frontendDomain?: string;
  baseUrl: string;
  debug?: boolean;
  backendApiDomain: string;
  backendApiTimeout: number;
  backendApiCSRFCookieName?: string;
  mdxComponents?: MDXComponents;
};

export const context = createContext<ContextOptions>({
  language: "ko",
  frontendDomain: "",
  baseUrl: "",
  debug: false,
  backendApiDomain: "",
  backendApiTimeout: 10000,
  backendApiCSRFCookieName: "",
});
