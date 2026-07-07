export type PaymentStatus = "pending" | "completed" | "partial_refunded" | "refunded";
export type OrderProductStatus = "pending" | "paid" | "used" | "refunded";

export type SimpleUser = {
  id: string;
  username: string;
  email: string;
  unique_id: string;
};

export type SimpleCustomerInfo = {
  name: string;
  phone: string;
  email: string;
  organization: string | null;
};

export type SimpleProduct = {
  id: string;
  name_ko: string;
  name_en: string;
  price: number;
};

export type SimpleOrderProductOptionRelation = {
  id: string;
  option_group_name_ko: string;
  option_group_name_en: string;
  option_name_ko: string | null;
  option_name_en: string | null;
  custom_response: string | null;
};

export type SimpleTicketInfo = {
  name: string;
  phone: string;
  email: string;
  organization: string | null;
  contribution_message: string | null;
};

export type SimpleOrderProductRelation = {
  id: string;
  product: SimpleProduct;
  status: OrderProductStatus;
  price: number;
  donation_price: number;
  options: SimpleOrderProductOptionRelation[];
  ticket_info: SimpleTicketInfo | null;
};

export type SimplePaymentHistory = {
  id: string;
  imp_id: string;
  status: PaymentStatus;
  price: number;
  created_at: string;
};

export type OrderAdmin = {
  id: string;
  str_repr: string;
  created_at: string;
  updated_at: string;
  name_ko: string;
  name_en: string;
  user: SimpleUser | null;
  customer_info: SimpleCustomerInfo | null;
  products: SimpleOrderProductRelation[];
  payment_histories: SimplePaymentHistory[];
  first_paid_price: number;
  current_paid_price: number;
  current_status: PaymentStatus;
  first_paid_at: string | null;
  latest_imp_id: string | null;
};
