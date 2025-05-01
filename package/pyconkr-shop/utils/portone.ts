import { RequestPayResponse } from "iamport-typings/src"

import ShopAPISchema from "@pyconkr-shop/schemas"

export const startPortOnePurchase = (
  order: ShopAPISchema.Order,
  onSuccess?: (response: RequestPayResponse) => void,
  onFailure?: (response: RequestPayResponse) => void,
  onCleanUp?: (response: RequestPayResponse) => void,
) => {
  const { IMP } = window
  if (!IMP) {
    alert('PortOne 라이브러리가 로드되지 않았습니다.')
    return
  }

  IMP.init(import.meta.env.VITE_PYCONKR_SHOP_IMP_ACCOUNT_ID)
  IMP.request_pay(
    {
      pg: "kcp",
      pay_method: "card",
      merchant_uid: order.id,
      name: "상품 구매",
      amount: order.first_paid_price,
      buyer_tel: "",
    },
    async (response: RequestPayResponse) => {
      if (response.success) onSuccess?.(response)
      else onFailure?.(response)
      onCleanUp?.(response)
    }
  )
}
