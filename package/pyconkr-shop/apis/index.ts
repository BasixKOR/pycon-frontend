import { shopAPIClient } from "./client";

import ShopAPISchema from "@pyconkr-shop/schemas";

namespace ShopAPIRoute {
  /**
   * 로그인합니다.
   * @param username - 사용자 이름
   * @param password - 비밀번호
   * @returns 로그인 정보
   * @throws 401 - 로그인 정보가 없습니다.
   */
  export const signInWithEmail = (data: ShopAPISchema.EmailSignInRequest) =>
    shopAPIClient.post<
      ShopAPISchema.UserStatus,
      ShopAPISchema.EmailSignInRequest
    >("authn/social/browser/v1/auth/login", data);

  /**
   * SNS로 로그인합니다.
   * @param socialSignInInfo - SNS 로그인 정보
   * @param socialSignInInfo.provider - SNS 제공자
   * @param socialSignInInfo.callback_url - SNS 로그인 후 리다이렉트할 URL
   * @returns 로그인 정보
   */
  export const signInWithSNS = async (
    socialSignInInfo: ShopAPISchema.SocialSignInRequest
  ) => {
    const f = document.createElement("form");
    f.method = "POST";
    f.action = `${shopAPIClient.baseURL}/authn/social/browser/v1/auth/provider/redirect`;

    Object.entries({
      ...socialSignInInfo,
      csrfmiddlewaretoken: shopAPIClient.getCSRFToken() ?? "",
      process: "login",
    }).forEach(([key, value]) => {
      const d = document.createElement("input");
      d.type = "hidden";
      d.name = key;
      d.value = value;
      f.appendChild(d);
    });
    document.body.appendChild(f);
    f.submit();
    document.body.removeChild(f);
  };

  /**
   * 로그아웃합니다.
   * @throws 401 - 로그아웃이 성공할 시에도 항상 401 에러가 발생합니다.
   */
  export const signOut = () =>
    shopAPIClient.delete<ShopAPISchema.UserStatus>(
      "authn/social/browser/v1/auth/session"
    );

  /**
   * 로그인 정보를 조회합니다.
   * @returns 로그인 정보
   * @throws 401 - 로그인 정보가 없습니다.
   */
  export const retrieveUserInfo = () =>
    shopAPIClient.get<ShopAPISchema.UserStatus>(
      "authn/social/browser/v1/auth/session"
    );

  /**
   * 노출 중인 모든 상품의 목록을 가져옵니다.
   * @param qs - 상품 목록을 가져올 쿼리 파라미터
   * @param qs.category_group - 상품 목록을 가져올 카테고리 그룹의 이름
   * @param qs.category - 상품 목록을 가져올 카테고리의 이름
   * @returns 노출 중인 모든 상품의 목록
   */
  export const listProducts = (qs?: ShopAPISchema.ProductListQueryParams) =>
    shopAPIClient.get<ShopAPISchema.Product[]>("v1/products/", { params: qs });

  /**
   * 현재 사용자의 장바구니에 담긴 상품의 목록을 가져옵니다.
   * @returns 현재 장바구니 상태
   */
  export const retrieveCart = () =>
    shopAPIClient.get<ShopAPISchema.Order>("v1/orders/cart/");

  /**
   * 장바구니에 상품을 추가합니다.
   * @param data 장바구니에 추가할 상품과 상품의 옵션 정보
   * @param data.product 장바구니에 추가할 상품의 UUID
   * @param data.options 장바구니에 추가할 상품의 옵션 정보
   * @param data.options[].product_option_group 장바구니에 추가할 상품 옵션 그룹의 UUID
   * @param data.options[].product_option 장바구니에 추가할 상품 옵션의 UUID (`null`일 경우 사용자 정의 응답)
   * @param data.options[].custom_response 장바구니에 추가할 상품 옵션에 대한 사용자 정의 응답 (옵션 그룹이 사용자 정의 응답일 경우 필수)
   * @returns 현재 장바구니 상태
   */
  export const appendItemToCart = (data: ShopAPISchema.CartItemAppendRequest) =>
    shopAPIClient.post<
      ShopAPISchema.Order,
      ShopAPISchema.CartItemAppendRequest
    >("v1/orders/cart/products/", data);

  /**
   * 장바구니에서 특정 상품을 제거합니다.
   * @param data 제거할 장바구니 내 상품의 UUID
   * @returns 현재 장바구니 상태
   */
  export const removeItemFromCart = (data: { cartProductId: string }) =>
    shopAPIClient.delete<ShopAPISchema.Order>(
      `v1/orders/cart/products/${data.cartProductId}/`
    );

  /**
   * 단일 상품 즉시 결제를 PortOne에 등록합니다.
   * @param data 결제할 상품과 상품의 옵션 정보
   * @param data.product 결제할 상품의 UUID
   * @param data.options 결제할 상품의 옵션 정보
   * @param data.options[].product_option_group 결제할 상품 옵션 그룹의 UUID
   * @param data.options[].product_option 결제할 상품 옵션의 UUID (`null`일 경우 사용자 정의 응답)
   * @param data.options[].custom_response 결제할 상품 옵션에 대한 사용자 정의 응답 (옵션 그룹이 사용자 정의 응답일 경우 필수)
   * @returns PortOne에 등록된 주문 정보
   */
  export const prepareOneItemOrder = (
    data: ShopAPISchema.OneItemOrderRequest
  ) =>
    shopAPIClient.post<ShopAPISchema.Order, ShopAPISchema.OneItemOrderRequest>(
      "v1/orders/single/",
      data
    );

  /**
   * 고객의 장바구니에 담긴 전체 상품 결제를 PortOne에 등록합니다.
   * @returns PortOne에 등록된 주문 정보
   */
  export const prepareCartOrder = () =>
    shopAPIClient.post<ShopAPISchema.Order, undefined>(
      "v1/orders/cart/",
      undefined
    );

  /**
   * 고객의 모든 결제 내역을 가져옵니다.
   * @returns 고객의 모든 결제 내역
   */
  export const listOrders = () =>
    shopAPIClient.get<ShopAPISchema.Order[]>("v1/orders/");

  /**
   * 결제 완료된 주문 내역에서 특정 상품을 환불 시도합니다.
   * @param data - 주문 내역 UUID와 주문 내역 내 환불할 상품 UUID
   * @param data.order_id - 환불할 상품이 포함된 주문 내역의 UUID
   * @param data.order_product_relation_id - 주문 내역 내 환불할 상품의 UUID
   */
  export const refundOneItemFromOrder = (
    data: ShopAPISchema.OneItemRefundRequest
  ) =>
    shopAPIClient.delete<void>(
      `v1/orders/${data.order_id}/products/${data.order_product_relation_id}/`
    );

  /**
   * 결제 완료된 주문 내역을 환불 시도합니다.
   * @param orderId - 환불할 주문 내역의 UUID
   */
  export const refundAllItemsInOrder = (orderId: string) =>
    shopAPIClient.delete<void>(`v1/orders/${orderId}/`);
}

export default ShopAPIRoute;
