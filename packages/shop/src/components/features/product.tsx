import * as Common from "@frontend/common";
import { AccordionProps, Button, ButtonProps, CircularProgress, Divider, Stack, Typography } from "@mui/material";
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

const getCartAppendRequestPayload = (
  product: ShopSchemas.Product,
  formRef: React.RefObject<HTMLFormElement | null>
): ShopSchemas.CartItemAppendRequest => {
  if (!Common.Utils.isFormValid(formRef.current)) throw new Error("Form is not valid");

  const options = Object.entries(
    Common.Utils.getFormValue<{ [key: string]: string }>({
      form: formRef.current,
    })
  ).map(([product_option_group, value]) => {
    const optionGroup = product.option_groups.find((group) => group.id === product_option_group);
    if (!optionGroup) throw new Error(`Option group ${product_option_group} not found`);

    const product_option = optionGroup.is_custom_response ? null : value;
    const custom_response = optionGroup.is_custom_response ? value : null;
    return { product_option_group, product_option, custom_response };
  });
  return { product: product.id, options };
};

const getProductNotPurchasableReason = (language: "ko" | "en", product: ShopSchemas.Product): string | null => {
  // 상품이 구매 가능 기간 내에 있고, 상품이 매진되지 않았으며, 매진된 상품 옵션 재고가 없으면 true
  const now = new Date();
  const orderableStartsAt = new Date(product.orderable_starts_at);
  const orderableEndsAt = new Date(product.orderable_ends_at);
  if (orderableStartsAt > now) {
    if (language === "ko") {
      return `아직 구매할 수 없어요!\n(${orderableStartsAt.toLocaleString()}부터 구매하실 수 있어요.)`;
    } else {
      return `You cannot purchase this product yet!\n(Starts at ${orderableStartsAt.toLocaleString()})`;
    }
  }
  if (orderableEndsAt < now)
    return language === "ko" ? "판매가 종료됐어요!" : "This product is no longer available for purchase!";

  if (R.isNumber(product.leftover_stock) && product.leftover_stock <= 0)
    return language === "ko" ? "상품이 매진되었어요!" : "This product is out of stock!";
  if (
    product.option_groups.some(
      (og) => !R.isEmpty(og.options) && og.options.every((o) => R.isNumber(o.leftover_stock) && o.leftover_stock <= 0)
    )
  )
    return language === "ko"
      ? "선택 가능한 상품 옵션이 모두 품절되어 구매할 수 없어요!"
      : "All selectable options for this product are out of stock!";

  return null;
};

const NotPurchasable: React.FC<React.PropsWithChildren> = ({ children }) => {
  return (
    <Typography variant="body1" color="error" sx={{ width: "100%", textAlign: "center", mt: "2rem", mb: "1rem" }}>
      {children}
    </Typography>
  );
};

type ProductItemPropType = Omit<AccordionProps, "children"> & {
  disabled?: boolean;
  language: "ko" | "en";
  product: ShopSchemas.Product;
  startPurchaseProcess: (oneItemOrderData: ShopSchemas.CartItemAppendRequest) => void;
};

const ProductItem: React.FC<ProductItemPropType> = ({
  disabled,
  language,
  product,
  startPurchaseProcess,
  ...props
}) => {
  const navigate = useNavigate();
  const optionFormRef = React.useRef<HTMLFormElement>(null);
  const shopAPIClient = ShopHooks.useShopClient();
  const addItemToCartMutation = ShopHooks.useAddItemToCartMutation(shopAPIClient);
  const addSnackbar = (c: string | React.ReactNode, variant: OptionsObject["variant"]) =>
    enqueueSnackbar(c, { variant, anchorOrigin: { vertical: "bottom", horizontal: "center" } });

  const requiresSignInStr =
    language === "ko"
      ? "로그인 후 장바구니에 담거나 구매할 수 있어요."
      : "You need to sign in to add items to the cart or make a purchase.";
  const addToCartStr = language === "ko" ? "장바구니에 담기" : "Add to Cart";
  const orderOneItemStr = language === "ko" ? "즉시 구매" : "Buy Now";
  const orderPriceStr = language === "ko" ? "결제 금액" : "Price";
  const succeededToAddOneItemToCartStr =
    language === "ko" ? "장바구니에 상품을 담았어요!" : "The product has been added to the cart!";
  const failedToAddOneItemToCartStr =
    language === "ko"
      ? "장바구니에 상품을 담는 중 문제가 발생했어요,\n잠시 후 다시 시도해주세요."
      : "An error occurred while adding the product to the cart,\nplease try again later.";
  const gotoCartPageStr = language === "ko" ? "장바구니로 이동" : "Go to Cart";

  const formOnSubmit: React.FormEventHandler = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };
  const shouldBeDisabled = disabled || addItemToCartMutation.isPending;

  const notPurchasableReason = getProductNotPurchasableReason(language, product);
  const actionButtonProps: ButtonProps = { variant: "contained", color: "secondary", disabled: shouldBeDisabled };

  const addItemToCart = () =>
    addItemToCartMutation.mutate(getCartAppendRequestPayload(product, optionFormRef), {
      onSuccess: () =>
        addSnackbar(
          <Stack spacing={2} justifyContent="center" alignItems="center" sx={{ width: "100%", flexGrow: 1 }}>
            <div>{succeededToAddOneItemToCartStr}</div>
            <Button
              variant="outlined"
              color="primary"
              onClick={() => navigate("/store/cart")}
              children={gotoCartPageStr}
              sx={{ backgroundColor: "white" }}
              fullWidth
            />
          </Stack>,
          "success"
        ),
      onError: () => alert(failedToAddOneItemToCartStr),
    });
  const onOrderOneItemButtonClick = () => startPurchaseProcess(getCartAppendRequestPayload(product, optionFormRef));
  const actionButton = R.isNullish(notPurchasableReason) && (
    <>
      <Button {...actionButtonProps} onClick={addItemToCart} children={addToCartStr} />
      <Button {...actionButtonProps} onClick={onOrderOneItemButtonClick} children={orderOneItemStr} />
    </>
  );

  return (
    <Common.Components.MDX.PrimaryStyledDetails {...props} summary={product.name} actions={actionButton}>
      <Common.Components.MDXRenderer text={product.description || ""} />
      <br />
      <Divider />
      <CommonComponents.SignInGuard fallback={<NotPurchasable>{requiresSignInStr}</NotPurchasable>}>
        {R.isNullish(notPurchasableReason) ? (
          <>
            <br />
            <form ref={optionFormRef} onSubmit={formOnSubmit}>
              <Stack spacing={2}>
                {product.option_groups.map((group) => (
                  <CommonComponents.OptionGroupInput
                    key={group.id}
                    optionGroup={group}
                    options={group.options}
                    defaultValue={group.options[0]?.id || ""}
                    disabled={disabled}
                  />
                ))}
              </Stack>
            </form>
            <br />
            <Divider />
            <br />
            <Typography variant="h6" sx={{ textAlign: "right" }}>
              {orderPriceStr}: <CommonComponents.PriceDisplay price={product.price} />
            </Typography>
          </>
        ) : (
          <NotPurchasable>{notPurchasableReason}</NotPurchasable>
        )}
      </CommonComponents.SignInGuard>
    </Common.Components.MDX.PrimaryStyledDetails>
  );
};

