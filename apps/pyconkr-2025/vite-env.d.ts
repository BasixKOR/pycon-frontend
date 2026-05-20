/// <reference types="vite/client" />
/// <reference types="vite-plugin-svgr/client" />
interface ViteTypeOptions {
  strictImportEnv: unknown;
}

interface ImportMetaEnv {
  readonly VITE_PYCONKR_BACKEND_API_DOMAIN: string;
  readonly VITE_PYCONKR_SHOP_IMP_ACCOUNT_ID: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
