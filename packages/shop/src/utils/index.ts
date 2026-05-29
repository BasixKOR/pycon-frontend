import { isEmpty, isNullish, isString } from "remeda";

import type { OptionGroup, OrderProductItem, Product } from "@frontend/shop/schemas";

export { startPortOnePurchase } from "./portone";

export const getCustomResponsePattern = (optionGroup: Pick<OptionGroup, "custom_response_pattern">) => {
  const pattern = optionGroup.custom_response_pattern?.trim() ?? "";
  return isString(pattern) && !isEmpty(pattern) ? new RegExp(pattern, "g") : undefined;
};

export const isOrderProductOptionModifiable = (optionRel: OrderProductItem["options"][number]): boolean => {
  if (!optionRel.product_option_group.is_custom_response) return false;
  if (isNullish(optionRel.product_option_group.response_modifiable_ends_at)) return false;
  return new Date() <= new Date(optionRel.product_option_group.response_modifiable_ends_at);
};

// 옵션 그룹에 인스턴스를 더 추가할 수 없는 사유 (한도/재고). orderable 기간 만료는 별도 헬퍼.
// null = 추가 가능.
export const getCannotAddMoreOptionGroupReason = (
  language: "ko" | "en",
  group: Pick<OptionGroup, "max_quantity_per_product" | "leftover_stock_per_user" | "leftover_stock_info">,
  currentInstanceCount: number
): string | null => {
  // max_quantity_per_product = 0 → 무제한 sentinel
  if (group.max_quantity_per_product > 0 && currentInstanceCount >= group.max_quantity_per_product) {
    return language === "ko"
      ? `이 옵션은 주문당 최대 ${group.max_quantity_per_product}개까지 선택할 수 있어요.`
      : `You can select up to ${group.max_quantity_per_product} of this option per order.`;
  }
  const userLeftover = group.leftover_stock_per_user;
  if (userLeftover === null || currentInstanceCount < userLeftover) return null;

  // binding limit 식별
  const info = group.leftover_stock_info;
  if (info.product_leftover_stock !== null && info.product_leftover_stock === userLeftover) {
    return language === "ko" ? "상품 재고가 부족해 더 이상 선택할 수 없어요." : "Not enough product stock to select more.";
  }
  if (info.option_group_max_quantity_per_user !== null && info.option_group_max_quantity_per_user === userLeftover) {
    return language === "ko"
      ? "이 옵션의 사용자당 구매 한도에 도달했어요."
      : "You've reached the per-user limit for this option.";
  }
  if (info.product_max_quantity_per_user !== null && info.product_max_quantity_per_user === userLeftover) {
    return language === "ko" ? "이 상품의 사용자당 구매 한도에 도달했어요." : "You've reached the per-user limit for this product.";
  }
  return language === "ko" ? "더 이상 선택할 수 없어요." : "Cannot select more.";
};

// 그룹의 orderable_* 가 null 이면 product 의 동일 필드로 fallback — 백엔드 effective_orderable_period 와 동일.
export const getOptionGroupNotOrderableReason = (
  language: "ko" | "en",
  product: Pick<Product, "orderable_starts_at" | "orderable_ends_at">,
  group: Pick<OptionGroup, "orderable_starts_at" | "orderable_ends_at">
): string | null => {
  const now = new Date();
  const startsAt = new Date(group.orderable_starts_at ?? product.orderable_starts_at);
  const endsAt = new Date(group.orderable_ends_at ?? product.orderable_ends_at);

  if (startsAt > now) {
    return language === "ko"
      ? `이 옵션은 아직 판매되지 않아요 (${startsAt.toLocaleString()}부터).`
      : `This option is not yet available (starts at ${startsAt.toLocaleString()}).`;
  }
  if (endsAt < now) {
    return language === "ko" ? "이 옵션은 판매가 종료됐어요." : "This option is no longer available for purchase.";
  }
  return null;
};
