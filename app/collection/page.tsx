import { Suspense } from 'react';
import { ShopView } from '@/components/shop-view';
import { listProductsWithCollections } from '@/lib/products';
import { listCollections } from '@/lib/collections';

export const revalidate = 60;

export default async function ShopPage() {
  let products: Awaited<ReturnType<typeof listProductsWithCollections>>['products'] = [];
  let brands: Awaited<ReturnType<typeof listCollections>> = [];

  try {
    const [productsData, brandsData] = await Promise.all([
      listProductsWithCollections({ limit: 100 }),
      listCollections(),
    ]);
    products = productsData.products;
    brands = brandsData;
  } catch (err) {
    console.error('Shop data fetch failed:', err);
  }

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
        collections={[]}
      />
    </Suspense>
  );
}
