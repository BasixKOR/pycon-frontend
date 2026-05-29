import { FallbackImage, MDXRenderer } from "@frontend/common/components";
import { OneDetailsOpener, PrimaryStyledDetails } from "@frontend/common/components/mdx_components";
import { useCommonContext } from "@frontend/common/hooks/useCommonContext";
import { Add, Close } from "@mui/icons-material";
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
  Tooltip,
  Typography,
} from "@mui/material";
import { ErrorBoundary, Suspense } from "@suspensive/react";
import { useQueryClient } from "@tanstack/react-query";
import { enqueueSnackbar, OptionsObject } from "notistack";
import { FC, FocusEventHandler, PropsWithChildren, ReactNode, useEffect, useMemo, useReducer, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { isEmpty, isNullish, isNumber, isString } from "remeda";

import { formatBackendErrorMessage } from "@frontend/shop/apis";
import { CustomerInfoFormDialog, OptionGroupInput, PriceDisplay, SignInGuard } from "@frontend/shop/components/common";
import { useAddItemToCartMutation, usePrepareOneItemOrderMutation, useProducts, useShopClient, useShopContext } from "@frontend/shop/hooks";
import type { CartItemAppendRequest, CustomerInfo, Order, Product, ProductListQueryParams } from "@frontend/shop/schemas";
import { getCannotAddMoreOptionGroupReason, getOptionGroupNotOrderableReason, startPortOnePurchase } from "@frontend/shop/utils";

const getCartAppendRequestPayload = (
  product: Product,
  formValue: { [key: string]: string },
  instanceToGroup: Map<string, string>
): CartItemAppendRequest => {
  let donation_price = formValue.donation_price ? parseInt(formValue.donation_price) : 0;
  if (isNaN(donation_price)) donation_price = 0;

  const options = Object.entries(formValue)
    .filter(([key]) => key !== "donation_price")
    .map(([key, value]) => {
      // 필수 그룹은 key=groupId, 선택 그룹 인스턴스는 key=instanceId → groupId 룩업
      const groupId = instanceToGroup.get(key) ?? key;
      const optionGroup = product.option_groups.find((group) => group.id === groupId);
      if (!optionGroup) throw new Error(`Option group ${groupId} not found`);

      const product_option = optionGroup.is_custom_response ? null : value;
      const custom_response = optionGroup.is_custom_response ? value : null;
      return { product_option_group: groupId, product_option, custom_response };
    });

  return { product: product.id, options, ...(product.donation_allowed ? { donation_price } : {}) };
};

const getProductNotPurchasableReason = (language: "ko" | "en", product: Product): string | null => {
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

  if (isNumber(product.leftover_stock) && product.leftover_stock <= 0)
    return language === "ko" ? "상품이 매진되었어요!" : "This product is out of stock!";
  if (product.option_groups.some((og) => !isEmpty(og.options) && og.options.every((o) => isNumber(o.leftover_stock) && o.leftover_stock <= 0)))
    return language === "ko"
      ? "선택 가능한 상품 옵션이 모두 품절되어 구매할 수 없어요!"
      : "All selectable options for this product are out of stock!";

  return null;
};

const NotPurchasable: FC<PropsWithChildren> = ({ children }) => {
  return (
    <Typography variant="body1" color="error" sx={{ width: "100%", textAlign: "center", mt: "2rem", mb: "1rem" }}>
      {children}
    </Typography>
  );
};

type ProductItemPropType = {
  disabled?: boolean;
  language: "ko" | "en";
  product: Product;
  onAddToCartSuccess?: () => void;
  startPurchaseProcess: (oneItemOrderData: CartItemAppendRequest) => void;
};

/**
 * 상품 가격과 옵션 가격을 합산하여 상품의 총 가격이 0인지 확인합니다.
 * @param p 상품 객체
 * @returns 상품의 가격이 0 이하인 경우 true, 그렇지 않으면 false
 */
const isZeroPriceProduct = (p: Product): boolean => {
  return p.price + p.option_groups.reduce((sum, group) => sum + group.options.reduce((s, o) => s + (o.additional_price || 0), 0), 0) === 0;
};

const ProductItem: FC<ProductItemPropType> = ({ disabled: rootDisabled, language, product, startPurchaseProcess, onAddToCartSuccess }) => {
  const navigate = useNavigate();
  const [, forceRender] = useReducer((x) => x + 1, 0);
  const [helperText, setHelperText] = useState<string | undefined>(undefined);
  const { baseUrl, mdxComponents } = useCommonContext();
  const { handleSubmit, subscribe, control, getValues, register, unregister, formState } = useForm<Record<string, string>>({ mode: "all" });
  // 선택(min=0) 그룹의 동적 인스턴스. 각 인스턴스 id가 form field name으로 쓰임 — `${groupId}__${counter}` 형태.
  const [optionalInstances, setOptionalInstances] = useState<{ id: string; groupId: string }[]>([]);
  const instanceCounterRef = useRef(0);
  const instanceToGroup = useMemo(() => new Map(optionalInstances.map((i) => [i.id, i.groupId])), [optionalInstances]);
  const shopAPIClient = useShopClient();
  const addItemToCartMutation = useAddItemToCartMutation(shopAPIClient);
  const addSnackbar = (c: string | ReactNode, variant: OptionsObject["variant"]) =>
    enqueueSnackbar(c, { variant, anchorOrigin: { vertical: "bottom", horizontal: "center" } });

  useEffect(() => {
    const callback = subscribe({
      formState: { values: true },
      callback: forceRender,
    });

    return () => callback();
  }, [subscribe]);

  const requiresSignInStr =
    language === "ko" ? "로그인 후 장바구니에 담거나 구매할 수 있어요." : "You need to sign in to add items to the cart or make a purchase.";
  const addOptionGroupLabel = (name: string) => (language === "ko" ? `${name} 추가` : `Add ${name}`);
  const removeOptionGroupAriaLabel = language === "ko" ? "옵션 제거" : "Remove option";
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
        최소 <PriceDisplay price={product.donation_min_price || 0} />
        , 최대 <PriceDisplay price={product.donation_max_price || 0} />
        까지 입력할 수 있습니다.
      </>
    ) : (
      <>
        You can enter a minimum of <PriceDisplay price={product.donation_min_price || 0} />
        &nbsp;and a maximum of <PriceDisplay price={product.donation_max_price || 0} />.
      </>
    );

  const disabled = rootDisabled || addItemToCartMutation.isPending;

  const notPurchasableReason = getProductNotPurchasableReason(language, product);
  const groupNotOrderableReasons = product.option_groups.map((group) => ({
    group,
    reason: getOptionGroupNotOrderableReason(language, product, group),
  }));
  const requiredGroupsData = groupNotOrderableReasons.filter(({ group }) => group.min_quantity_per_product >= 1);
  const optionalGroupsData = groupNotOrderableReasons.filter(({ group }) => group.min_quantity_per_product === 0);
  // 필수 그룹(min_quantity_per_product > 0)이 비-orderable이면 주문 자체 불가 — 백엔드도 거절.
  const disabledRequiredGroupReason = requiredGroupsData.find((g) => g.reason)?.reason ?? null;

  const addInstance = (groupId: string) => {
    const id = `${groupId}__${instanceCounterRef.current++}`;
    setOptionalInstances((prev) => [...prev, { id, groupId }]);
  };
  const removeInstance = (id: string) => {
    unregister(id);
    setOptionalInstances((prev) => prev.filter((i) => i.id !== id));
  };
  const actionButtonProps: ButtonProps = {
    variant: "contained",
    color: "secondary",
    disabled: disabled || isString(helperText) || !formState.isValid || !!disabledRequiredGroupReason,
  };

  const validateDonationPrice: FocusEventHandler<HTMLInputElement | HTMLTextAreaElement> = (e) => {
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

    // 필수 그룹: key = groupId / 선택 그룹 인스턴스: key = instanceId → groupId 룩업
    for (const [key, value] of Object.entries(formData)) {
      if (key === "donation_price") continue;
      const groupId = instanceToGroup.get(key) ?? key;
      const group = product.option_groups.find((g) => g.id === groupId);
      if (!group || group.is_custom_response) continue;
      const selectedOption = group.options.find((o) => o.id === value);
      if (selectedOption) totalPrice += selectedOption.additional_price || 0;
    }

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
    const formData = getCartAppendRequestPayload(product, getValues(), instanceToGroup);
    if (!isZeroPriceProduct(product) && getTotalProductPrice(getValues()) <= 0) {
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
      onError: (error) => alert(formatBackendErrorMessage(error, failedToAddOneItemToCartStr)),
    });
  };
  const onOrderOneItemButtonClick = () => {
    const formData = getCartAppendRequestPayload(product, getValues(), instanceToGroup);
    if (!isZeroPriceProduct(product) && getTotalProductPrice(getValues()) <= 0) {
      alert(cannotPurchaseZeroPriceProductStr);
      return;
    }

    startPurchaseProcess(formData);
  };

  return (
    <>
      <MDXRenderer text={product.description || ""} format="mdx" baseUrl={baseUrl} mdxComponents={mdxComponents} />
      <br />
      <Divider />
      {isNullish(notPurchasableReason) ? (
        <>
          <br />
          <form onSubmit={handleSubmit(() => {})}>
            <Stack spacing={2}>
              {requiredGroupsData.map(({ group, reason }) => (
                <OptionGroupInput
                  key={group.id}
                  optionGroup={group}
                  options={group.options}
                  defaultValue={reason ? "" : group.options[0]?.id || ""}
                  disabled={disabled || !!reason}
                  disabledReason={reason ?? undefined}
                  control={control}
                />
              ))}
              {requiredGroupsData.length > 0 && optionalGroupsData.length > 0 && <Divider />}
              {optionalGroupsData.map(({ group, reason }) => {
                const groupInstances = optionalInstances.filter((i) => i.groupId === group.id);
                const cannotAddReason = getCannotAddMoreOptionGroupReason(language, group, groupInstances.length);
                const addDisabled = disabled || !!reason || !!cannotAddReason;
                // orderable 사유는 Tooltip으로, 한도 사유는 캡션으로 노출 (한도는 항상 보여야 함).
                return (
                  <Stack key={group.id} spacing={1}>
                    {groupInstances.map((instance) => (
                      <Stack key={instance.id} direction="row" spacing={1} alignItems="center">
                        <Box sx={{ flexGrow: 1 }}>
                          <OptionGroupInput
                            optionGroup={{ ...group, id: instance.id }}
                            options={group.options}
                            defaultValue={reason ? "" : group.options[0]?.id || ""}
                            disabled={disabled || !!reason}
                            disabledReason={reason ?? undefined}
                            control={control}
                          />
                        </Box>
                        <IconButton onClick={() => removeInstance(instance.id)} disabled={disabled} aria-label={removeOptionGroupAriaLabel}>
                          <Close />
                        </IconButton>
                      </Stack>
                    ))}
                    <Tooltip title={reason ?? ""}>
                      <span>
                        <Button
                          variant="outlined"
                          color="primary"
                          startIcon={<Add />}
                          onClick={() => addInstance(group.id)}
                          disabled={addDisabled}
                          fullWidth
                        >
                          {addOptionGroupLabel(group.name)}
                        </Button>
                      </span>
                    </Tooltip>
                    {cannotAddReason && !reason && (
                      <Typography variant="caption" color="text.secondary" sx={{ textAlign: "center" }}>
                        {cannotAddReason}
                      </Typography>
                    )}
                  </Stack>
                );
              })}
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
            {orderPriceStr}: <PriceDisplay price={getTotalProductPrice(getValues())} />
          </Typography>
        </>
      ) : (
        <NotPurchasable>{notPurchasableReason}</NotPurchasable>
      )}
      {isNullish(notPurchasableReason) && (
        <SignInGuard fallback={<NotPurchasable>{requiresSignInStr}</NotPurchasable>}>
          {disabledRequiredGroupReason && <NotPurchasable>{disabledRequiredGroupReason}</NotPurchasable>}
          <Stack direction="row" spacing={1} sx={{ justifyContent: "flex-end", mt: 2 }}>
            <Button {...actionButtonProps} onClick={addItemToCart} children={addToCartStr} />
            <Button {...actionButtonProps} onClick={onOrderOneItemButtonClick} children={orderOneItemStr} />
          </Stack>
        </SignInGuard>
      )}
    </>
  );
};

