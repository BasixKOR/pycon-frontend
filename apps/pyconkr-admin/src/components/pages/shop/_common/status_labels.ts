import { OrderProductStatus, PaymentStatus } from "@apps/pyconkr-admin/components/pages/shop/order/types";
import { ProductCurrentStatus } from "@apps/pyconkr-admin/components/pages/shop/product/types";

type ChipColor = "default" | "primary" | "success" | "warning" | "error" | "info";

export const PAYMENT_STATUS_LABEL: Record<PaymentStatus, { label: string; color: ChipColor }> = {
  pending: { label: "대기", color: "default" },
  completed: { label: "완료", color: "success" },
  partial_refunded: { label: "부분환불", color: "warning" },
  refunded: { label: "환불", color: "error" },
};

export const ORDER_PRODUCT_STATUS_LABEL: Record<OrderProductStatus, { label: string; color: ChipColor }> = {
  pending: { label: "대기", color: "default" },
  paid: { label: "결제완료", color: "success" },
  used: { label: "사용", color: "info" },
  refunded: { label: "환불", color: "error" },
};

export const PRODUCT_STATUS_LABEL: Record<ProductCurrentStatus, { label: string; color: ChipColor }> = {
  hidden: { label: "비공개", color: "default" },
  out_of_visible_period: { label: "노출 기간 아님", color: "default" },
  out_of_orderable_period: { label: "판매 기간 아님", color: "warning" },
  active: { label: "노출 중", color: "success" },
};
