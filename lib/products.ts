import type { Product, ProductOption } from './storefront-types';
import type { BrandGroup } from './format';

const PRODUCTS_URL =
  'https://zesty-rosybrown-curlew-26.hostingersite.com/api/index.php?route=products';
const COLLECTIONS_URL =
  'https://zesty-rosybrown-curlew-26.hostingersite.com/api/index.php?route=collections';
const IMAGE_BASE_URL = 'https://zesty-rosybrown-curlew-26.hostingersite.com/';

interface ApiVariant {
  id: number;
  sku: string | null;
  title: string;
  price: string;
  compare_price: string | null;
  stock: number;
}

interface ApiProduct {
  id: number;
  name: string;
  handle: string;
  subtitle: string | null;
  description: string | null;
  category: string | null;
  variants: ApiVariant[];
  images: string[];
  attributes: Record<string, string>;
}

interface ApiCollectionProduct {
  id: number;
  handle: string;
  name: string;
}

interface ApiCollection {
  id: number;
  name: string;
  handle: string;
  description?: string | null;
  products: ApiCollectionProduct[];
}

function parsePrice(value: string, variantId: number): number {
  const amount = Number(value);
  if (!value.trim() || !Number.isFinite(amount)) {
    throw new Error(`Invalid price for product variant ${variantId}`);
  }
  return amount;
}

function mapProduct(product: ApiProduct, collectionMap?: Map<number, string>): Product {
  const optionId = `product-${product.id}-variant`;
  const hasVariantOptions = product.variants.length > 1;
  const options: ProductOption[] = hasVariantOptions
    ? [{
        id: optionId,
        title: 'Variant',
        values: product.variants.map((variant) => ({
          id: String(variant.id),
          value: variant.title,
        })),
      }]
    : [];
  const images = product.images.map((image, index) => ({
    id: `${product.id}-${index}`,
    url: new URL(image, IMAGE_BASE_URL).href,
    rank: index,
  }));
  const metadata = {
    ...Object.fromEntries(
      Object.entries(product.attributes).map(([key, value]) => [
        key.replace(/^-+\s*/, '').trim().toLowerCase().replace(/\s+/g, '_'),
        value,
      ])
    ),
    // Store Hostinger product ID for order API
    hostinger_product_id: product.id,
  };

  const collectionSlug = collectionMap?.get(product.id);
  const categories = collectionSlug
    ? [{ id: collectionSlug, name: collectionSlug, handle: collectionSlug }]
    : product.category
      ? [{ id: product.category, name: product.category, handle: product.category.toLowerCase() }]
      : [];

  return {
    id: String(product.id),
    title: product.name,
    handle: product.handle,
    subtitle: product.subtitle,
    description: product.description,
    thumbnail: images[0]?.url ?? null,
    images,
    metadata,
    categories,
    options,
    variants: product.variants.map((variant) => ({
      id: String(variant.id),
      title: variant.title,
      sku: variant.sku,
      stock: variant.stock,
      price: parsePrice(variant.price, variant.id),
      compare_price: variant.compare_price === null
          ? null
          : parsePrice(variant.compare_price, variant.id),
      options: hasVariantOptions
        ? [{ id: String(variant.id), value: variant.title, option_id: optionId }]
        : [],
    })),
  };
}

export async function listProducts(
  params: { limit?: number; offset?: number } = {}
): Promise<{ products: Product[]; count: number; offset: number; limit: number }> {
  const response = await fetch(PRODUCTS_URL, {
    next: { revalidate: 60, tags: ['products'] },
  });
  if (!response.ok) {
    throw new Error(`Product request failed: ${response.status} ${response.statusText}`);
  }
  const data: { products: ApiProduct[]; currency: string } = await response.json();
  if (!Array.isArray(data.products) || typeof data.currency !== 'string') {
    throw new Error('Invalid product response');
  }
  const products = data.products.map((product) => mapProduct(product));
  const offset = params.offset ?? 0;
  const limit = params.limit ?? 100;
  return {
    products: products.slice(offset, offset + limit),
    count: products.length,
    offset,
    limit,
  };
}

export async function listProductsWithCollections(
  params: { limit?: number; offset?: number } = {}
): Promise<{ products: Product[]; count: number; offset: number; limit: number }> {
  const [productsResp, collectionsResp] = await Promise.all([
    fetch(PRODUCTS_URL, { next: { revalidate: 60, tags: ['products'] } }),
    fetch(COLLECTIONS_URL, { next: { revalidate: 300, tags: ['collections'] } }),
  ]);

  if (!productsResp.ok) {
    throw new Error(`Product request failed: ${productsResp.status} ${productsResp.statusText}`);
  }
  if (!collectionsResp.ok) {
    throw new Error(`Collections request failed: ${collectionsResp.status} ${collectionsResp.statusText}`);
  }

  const productsData: { products: ApiProduct[]; currency: string } = await productsResp.json();
  const collectionsData: { collections: ApiCollection[] } = await collectionsResp.json();

  if (!Array.isArray(productsData.products)) {
    throw new Error('Invalid product response');
  }
  if (!Array.isArray(collectionsData.collections)) {
    throw new Error('Invalid collections response');
  }

  const collectionMap = new Map<number, string>();
  for (const collection of collectionsData.collections) {
    for (const product of collection.products) {
      collectionMap.set(product.id, collection.handle);
    }
  }

  const products = productsData.products.map((product) =>
    mapProduct(product, collectionMap)
  );
  const offset = params.offset ?? 0;
  const limit = params.limit ?? 100;
  return {
    products: products.slice(offset, offset + limit),
    count: products.length,
    offset,
    limit,
  };
}

export async function getProductByHandle(handle: string): Promise<Product | null> {
  const { products } = await listProducts({ limit: Number.MAX_SAFE_INTEGER });
  return products.find((product) => product.handle === handle) ?? null;
}
