import { BrandsView } from '@/components/brands-view';
import { listCollections } from '@/lib/collections';

export const revalidate = 60;

export default async function BrandsPage() {
  let brands: Awaited<ReturnType<typeof listCollections>> = [];
  try {
    brands = await listCollections();
  } catch (err) {
    console.error('Brands data fetch failed:', err);
  }
  return <BrandsView brands={brands} />;
}
