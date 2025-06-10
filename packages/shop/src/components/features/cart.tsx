import { ExpandMore } from "@mui/icons-material";
import {
  Accordion,
  AccordionActions,
  AccordionDetails,
  AccordionSummary,
  Button,
  CircularProgress,
  Divider,
  Stack,
  Typography,
} from "@mui/material";
import { ErrorBoundary, Suspense } from "@suspensive/react";
import { useQueryClient } from "@tanstack/react-query";
import * as React from "react";
import * as R from "remeda";

import ShopHooks from "../../hooks";
import ShopSchemas from "../../schemas";
import ShopUtils from "../../utils";
import CommonComponents from "../common";

const CartItem: React.FC<{
  language: "ko" | "en";
  cartProdRel: ShopSchemas.OrderProductItem;
  removeItemFromCartFunc: (cartProductId: string) => void;
  disabled?: boolean;
}> = ({ language, cartProdRel, disabled, removeItemFromCartFunc }) => {
  const cannotModifyOptionsStr =
    language === "ko"
      ? "상품 옵션을 수정하려면 장바구니에서 상품을 삭제한 후 다시 담아주세요."
      : "To modify product options, please remove the item from the cart and add it again.";
  const productPriceStr = language === "ko" ? "상품 가격" : "Product Price";
  const removeFromCartStr = language === "ko" ? "장바구니에서 상품 삭제" : "Remove from Cart";

  return (
    <Accordion>
      <AccordionSummary expandIcon={<ExpandMore />}>
        <Typography variant="h6" sx={{ width: "100%", flexShrink: 0 }}>
          {cartProdRel.product.name}
        </Typography>
      </AccordionSummary>
      <AccordionDetails>
        <Stack spacing={2} sx={{ width: "100%" }}>
          {cartProdRel.options.map((optionRel) => (
            <CommonComponents.OrderProductRelationOptionInput
              key={optionRel.product_option_group.id + (optionRel.product_option?.id || "")}
              optionRel={optionRel}
              disabled
              disabledReason={cannotModifyOptionsStr}
            />
          ))}
        </Stack>
        <br />
        <Divider />
        <br />
        <Typography variant="h6" sx={{ textAlign: "end" }}>
          {productPriceStr}: <CommonComponents.PriceDisplay price={cartProdRel.price} />
        </Typography>
      </AccordionDetails>
      <AccordionActions>
        <Button
          variant="contained"
          color="secondary"
          onClick={() => removeItemFromCartFunc(cartProdRel.id)}
          disabled={disabled}
          children={removeFromCartStr}
        />
      </AccordionActions>
    </Accordion>
  );
};

export const CartStatus: React.FC<{ onPaymentCompleted?: () => void }> = Suspense.with(
  { fallback: <CircularProgress /> },
  ({ onPaymentCompleted }) => {
    const queryClient = useQueryClient();
    const { language } = ShopHooks.useShopContext();
    const shopAPIClient = ShopHooks.useShopClient();
    const cartOrderStartMutation = ShopHooks.usePrepareCartOrderMutation(shopAPIClient);
    const removeItemFromCartMutation = ShopHooks.useRemoveItemFromCartMutation(shopAPIClient);

    const cartIsEmptyStr = language === "ko" ? "장바구니가 비어있어요!" : "Your cart is empty!";
    const totalPriceStr = language === "ko" ? "총 결제 금액" : "Total Payment Amount";
    const orderCartStr = language === "ko" ? "장바구니에 담긴 상품 결제" : "Pay for Items in Cart";
    const errorWhileLoadingCartStr =
      language === "ko"
        ? "장바구니 정보를 불러오는 중 문제가 발생했습니다."
        : "An error occurred while loading the cart information.";
    const errorWhilePreparingOrderStr =
      language === "ko"
        ? "장바구니 결제 준비 중 문제가 발생했습니다.\n잠시 후 다시 시도해주세요."
        : "An error occurred while preparing the cart order.\nPlease try again later.";
    const failedToOrderStr =
      language === "ko"
        ? "장바구니 결제에 실패했습니다.\n잠시 후 다시 시도해주세요.\n"
        : "Failed to complete the cart order.\nPlease try again later.\n";

    const removeItemFromCart = (cartProductId: string) => removeItemFromCartMutation.mutate({ cartProductId });
    const startCartOrder = () =>
      cartOrderStartMutation.mutate(undefined, {
        onSuccess: (order: ShopSchemas.Order) => {
          ShopUtils.startPortOnePurchase(
            order,
            () => {
              queryClient.invalidateQueries();
              queryClient.resetQueries();
              onPaymentCompleted?.();
            },
            (response) => alert(failedToOrderStr + response.error_msg),
            () => {}
          );
        },
        onError: (error) => alert(error.message || errorWhilePreparingOrderStr),
      });

    const disabled = removeItemFromCartMutation.isPending || cartOrderStartMutation.isPending;

    const WrappedShopCartList: React.FC = () => {
      const { data } = ShopHooks.useCart(shopAPIClient);

      return !R.isArray(data.products) || data.products.length === 0 ? (
        <Typography variant="body1" color="error">
          {cartIsEmptyStr}
        </Typography>
      ) : (
        <>
          {data.products.map((prodRel) => (
            <CartItem
              language={language}
              key={prodRel.id}
              cartProdRel={prodRel}
              disabled={disabled}
              removeItemFromCartFunc={removeItemFromCart}
            />
          ))}
          <br />
          <Divider />
          <Typography variant="h6" sx={{ textAlign: "end" }}>
            {totalPriceStr}: <CommonComponents.PriceDisplay price={data.first_paid_price} />
          </Typography>
          <Button variant="contained" color="secondary" onClick={startCartOrder} disabled={disabled}>
            {orderCartStr}
          </Button>
        </>
      );
    };

    return (
      <CommonComponents.SignInGuard>
        <ErrorBoundary fallback={errorWhileLoadingCartStr}>
          <Suspense fallback={<CircularProgress />}>
            <WrappedShopCartList />
          </Suspense>
        </ErrorBoundary>
      </CommonComponents.SignInGuard>
    );
  }
);
