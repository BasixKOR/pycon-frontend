import { useMutation, useSuspenseQuery } from "@tanstack/react-query";

import ShopAPIRoute from "@pyconkr-shop/apis";
import ShopAPISchema from "@pyconkr-shop/schemas";

const QUERY_KEYS = {
  USER: ["query", "user"],
  PRODUCT_LIST: ["query", "products"],
  CART_INFO: ["query", "cart"],
  ORDER_LIST: ["query", "orders"],
};

const MUTATION_KEYS = {
  USER_SIGN_IN_EMAIL: ["mutation", "user", "sign_in", "email"],
  USER_SIGN_IN_SNS: ["mutation", "user", "sign_in", "sns"],
  USER_SIGN_OUT: ["mutation", "user", "sign_out"],
  CART_ITEM_APPEND: ["mutation", "cart", "item", "append"],
  CART_ITEM_REMOVE: ["mutation", "cart", "item", "remove"],
  CART_ORDER_START: ["mutation", "cart_order", "start"],
  ONE_ITEM_ORDER_START: ["mutation", "one_item_order", "start"],
  ALL_ORDER_REFUND: ["mutation", "all_order_refund"],
  ONE_ITEM_REFUND: ["mutation", "one_item_refund"],
};

namespace ShopAPIHook {
  export const useUserStatus = () =>
    useSuspenseQuery({
      queryKey: QUERY_KEYS.USER,
      queryFn: async () => {
        try {
          const userInfo = await ShopAPIRoute.retrieveUserInfo();
          return userInfo.meta.is_authenticated === true ? userInfo : null;
        } catch (e) {
          return null;
        }
      },
    });

  export const useSignInWithEmailMutation = () =>
    useMutation({
      mutationKey: MUTATION_KEYS.USER_SIGN_IN_EMAIL,
      mutationFn: ShopAPIRoute.signInWithEmail,
      meta: {
        invalidates: [
          QUERY_KEYS.USER,
          QUERY_KEYS.CART_INFO,
          QUERY_KEYS.ORDER_LIST,
        ],
      },
    });

  export const useSignInWithSNSMutation = () =>
    useMutation({
      mutationKey: MUTATION_KEYS.USER_SIGN_IN_SNS,
      mutationFn: ShopAPIRoute.signInWithSNS,
      meta: {
        invalidates: [
          QUERY_KEYS.USER,
          QUERY_KEYS.CART_INFO,
          QUERY_KEYS.ORDER_LIST,
        ],
      },
    });

  export const useSignOutMutation = () =>
    useMutation({
      mutationKey: MUTATION_KEYS.USER_SIGN_OUT,
      mutationFn: async () => {
        try {
          return await ShopAPIRoute.signOut();
        } catch (e) {
          return null;
        }
      },
      meta: {
        invalidates: [
          QUERY_KEYS.USER,
          QUERY_KEYS.CART_INFO,
          QUERY_KEYS.ORDER_LIST,
        ],
      },
    });

  export const useProducts = (qs?: ShopAPISchema.ProductListQueryParams) =>
    useSuspenseQuery({
      queryKey: QUERY_KEYS.PRODUCT_LIST,
      queryFn: () => ShopAPIRoute.listProducts(qs),
    });

  export const useCart = () =>
    useSuspenseQuery({
      queryKey: QUERY_KEYS.CART_INFO,
      queryFn: ShopAPIRoute.retrieveCart,
    });

  export const useAddItemToCartMutation = () =>
    useMutation({
      mutationKey: MUTATION_KEYS.CART_ITEM_APPEND,
      mutationFn: ShopAPIRoute.appendItemToCart,
      meta: { invalidates: [QUERY_KEYS.CART_INFO] },
    });

  export const useRemoveItemFromCartMutation = () =>
    useMutation({
      mutationKey: MUTATION_KEYS.CART_ITEM_REMOVE,
      mutationFn: ShopAPIRoute.removeItemFromCart,
      meta: { invalidates: [QUERY_KEYS.CART_INFO] },
    });

  export const usePrepareOneItemOrderMutation = () =>
    useMutation({
      mutationKey: MUTATION_KEYS.ONE_ITEM_ORDER_START,
      mutationFn: ShopAPIRoute.prepareOneItemOrder,
      meta: { invalidates: [QUERY_KEYS.CART_INFO, QUERY_KEYS.ORDER_LIST] },
    });

  export const usePrepareCartOrderMutation = () =>
    useMutation({
      mutationKey: MUTATION_KEYS.CART_ORDER_START,
      mutationFn: ShopAPIRoute.prepareCartOrder,
      meta: { invalidates: [QUERY_KEYS.CART_INFO, QUERY_KEYS.ORDER_LIST] },
    });

  export const useOrders = () =>
    useSuspenseQuery({
      queryKey: QUERY_KEYS.ORDER_LIST,
      queryFn: ShopAPIRoute.listOrders,
    });

  export const useOneItemRefundMutation = () =>
    useMutation({
      mutationKey: MUTATION_KEYS.ONE_ITEM_REFUND,
      mutationFn: ShopAPIRoute.refundOneItemFromOrder,
      meta: { invalidates: [QUERY_KEYS.ORDER_LIST] },
    });

  export const useOrderRefundMutation = () =>
    useMutation({
      mutationKey: MUTATION_KEYS.ALL_ORDER_REFUND,
      mutationFn: ShopAPIRoute.refundAllItemsInOrder,
      meta: { invalidates: [QUERY_KEYS.ORDER_LIST] },
    });
}

export default ShopAPIHook;
