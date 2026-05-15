import { isEmpty, isNullish, isString } from "remeda";

import type { OptionGroup, OrderProductItem } from "@frontend/shop/schemas";

export { startPortOnePurchase } from "./portone";

export const getCustomResponsePattern = (optionGroup: Pick<OptionGroup, "custom_response_pattern">) => {
  const pattern = optionGroup.custom_response_pattern?.trim() ?? "";
  return isString(pattern) && !isEmpty(pattern) ? new RegExp(pattern, "g") : undefined;
};

export const isOrderProductOptionModifiable = (optionRel: OrderProductItem["options"][number]): boolean => {
  if (!optionRel.product_option_group.is_custom_response) return false;

  if (isNullish(optionRel.product_option_group.response_modifiable_ends_at)) return true;
  else if (new Date() <= new Date(optionRel.product_option_group.response_modifiable_ends_at)) return true;

  return false;
};
