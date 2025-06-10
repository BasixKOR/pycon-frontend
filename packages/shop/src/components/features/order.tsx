import * as Common from "@frontend/common";
import { Button, CircularProgress, Divider, Stack, Typography } from "@mui/material";
import { ErrorBoundary, Suspense } from "@suspensive/react";
import * as React from "react";
import * as R from "remeda";

import ShopHooks from "../../hooks";
import ShopSchemas from "../../schemas";
import ShopUtils from "../../utils";
import CommonComponents from "../common";

const PaymentHistoryStatusTranslated: {
  [k in ShopSchemas.PaymentHistoryStatus]: string;
} = {
  pending: "결제 대기중",
  completed: "결제 완료",
  partial_refunded: "부분 환불됨",
  refunded: "환불됨",
};

type OrderProductRelationItemProps = {
  order: ShopSchemas.Order;
  prodRel: ShopSchemas.OrderProductItem;
  isPending: boolean;
  oneItemRefundMutation: ReturnType<typeof ShopHooks.useOneItemRefundMutation>;
  optionsOfOneItemInOrderPatchMutation: ReturnType<typeof ShopHooks.useOptionsOfOneItemInOrderPatchMutation>;
};

const OrderProductRelationItem: React.FC<OrderProductRelationItemProps> = ({
  order,
  prodRel,
  isPending,
  oneItemRefundMutation,
  optionsOfOneItemInOrderPatchMutation,
}) => {
  const formRef = React.useRef<HTMLFormElement>(null);
  const currentCustomOptionValues: { [k: string]: string } = prodRel.options
    .filter((optionRel) => ShopUtils.isOrderProductOptionModifiable(optionRel))
    .reduce(
      (acc, optionRel) => ({
        ...acc,
        [optionRel.product_option_group.id]: optionRel.custom_response,
      }),
      {}
    );

  const hasPatchableOption = Object.entries(currentCustomOptionValues).length > 0;
  const patchOptionBtnDisabled = isPending || !hasPatchableOption;

  const refundBtnDisabled = isPending || !R.isNullish(prodRel.not_refundable_reason);
  const refundBtnText = R.isNullish(prodRel.not_refundable_reason)
    ? "단일 상품 환불"
    : prodRel.status === "refunded"
      ? "환불됨"
      : prodRel.not_refundable_reason;

  const refundOneItem = () =>
    oneItemRefundMutation.mutate({
      order_id: order.id,
      order_product_relation_id: prodRel.id,
    });
  const patchOneItemOptions = () => {
    if (!Common.Utils.isFormValid(formRef.current)) throw new Error("Form is not valid");

    const modifiedCustomOptionValues: ShopSchemas.OrderOptionsPatchRequest["options"] = Object.entries(
      Common.Utils.getFormValue<{ [key: string]: string }>({
        form: formRef.current,
      })
    )
      .filter(([key, value]) => currentCustomOptionValues[key] !== value)
      .map(([key, value]) => ({
        order_product_option_relation: key,
        custom_response: value,
      }));

    optionsOfOneItemInOrderPatchMutation.mutate({
      order_id: order.id,
      order_product_relation_id: prodRel.id,
      options: modifiedCustomOptionValues,
    });
  };

  const actionButtons = (
    <>
      <Button variant="contained" fullWidth onClick={patchOneItemOptions} disabled={patchOptionBtnDisabled}>
        옵션 수정
      </Button>
      <Button variant="contained" fullWidth onClick={refundOneItem} disabled={refundBtnDisabled}>
        {refundBtnText}
      </Button>
    </>
  );

  return (
    <Common.Components.MDX.PrimaryStyledDetails key={prodRel.id} summary={prodRel.product.name} actions={actionButtons}>
      <form
        ref={formRef}
        onSubmit={(e) => {
          e.preventDefault();
          patchOneItemOptions();
        }}
      >
        <Stack spacing={2} sx={{ width: "100%" }}>
          {prodRel.options.map((optionRel) => (
            <CommonComponents.OrderProductRelationOptionInput
              key={optionRel.product_option_group.id + (optionRel.product_option?.id || "")}
              optionRel={optionRel}
              disabled={isPending}
            />
          ))}
        </Stack>
      </form>
    </Common.Components.MDX.PrimaryStyledDetails>
  );
};

const OrderItem: React.FC<{ order: ShopSchemas.Order; disabled?: boolean }> = ({ order, disabled }) => {
  const { shopApiDomain } = ShopHooks.useShopContext();
  const shopAPIClient = ShopHooks.useShopClient();
  const orderRefundMutation = ShopHooks.useOrderRefundMutation(shopAPIClient);
  const oneItemRefundMutation = ShopHooks.useOneItemRefundMutation(shopAPIClient);
  const optionsOfOneItemInOrderPatchMutation = ShopHooks.useOptionsOfOneItemInOrderPatchMutation(shopAPIClient);

  const refundOrder = () => orderRefundMutation.mutate({ order_id: order.id });
  const openReceipt = () => window.open(`${shopApiDomain}/v1/orders/${order.id}/receipt/`, "_blank");

  const isPending =
    disabled ||
    orderRefundMutation.isPending ||
    oneItemRefundMutation.isPending ||
    optionsOfOneItemInOrderPatchMutation.isPending;
  const refundBtnDisabled = isPending || !R.isNullish(order.not_fully_refundable_reason);
  const receipyBtnDisabled = isPending || order.current_status === "pending";
  const btnText = R.isNullish(order.not_fully_refundable_reason)
    ? "주문 전체 환불"
    : order.current_status === "refunded"
      ? "주문 전체 환불됨"
      : order.not_fully_refundable_reason;

  const actionButtons = (
    <>
      <Button variant="contained" fullWidth onClick={openReceipt} disabled={receipyBtnDisabled}>
        영수증
      </Button>
      <Button variant="contained" fullWidth onClick={refundOrder} disabled={refundBtnDisabled}>
        {btnText}
      </Button>
    </>
  );

  return (
    <Common.Components.MDX.PrimaryStyledDetails summary={order.name} actions={actionButtons}>
      <Divider />
      <br />
      <Typography variant="body1">
        주문 결제 금액 : <CommonComponents.PriceDisplay price={order.current_paid_price} />
      </Typography>
      <Typography variant="body1">상태: {PaymentHistoryStatusTranslated[order.current_status]}</Typography>
      <br />
      <Divider />
      <br />
      <Typography variant="body1">주문 상품 목록</Typography>
      <br />
      {order.products.map((prodRel) => (
        <OrderProductRelationItem
          key={prodRel.id}
          order={order}
          prodRel={prodRel}
          isPending={isPending}
          oneItemRefundMutation={oneItemRefundMutation}
          optionsOfOneItemInOrderPatchMutation={optionsOfOneItemInOrderPatchMutation}
        />
      ))}
      <br />
      <Divider />
    </Common.Components.MDX.PrimaryStyledDetails>
  );
};

export const OrderList: React.FC = () => {
  const WrappedOrderList: React.FC = () => {
    const shopAPIClient = ShopHooks.useShopClient();
    const { data } = ShopHooks.useOrders(shopAPIClient);

    return data.map((item) => <OrderItem key={item.id} order={item} />);
  };

  return (
    <CommonComponents.SignInGuard>
      <ErrorBoundary fallback={<div>주문 내역을 불러오는 중 문제가 발생했습니다.</div>}>
        <Suspense fallback={<CircularProgress />}>
          <WrappedOrderList />
        </Suspense>
      </ErrorBoundary>
    </CommonComponents.SignInGuard>
  );
};
