import { HomeView } from '@/components/home-view';
import { listProducts } from '@/lib/products';
import { groupProductsByBrand } from '@/lib/format';

export const revalidate = 60;

export default async function HomePage() {
  let products: Awaited<ReturnType<typeof listProducts>>['products'] = [];

  try {
    const productsData = await listProducts({ limit: 100 });
    products = productsData.products;
  } catch (err) {
    console.error('Home data fetch failed:', err);
  }

  const featured = products.slice(0, 8);
  const brands = groupProductsByBrand(products);

  return <HomeView featured={featured} brands={brands} />;
}
