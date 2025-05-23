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

  export const useShopClient = () => {
    const { shopApiDomain, shopApiCSRFCookieName, shopApiTimeout } = useShopContext();
    return new ShopAPIClient(shopApiDomain, shopApiCSRFCookieName, shopApiTimeout);
  }

  export const useUserStatus = (client: ShopAPIClient) =>
    useSuspenseQuery({
      queryKey: QUERY_KEYS.USER,
      queryFn: ShopAPIs.retrieveUserInfo(client),
      retry: 3,
    });

  export const useSignInWithEmailMutation = (client: ShopAPIClient) =>
    useMutation({
      mutationKey: MUTATION_KEYS.USER_SIGN_IN_EMAIL,
      mutationFn: ShopAPIs.signInWithEmail(client),
      meta: { invalidates: [ QUERY_KEYS.BASE ] },
    });

  export const useSignInWithSNSMutation = (client: ShopAPIClient) =>
    useMutation({
      mutationKey: MUTATION_KEYS.USER_SIGN_IN_SNS,
      mutationFn: ShopAPIs.signInWithSNS(client),
      meta: { invalidates: [ QUERY_KEYS.BASE ] },
    });

  export const useSignOutMutation = (client: ShopAPIClient) =>
    useMutation({
      mutationKey: MUTATION_KEYS.USER_SIGN_OUT,
      mutationFn: ShopAPIs.signOut(client),
      meta: { invalidates: [ QUERY_KEYS.BASE ] },
    });

  export const useProducts = (client: ShopAPIClient, qs?: ShopSchemas.ProductListQueryParams) =>
    useSuspenseQuery({
      queryKey: QUERY_KEYS.PRODUCT_LIST,
      queryFn: () => ShopAPIs.listProducts(client)(qs),
    });

  export const useCart = (client: ShopAPIClient) =>
    useSuspenseQuery({
      queryKey: QUERY_KEYS.CART_INFO,
      queryFn: ShopAPIs.retrieveCart(client),
    });

  export const useAddItemToCartMutation = (client: ShopAPIClient) =>
    useMutation({
      mutationKey: MUTATION_KEYS.CART_ITEM_APPEND,
      mutationFn: ShopAPIs.appendItemToCart(client),
      meta: { invalidates: [QUERY_KEYS.CART_INFO] },
    });

  export const useRemoveItemFromCartMutation = (client: ShopAPIClient) =>
    useMutation({
      mutationKey: MUTATION_KEYS.CART_ITEM_REMOVE,
      mutationFn: ShopAPIs.removeItemFromCart(client),
      meta: { invalidates: [QUERY_KEYS.CART_INFO] },
    });

  export const usePrepareOneItemOrderMutation = (client: ShopAPIClient) =>
    useMutation({
      mutationKey: MUTATION_KEYS.ONE_ITEM_ORDER_START,
      mutationFn: ShopAPIs.prepareOneItemOrder(client),
      meta: { invalidates: [QUERY_KEYS.CART_INFO, QUERY_KEYS.ORDER_LIST] },
    });

  export const usePrepareCartOrderMutation = (client: ShopAPIClient) =>
    useMutation({
      mutationKey: MUTATION_KEYS.CART_ORDER_START,
      mutationFn: ShopAPIs.prepareCartOrder(client),
      meta: { invalidates: [QUERY_KEYS.CART_INFO, QUERY_KEYS.ORDER_LIST] },
    });

  export const useOrders = (client: ShopAPIClient) =>
    useSuspenseQuery({
      queryKey: QUERY_KEYS.ORDER_LIST,
      queryFn: ShopAPIs.listOrders(client),
    });

  export const useOneItemRefundMutation = (client: ShopAPIClient) =>
    useMutation({
      mutationKey: MUTATION_KEYS.ONE_ITEM_REFUND,
      mutationFn: ShopAPIs.refundOneItemFromOrder(client),
      meta: { invalidates: [QUERY_KEYS.ORDER_LIST] },
    });

  export const useOrderRefundMutation = (client: ShopAPIClient) =>
    useMutation({
      mutationKey: MUTATION_KEYS.ALL_ORDER_REFUND,
      mutationFn: ShopAPIs.refundAllItemsInOrder(client),
      meta: { invalidates: [QUERY_KEYS.ORDER_LIST] },
    });

  export const useOptionsOfOneItemInOrderPatchMutation = (client: ShopAPIClient) =>
    useMutation({
      mutationKey: MUTATION_KEYS.CART_ITEM_APPEND,
      mutationFn: ShopAPIs.patchOrderOptions(client),
      meta: { invalidates: [QUERY_KEYS.ORDER_LIST] },
    });
}

export default ShopHooks;