type ProductStateType = {
  openDialog: boolean;
  openBackdrop: boolean;
  product?: ShopSchemas.Product;
  oneItemOrderData?: ShopSchemas.CartItemAppendRequest;
};

export const ProductList: React.FC<ShopSchemas.ProductListQueryParams> = (qs) => {
  const WrappedProductList: React.FC = () => {
    const queryClient = useQueryClient();
    const navigate = useNavigate();
    const { language, shopImpAccountId } = ShopHooks.useShopContext();
    const shopAPIClient = ShopHooks.useShopClient();
    const oneItemOrderStartMutation = ShopHooks.usePrepareOneItemOrderMutation(shopAPIClient);
    const { data } = ShopHooks.useProducts(shopAPIClient, qs);

    const [state, setState] = React.useState<ProductStateType>({
      openDialog: false,
      openBackdrop: false,
    });

    const openDialog = () => setState((ps) => ({ ...ps, openDialog: true }));
    const closeDialog = () => setState((ps) => ({ ...ps, openDialog: false }));
    const openBackdrop = () => setState((ps) => ({ ...ps, openBackdrop: true }));
    const closeBackdrop = () => setState((ps) => ({ ...ps, openBackdrop: false }));
    const setProductDataAndOpenDialog = (oneItemOrderData: ShopSchemas.CartItemAppendRequest) => {
      setState((ps) => ({ ...ps, oneItemOrderData }));
      openDialog();
    };

    const orderErrorStr =
      language === "ko"
        ? "결제 준비 중 문제가 발생했습니다,\n잠시 후 다시 시도해주세요."
        : "An error occurred while preparing the payment, please try again later.";
    const failedToOrderStr =
      language === "ko"
        ? "결제에 실패했습니다.\n잠시 후 다시 시도해주세요.\n"
        : "Failed to complete the payment. Please try again later.\n";

    const onFormSubmit = (customer_info: ShopSchemas.CustomerInfo) => {
      if (!state.oneItemOrderData) return;

      closeDialog();
      openBackdrop();
      oneItemOrderStartMutation.mutate(
        { ...state.oneItemOrderData, customer_info: customer_info },
        {
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
          onError: (error) => alert(error.message || orderErrorStr),
        }
      );
    };

    return (
      <>
        <CommonComponents.CustomerInfoFormDialog
          open={state.openDialog}
          closeFunc={closeDialog}
          onSubmit={onFormSubmit}
        />
        <Common.Components.MDX.OneDetailsOpener>
          {data.map((p) => (
            <ProductItem
              disabled={oneItemOrderStartMutation.isPending}
              language={language}
              key={p.id}
              product={p}
              startPurchaseProcess={setProductDataAndOpenDialog}
            />
          ))}
        </Common.Components.MDX.OneDetailsOpener>
      </>
    );
  };

  return (
    <ErrorBoundary fallback={<div>상품 목록을 불러오는 중 문제가 발생했습니다.</div>}>
      <Suspense fallback={<CircularProgress />}>
        <Stack spacing={2}>
          <WrappedProductList />
        </Stack>
      </Suspense>
    </ErrorBoundary>
  );
};
