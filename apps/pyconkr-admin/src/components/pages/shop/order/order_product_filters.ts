import { OrderProductStatus } from "@apps/pyconkr-admin/components/pages/shop/order/types";

// 주문 목록 필터(OrderAdminFilterSet)를 상품 단위 filterset(OrderProductRelationAdminFilterSet) 키로 옮기는 표.
// `status` 는 양쪽에 다 있지만 의미가 다르다 — 주문에선 결제 상태, 상품에선 상품 상태(pending/paid/used/refunded).
// django-filter 는 모르는 키를 조용히 무시하므로, 넘길 키를 명시한 allowlist 로 둔다.
// 주문 목록에 필터가 새로 생겨도 여기 없으면 자동으로 dropped 에 잡혀 경고로 노출된다 (대상이 몰래 넓어지지 않음).
const ORDER_PRODUCT_PARAM_BY_ORDER_PARAM: Record<string, string> = {
  id: "order_id",
  user_id: "user_id",
  user_unique_id: "user_unique_id",
  name: "name",
  email: "email",
  imp_id: "imp_id",
  status: "order_status",
  first_paid_at_after: "first_paid_at_after",
  first_paid_at_before: "first_paid_at_before",
  product_id: "product_id",
  category_id: "category_id",
  category_group_id: "category_group_id",
  event_id: "event_id",
  // price_min/max 는 의도적으로 제외 — 주문에선 주문 총액, 상품에선 상품 단가라 뜻이 달라 그대로 넘기면 안 된다.
};

/** 주문 필터 → 상품 필터. `dropped` 는 상품 filterset 이 지원하지 않아 무시된 주문 필터 키. */
export const toOrderProductParams = (orderParams: Record<string, string>): { params: Record<string, string>; dropped: string[] } => {
  const params: Record<string, string> = {};
  const dropped: string[] = [];
  for (const [key, value] of Object.entries(orderParams)) {
    const mappedKey = ORDER_PRODUCT_PARAM_BY_ORDER_PARAM[key];
    if (mappedKey) params[mappedKey] = value;
    else dropped.push(key);
  }
  return { params, dropped };
};

// 알림 발송 대상 queryset 은 PURCHASED_OR_REFUNDED_STATUS 로 미리 좁혀져 pending 이 애초에 대상이 아니다.
// 태그는 그런 제약이 없지만, 두 화면 모두 운영상 의미 있는 상태만 고르면 되므로 같은 목록을 쓴다.
export const SELECTABLE_OPR_STATUSES: OrderProductStatus[] = ["paid", "used", "refunded"];

export type ProductFilterState = {
  productIds: (string | number)[];
  statuses: OrderProductStatus[];
  ticketOnly: boolean;
};

export const EMPTY_PRODUCT_FILTER: ProductFilterState = { productIds: [], statuses: [], ticketOnly: false };

export const productFilterParams = (productFilter: ProductFilterState): Record<string, string> => ({
  ...(productFilter.productIds.length ? { product_id: productFilter.productIds.join(",") } : {}),
  ...(productFilter.statuses.length ? { status: productFilter.statuses.join(",") } : {}),
  ...(productFilter.ticketOnly ? { is_ticket: "true" } : {}),
});
