import { BrandsView } from '@/components/brands-view';
import { listProducts } from '@/lib/medusa';
import { groupProductsByBrand } from '@/lib/format';

export const revalidate = 60;

export default async function BrandsPage() {
  let products: Awaited<ReturnType<typeof listProducts>>['products'] = [];
  try {
    const data = await listProducts({ limit: 100 });
    products = data.products;
  } catch (err) {
    console.error('Brands data fetch failed:', err);
  }
  const brands = groupProductsByBrand(products);
  return <BrandsView brands={brands} />;
}
