import * as Common from "@frontend/common";
import { AccordionProps, Button, ButtonProps, CircularProgress, Divider, Stack, TextField, Typography } from "@mui/material";
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
): ShopSchemas.CartItemAppendRequest | null => {
  if (!Common.Utils.isFormValid(formRef.current)) return null;

  const formValue = Common.Utils.getFormValue<{ [key: string]: string }>({ form: formRef.current });
  let donation_price = formValue.donation_price ? parseInt(formValue.donation_price) : 0;
  if (isNaN(donation_price)) donation_price = 0;

  const options = Object.entries(formValue)
    .filter(([product_option_group]) => product_option_group !== "donation_price")
    .map(([product_option_group, value]) => {
      const optionGroup = product.option_groups.find((group) => group.id === product_option_group);
      if (!optionGroup) throw new Error(`Option group ${product_option_group} not found`);

      const product_option = optionGroup.is_custom_response ? null : value;
      const custom_response = optionGroup.is_custom_response ? value : null;
      return { product_option_group, product_option, custom_response };
    });

  return { product: product.id, options, ...(product.donation_allowed ? { donation_price } : {}) };
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
  if (orderableEndsAt < now) return language === "ko" ? "판매가 종료됐어요!" : "This product is no longer available for purchase!";

  if (R.isNumber(product.leftover_stock) && product.leftover_stock <= 0)
    return language === "ko" ? "상품이 매진되었어요!" : "This product is out of stock!";
  if (product.option_groups.some((og) => !R.isEmpty(og.options) && og.options.every((o) => R.isNumber(o.leftover_stock) && o.leftover_stock <= 0)))
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

const ProductItem: React.FC<ProductItemPropType> = ({ disabled: rootDisabled, language, product, startPurchaseProcess, ...props }) => {
  const navigate = useNavigate();
  const [, forceRender] = React.useReducer((x) => x + 1, 0);
  const [donationPrice, setDonationPrice] = React.useState<string>(product.donation_min_price?.toString() || "0");
  const [helperText, setHelperText] = React.useState<string | undefined>(undefined);
  const donationInputRef = React.useRef<HTMLInputElement>(null);
  const optionFormRef = React.useRef<HTMLFormElement>(null);
  const shopAPIClient = ShopHooks.useShopClient();
  const addItemToCartMutation = ShopHooks.useAddItemToCartMutation(shopAPIClient);
  const addSnackbar = (c: string | React.ReactNode, variant: OptionsObject["variant"]) =>
    enqueueSnackbar(c, { variant, anchorOrigin: { vertical: "bottom", horizontal: "center" } });

  const requiresSignInStr =
    language === "ko" ? "로그인 후 장바구니에 담거나 구매할 수 있어요." : "You need to sign in to add items to the cart or make a purchase.";
  const addToCartStr = language === "ko" ? "장바구니에 담기" : "Add to Cart";
  const orderOneItemStr = language === "ko" ? "즉시 구매" : "Buy Now";
  const orderPriceStr = language === "ko" ? "결제 금액" : "Price";
  const succeededToAddOneItemToCartStr = language === "ko" ? "장바구니에 상품을 담았어요!" : "The product has been added to the cart!";
  const failedToAddOneItemToCartStr =
    language === "ko"
      ? "장바구니에 상품을 담는 중 문제가 발생했어요,\n잠시 후 다시 시도해주세요."
      : "An error occurred while adding the product to the cart,\nplease try again later.";
  const gotoCartPageStr = language === "ko" ? "장바구니로 이동" : "Go to Cart";
  const donationLabelStr = language === "ko" ? "추가 기부 금액" : "Additional Donation Amount";
  const thankYouForDonationStr =
    language === "ko"
      ? "후원을 통해 PyCon 한국 준비 위원회와 함께해주셔서 정말 감사합니다!"
      : "Thank you for supporting PyCon Korea Organizing Team!";
  const pleaseEnterDonationAmountStr =
    language === "ko"
      ? "만약 추가로 후원하고 싶은 금액이 있으시면, 아래에 입력해주시면 추가로 후원해주실 수 있습니다!"
      : "If you would like to donate more, you can donate more by entering the amount below!";
  const errDonationPriceShouldBetweenMinAndMaxStr =
    language === "ko"
      ? `기부 금액은 ${product.donation_min_price}원 이상, ${product.donation_max_price}원 이하로 입력해주세요.`
      : `Please enter a donation amount between ${product.donation_min_price} and ${product.donation_max_price}.`;
  const errDonationPriceIsNotNumberStr =
    language === "ko" ? "기부 금액은 숫자로 입력해주세요." : "Please enter a valid number for the donation amount.";
  const possibleDonationAmountStr =
    language === "ko" ? (
      <>
        최소 <CommonComponents.PriceDisplay price={product.donation_min_price || 0} />
        , 최대 <CommonComponents.PriceDisplay price={product.donation_max_price || 0} />
        까지 입력할 수 있습니다.
      </>
    ) : (
      <>
        You can enter a minimum of <CommonComponents.PriceDisplay price={product.donation_min_price || 0} />
        &nbsp;and a maximum of <CommonComponents.PriceDisplay price={product.donation_max_price || 0} />.
      </>
    );

  const formOnSubmit: React.FormEventHandler = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };
  const disabled = rootDisabled || addItemToCartMutation.isPending;

  const notPurchasableReason = getProductNotPurchasableReason(language, product);
  const actionButtonProps: ButtonProps = { variant: "contained", color: "secondary", disabled: disabled || R.isString(helperText) };

  const validateDonationPrice: React.FocusEventHandler<HTMLInputElement | HTMLTextAreaElement> = (e) => {
    const value = e.target.value.trim().replace(/e/i, "") || "0";
    const originalValue = donationPrice;

    if (!/^[0-9]+$/.test(value)) {
      setHelperText(errDonationPriceIsNotNumberStr);
      setDonationPrice(originalValue);
      return;
    }

    const parsedValue = parseInt(value);
    if (parsedValue < (product.donation_min_price || 0) || parsedValue > (product.donation_max_price || 0)) {
      setHelperText(errDonationPriceShouldBetweenMinAndMaxStr);
      setDonationPrice(parsedValue.toString());
      return;
    }
    setHelperText(undefined);
    setDonationPrice(parsedValue.toString());
    forceRender();
  };
  const onEnterPressedOnDonationInput: React.KeyboardEventHandler<HTMLDivElement> = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      e.stopPropagation();
      validateDonationPrice(e as unknown as React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>);
    }
  };
  const addItemToCart = () => {
    const formData = getCartAppendRequestPayload(product, optionFormRef);
    if (!formData) return;

    addItemToCartMutation.mutate(formData, {
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
  };
  const onOrderOneItemButtonClick = () => {
    const formData = getCartAppendRequestPayload(product, optionFormRef);
    if (!formData) return;

    startPurchaseProcess(formData);
  };

  const getTotalProductPrice = (): number => {
    let totalPrice = product.price;
    if (product.donation_allowed) {
      const donation_price = parseInt(donationPrice);
      if (!isNaN(donation_price)) totalPrice += donation_price;
    }
    return totalPrice;
  };

  const actionButton = R.isNullish(notPurchasableReason) && (
    <CommonComponents.SignInGuard fallback={<NotPurchasable>{requiresSignInStr}</NotPurchasable>}>
      <Button {...actionButtonProps} onClick={addItemToCart} children={addToCartStr} />
      <Button {...actionButtonProps} onClick={onOrderOneItemButtonClick} children={orderOneItemStr} />
    </CommonComponents.SignInGuard>
  );

  return (
    <Common.Components.MDX.PrimaryStyledDetails {...props} summary={product.name} actions={actionButton}>
      <Common.Components.MDXRenderer text={product.description || ""} />
      <br />
      <Divider />
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
              {product.donation_allowed && (
                <>
                  {product.option_groups.length > 0 && (
                    <>
                      <Divider />
                      <br />
                    </>
                  )}
                  <Typography variant="body1" sx={{ mb: 1 }}>
                    {thankYouForDonationStr}
                    <br />
                    {pleaseEnterDonationAmountStr}
                  </Typography>
                  <Typography variant="body2" sx={{ mb: 1 }} children={possibleDonationAmountStr} />
                  <TextField
                    label={donationLabelStr}
                    disabled={disabled}
                    /*
                    TODO: FIXME: Fis this to use controlled input instead of this shitty uncontrolled input.
                    This was the worst way to handle the donation price input validation...
                    Whatever reason, this stupid input unfocus when user types any character,
                    so I had to use a uncontrolled input to prevent this issue, and handle the validation manually on onBlur and onKeyDown events.
                    I really hate this.
                    */
                    defaultValue={donationPrice}
                    onBlur={validateDonationPrice}
                    onKeyDown={onEnterPressedOnDonationInput}
                    type="number"
                    name="donation_price"
                    fullWidth
                    helperText={helperText}
                    error={R.isString(helperText)}
                    inputRef={donationInputRef}
                    slotProps={{
                      htmlInput: {
                        min: product.donation_min_price,
                        max: product.donation_max_price,
                        pattern: new RegExp(/^[0-9]+$/, "i").source,
                      },
                    }}
                  />
                </>
              )}
              <Divider />
              <br />
            </Stack>
          </form>
          <br />
          <Typography variant="h6" sx={{ textAlign: "right" }}>
            {orderPriceStr}: <CommonComponents.PriceDisplay price={getTotalProductPrice()} />
          </Typography>
        </>
      ) : (
        <NotPurchasable>{notPurchasableReason}</NotPurchasable>
      )}
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

    const pleaseRetryStr = language === "ko" ? "\n잠시 후 다시 시도해주세요." : "\nPlease try again later.";
    const failedToOrderStr = language === "ko" ? `결제에 실패했습니다.${pleaseRetryStr}\n` : `Failed to complete the payment.${pleaseRetryStr}\n`;
    const orderErrorStr =
      language === "ko" ? `결제 준비 중 문제가 발생했습니다,${pleaseRetryStr}` : `An error occurred while preparing the payment,${pleaseRetryStr}`;

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
        <CommonComponents.CustomerInfoFormDialog open={state.openDialog} closeFunc={closeDialog} onSubmit={onFormSubmit} />
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
