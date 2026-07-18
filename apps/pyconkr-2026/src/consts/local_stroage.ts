export const LOCAL_STORAGE_LANGUAGE_KEY = "language";

/** 로그인 후 복귀할 위치를 잠시 보관하는 sessionStorage 키. */
export const PENDING_REDIRECT_KEY = "pyconkr-2026:pending-redirect";

export const SCHEDULE_LS_PREFIX = "pyconkr-2026:my-schedule";
export const scheduleStorageKey = (username: string | null): string =>
  username ? `${SCHEDULE_LS_PREFIX}:${username}` : `${SCHEDULE_LS_PREFIX}:__anon__`;
