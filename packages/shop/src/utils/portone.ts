import { RequestPayResponse } from "iamport-typings/src";
import { isEmpty, isString } from "remeda";

import type { Cart } from "@frontend/shop/schemas";

// 결제 직전(미결제) 상태를 받으므로 Cart. Order는 Cart에 할당 가능해 둘 다 허용된다.
export const startPortOnePurchase = (
  portOneAccountId: string,
  order: Cart,
  onSuccess?: (response: RequestPayResponse) => void,
  onFailure?: (response: RequestPayResponse) => void,
  onCleanUp?: (response: RequestPayResponse) => void
) => {
  const { IMP } = window;
  if (!IMP) {
    alert("PortOne 라이브러리가 로드되지 않았습니다.");
    return;
  }

  if (!isString(portOneAccountId) || isEmpty(portOneAccountId)) {
    alert("PortOne 계정 ID가 설정되지 않았습니다.");
    return;
  }

  IMP.init(portOneAccountId);
  IMP.request_pay(
    {
      pg: "kcp",
      pay_method: "card",
      merchant_uid: order.merchant_uid,
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
