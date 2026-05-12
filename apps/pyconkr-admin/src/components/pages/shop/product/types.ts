export type OptionAdmin = {
  id: string;
  created_at: string;
  updated_at: string;
  group: string;
  priority: number;
  name_ko: string;
  name_en: string;
  max_quantity_per_user: number;
  additional_price: number;
  stock: number;
  leftover_stock?: number | null;
};

export type OptionGroupAdmin = {
  id: string;
  created_at: string;
  updated_at: string;
  str_repr: string;
  product: string;
  priority: number;
  name_ko: string;
  name_en: string;
  min_quantity_per_product: number;
  max_quantity_per_product: number;
  is_custom_response: boolean;
  custom_response_pattern: string;
  response_modifiable_ends_at: string | null;
  options: OptionAdmin[];
};

export type ProductAdmin = {
  id: string;
  created_at: string;
  updated_at: string;
  str_repr: string;
  name_ko: string;
  name_en: string;
  description_ko: string;
  description_en: string;
  image: string;
  price: number;
  stock: number;
  hidden: boolean;
  max_quantity_per_user: number;
  visible_starts_at: string;
  visible_ends_at: string;
  orderable_starts_at: string;
  orderable_ends_at: string;
  refundable_ends_at: string;
  category: string;
  priority: number;
  donation_allowed: boolean;
  donation_min_price: number;
  donation_max_price: number;
  option_groups: OptionGroupAdmin[];
  tag_set: string[];
  leftover_stock?: number | null;
  current_status: ProductCurrentStatus;
};

export type ProductCurrentStatus = "hidden" | "out_of_visible_period" | "out_of_orderable_period" | "active";

export type TagAdmin = {
  id: string;
  name_ko: string;
  name_en: string;
  stock: number;
  max_quantity_per_user: number;
  leftover_stock?: number | null;
};

export type CategoryAdminFromGroup = {
  id: string;
  name: string;
  priority: number;
  group: string;
};

export type CategoryGroupAdminWithCategories = {
  id: string;
  name: string;
  priority: number;
  categories: CategoryAdminFromGroup[];
};
