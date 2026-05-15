import { ProductAdmin } from "./types";

export type ProductFormValues = {
  name_ko: string;
  name_en: string;
  description_ko: string;
  description_en: string;
  image: string;
  price: string;
  stock: string;
  hidden: boolean;
  max_quantity_per_user: string;
  category: string;
  priority: string;
  visible_starts_at: string;
  visible_ends_at: string;
  orderable_starts_at: string;
  orderable_ends_at: string;
  refundable_ends_at: string;
  donation_allowed: boolean;
  donation_min_price: string;
  donation_max_price: string;
  tag_set: string[];
};

export type SetField = <K extends keyof ProductFormValues>(key: K, value: ProductFormValues[K]) => void;

export const buildDefaultFormValues = (existing?: ProductAdmin): ProductFormValues => ({
  name_ko: existing?.name_ko ?? "",
  name_en: existing?.name_en ?? "",
  description_ko: existing?.description_ko ?? "",
  description_en: existing?.description_en ?? "",
  image: existing?.image ?? "",
  price: existing ? String(existing.price) : "0",
  stock: existing ? String(existing.stock) : "0",
  hidden: existing?.hidden ?? false,
  max_quantity_per_user: existing ? String(existing.max_quantity_per_user) : "0",
  category: existing?.category ?? "",
  priority: existing ? String(existing.priority) : "0",
  visible_starts_at: existing?.visible_starts_at ?? "",
  visible_ends_at: existing?.visible_ends_at ?? "",
  orderable_starts_at: existing?.orderable_starts_at ?? "",
  orderable_ends_at: existing?.orderable_ends_at ?? "",
  refundable_ends_at: existing?.refundable_ends_at ?? "",
  donation_allowed: existing?.donation_allowed ?? false,
  donation_min_price: existing ? String(existing.donation_min_price) : "0",
  donation_max_price: existing ? String(existing.donation_max_price) : "0",
  tag_set: existing?.tag_set ?? [],
});

export const toPayload = (v: ProductFormValues) => ({
  name_ko: v.name_ko,
  name_en: v.name_en,
  description_ko: v.description_ko,
  description_en: v.description_en,
  image: v.image,
  price: Number(v.price) || 0,
  stock: Number(v.stock) || 0,
  hidden: v.hidden,
  max_quantity_per_user: Number(v.max_quantity_per_user) || 0,
  category: v.category,
  priority: Number(v.priority) || 0,
  visible_starts_at: v.visible_starts_at || null,
  visible_ends_at: v.visible_ends_at || null,
  orderable_starts_at: v.orderable_starts_at || null,
  orderable_ends_at: v.orderable_ends_at || null,
  refundable_ends_at: v.refundable_ends_at || null,
  donation_allowed: v.donation_allowed,
  donation_min_price: Number(v.donation_min_price) || 0,
  donation_max_price: Number(v.donation_max_price) || 0,
  tag_set: v.tag_set,
});
