import { useMutation, useSuspenseQuery } from "@tanstack/react-query";
import * as React from "react";

import {
  appendItemToCart,
  listOrders,
  listPatrons,
  listProducts,
  patchOrderOptions,
  prepareCartOrder,
  prepareOneItemOrder,
  refundAllItemsInOrder,
  refundOneItemFromOrder,
  removeItemFromCart,
  retrieveCart,
  retrieveUserInfo,
  retrieveUserRowInfo,
  signInWithEmail,
  signInWithSNS,
  signOut,
} from "../apis";
import { ShopAPIClient } from "../apis/client";
import { context as shopContext } from "../contexts";
import type { ProductListQueryParams } from "../schemas";

const QUERY_KEYS = {
  BASE: ["query", "shop"],
  USER: ["query", "shop", "user"],
  USER_ROW: ["query", "shop", "user_row"],
  PRODUCT_LIST: ["query", "shop", "products"],
  CART_INFO: ["query", "shop", "cart"],
  ORDER_LIST: ["query", "shop", "orders"],
  PATRONS: ["query", "shop", "patrons"],
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

export const useShopContext = () => {
  const context = React.useContext(shopContext);
  if (!context) {
    throw new Error("useShopContext must be used within a ShopProvider");
  }
  return context;
};

export const useShopClient = () => {
  const { shopApiDomain, shopApiCSRFCookieName, shopApiTimeout, language } = useShopContext();
  return new ShopAPIClient(shopApiDomain, shopApiCSRFCookieName, shopApiTimeout, language);
};

export const useUserStatus = (client: ShopAPIClient) =>
  useSuspenseQuery({
    queryKey: [...QUERY_KEYS.USER, client.language],
    queryFn: retrieveUserInfo(client),
    retry: 3,
  });

export const useUserInfo = (client: ShopAPIClient) =>
  useSuspenseQuery({
    queryKey: [...QUERY_KEYS.USER_ROW, client.language],
    queryFn: retrieveUserRowInfo(client),
    retry: 3,
  });

export const useSignInWithEmailMutation = (client: ShopAPIClient) =>
  useMutation({
    mutationKey: MUTATION_KEYS.USER_SIGN_IN_EMAIL,
    mutationFn: signInWithEmail(client),
    meta: { invalidates: [QUERY_KEYS.BASE] },
  });

export const useSignInWithSNSMutation = (client: ShopAPIClient) =>
  useMutation({
    mutationKey: MUTATION_KEYS.USER_SIGN_IN_SNS,
    mutationFn: signInWithSNS(client),
    meta: { invalidates: [QUERY_KEYS.BASE] },
  });

export const useSignOutMutation = (client: ShopAPIClient) =>
  useMutation({
    mutationKey: MUTATION_KEYS.USER_SIGN_OUT,
    mutationFn: signOut(client),
    retry: 0,
    meta: { invalidates: [QUERY_KEYS.BASE] },
  });

export const useProducts = (client: ShopAPIClient, qs?: ProductListQueryParams) =>
  useSuspenseQuery({
    queryKey: [...QUERY_KEYS.PRODUCT_LIST, qs ? JSON.stringify(qs) : "", client.language],
    queryFn: () => listProducts(client)(qs),
  });

export const useCart = (client: ShopAPIClient) =>
  useSuspenseQuery({
    queryKey: [...QUERY_KEYS.CART_INFO, client.language],
    queryFn: retrieveCart(client),
  });

export const useAddItemToCartMutation = (client: ShopAPIClient) =>
  useMutation({
    mutationKey: MUTATION_KEYS.CART_ITEM_APPEND,
    mutationFn: appendItemToCart(client),
    meta: { invalidates: [QUERY_KEYS.CART_INFO] },
  });

export const useRemoveItemFromCartMutation = (client: ShopAPIClient) =>
  useMutation({
    mutationKey: MUTATION_KEYS.CART_ITEM_REMOVE,
    mutationFn: removeItemFromCart(client),
    meta: { invalidates: [QUERY_KEYS.CART_INFO] },
  });

export const usePrepareOneItemOrderMutation = (client: ShopAPIClient) =>
  useMutation({
    mutationKey: MUTATION_KEYS.ONE_ITEM_ORDER_START,
    mutationFn: prepareOneItemOrder(client),
    meta: { invalidates: [QUERY_KEYS.CART_INFO, QUERY_KEYS.ORDER_LIST] },
  });

export const usePrepareCartOrderMutation = (client: ShopAPIClient) =>
  useMutation({
    mutationKey: MUTATION_KEYS.CART_ORDER_START,
    mutationFn: prepareCartOrder(client),
    meta: { invalidates: [QUERY_KEYS.CART_INFO, QUERY_KEYS.ORDER_LIST] },
  });

export const useOrders = (client: ShopAPIClient) =>
  useSuspenseQuery({
    queryKey: [...QUERY_KEYS.ORDER_LIST, client.language],
    queryFn: listOrders(client),
  });

export const useOneItemRefundMutation = (client: ShopAPIClient) =>
  useMutation({
    mutationKey: MUTATION_KEYS.ONE_ITEM_REFUND,
    mutationFn: refundOneItemFromOrder(client),
    meta: { invalidates: [QUERY_KEYS.ORDER_LIST] },
  });

export const useOrderRefundMutation = (client: ShopAPIClient) =>
  useMutation({
    mutationKey: MUTATION_KEYS.ALL_ORDER_REFUND,
    mutationFn: refundAllItemsInOrder(client),
    meta: { invalidates: [QUERY_KEYS.ORDER_LIST] },
  });

export const useOptionsOfOneItemInOrderPatchMutation = (client: ShopAPIClient) =>
  useMutation({
    mutationKey: MUTATION_KEYS.CART_ITEM_APPEND,
    mutationFn: patchOrderOptions(client),
    meta: { invalidates: [QUERY_KEYS.ORDER_LIST] },
  });

export const usePatrons = (client: ShopAPIClient, year: number) =>
  useSuspenseQuery({
    queryKey: [...QUERY_KEYS.PATRONS, year],
    queryFn: listPatrons(client, year),
  });
