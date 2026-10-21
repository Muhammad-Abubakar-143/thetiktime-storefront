import {
  medusaRequest,
  DEFAULT_REGION,
  getCartId,
  setCartId,
} from './medusa-client';

export interface Region {
  id: string;
  name: string;
  currency_code: string;
  countries?: { iso_2: string; name: string; display_name: string }[];
}

export interface MoneyAmount {
  amount: number;
  currency_code: string;
}

export interface CalculatedPrice {
  calculated_amount: number;
  currency_code: string;
  original_amount?: number | null;
}

export interface ProductVariant {
  id: string;
  title: string;
  sku?: string | null;
  barcode?: string | null;
  calculated_price?: CalculatedPrice;
  original_price?: number | null;
  prices?: { amount: number; currency_code: string }[];
  options?: { id: string; value: string; option?: { id: string; title: string } }[];
  inventory_quantity?: number;
  allow_backorder?: boolean;
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

export interface Product {
  id: string;
  title: string;
  handle: string;
  subtitle?: string | null;
  description?: string | null;
  thumbnail?: string | null;
  status?: string;
  material?: string | null;
  weight?: number | null;
  length?: number | null;
  height?: number | null;
  width?: number | null;
  origin_country?: string | null;
  mid_code?: string | null;
  hs_code?: string | null;
  metadata?: Record<string, unknown> | null;
  variants?: ProductVariant[];
  images?: ProductImage[];
  options?: ProductOption[];
  collection_id?: string | null;
  collection?: Collection | null;
  categories?: { id: string; name: string; handle: string }[];
  tags?: { id: string; value: string }[];
  type?: { id: string; value: string } | null;
  type_id?: string | null;
  created_at?: string;
  updated_at?: string;
}

export interface Collection {
  id: string;
  title: string;
  handle: string;
  metadata?: Record<string, unknown> | null;
  products?: Product[];
}

export interface Category {
  id: string;
  name: string;
  handle: string;
  description?: string | null;
  parent_category_id?: string | null;
}

export interface CartItem {
  id: string;
  quantity: number;
  product_id: string;
  variant_id: string;
  product?: { id: string; title: string; handle: string; thumbnail?: string | null; description?: string | null };
  variant?: { id: string; title: string; sku?: string | null; calculated_price?: CalculatedPrice };
  unit_price: number;
  original_unit_price?: number | null;
  total: number;
  subtotal: number;
  metadata?: Record<string, unknown> | null;
  thumbnail?: string | null;
  title?: string;
  variant_title?: string;
}

export interface Address {
  first_name?: string;
  last_name?: string;
  address_1?: string;
  address_2?: string;
  city?: string;
  country_code?: string;
  postal_code?: string;
  phone?: string;
  province?: string;
}

export interface Cart {
  id: string;
  currency_code: string;
  region_id: string;
  email?: string | null;
  items: CartItem[];
  shipping_address?: Address | null;
  billing_address?: Address | null;
  shipping_methods?: { id: string; name: string; amount: number }[];
  total: number;
  subtotal: number;
  tax_total: number;
  discount_total: number;
  shipping_total: number;
  original_total: number;
  item_total: number;
  item_subtotal: number;
}

export interface ShippingOption {
  id: string;
  name: string;
  price_type?: string;
  amount?: number;
  calculated_price?: { calculated_amount: number };
}

export interface PaymentSession {
  id: string;
  provider_id: string;
  status: string;
  data?: Record<string, unknown>;
}

export interface Order {
  id: string;
  status: string;
  fulfillment_status?: string;
  payment_status?: string;
  currency_code: string;
  email?: string | null;
  items?: CartItem[];
  shipping_address?: Address | null;
  billing_address?: Address | null;
  total: number;
  subtotal: number;
  tax_total: number;
  shipping_total: number;
  discount_total: number;
  display_id?: number;
  created_at?: string;
}

const PRODUCT_FIELDS = [
  '+variants.calculated_price',
  '*variants',
  '*variants.options',
  '*images',
  '*options',
  '*options.values',
  '*collection',
  '*tags',
  '*categories',
  '*type',
].join(',');

export async function listRegions(): Promise<Region[]> {
  const data = await medusaRequest<{ regions: Region[] }>(
    '/store/regions',
    { next: { revalidate: 3600, tags: ['regions'] } }
  );
  return data.regions;
}

export async function getDefaultRegion(): Promise<Region> {
  const regions = await listRegions();
  const match =
    regions.find((r) => r.countries?.some((c) => c.iso_2 === DEFAULT_REGION)) ||
    regions.find((r) => r.name?.toLowerCase().includes('pakistan')) ||
    regions[0];
  if (!match) throw new Error('No regions available in store');
  return match;
}

export interface ListProductsParams {
  limit?: number;
  offset?: number;
  collection_id?: string | string[];
  category_id?: string | string[];
  handle?: string;
  q?: string;
  tags?: string | string[];
  order?: string;
  fields?: string;
}

export async function listProducts(
  params: ListProductsParams = {}
): Promise<{ products: Product[]; count: number; offset: number; limit: number }> {
  const { fields, ...rest } = params;
  const data = await medusaRequest<{
    products: Product[];
    count: number;
    offset: number;
    limit: number;
  }>('/store/products', {
    query: {
      limit: String(params.limit ?? 100),
      offset: String(params.offset ?? 0),
      fields: fields ?? PRODUCT_FIELDS,
      ...(rest.collection_id ? { collection_id: rest.collection_id } : {}),
      ...(rest.category_id ? { category_id: rest.category_id } : {}),
      ...(rest.handle ? { handle: rest.handle } : {}),
      ...(rest.q ? { q: rest.q } : {}),
      ...(rest.tags ? { tags: rest.tags } : {}),
      ...(rest.order ? { order: rest.order } : {}),
    },
    next: { revalidate: 60, tags: ['products'] },
  });
  return data;
}

export async function getProductByHandle(
  handle: string
): Promise<Product | null> {
  const data = await medusaRequest<{ products: Product[] }>(
    '/store/products',
    {
      query: { handle, fields: PRODUCT_FIELDS },
      next: { revalidate: 60, tags: ['products', `product:${handle}`] },
    }
  );
  return data.products?.[0] ?? null;
}

export async function listCollections(): Promise<Collection[]> {
  const data = await medusaRequest<{ collections: Collection[] }>(
    '/store/collections',
    {
      query: { fields: '+products,+products.tags,+products.collection' },
      next: { revalidate: 600, tags: ['collections'] },
    }
  );
  return data.collections;
}

export async function listCategories(): Promise<Category[]> {
  try {
    const data = await medusaRequest<{ product_categories: Category[] }>(
      '/store/product-categories',
      { next: { revalidate: 600, tags: ['categories'] } }
    );
    return data.product_categories;
  } catch {
    return [];
  }
}

export async function createCart(regionId: string): Promise<Cart> {
  const data = await medusaRequest<{ cart: Cart }>('/store/carts', {
    method: 'POST',
    body: { region_id: regionId },
  });
  setCartId(data.cart.id);
  return data.cart;
}

export async function getCart(cartId: string): Promise<Cart | null> {
  try {
    const data = await medusaRequest<{ cart: Cart }>(
      `/store/carts/${cartId}`,
      { next: { revalidate: 0 } }
    );
    return data.cart;
  } catch {
    return null;
  }
}

export async function getOrCreateCart(regionId: string): Promise<Cart> {
  const existingId = getCartId();
  if (existingId) {
    const cart = await getCart(existingId);
    if (cart && !cart.email) return cart;
  }
  return createCart(regionId);
}

export async function addToCart(
  cartId: string,
  variantId: string,
  quantity: number
): Promise<Cart> {
  const data = await medusaRequest<{ cart: Cart }>(
    `/store/carts/${cartId}/line-items`,
    { method: 'POST', body: { variant_id: variantId, quantity } }
  );
  return data.cart;
}

export async function updateLineItem(
  cartId: string,
  lineId: string,
  quantity: number
): Promise<Cart> {
  const data = await medusaRequest<{ cart: Cart }>(
    `/store/carts/${cartId}/line-items/${lineId}`,
    { method: 'POST', body: { quantity } }
  );
  return data.cart;
}

export async function deleteLineItem(
  cartId: string,
  lineId: string
): Promise<Cart> {
  const data = await medusaRequest<{ cart: Cart }>(
    `/store/carts/${cartId}/line-items/${lineId}`,
    { method: 'DELETE' }
  );
  return data.cart;
}

export async function updateCartEmail(
  cartId: string,
  email: string
): Promise<Cart> {
  const data = await medusaRequest<{ cart: Cart }>(`/store/carts/${cartId}`, {
    method: 'POST',
    body: { email },
  });
  return data.cart;
}

export async function updateCartShippingAddress(
  cartId: string,
  address: Address
): Promise<Cart> {
  const data = await medusaRequest<{ cart: Cart }>(`/store/carts/${cartId}`, {
    method: 'POST',
    body: {
      shipping_address: address,
    },
  });
  return data.cart;
}

export async function listShippingOptions(
  cartId: string
): Promise<ShippingOption[]> {
  try {
    const data = await medusaRequest<{
      shipping_options: ShippingOption[];
    }>('/store/shipping-options', {
      query: { cart_id: cartId },
    });
    return data.shipping_options;
  } catch {
    return [];
  }
}

export async function addShippingMethod(
  cartId: string,
  optionId: string
): Promise<Cart> {
  const data = await medusaRequest<{ cart: Cart }>(
    `/store/carts/${cartId}/shipping-methods`,
    { method: 'POST', body: { option_id: optionId } }
  );
  return data.cart;
}

export async function initPaymentSessions(cartId: string): Promise<Cart> {
  const data = await medusaRequest<{ cart: Cart }>(
    `/store/carts/${cartId}/payment-sessions`,
    { method: 'POST' }
  );
  return data.cart;
}

export async function completeCart(cartId: string): Promise<Order> {
  const data = await medusaRequest<{
    type: string;
    order?: Order;
    cart?: Cart;
  }>(`/store/carts/${cartId}/complete`, { method: 'POST' });
  if (data.type === 'order' && data.order) return data.order;
  throw new Error(
    'Unable to complete order. Please verify your shipping details and try again.'
  );
}
