import { isEmpty, isString } from "remeda";
export const getCookie = (name: string) => {
  if (!isString(document.cookie) || isEmpty(document.cookie)) return undefined;

  let cookieValue: string | undefined;
  document.cookie.split(";").forEach((cookie) => {
    if (isEmpty(cookie) || !cookie.includes("=")) return;
    const [key, value] = cookie.split("=", 2);
    if (key.trim() === name) cookieValue = decodeURIComponent(value) as string;
  });
  return cookieValue;
};

export const captureSessionTokenFromURL = (cookieName: string | undefined): void => {
  if (!cookieName) return;

  const hash = window.location.hash.replace(/^#/, "");
  if (!hash) return;

  const hashParams = new URLSearchParams(hash);
  const token = hashParams.get("session_token");
  if (!token) return;

  document.cookie = `${cookieName}=${encodeURIComponent(token)}; path=/; SameSite=Lax; Secure; Max-Age=1209600`;
  window.history.replaceState({}, "", window.location.pathname + window.location.search);
};
