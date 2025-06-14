import ShopSchemas from "../schemas";
import { ShopAPIClient } from "./client";

namespace ShopAPIs {
  /**
   * 로그인합니다.
   */
  export const signInWithEmail = (client: ShopAPIClient) => (data: ShopSchemas.EmailSignInRequest) => {
    const requestPayload = {
      ...data,
      csrfmiddlewaretoken: client.getCSRFToken() ?? "",
    };
    return client.post<ShopSchemas.UserSignedInStatus, ShopSchemas.EmailSignInRequest>("authn/social/browser/v1/auth/login", requestPayload);
  };

  /**
   * SNS로 로그인합니다.
   */
  export const signInWithSNS = (client: ShopAPIClient) => async (socialSignInInfo: ShopSchemas.SocialSignInRequest) => {
    const form = document.createElement("form");
    form.method = "POST";
    form.action = `${client.baseURL}/authn/social/browser/v1/auth/provider/redirect`;

    Object.entries({
      ...socialSignInInfo,
      csrfmiddlewaretoken: client.getCSRFToken() ?? "",
      process: "login",
    }).forEach(([key, value]) => {
      const inputElement = document.createElement("input");
      inputElement.type = "hidden";
      inputElement.name = key;
      inputElement.value = value;
      form.appendChild(inputElement);
    });
    document.body.appendChild(form);
    form.submit();
    setTimeout(() => document.body.removeChild(form), 100);
  };

  /**
   * 로그아웃합니다.
   */
  export const signOut = (client: ShopAPIClient) => async () => {
    try {
      await client.delete<void>("authn/social/browser/v1/auth/session");
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (_) {
      return Promise.resolve({});
    }
  };

  /**
   * 로그인 정보를 조회합니다.
   * @returns 로그인 정보
   */
  export const retrieveUserInfo = (client: ShopAPIClient) => async () => {
    try {
      const response = await client.get<ShopSchemas.UserSignedInStatus>("authn/social/browser/v1/auth/session");
      if (response.meta.is_authenticated) {
        return response;
      } else {
        throw new Error("User is not authenticated");
      }
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (_) {
      return Promise.resolve(null);
    }
  };

  /**
   * 노출 중인 모든 상품의 목록을 가져옵니다.
   * @returns 노출 중인 모든 상품의 목록
   */
  export const listProducts = (client: ShopAPIClient) => (qs?: ShopSchemas.ProductListQueryParams) =>
    client.get<ShopSchemas.Product[]>("v1/products/", { params: qs });

  /**
   * 현재 사용자의 장바구니에 담긴 상품의 목록을 가져옵니다.
   * @returns 현재 장바구니 상태
   */
  export const retrieveCart = (client: ShopAPIClient) => () => client.get<ShopSchemas.Order | ShopSchemas.EmptyObject>("v1/orders/cart/");

  /**
   * 장바구니에 상품을 추가합니다.
   * @returns 현재 장바구니 상태
   */
  export const appendItemToCart = (client: ShopAPIClient) => (data: ShopSchemas.CartItemAppendRequest) =>
    client.post<ShopSchemas.Order, ShopSchemas.CartItemAppendRequest>("v1/orders/cart/products/", data);

  /**
   * 장바구니에서 특정 상품을 제거합니다.
   * @returns 현재 장바구니 상태
   */
  export const removeItemFromCart = (client: ShopAPIClient) => (data: { cartProductId: string }) =>
    client.delete<ShopSchemas.Order>(`v1/orders/cart/products/${data.cartProductId}/`);

  /**
   * 단일 상품 즉시 결제를 PortOne에 등록합니다.
   * @returns PortOne에 등록된 주문 정보
   */
  export const prepareOneItemOrder = (client: ShopAPIClient) => (data: ShopSchemas.OneItemOrderRequest) =>
    client.post<ShopSchemas.Order, ShopSchemas.OneItemOrderRequest>("v1/orders/single/", data);

  /**
   * 고객의 장바구니에 담긴 전체 상품 결제를 PortOne에 등록합니다.
   * @returns PortOne에 등록된 주문 정보
   */
  export const prepareCartOrder = (client: ShopAPIClient) => (data: ShopSchemas.CustomerInfo) =>
    client.post<ShopSchemas.Order, ShopSchemas.CustomerInfo>("v1/orders/", data);

  /**
   * 고객의 모든 결제 내역을 가져옵니다.
   * @returns 고객의 모든 결제 내역
   */
  export const listOrders = (client: ShopAPIClient) => () => client.get<ShopSchemas.Order[]>("v1/orders/");

  /**
   * 결제 완료된 주문 내역에서 특정 상품을 환불 시도합니다.
   */
  export const refundOneItemFromOrder = (client: ShopAPIClient) => (data: ShopSchemas.OneItemRefundRequest) =>
    client.delete<void>(`v1/orders/${data.order_id}/products/${data.order_product_relation_id}/`);

  /**
   * 결제 완료된 주문 내역을 환불 시도합니다.
   */
  export const refundAllItemsInOrder = (client: ShopAPIClient) => (data: { order_id: string }) => client.delete<void>(`v1/orders/${data.order_id}/`);

  /**
   * 결제 완료된 주문의 사용자 정의 응답용 상품 옵션을 수정합니다.
   */
  export const patchOrderOptions = (client: ShopAPIClient) => async (data: ShopSchemas.OrderOptionsPatchRequest) =>
    client.patch<ShopSchemas.Order, ShopSchemas.OrderOptionsPatchRequest["options"]>(
      `v1/orders/${data.order_id}/products/${data.order_product_relation_id}/options/`,
      data.options
    );
}

export default ShopAPIs;
