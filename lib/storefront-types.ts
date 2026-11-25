export interface ProductVariantOption {
  id: string;
  value: string;
  option_id?: string;
  option?: { id: string; title: string };
}

export interface ProductVariant {
  id: string;
  title: string;
  thumbnail?: string | null;
  sku?: string | null;
  price: number;
  compare_price?: number | null;
  stock: number;
  options?: ProductVariantOption[];
}

export interface ProductImage {
  id: string;
  url: string;
  rank?: number;
}

export interface ProductOption {
  id: string;
  title: string;
  values?: { id: string; value: string }[];
}

export interface ProductCategory {
  id: string;
  name: string;
  handle: string;
}

export interface Product {
  id: string;
  title: string;
  handle: string;
  subtitle?: string | null;
  description?: string | null;
  thumbnail?: string | null;
  metadata?: Record<string, unknown> | null;
  variants?: ProductVariant[];
  images?: ProductImage[];
  options?: ProductOption[];
  collection_id?: string | null;
  collection?: { title: string } | null;
  categories?: ProductCategory[];
  tags?: { id: string; value: string }[];
}

export interface StorefrontRegion {
  currency_code: string;
}
