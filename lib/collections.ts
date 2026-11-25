import type { BrandGroup } from './format';

const COLLECTIONS_URL =
  'https://zesty-rosybrown-curlew-26.hostingersite.com/api/index.php?route=collections';
const IMAGE_BASE_URL = 'https://zesty-rosybrown-curlew-26.hostingersite.com/';

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

function mapCollection(collection: ApiCollection): BrandGroup {
  return {
    name: collection.name,
    slug: collection.handle,
    productCount: collection.products.length,
    sampleHandle: collection.products[0]?.handle,
    thumbnail: null,
  };
}

export async function listCollections(): Promise<BrandGroup[]> {
  const response = await fetch(COLLECTIONS_URL, {
    next: { revalidate: 300, tags: ['collections'] },
  });
  if (!response.ok) {
    throw new Error(`Collections request failed: ${response.status} ${response.statusText}`);
  }
  const data: { collections: ApiCollection[] } = await response.json();
  if (!Array.isArray(data.collections)) {
    throw new Error('Invalid collections response');
  }
  return data.collections.map(mapCollection);
}
