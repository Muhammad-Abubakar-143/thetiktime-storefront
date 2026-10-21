import type { Product, ProductVariant } from './medusa';

const PKR_LOCALE = 'en-PK';

export function formatPrice(
  amount: number | null | undefined,
  currencyCode = 'pkr'
): string {
  if (amount === null || amount === undefined || Number.isNaN(amount)) {
    return '—';
  }
  // Medusa v2 returns amounts in major units (1000 = Rs 1,000)
  const value = amount;
  try {
    return new Intl.NumberFormat(PKR_LOCALE, {
      style: 'currency',
      currency: currencyCode.toUpperCase(),
      maximumFractionDigits: 0,
    }).format(value);
  } catch {
    return `Rs ${value.toLocaleString()}`;
  }
}

export function getVariantPrice(
  variant?: ProductVariant | null,
  currencyCode = 'pkr'
): { price: number; original?: number | null } {
  if (!variant) return { price: 0 };
  const calculated = variant.calculated_price;
  if (calculated) {
    return {
      price: calculated.calculated_amount,
      original: calculated.original_amount ?? null,
    };
  }
  const price =
    variant.original_price ??
    variant.prices?.find((p) => p.currency_code === currencyCode)?.amount ??
    variant.prices?.[0]?.amount ??
    0;
  return { price, original: null };
}

export function getProductPrice(
  product?: Product | null,
  currencyCode = 'pkr'
): { price: number; original?: number | null; formatted: string } {
  if (!product || !product.variants?.length) {
    return { price: 0, formatted: formatPrice(0, currencyCode) };
  }
  const prices = product.variants.map((v) => getVariantPrice(v, currencyCode));
  const min = prices.reduce(
    (acc, p) => (p.price < acc.price ? p : acc),
    prices[0]
  );
  return {
    price: min.price,
    original: min.original,
    formatted: formatPrice(min.price, currencyCode),
  };
}

export function getMinVariant(product?: Product | null): ProductVariant | null {
  if (!product?.variants?.length) return null;
  return product.variants[0];
}

export function getImageUrl(
  url?: string | null,
  fallback = '/images/placeholder-watch.svg'
): string {
  if (!url) return fallback;
  if (url.startsWith('http')) return url;
  return url;
}

export function getProductImages(product?: Product | null): string[] {
  if (!product) return [];
  const imgs = (product.images ?? [])
    .slice()
    .sort((a, b) => (a.rank ?? 0) - (b.rank ?? 0))
    .map((i) => i.url);
  if (imgs.length) return imgs;
  if (product.thumbnail) return [product.thumbnail];
  return [];
}

export function slugify(value: string): string {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

export function extractBrand(product?: Product | null): string {
  if (!product) return '';
  const meta = product.metadata as Record<string, unknown> | null;
  if (meta) {
    const brandKeys = ['brand', 'Brand', 'manufacturer', 'make'];
    for (const key of brandKeys) {
      const value = meta[key];
      if (typeof value === 'string' && value.trim()) return value.trim();
    }
  }
  if (product.collection?.title) return product.collection.title;
  const brandTag = product.tags?.find(
    (t) => t.value.toLowerCase().startsWith('brand:') || t.value.toLowerCase().startsWith('brand_')
  );
  if (brandTag) {
    return brandTag.value.split(/[:_]/).slice(1).join(' ').trim() || brandTag.value;
  }
  return '';
}

export interface BrandGroup {
  name: string;
  slug: string;
  productCount: number;
  collectionId?: string;
  sampleHandle?: string;
  thumbnail?: string | null;
}

export function groupProductsByBrand(products: Product[]): BrandGroup[] {
  const map = new Map<string, BrandGroup>();
  for (const product of products) {
    const brand = extractBrand(product) || 'TheTikTime';
    const slug = slugify(brand);
    const existing = map.get(slug);
    if (existing) {
      existing.productCount += 1;
      if (!existing.thumbnail && product.thumbnail) {
        existing.thumbnail = product.thumbnail;
      }
      if (!existing.sampleHandle) existing.sampleHandle = product.handle;
      if (!existing.collectionId && product.collection_id) {
        existing.collectionId = product.collection_id;
      }
    } else {
      map.set(slug, {
        name: brand,
        slug,
        productCount: 1,
        collectionId: product.collection_id ?? undefined,
        sampleHandle: product.handle,
        thumbnail: product.thumbnail ?? null,
      });
    }
  }
  return Array.from(map.values()).sort((a, b) =>
    a.name.localeCompare(b.name)
  );
}

export function getProductsByBrandSlug(
  products: Product[],
  slug: string
): Product[] {
  return products.filter((p) => slugify(extractBrand(p)) === slug);
}

export function truncate(text: string, max = 160): string {
  if (text.length <= max) return text;
  return text.slice(0, max).trimEnd() + '…';
}
