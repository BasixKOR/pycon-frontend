import { RequestPayResponse } from "iamport-typings/src";
import * as R from "remeda";

import ShopSchemas from "../schemas";

export const startPortOnePurchase = (
  order: ShopSchemas.Order,
  onSuccess?: (response: RequestPayResponse) => void,
  onFailure?: (response: RequestPayResponse) => void,
  onCleanUp?: (response: RequestPayResponse) => void
) => {
  const { IMP } = window;
  if (!IMP) {
    alert("PortOne 라이브러리가 로드되지 않았습니다.");
    return;
  }

  const portOneAccountId = (
    import.meta?.env?.VITE_PYCONKR_SHOP_PORTONE_ACCOUNT_ID
    || process?.env?.PYCONKR_SHOP_PORTONE_ACCOUNT_ID
    || ""
  );
  if (!R.isString(portOneAccountId) || R.isEmpty(portOneAccountId)) {
    alert("PortOne 계정 ID가 설정되지 않았습니다.");
    return;
  }

  IMP.init(portOneAccountId);
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
      if (response.success) onSuccess?.(response);
      else onFailure?.(response);
      onCleanUp?.(response);
    }
  );
};
