import { notFound } from 'next/navigation';
import { ProductView } from '@/components/product-view';
import { getProductByHandle, listProducts } from '@/lib/medusa';
import { extractBrand, slugify } from '@/lib/format';

export const revalidate = 60;

interface PageProps {
  params: { handle: string };
}

export async function generateMetadata({ params }: PageProps) {
  try {
    const product = await getProductByHandle(params.handle);
    if (!product) return { title: 'Timepiece — TheTikTime' };
    return {
      title: product.title,
      description: product.description ?? product.subtitle ?? undefined,
      openGraph: {
        title: product.title,
        description: product.description ?? undefined,
        images: product.thumbnail ? [{ url: product.thumbnail }] : undefined,
      },
    };
  } catch {
    return { title: 'Timepiece — TheTikTime' };
  }
}

export default async function ProductPage({ params }: PageProps) {
  let product: Awaited<ReturnType<typeof getProductByHandle>> | undefined;
  try {
    product = await getProductByHandle(params.handle);
  } catch (err) {
    console.error('Product fetch failed:', err);
  }

  if (!product) notFound();
  const currentProduct = product;

  let related: Awaited<ReturnType<typeof listProducts>>['products'] = [];
  try {
    const all = await listProducts({ limit: 100 });
    const brand = extractBrand(currentProduct);
    related = all.products
      .filter(
        (p) =>
          p.id !== currentProduct.id &&
          (slugify(extractBrand(p)) === slugify(brand) ||
            p.collection_id === currentProduct.collection_id)
      )
      .slice(0, 4);
  } catch (err) {
    console.error('Related products fetch failed:', err);
  }

  return <ProductView product={currentProduct} related={related} />;
}
