import * as R from "remeda";

import ShopSchemas from "../schemas";
import { startPortOnePurchase as _startPortOnePurchase } from "./portone";

namespace ShopAPIUtil {
  export const getCustomResponsePattern = (optionGroup: Pick<ShopSchemas.OptionGroup, "custom_response_pattern">) => {
    const pattern = optionGroup.custom_response_pattern?.trim() ?? "";
    return R.isString(pattern) && !R.isEmpty(pattern) ? new RegExp(pattern, "g") : undefined;
  };

  export const isOrderProductOptionModifiable = (
    optionRel: ShopSchemas.OrderProductItem["options"][number]
  ): boolean => {
    if (!optionRel.product_option_group.is_custom_response) return false;

    if (R.isNullish(optionRel.product_option_group.response_modifiable_ends_at)) return true;
    else if (new Date() <= new Date(optionRel.product_option_group.response_modifiable_ends_at)) return true;

    return false;
  };

  export const startPortOnePurchase = _startPortOnePurchase;
}

export default ShopAPIUtil;
