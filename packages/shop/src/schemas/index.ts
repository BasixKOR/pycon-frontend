import * as R from "remeda";

namespace ShopSchemas {
  export type EmptyObject = Record<string, never>;

  export type DetailedErrorSchema = {
    code: string;
    detail: string;
    attr: string | null;
  };

  export type ErrorResponseSchema = {
    type: string;
    errors: DetailedErrorSchema[];
  };

  export type SocialSignInProvider = "google" | "naver" | "kakao";

  export type SocialSignInRequest = {
    provider: SocialSignInProvider;
    callback_url: string;
  };

  export type SocialSessionStatusType = {
    meta: { is_authenticated: boolean };
    data: { user?: { email: string } };
  };

  export type EmailSignInRequest = {
    email: string;
    password: string;
  };

  export type UserSignedInStatus = {
    status: number;
    meta: {
      is_authenticated: true;
    };
    data: {
      user: {
        id: number;
        display: string;
        has_usable_password: boolean;
        email: string;
        username: string;
      };
      methods: {
        method: string;
        at: number;
        email: string;
      }[];
    };
  };

  export type UserNotSignedInStatus = {
    status: number;
    meta: {
      is_authenticated: false;
    };
    data: {
      flows:
        | {
            id: "login";
          }
        | {
            id: "provider_redirect";
            providers: SocialSignInProvider[];
          }
        | {
            id: "provider_token";
            providers: SocialSignInProvider[];
          };
    };
  };

  export type Option = {
    id: string;
    name: string;
    additional_price: number;
    max_quantity_per_user: number;
    leftover_stock: number | null;
  };

  export type OptionGroup = {
    id: string;
    name: string;

    min_quantity_per_product: number;
    max_quantity_per_product: number;
    options: Option[];
  } & (
    | {
        is_custom_response: false;
        custom_response_pattern: null;
      }
    | {
        is_custom_response: true;
        custom_response_pattern: string;
      }
  );

  export type ProductListQueryParams = {
    category_group?: string;
    category?: string;
  };

  export type Product = {
    id: string;
    name: string;
    description: string | null;
    image: string | null;
    price: number;
    orderable_starts_at: string;
    orderable_ends_at: string;
    refundable_ends_at: string;

    category_group: string;
    category: string;

    donation_allowed: boolean;
    donation_min_price: number | null;
    donation_max_price: number | null;

    option_groups: OptionGroup[];
    leftover_stock: number;
    tag_names: string[];
  };

  export type PaymentHistoryStatus = "pending" | "completed" | "partial_refunded" | "refunded";

  export type PaymentHistory = {
    price: number;
    status: PaymentHistoryStatus;
  };

  export type OrderProductItemStatus = "pending" | "paid" | "used" | "refunded";

  export type OrderProductItem = {
    id: string;
    status: OrderProductItemStatus;
    price: number;
    donation_price: number;
    not_refundable_reason: string | null;
    product: {
      id: string;
      name: string;
      price: number;
      image: string | null;
    };
    options: (
      | {
          id: string;
          product_option_group: {
            id: string;
            name: string;
            is_custom_response: false;
            custom_response_pattern: null;
            response_modifiable_ends_at: string | null;
          };
          product_option: {
            id: string;
            name: string;
            additional_price: number;
          };
          custom_response: null;
        }
      | {
          id: string;
          product_option_group: {
            id: string;
            name: string;
            is_custom_response: true;
            custom_response_pattern: string;
            response_modifiable_ends_at: string | null;
          };
          product_option: null;
          custom_response: string;
        }
    )[];
  };

  export type CustomerInfo = {
    name: string; // ^(.*)$
    phone: string; // ^([\d]{3}-[\d]{3,4}-[\d]{4}|\+[\d]{9,14})$
    email: string; // $email
    organization: string | null; // ^(.*)$
  };

  export type Order = {
    id: string;
    name: string;
    first_paid_price: number;
    current_paid_price: number;
    current_status: PaymentHistoryStatus;
    not_fully_refundable_reason: string | null;
    created_at: string;

    payment_histories: PaymentHistory[];
    products: OrderProductItem[];
    customer_info: CustomerInfo | null;
  };
  export type Cart = Order;

  export type CartItemAppendRequest = {
    product: string;
    options: {
      product_option_group: string;
      product_option: string | null;
      custom_response: string | null;
    }[];
    donation_price?: number;
  };
  export type OneItemOrderRequest = CartItemAppendRequest & { customer_info: CustomerInfo };

  export type OneItemRefundRequest = {
    order_id: string;
    order_product_relation_id: string;
  };

  export type OrderOptionsPatchRequest = {
    order_id: string;
    order_product_relation_id: string;
    options: {
      order_product_option_relation: string;
      custom_response: string;
    }[];
  };

  export const isObjectErrorResponseSchema = (obj?: unknown): obj is ShopSchemas.ErrorResponseSchema => {
    return (
      R.isPlainObject(obj) &&
      R.isString(obj.type) &&
      R.isArray(obj.errors) &&
      obj.errors.every((error) => {
        return (
          R.isPlainObject(error) &&
          R.isString(error.code) &&
          R.isString(error.detail) &&
          (error.attr === null || R.isString(error.attr))
        );
      })
    );
  };
}

export default ShopSchemas;