type FoldableProductItemPropType = Omit<AccordionProps, "children"> & ProductItemPropType;

const FoldableProductItem: FC<FoldableProductItemPropType> = ({ disabled, language, product, startPurchaseProcess, ...props }) => {
  const notPurchasableReason = getProductNotPurchasableReason(language, product);
  const summary = notPurchasableReason ? (
    <Stack>
      <Typography variant="h5" sx={{ textDecoration: "line-through", color: "text.disabled" }}>
        {product.name}
      </Typography>
      <Typography variant="caption" color="error" sx={{ whiteSpace: "pre-line" }}>
        {notPurchasableReason}
      </Typography>
    </Stack>
  ) : (
    product.name
  );
  return (
    <PrimaryStyledDetails {...props} summary={summary}>
      <ProductItem disabled={disabled} language={language} product={product} startPurchaseProcess={startPurchaseProcess} />
    </PrimaryStyledDetails>
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
    product?: Product;
  };

const DialogedProductItem: FC<DialogedProductItemPropType> = ({ disabled, language, product, startPurchaseProcess, ...props }) => {
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
  product: Product;
  disabled?: boolean;
  showDetail: (product: Product) => void;
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

const ProductImageCard: FC<ProductImageCardPropType> = ({ language, product, disabled, showDetail }) => {
  const showDetailStr = language === "ko" ? "상품 상세 정보 보기" : "View Product Details";
  const notPurchasableReason = getProductNotPurchasableReason(language, product);
  return (
    <StyledProductImageCard onClick={() => showDetail(product)} elevation={0}>
      <CardMedia sx={{ height: "200px", objectFit: "contain", borderRadius: "0 0 0.5rem 0.5rem" }}>
        <FallbackImage
          src={product.image || ""}
          alt="Product Image"
          loading="lazy"
          style={{ width: "100%", height: "100%", maxWidth: "100%", maxHeight: "100%", objectFit: "contain" }}
          errorFallback={<Box sx={{ width: "100%", height: "100%", flexGrow: 1, backgroundColor: "#bbb", borderRadius: "0 0 0.5rem 0.5rem" }} />}
        />
      </CardMedia>
      <CardContent sx={{ py: 1 }}>
        <Stack spacing={1}>
          <Stack spacing={0.5} alignItems="center">
            <Typography
              variant="h6"
              sx={{ textAlign: "center", ...(notPurchasableReason && { textDecoration: "line-through", color: "text.disabled" }) }}
              children={product.name}
            />
            {notPurchasableReason && (
              <Typography variant="caption" color="error" sx={{ textAlign: "center", whiteSpace: "pre-line" }}>
                {notPurchasableReason}
              </Typography>
            )}
          </Stack>
          <Typography variant="body1" sx={{ textAlign: "right" }} children={<PriceDisplay price={product.price} />} />
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
  product?: Product;
  oneItemOrderData?: CartItemAppendRequest;
};

export const ProductList: FC<ProductListQueryParams> = (qs) => {
  const WrappedProductList: FC = () => {
    const queryClient = useQueryClient();
    const navigate = useNavigate();
    const { language, shopImpAccountId } = useShopContext();
    const shopAPIClient = useShopClient();
    const oneItemOrderStartMutation = usePrepareOneItemOrderMutation(shopAPIClient);
    const { data } = useProducts(shopAPIClient, qs);

    const [state, setState] = useState<ProductListStateType>({
      openDialog: false,
      openBackdrop: false,
      resetKey: Math.random().toString(36).substring(2),
    });

    const foldAll = () => setState((ps) => ({ ...ps, resetKey: Math.random().toString(36).substring(2) }));
    const openDialog = () => setState((ps) => ({ ...ps, openDialog: true }));
    const closeDialog = () => setState((ps) => ({ ...ps, openDialog: false }));
    const openBackdrop = () => setState((ps) => ({ ...ps, openBackdrop: true }));
    const closeBackdrop = () => setState((ps) => ({ ...ps, openBackdrop: false }));
    const setProductDataAndOpenDialog = (oneItemOrderData: CartItemAppendRequest) => {
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

    const onFormSubmit = (customer_info: CustomerInfo) => {
      if (!state.oneItemOrderData) return;

      closeDialog();
      openBackdrop();
      oneItemOrderStartMutation.mutate(
        { ...state.oneItemOrderData, customer_info: customer_info },
        {
          onSuccess: (order: Order) => {
            startPortOnePurchase(
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
          onError: (error) => {
            alert(formatBackendErrorMessage(error, orderErrorStr));
            closeBackdrop();
          },
        }
      );
    };

    const noProductsStr = language === "ko" ? "상품이 없어요!" : "No products available.";

    if (isEmpty(data)) {
      return (
        <Typography variant="body1" color="error">
          {noProductsStr}
        </Typography>
      );
    }

    return (
      <>
        <CustomerInfoFormDialog open={state.openDialog} closeFunc={closeDialog} onSubmit={onFormSubmit} />
        <OneDetailsOpener resetKey={state.resetKey}>
          {data.map((p) => (
            <FoldableProductItem
              disabled={oneItemOrderStartMutation.isPending}
              language={language}
              key={p.id}
              product={p}
              startPurchaseProcess={setProductDataAndOpenDialog}
            />
          ))}
        </OneDetailsOpener>
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
  product?: Product;
  oneItemOrderData?: CartItemAppendRequest;
};

export const ProductImageCardList: FC<ProductListQueryParams> = (qs) => {
  const WrappedProductImageCardList: FC = () => {
    const queryClient = useQueryClient();
    const navigate = useNavigate();
    const { language, shopImpAccountId } = useShopContext();
    const shopAPIClient = useShopClient();
    const oneItemOrderStartMutation = usePrepareOneItemOrderMutation(shopAPIClient);
    const { data } = useProducts(shopAPIClient, qs);

    const [state, setState] = useState<ProductImageCardListStateType>({
      openProductDialog: false,
      openCustomerInfoDialog: false,
      openBackdrop: false,
    });

    const openProductDialog = (product: Product) => setState((ps) => ({ ...ps, product, openProductDialog: true }));
    const closeProductDialog = () => setState((ps) => ({ ...ps, openProductDialog: false }));
    const openCustomerInfoDialog = () => setState((ps) => ({ ...ps, openCustomerInfoDialog: true }));
    const closeCustomerInfoDialog = () => setState((ps) => ({ ...ps, openCustomerInfoDialog: false }));
    const openBackdrop = () => setState((ps) => ({ ...ps, openBackdrop: true }));
    const closeBackdrop = () => setState((ps) => ({ ...ps, openBackdrop: false }));
    const setProductDataAndOpenDialog = (oneItemOrderData: CartItemAppendRequest) => {
      closeProductDialog();
      setState((ps) => ({ ...ps, oneItemOrderData }));
      openCustomerInfoDialog();
    };

    const pleaseRetryStr = language === "ko" ? "\n잠시 후 다시 시도해주세요." : "\nPlease try again later.";
    const failedToOrderStr = language === "ko" ? `결제에 실패했습니다.${pleaseRetryStr}\n` : `Failed to complete the payment.${pleaseRetryStr}\n`;
    const orderErrorStr =
      language === "ko" ? `결제 준비 중 문제가 발생했습니다,${pleaseRetryStr}` : `An error occurred while preparing the payment,${pleaseRetryStr}`;

    const onFormSubmit = (customer_info: CustomerInfo) => {
      if (!state.oneItemOrderData) return;

      closeCustomerInfoDialog();
      openBackdrop();
      oneItemOrderStartMutation.mutate(
        { ...state.oneItemOrderData, customer_info: customer_info },
        {
          onSuccess: (order: Order) => {
            startPortOnePurchase(
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
          onError: (error) => {
            alert(formatBackendErrorMessage(error, orderErrorStr));
            closeBackdrop();
          },
        }
      );
    };

    const noProductsStr = language === "ko" ? "상품이 없어요!" : "No products available.";

    if (isEmpty(data)) {
      return (
        <Typography variant="body1" color="error">
          {noProductsStr}
        </Typography>
      );
    }

    return (
      <>
        <CustomerInfoFormDialog open={state.openCustomerInfoDialog} closeFunc={closeCustomerInfoDialog} onSubmit={onFormSubmit} />
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
