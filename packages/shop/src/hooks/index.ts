import * as React from "react";

import { useMutation, useSuspenseQuery } from "@tanstack/react-query";

import ShopAPIs from "../apis";
import { ShopAPIClient } from '../apis/client';
import ShopContext from '../contexts';
import ShopSchemas from "../schemas";

const QUERY_KEYS = {
  BASE: ["query", "shop"],
  USER: ["query", "shop", "user"],
  PRODUCT_LIST: ["query", "shop", "products"],
  CART_INFO: ["query", "shop", "cart"],
  ORDER_LIST: ["query", "shop", "orders"],
};

const MUTATION_KEYS = {
  USER_SIGN_IN_EMAIL: ["mutation", "shop", "user", "sign_in", "email"],
  USER_SIGN_IN_SNS: ["mutation", "shop", "user", "sign_in", "sns"],
  USER_SIGN_OUT: ["mutation", "shop", "user", "sign_out"],
  CART_ITEM_APPEND: ["mutation", "shop", "cart", "item", "append"],
  CART_ITEM_REMOVE: ["mutation", "shop", "cart", "item", "remove"],
  CART_ORDER_START: ["mutation", "shop", "cart_order", "start"],
  ONE_ITEM_ORDER_START: ["mutation", "shop", "one_item_order", "start"],
  ALL_ORDER_REFUND: ["mutation", "shop", "all_order_refund"],
  ONE_ITEM_REFUND: ["mutation", "shop", "one_item_refund"],
};

namespace ShopHooks {
  export const useShopContext = () => {
    const context = React.useContext(ShopContext.context);
    if (!context) {
      throw new Error("useShopContext must be used within a ShopProvider");
    }
    return context;
  }

  const clientDecorator = <T = CallableFunction>(func:(client: ShopAPIClient) => T): T => {
    const { shopApiDomain, shopApiCSRFCookieName, shopApiTimeout } = useShopContext();
    return func(new ShopAPIClient(shopApiDomain, shopApiCSRFCookieName, shopApiTimeout));
  }

  export const useUserStatus = () =>
    useSuspenseQuery({
      queryKey: QUERY_KEYS.USER,
      queryFn: clientDecorator(ShopAPIs.retrieveUserInfo),
      retry: 3,
    });

  export const useSignInWithEmailMutation = () =>
    useMutation({
      mutationKey: MUTATION_KEYS.USER_SIGN_IN_EMAIL,
      mutationFn: clientDecorator(ShopAPIs.signInWithEmail),
      meta: { invalidates: [ QUERY_KEYS.BASE ] },
    });

  export const useSignInWithSNSMutation = () =>
    useMutation({
      mutationKey: MUTATION_KEYS.USER_SIGN_IN_SNS,
      mutationFn: clientDecorator(ShopAPIs.signInWithSNS),
      meta: { invalidates: [ QUERY_KEYS.BASE ] },
    });

  export const useSignOutMutation = () =>
    useMutation({
      mutationKey: MUTATION_KEYS.USER_SIGN_OUT,
      mutationFn: clientDecorator(ShopAPIs.signOut),
      meta: { invalidates: [ QUERY_KEYS.BASE ] },
    });

  export const useProducts = (qs?: ShopSchemas.ProductListQueryParams) =>
    useSuspenseQuery({
      queryKey: QUERY_KEYS.PRODUCT_LIST,
      queryFn: () => clientDecorator(ShopAPIs.listProducts)(qs),
    });

  export const useCart = () =>
    useSuspenseQuery({
      queryKey: QUERY_KEYS.CART_INFO,
      queryFn: clientDecorator(ShopAPIs.retrieveCart),
    });

  export const useAddItemToCartMutation = () =>
    useMutation({
      mutationKey: MUTATION_KEYS.CART_ITEM_APPEND,
      mutationFn: clientDecorator(ShopAPIs.appendItemToCart),
      meta: { invalidates: [QUERY_KEYS.CART_INFO] },
    });

  export const useRemoveItemFromCartMutation = () =>
    useMutation({
      mutationKey: MUTATION_KEYS.CART_ITEM_REMOVE,
      mutationFn: clientDecorator(ShopAPIs.removeItemFromCart),
      meta: { invalidates: [QUERY_KEYS.CART_INFO] },
    });

  export const usePrepareOneItemOrderMutation = () =>
    useMutation({
      mutationKey: MUTATION_KEYS.ONE_ITEM_ORDER_START,
      mutationFn: clientDecorator(ShopAPIs.prepareOneItemOrder),
      meta: { invalidates: [QUERY_KEYS.CART_INFO, QUERY_KEYS.ORDER_LIST] },
    });

  export const usePrepareCartOrderMutation = () =>
    useMutation({
      mutationKey: MUTATION_KEYS.CART_ORDER_START,
      mutationFn: clientDecorator(ShopAPIs.prepareCartOrder),
      meta: { invalidates: [QUERY_KEYS.CART_INFO, QUERY_KEYS.ORDER_LIST] },
    });

  export const useOrders = () =>
    useSuspenseQuery({
      queryKey: QUERY_KEYS.ORDER_LIST,
      queryFn: clientDecorator(ShopAPIs.listOrders),
    });

  export const useOneItemRefundMutation = () =>
    useMutation({
      mutationKey: MUTATION_KEYS.ONE_ITEM_REFUND,
      mutationFn: clientDecorator(ShopAPIs.refundOneItemFromOrder),
      meta: { invalidates: [QUERY_KEYS.ORDER_LIST] },
    });

  export const useOrderRefundMutation = () =>
    useMutation({
      mutationKey: MUTATION_KEYS.ALL_ORDER_REFUND,
      mutationFn: clientDecorator(ShopAPIs.refundAllItemsInOrder),
      meta: { invalidates: [QUERY_KEYS.ORDER_LIST] },
    });

  export const useOptionsOfOneItemInOrderPatchMutation = () =>
    useMutation({
      mutationKey: MUTATION_KEYS.CART_ITEM_APPEND,
      mutationFn: clientDecorator(ShopAPIs.patchOrderOptions),
      meta: { invalidates: [QUERY_KEYS.ORDER_LIST] },
    });
}

export default ShopHooks;
