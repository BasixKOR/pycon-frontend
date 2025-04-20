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
  USER_SIGN_IN: ["mutation", "user", "sign_in"],
  CART_ITEM_APPEND: ["mutation", "cart", "item", "append"],
  CART_ITEM_REMOVE: ["mutation", "cart", "item", "remove"],
  CART_ORDER_START: ["mutation", "cart_order", "start"],
  ONE_ITEM_ORDER_START: ["mutation", "one_item_order", "start"],
  ALL_ORDER_REFUND: ["mutation", "all_order_refund"],
  ONE_ITEM_REFUND: ["mutation", "one_item_refund"],
};

namespace ShopAPIHook {
  export const useIsSignedIn = () =>
    useSuspenseQuery({
      queryKey: QUERY_KEYS.USER,
      queryFn: async () => {
        try {
          return (await ShopAPIRoute.retrieveUserInfo()).meta.is_authenticated;
        } catch (e) {
          return false;
        }
      },
    });

  export const useSignInWithEmailMutation = () =>
    useMutation({
      mutationKey: MUTATION_KEYS.USER_SIGN_IN,
      mutationFn: ShopAPIRoute.signInWithEmail,
    });

  export const useSignInWithSNSMutation = () =>
    useMutation({
      mutationKey: MUTATION_KEYS.USER_SIGN_IN,
      mutationFn: ShopAPIRoute.signInWithSNS,
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
    });

  export const useRemoveItemFromCartMutation = () =>
    useMutation({
      mutationKey: MUTATION_KEYS.CART_ITEM_REMOVE,
      mutationFn: ShopAPIRoute.removeItemFromCart,
    });

  export const usePrepareOneItemOrderMutation = () =>
    useMutation({
      mutationKey: MUTATION_KEYS.ONE_ITEM_ORDER_START,
      mutationFn: ShopAPIRoute.prepareOneItemOrder,
    });

  export const usePrepareOrderMutation = () =>
    useMutation({
      mutationKey: MUTATION_KEYS.CART_ORDER_START,
      mutationFn: ShopAPIRoute.prepareCartOrder,
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
    });

  export const useOrderRefundMutation = () =>
    useMutation({
      mutationKey: MUTATION_KEYS.ALL_ORDER_REFUND,
      mutationFn: ShopAPIRoute.refundAllItemsInOrder,
    });
}

export default ShopAPIHook;
