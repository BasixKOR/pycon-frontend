import React from "react";

import { ExpandMore } from '@mui/icons-material';
import { Accordion, AccordionActions, AccordionDetails, AccordionSummary, Button, CircularProgress, Divider, Stack, Typography } from "@mui/material";
import { wrap } from "@suspensive/react";
import { useQueryClient } from '@tanstack/react-query';

import ShopComponent from "@pyconkr-shop/components";
import ShopAPIHook from "@pyconkr-shop/hooks";
import ShopAPISchema from '@pyconkr-shop/schemas';
import ShopAPIUtil from "@pyconkr-shop/utils";

const ShopCartItem: React.FC<{
  cartProdRel: ShopAPISchema.OrderProductItem,
  removeItemFromCartFunc: (cartProductId: string) => void,
  disabled?: boolean
}> = ({ cartProdRel, disabled, removeItemFromCartFunc }) => <Accordion>
  <AccordionSummary expandIcon={<ExpandMore />}>
    <Typography variant="h6" sx={{ width: '100%', flexShrink: 0 }}>
      {cartProdRel.product.name}
    </Typography>
  </AccordionSummary>
  <AccordionDetails>
    <Stack spacing={2} sx={{ width: '100%' }}>
      {
        cartProdRel.options.map(
          (optionRel) => <ShopComponent.OrderProductRelationOptionInput
            key={optionRel.product_option_group.id + (optionRel.product_option?.id || '')}
            optionRel={optionRel}
            disabled
            disabledReason='상품 옵션을 수정하려면 장바구니에서 상품을 삭제한 후 다시 담아주세요.'
          />
        )
      }
    </Stack>
    <br />
    <Divider />
    <br />
    <Typography variant="h6" sx={{ textAlign: 'end' }}>
      상품 가격: <ShopComponent.PriceDisplay price={cartProdRel.price} />
    </Typography>
  </AccordionDetails>
  <AccordionActions>
    <Button variant="contained" color="secondary" onClick={() => removeItemFromCartFunc(cartProdRel.id)} disabled={disabled}>장바구니에서 상품 삭제</Button>
  </AccordionActions>
</Accordion>


export const ShopCartList: React.FC<{ onPaymentCompleted?: () => void; }> = ({ onPaymentCompleted }) => {
  const queryClient = useQueryClient();
  const cartOrderStartMutation = ShopAPIHook.usePrepareCartOrderMutation();
  const removeItemFromCartMutation = ShopAPIHook.useRemoveItemFromCartMutation();

  const removeItemFromCart = (cartProductId: string) => removeItemFromCartMutation.mutate({ cartProductId });
  const startCartOrder = () => cartOrderStartMutation.mutate(
    undefined,
    {
      onSuccess: (order: ShopAPISchema.Order) => {
        ShopAPIUtil.startPortOnePurchase(
          order,
          () => {
            queryClient.invalidateQueries();
            queryClient.resetQueries();
            onPaymentCompleted?.();
          },
          (response) => alert("결제를 실패했습니다!\n" + response.error_msg),
          () => { }
        );
      },
      onError: (error) => alert(error.message || '결제 준비 중 문제가 발생했습니다,\n잠시 후 다시 시도해주세요.'),
    }
  );

  const disabled = removeItemFromCartMutation.isPending || cartOrderStartMutation.isPending;

  const WrappedShopCartList = wrap
    .ErrorBoundary({ fallback: <div>장바구니 정보를 불러오는 중 문제가 발생했습니다.</div> })
    .Suspense({ fallback: <CircularProgress /> })
    .on(() => {
      // eslint-disable-next-line react-hooks/rules-of-hooks
      const { data } = ShopAPIHook.useCart();

      return data.products.length === 0
        ? <Typography variant="body1" color="error">장바구니가 비어있어요!</Typography>
        : <>
          {data.products.map((prodRel) => <ShopCartItem key={prodRel.id} cartProdRel={prodRel} disabled={disabled} removeItemFromCartFunc={removeItemFromCart} />)}
          <br />
          <Divider />
          <Typography variant="h6" sx={{ textAlign: 'end' }}>
            결제 금액: <ShopComponent.PriceDisplay price={data.first_paid_price} />
          </Typography>
          <Button variant="contained" color="secondary" onClick={startCartOrder} disabled={disabled}>장바구니에 담긴 상품 결제</Button>
        </>
    });

  return <>
    <Typography variant="h5" gutterBottom>Cart List</Typography>
    <ShopComponent.ShopSignInGuard>
      <WrappedShopCartList />
    </ShopComponent.ShopSignInGuard>
  </>
}
