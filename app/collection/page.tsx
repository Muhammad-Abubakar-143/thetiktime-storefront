import { Suspense } from 'react';
import { ShopView } from '@/components/shop-view';
import { listProducts, listCollections } from '@/lib/medusa';
import { groupProductsByBrand } from '@/lib/format';

export const revalidate = 60;

export default async function ShopPage() {
  let products: Awaited<ReturnType<typeof listProducts>>['products'] = [];
  let collections: Awaited<ReturnType<typeof listCollections>> = [];

  try {
    const [productsData, collectionsData] = await Promise.all([
      listProducts({ limit: 100 }),
      listCollections(),
    ]);
    products = productsData.products;
    collections = collectionsData;
  } catch (err) {
    console.error('Shop data fetch failed:', err);
  }

  const brands = groupProductsByBrand(products);

  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center bg-[hsl(0_0%_9%)] pt-28">
          <div className="text-center">
            <div className="mx-auto h-8 w-8 animate-spin rounded-full border-2 border-[hsl(var(--gold)/0.2)] border-t-gold" />
            <p className="mt-4 font-mono-label text-[10px] uppercase tracking-[0.3em] text-gray-400">
              Loading Collection
            </p>
          </div>
        </div>
      }
    >
      <ShopView
        products={products}
        brands={brands}
        collections={collections.map((c) => ({
          id: c.id,
          title: c.title,
          handle: c.handle,
        }))}
      />
    </Suspense>
  );
}
