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
