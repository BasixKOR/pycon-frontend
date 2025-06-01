/// <reference types="vite/client" />
import * as React from "react";

declare module "*.svg?react" {
  const component: React.FC<React.SVGProps<SVGSVGElement>>;
  export default component;
}

interface ViteTypeOptions {
  strictImportEnv: unknown;
}

interface ImportMetaEnv {
  readonly VITE_PYCONKR_FRONTEND_DOMAIN: string;
  readonly VITE_PYCONKR_BACKEND_API_DOMAIN: string;
  readonly VITE_PYCONKR_SHOP_API_DOMAIN: string;
  readonly VITE_PYCONKR_SHOP_CSRF_COOKIE_NAME: string;
  readonly VITE_PYCONKR_SHOP_IMP_ACCOUNT_ID: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
