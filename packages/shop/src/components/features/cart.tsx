import * as Common from "@frontend/common";
import { AccordionProps, Backdrop, Button, CircularProgress, Divider, Stack, Typography } from "@mui/material";
import { ErrorBoundary, Suspense } from "@suspensive/react";
import { useQueryClient } from "@tanstack/react-query";
import { enqueueSnackbar, OptionsObject } from "notistack";
import * as React from "react";
import { useNavigate } from "react-router-dom";
import * as R from "remeda";

import ShopHooks from "../../hooks";
import ShopSchemas from "../../schemas";
import ShopUtils from "../../utils";
import CommonComponents from "../common";

const CartItem: React.FC<
  Omit<AccordionProps, "children"> & {
    language: "ko" | "en";
    cartProdRel: ShopSchemas.OrderProductItem;
    removeItemFromCartFunc: (cartProductId: string) => void;
    disabled?: boolean;
  }
> = ({ language, cartProdRel, disabled, removeItemFromCartFunc, ...props }) => {
  const cannotModifyOptionsStr =
    language === "ko"
      ? "상품 옵션을 수정하려면 장바구니에서 상품을 삭제한 후 다시 담아주세요."
      : "To modify product options, please remove the item from the cart and add it again.";
  const productPriceStr = language === "ko" ? "상품 가격" : "Product Price";
  const removeFromCartStr = language === "ko" ? "장바구니에서 상품 삭제" : "Remove from Cart";

  return (
    <Common.Components.MDX.PrimaryStyledDetails
      {...props}
      summary={cartProdRel.product.name}
      actions={[
        <Button
          variant="contained"
          color="secondary"
          onClick={() => removeItemFromCartFunc(cartProdRel.id)}
          disabled={disabled}
          children={removeFromCartStr}
        />,
      ]}
    >
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
        {productPriceStr}: <CommonComponents.PriceDisplay price={cartProdRel.price + cartProdRel.donation_price} />
      </Typography>
    </Common.Components.MDX.PrimaryStyledDetails>
  );
};

type CartStatusStateType = {
  openDialog: boolean;
  openBackdrop: boolean;
};

export const CartStatus: React.FC = Suspense.with({ fallback: <CircularProgress /> }, () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const { language, shopImpAccountId } = ShopHooks.useShopContext();
  const shopAPIClient = ShopHooks.useShopClient();
  const cartOrderStartMutation = ShopHooks.usePrepareCartOrderMutation(shopAPIClient);
  const removeItemFromCartMutation = ShopHooks.useRemoveItemFromCartMutation(shopAPIClient);
  const [state, setState] = React.useState<CartStatusStateType>({
    openDialog: false,
    openBackdrop: false,
  });

  const addSnackbar = (c: string | React.ReactNode, variant: OptionsObject["variant"]) =>
    enqueueSnackbar(c, { variant, anchorOrigin: { vertical: "bottom", horizontal: "center" } });

  const cartIsEmptyStr = language === "ko" ? "장바구니가 비어있어요!" : "Your cart is empty!";
  const totalPriceStr = language === "ko" ? "총 결제 금액" : "Total Payment Amount";
  const orderCartStr = language === "ko" ? "장바구니에 담긴 상품 결제" : "Pay for Items in Cart";
  const succeededToRemoveItemFromCartStr = language === "ko" ? "장바구니에서 상품을 삭제했습니다." : "Item has been removed from the cart.";
  const errorWhileLoadingCartStr =
    language === "ko" ? "장바구니 정보를 불러오는 중 문제가 발생했습니다." : "An error occurred while loading the cart information.";
  const errorWhilePreparingOrderStr =
    language === "ko"
      ? "장바구니 결제 준비 중 문제가 발생했습니다.\n잠시 후 다시 시도해주세요."
      : "An error occurred while preparing the cart order.\nPlease try again later.";
  const failedToOrderStr =
    language === "ko"
      ? "장바구니 결제에 실패했습니다.\n잠시 후 다시 시도해주세요.\n"
      : "Failed to complete the cart order.\nPlease try again later.\n";

  const removeItemFromCart = (cartProductId: string) =>
    removeItemFromCartMutation.mutate(
      { cartProductId },
      {
        onSuccess: () => addSnackbar(succeededToRemoveItemFromCartStr, "success"),
        onError: (error) => addSnackbar(error.message || errorWhilePreparingOrderStr, "error"),
      }
    );

  const openDialog = () => setState((ps) => ({ ...ps, openDialog: true }));
  const closeDialog = () => setState((ps) => ({ ...ps, openDialog: false }));
  const openBackdrop = () => setState((ps) => ({ ...ps, openBackdrop: true }));
  const closeBackdrop = () => setState((ps) => ({ ...ps, openBackdrop: false }));

  const onFormSubmit = (formData: ShopSchemas.CustomerInfo) => {
    closeDialog();
    openBackdrop();
    cartOrderStartMutation.mutate(formData, {
      onSuccess: (order: ShopSchemas.Order) => {
        ShopUtils.startPortOnePurchase(
          shopImpAccountId,
          order,
          () => {
            queryClient.invalidateQueries();
            queryClient.resetQueries();
            navigate("/store/thank-you-for-your-purchase");
          },
          (response) => alert(failedToOrderStr + response.error_msg),
          closeBackdrop
        );
      },
      onError: (error) => alert(error.message || errorWhilePreparingOrderStr),
    });
  };

  const disabled = removeItemFromCartMutation.isPending || cartOrderStartMutation.isPending;

  const WrappedShopCartList: React.FC = () => {
    const { data } = ShopHooks.useCart(shopAPIClient);

    return !R.isArray(data.products) || data.products.length === 0 ? (
      <Typography variant="body1" color="error">
        {cartIsEmptyStr}
      </Typography>
    ) : (
      <>
        <Backdrop sx={(theme) => ({ zIndex: theme.zIndex.drawer + 1 })} open={state.openBackdrop} onClick={() => {}} />
        <CommonComponents.CustomerInfoFormDialog
          open={state.openDialog}
          closeFunc={closeDialog}
          onSubmit={onFormSubmit}
          defaultValue={data.customer_info}
        />
        <Stack spacing={2}>
          <Common.Components.MDX.OneDetailsOpener>
            {data.products.map((prodRel) => (
              <CartItem language={language} key={prodRel.id} cartProdRel={prodRel} disabled={disabled} removeItemFromCartFunc={removeItemFromCart} />
            ))}
          </Common.Components.MDX.OneDetailsOpener>
        </Stack>
        <br />
        <Divider />
        <Typography variant="h6" sx={{ textAlign: "end" }}>
          {totalPriceStr}: <CommonComponents.PriceDisplay price={data.first_paid_price} />
        </Typography>
        <Button variant="contained" color="secondary" onClick={openDialog} disabled={disabled}>
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
});
