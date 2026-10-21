import { StoreView } from '@/components/store-view';
import { listProducts } from '@/lib/medusa';
import { groupProductsByBrand } from '@/lib/format';

export const revalidate = 60;

export const metadata = {
  title: 'Store',
  description:
    'Browse every timepiece in TheTikTime\'s collection — the complete catalogue of luxury wristwatches, delivered across Pakistan with Cash on Delivery.',
};

export default async function StorePage() {
  let products: Awaited<ReturnType<typeof listProducts>>['products'] = [];

  try {
    const data = await listProducts({ limit: 100 });
    products = data.products;
  } catch (err) {
    console.error('Store data fetch failed:', err);
  }

  const brands = groupProductsByBrand(products);

  return <StoreView products={products} brands={brands} />;
}
