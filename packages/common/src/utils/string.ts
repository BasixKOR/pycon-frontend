import * as R from "remeda";

export const isFilledString = (obj: unknown): obj is string => R.isString(obj) && !R.isEmpty(obj);

export const isValidHttpUrl = (obj: unknown): obj is string => {
  try {
    const url = new URL(obj as string);
    return url.protocol === "http:" || url.protocol === "https:";
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (_) {
    return false;
  }
};

// Remove whitespace from the right side of the input string.
export const rtrim = (x: string): string => x.replace(/\s+$/gm, "");
