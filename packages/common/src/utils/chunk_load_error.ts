const RELOAD_FLAG_KEY = "__pyconkr_chunk_load_error_reload_at";
const RELOAD_DEBOUNCE_MS = 30_000;

const CHUNK_ERROR_PATTERNS: RegExp[] = [
  /Failed to fetch dynamically imported module/i,
  /error loading dynamically imported module/i,
  /Importing a module script failed/i,
  /Loading chunk \S+ failed/i,
  /Loading CSS chunk \S+ failed/i,
  /Unable to preload CSS/i,
];

export const isChunkLoadError = (error: unknown): boolean => {
  if (!error) return false;

  if (typeof error === "string") {
    return CHUNK_ERROR_PATTERNS.some((re) => re.test(error));
  }

  if (typeof error === "object") {
    const { name, message } = error as { name?: unknown; message?: unknown };
    // webpack runtime throws an Error subclass with name "ChunkLoadError"; Vite throws TypeError matched via the message patterns above.
    if (name === "ChunkLoadError") return true;
    if (typeof message === "string" && CHUNK_ERROR_PATTERNS.some((re) => re.test(message))) return true;
  }

  return false;
};

const recentlyReloaded = (): boolean => {
  try {
    const last = window.sessionStorage.getItem(RELOAD_FLAG_KEY);
    if (!last) return false;
    return Date.now() - Number(last) < RELOAD_DEBOUNCE_MS;
  } catch {
    return false;
  }
};

const markReloaded = (): void => {
  try {
    window.sessionStorage.setItem(RELOAD_FLAG_KEY, String(Date.now()));
  } catch {
    // sessionStorage may be blocked (storage permissions, quota); proceed without debounce.
  }
};

export const reloadForChunkLoadError = (): boolean => {
  if (typeof window === "undefined") return false;
  if (recentlyReloaded()) return false;
  markReloaded();
  window.location.reload();
  return true;
};

let handlerRegistered = false;

export const registerChunkLoadErrorReloadHandler = (): void => {
  if (typeof window === "undefined" || handlerRegistered) return;
  handlerRegistered = true;

  window.addEventListener("error", (event) => {
    if (isChunkLoadError(event.error ?? event.message)) reloadForChunkLoadError();
  });

  window.addEventListener("unhandledrejection", (event) => {
    if (isChunkLoadError(event.reason)) reloadForChunkLoadError();
  });
};
