import * as Common from "@frontend/common";
import { Close } from "@mui/icons-material";
import {
  AccordionProps,
  Box,
  Button,
  ButtonProps,
  Card,
  CardActions,
  CardContent,
  CardMedia,
  CircularProgress,
  Dialog,
  DialogContent,
  DialogProps,
  DialogTitle,
  Divider,
  Grid,
  IconButton,
  Stack,
  styled,
  TextField,
  Typography,
} from "@mui/material";
import { ErrorBoundary, Suspense } from "@suspensive/react";
import { useQueryClient } from "@tanstack/react-query";
import { enqueueSnackbar, OptionsObject } from "notistack";
import * as React from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import * as R from "remeda";

import ShopHooks from "../../hooks";
import ShopSchemas from "../../schemas";
import ShopUtils from "../../utils";
import CommonComponents from "../common";

const getCartAppendRequestPayload = (product: ShopSchemas.Product, formValue: { [key: string]: string }): ShopSchemas.CartItemAppendRequest => {
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

type ProductItemPropType = {
  disabled?: boolean;
  language: "ko" | "en";
  product: ShopSchemas.Product;
  onAddToCartSuccess?: () => void;
  startPurchaseProcess: (oneItemOrderData: ShopSchemas.CartItemAppendRequest) => void;
};

const ProductItem: React.FC<ProductItemPropType> = ({ disabled: rootDisabled, language, product, startPurchaseProcess, onAddToCartSuccess }) => {
  const navigate = useNavigate();
  const [, forceRender] = React.useReducer((x) => x + 1, 0);
  const [helperText, setHelperText] = React.useState<string | undefined>(undefined);
  const { handleSubmit, subscribe, control, getValues, register, formState } = useForm<Record<string, string>>({ mode: "all" });
  const shopAPIClient = ShopHooks.useShopClient();
  const addItemToCartMutation = ShopHooks.useAddItemToCartMutation(shopAPIClient);
  const addSnackbar = (c: string | React.ReactNode, variant: OptionsObject["variant"]) =>
    enqueueSnackbar(c, { variant, anchorOrigin: { vertical: "bottom", horizontal: "center" } });

  React.useEffect(() => {
    const callback = subscribe({
      formState: { values: true },
      callback: forceRender,
    });

    return () => callback();
  }, [subscribe]);

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
  const cannotAddToCartZeroPriceProductStr =
    language === "ko"
      ? "상품 가격이 0원 이하입니다. 상품을 장바구니에 담을 수 없습니다."
      : "The product price is 0 or less. You cannot add this product to the cart.";
  const cannotPurchaseZeroPriceProductStr =
    language === "ko"
      ? "상품 가격이 0원 이하입니다. 상품을 구매할 수 없습니다."
      : "The product price is 0 or less. You cannot purchase this product.";
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

  const disabled = rootDisabled || addItemToCartMutation.isPending;

  const notPurchasableReason = getProductNotPurchasableReason(language, product);
  const actionButtonProps: ButtonProps = {
    variant: "contained",
    color: "secondary",
    disabled: disabled || R.isString(helperText) || !formState.isValid,
  };

  const validateDonationPrice: React.FocusEventHandler<HTMLInputElement | HTMLTextAreaElement> = (e) => {
    const value = e.target.value || "0";

    if (!/^[0-9]*$/.test(value)) {
      setHelperText(errDonationPriceIsNotNumberStr);
      return;
    }

    const parsedValue = parseInt(value);
    if (parsedValue < (product.donation_min_price || 0) || parsedValue > (product.donation_max_price || 0)) {
      setHelperText(errDonationPriceShouldBetweenMinAndMaxStr);
      return;
    }
    setHelperText(undefined);
  };
  const getTotalProductPrice = (formData: Record<string, unknown>): number => {
    let totalPrice = product.price;

    totalPrice += product.option_groups
      .filter((optionRel) => !optionRel.is_custom_response)
      .reduce((sum, group) => {
        const selectedOption = group.options.find((o) => o.id === formData[group.id]);
        return sum + (selectedOption?.additional_price || 0);
      }, 0);

    if (product.donation_allowed) {
      const donation_price = parseInt(formData.donation_price as string) || 0;
      if (!isNaN(donation_price)) totalPrice += donation_price;
    }
    return totalPrice;
  };

  const { ref: donationPriceRef, ...donationPriceInputProps } = register("donation_price", {
    onBlur: validateDonationPrice,
    pattern: /^[0-9]+$/,
    min: product.donation_min_price || 0,
    max: product.donation_max_price || 0,
  });

  const addItemToCart = () => {
    const formData = getCartAppendRequestPayload(product, getValues());
    if (getTotalProductPrice(getValues()) <= 0) {
      alert(cannotAddToCartZeroPriceProductStr);
      return;
    }

    addItemToCartMutation.mutate(formData, {
      onSuccess: () => {
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
        );
        onAddToCartSuccess?.();
      },
      onError: () => alert(failedToAddOneItemToCartStr),
    });
  };
  const onOrderOneItemButtonClick = () => {
    const formData = getCartAppendRequestPayload(product, getValues());
    if (getTotalProductPrice(getValues()) <= 0) {
      alert(cannotPurchaseZeroPriceProductStr);
      return;
    }

    startPurchaseProcess(formData);
  };

  return (
    <>
      <Common.Components.MDXRenderer text={product.description || ""} format="mdx" />
      <br />
      <Divider />
      {R.isNullish(notPurchasableReason) ? (
        <>
          <br />
          <form onSubmit={handleSubmit(() => {})}>
            <Stack spacing={2}>
              {product.option_groups.map((group) => (
                <CommonComponents.OptionGroupInput
                  key={group.id}
                  optionGroup={group}
                  options={group.options}
                  defaultValue={group.options[0]?.id || ""}
                  disabled={disabled}
                  control={control}
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
                    inputRef={donationPriceRef}
                    {...donationPriceInputProps}
                    label={donationLabelStr}
                    defaultValue={product.donation_min_price || 0}
                    fullWidth
                    type="number"
                    error={!!helperText}
                    helperText={helperText}
                  />
                </>
              )}
              <Divider />
              <br />
            </Stack>
          </form>
          <br />
          <Typography variant="h6" sx={{ textAlign: "right" }}>
            {orderPriceStr}: <CommonComponents.PriceDisplay price={getTotalProductPrice(getValues())} />
          </Typography>
        </>
      ) : (
        <NotPurchasable>{notPurchasableReason}</NotPurchasable>
      )}
      {R.isNullish(notPurchasableReason) && (
        <CommonComponents.SignInGuard fallback={<NotPurchasable>{requiresSignInStr}</NotPurchasable>}>
          <Stack direction="row" spacing={1} sx={{ justifyContent: "flex-end", mt: 2 }}>
            <Button {...actionButtonProps} onClick={addItemToCart} children={addToCartStr} />
            <Button {...actionButtonProps} onClick={onOrderOneItemButtonClick} children={orderOneItemStr} />
          </Stack>
        </CommonComponents.SignInGuard>
      )}
    </>
  );
};

type FoldableProductItemPropType = Omit<AccordionProps, "children"> & ProductItemPropType;

const FoldableProductItem: React.FC<FoldableProductItemPropType> = ({ disabled, language, product, startPurchaseProcess, ...props }) => {
  return (
    <Common.Components.MDX.PrimaryStyledDetails {...props} summary={product.name}>
      <ProductItem disabled={disabled} language={language} product={product} startPurchaseProcess={startPurchaseProcess} />
    </Common.Components.MDX.PrimaryStyledDetails>
  );
};

const CloseButton = styled(IconButton)(({ theme }) => ({
  position: "absolute",
  right: theme.spacing(1),
  top: theme.spacing(1),
  color: theme.palette.grey[500],
}));

type DialogedProductItemPropType = Omit<DialogProps, "children"> &
  Omit<ProductItemPropType, "product"> & {
    product?: ShopSchemas.Product;
  };

const DialogedProductItem: React.FC<DialogedProductItemPropType> = ({ disabled, language, product, startPurchaseProcess, ...props }) => {
  const dialogTitle = language === "ko" ? "상품 상세 정보" : "Product Details";
  const onCloseClick = (props.onClose as () => void) || (() => {});
  return (
    <Dialog maxWidth="md" fullWidth {...props}>
      <DialogTitle>{dialogTitle}</DialogTitle>
      <CloseButton onClick={onCloseClick} children={<Close />} />
      <DialogContent>
        {product && (
          <ProductItem
            disabled={disabled}
            language={language}
            product={product}
            startPurchaseProcess={startPurchaseProcess}
            onAddToCartSuccess={onCloseClick}
          />
        )}
      </DialogContent>
    </Dialog>
  );
};

type ProductImageCardPropType = {
  language: "ko" | "en";
  product: ShopSchemas.Product;
  disabled?: boolean;
  showDetail: (product: ShopSchemas.Product) => void;
};

const StyledProductImageCard = styled(Card)(({ theme }) => ({
  cursor: "pointer",
  maxWidth: "300px",
  borderRadius: "0.5rem",
  border: `1px solid ${theme.palette.primary.light}`,
  transition: "all 0.2s ease",

  "&:hover": {
    boxShadow: theme.shadows[3],
    borderColor: theme.palette.primary.main,
  },
}));

const ProductImageCard: React.FC<ProductImageCardPropType> = ({ language, product, disabled, showDetail }) => {
  const showDetailStr = language === "ko" ? "상품 상세 정보 보기" : "View Product Details";
  return (
    <StyledProductImageCard onClick={() => showDetail(product)} elevation={0}>
      <CardMedia sx={{ height: "200px", objectFit: "contain", borderRadius: "0 0 0.5rem 0.5rem" }}>
        <Common.Components.FallbackImage
          src={product.image || ""}
          alt="Product Image"
          loading="lazy"
          style={{ width: "100%", height: "100%", maxWidth: "100%", maxHeight: "100%", objectFit: "contain" }}
          errorFallback={<Box sx={{ width: "100%", height: "100%", flexGrow: 1, backgroundColor: "#bbb", borderRadius: "0 0 0.5rem 0.5rem" }} />}
        />
      </CardMedia>
      <CardContent sx={{ py: 1 }}>
        <Stack spacing={1}>
          <Typography variant="h6" sx={{ textAlign: "center" }} children={product.name} />
          <Typography variant="body1" sx={{ textAlign: "right" }} children={<CommonComponents.PriceDisplay price={product.price} />} />
        </Stack>
      </CardContent>
      <CardActions>
        <Button variant="outlined" color="primary" disabled={disabled} children={showDetailStr} fullWidth />
      </CardActions>
    </StyledProductImageCard>
  );
};

type ProductListStateType = {
  openDialog: boolean;
  openBackdrop: boolean;
  resetKey: string;
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

    const [state, setState] = React.useState<ProductListStateType>({
      openDialog: false,
      openBackdrop: false,
      resetKey: Math.random().toString(36).substring(2),
    });

    const foldAll = () => setState((ps) => ({ ...ps, resetKey: Math.random().toString(36).substring(2) }));
    const openDialog = () => setState((ps) => ({ ...ps, openDialog: true }));
    const closeDialog = () => setState((ps) => ({ ...ps, openDialog: false }));
    const openBackdrop = () => setState((ps) => ({ ...ps, openBackdrop: true }));
    const closeBackdrop = () => setState((ps) => ({ ...ps, openBackdrop: false }));
    const setProductDataAndOpenDialog = (oneItemOrderData: ShopSchemas.CartItemAppendRequest) => {
      // 부모 리렌더링에 따른 form 상태 초기화를 숨기기 위해 accordion을 닫습니다.
      // TODO: FIXME: form 상태가 애초에 초기화되면 안됩니다. form 내부 값을 초기화되지 않도록 막고, 접히지 않도록 하세요.
      foldAll();
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
        <Common.Components.MDX.OneDetailsOpener resetKey={state.resetKey}>
          {data.map((p) => (
            <FoldableProductItem
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

type ProductImageCardListStateType = {
  openProductDialog: boolean;
  openCustomerInfoDialog: boolean;
  openBackdrop: boolean;
  product?: ShopSchemas.Product;
  oneItemOrderData?: ShopSchemas.CartItemAppendRequest;
};

export const ProductImageCardList: React.FC<ShopSchemas.ProductListQueryParams> = (qs) => {
  const WrappedProductImageCardList: React.FC = () => {
    const queryClient = useQueryClient();
    const navigate = useNavigate();
    const { language, shopImpAccountId } = ShopHooks.useShopContext();
    const shopAPIClient = ShopHooks.useShopClient();
    const oneItemOrderStartMutation = ShopHooks.usePrepareOneItemOrderMutation(shopAPIClient);
    const { data } = ShopHooks.useProducts(shopAPIClient, qs);

    const [state, setState] = React.useState<ProductImageCardListStateType>({
      openProductDialog: false,
      openCustomerInfoDialog: false,
      openBackdrop: false,
    });

    const openProductDialog = (product: ShopSchemas.Product) => setState((ps) => ({ ...ps, product, openProductDialog: true }));
    const closeProductDialog = () => setState((ps) => ({ ...ps, openProductDialog: false }));
    const openCustomerInfoDialog = () => setState((ps) => ({ ...ps, openCustomerInfoDialog: true }));
    const closeCustomerInfoDialog = () => setState((ps) => ({ ...ps, openCustomerInfoDialog: false }));
    const openBackdrop = () => setState((ps) => ({ ...ps, openBackdrop: true }));
    const closeBackdrop = () => setState((ps) => ({ ...ps, openBackdrop: false }));
    const setProductDataAndOpenDialog = (oneItemOrderData: ShopSchemas.CartItemAppendRequest) => {
      closeProductDialog();
      setState((ps) => ({ ...ps, oneItemOrderData }));
      openCustomerInfoDialog();
    };

    const pleaseRetryStr = language === "ko" ? "\n잠시 후 다시 시도해주세요." : "\nPlease try again later.";
    const failedToOrderStr = language === "ko" ? `결제에 실패했습니다.${pleaseRetryStr}\n` : `Failed to complete the payment.${pleaseRetryStr}\n`;
    const orderErrorStr =
      language === "ko" ? `결제 준비 중 문제가 발생했습니다,${pleaseRetryStr}` : `An error occurred while preparing the payment,${pleaseRetryStr}`;

    const onFormSubmit = (customer_info: ShopSchemas.CustomerInfo) => {
      if (!state.oneItemOrderData) return;

      closeCustomerInfoDialog();
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
        <CommonComponents.CustomerInfoFormDialog open={state.openCustomerInfoDialog} closeFunc={closeCustomerInfoDialog} onSubmit={onFormSubmit} />
        <DialogedProductItem
          open={state.openProductDialog}
          onClose={closeProductDialog}
          language={language}
          product={state.product}
          startPurchaseProcess={setProductDataAndOpenDialog}
        />
        <Grid>
          {data.map((p) => (
            <ProductImageCard
              disabled={oneItemOrderStartMutation.isPending}
              language={language}
              key={p.id}
              product={p}
              showDetail={openProductDialog}
            />
          ))}
        </Grid>
      </>
    );
  };

  return (
    <ErrorBoundary fallback={<div>상품 목록을 불러오는 중 문제가 발생했습니다.</div>}>
      <Suspense fallback={<CircularProgress />}>
        <Stack spacing={2}>
          <WrappedProductImageCardList />
        </Stack>
      </Suspense>
    </ErrorBoundary>
  );
};
