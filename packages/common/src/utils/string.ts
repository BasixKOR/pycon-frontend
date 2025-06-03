import * as R from "remeda";

export const isFilledString = (obj: unknown): obj is string => R.isString(obj) && !R.isEmpty(obj);

// Remove whitespace from the right side of the input string.
export const rtrim = (x: string): string => x.replace(/\s+$/gm, "");
