'use client';

import Link from 'next/link';
import { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { ProductCard } from '@/components/product-card';
import { Reveal, SplitText, Stagger, staggerItem } from '@/components/reveal';
import type { Product } from '@/lib/medusa';
import type { BrandGroup } from '@/lib/format';
import { extractBrand, getProductPrice, slugify } from '@/lib/format';
import { useCart } from '@/hooks/use-cart';
import { cn } from '@/lib/utils';

type SortKey = 'featured' | 'price-asc' | 'price-desc' | 'name-asc';

interface StoreViewProps {
  products: Product[];
  brands: BrandGroup[];
}

export function StoreView({ products, brands }: StoreViewProps) {
  const { region } = useCart();
  const currency = region?.currency_code ?? 'pkr';
  const [sort, setSort] = useState<SortKey>('featured');
  const [visibleCount, setVisibleCount] = useState(12);

  const sorted = useMemo(() => {
    let list = [...products];
    switch (sort) {
      case 'price-asc':
        list.sort(
          (a, b) =>
            getProductPrice(a, currency).price -
            getProductPrice(b, currency).price
        );
        break;
      case 'price-desc':
        list.sort(
          (a, b) =>
            getProductPrice(b, currency).price -
            getProductPrice(a, currency).price
        );
        break;
      case 'name-asc':
        list.sort((a, b) => a.title.localeCompare(b.title));
        break;
      default:
        break;
    }
    return list;
  }, [products, sort, currency]);

  const visible = sorted.slice(0, visibleCount);
  const hasMore = visibleCount < sorted.length;

  return (
    <div className="relative min-h-screen bg-[hsl(0_0%_9%)] pt-28 sm:pt-32">
      {/* Header */}
      <section className="mx-auto max-w-7xl px-5 sm:px-8">
        <div className="flex flex-col items-center text-center">
          <Reveal>
            <p className="font-mono-label text-[11px] uppercase tracking-[0.4em] text-gold">
              The Full Catalogue
            </p>
          </Reveal>
          <SplitText
            as="h1"
            text="The Store"
            stagger={0.1}
            className="mt-4 font-serif-display text-4xl font-light text-champagne sm:text-6xl md:text-7xl"
          />
          <Reveal delay={0.1}>
            <p className="mt-5 max-w-xl text-sm leading-relaxed text-gray-400 sm:text-base">
              Every timepiece in our collection, in one place.{' '}
              {sorted.length}{' '}
              {sorted.length === 1 ? 'piece' : 'pieces'} — delivered across
              Pakistan with Cash on Delivery.
            </p>
          </Reveal>
        </div>
      </section>

      {/* Brand quick-nav */}
      {/* {brands.length > 0 && (
        <section className="mx-auto max-w-7xl px-5 sm:px-8">
          <div className="mt-10 flex flex-wrap items-center justify-center gap-2.5">
            {brands.map((brand) => (
              <Link
                key={brand.slug}
                href={`/shop?brand=${brand.slug}`}
                className="rounded-full border border-[hsl(var(--gold)/0.15)] px-4 py-1.5 font-mono-label text-[10px] uppercase tracking-[0.2em] text-gray-400 transition-all hover:border-gold hover:text-gold"
              >
                {brand.name}
              </Link>
            ))}
          </div>
        </section>
      )} */}

      {/* Toolbar */}
      <div className="sticky top-16 z-30 mt-10 border-y border-[hsl(var(--gold)/0.1)] bg-[hsl(0_0%_8%/0.85)] backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-3.5 sm:px-8">
          <span className="font-mono-label text-[11px] uppercase tracking-[0.25em] text-gray-400">
            {sorted.length} {sorted.length === 1 ? 'Timepiece' : 'Timepieces'}
          </span>
          <div className="flex items-center gap-3">
            <SortInline sort={sort} setSort={setSort} />
          </div>
        </div>
      </div>

      {/* Grid */}
      <section className="mx-auto max-w-7xl px-5 py-12 sm:px-8 sm:py-16">
        {visible.length > 0 ? (
          <>
            <Stagger
              className="grid grid-cols-2 gap-4 sm:gap-6 md:grid-cols-3 lg:grid-cols-4"
              stagger={0.06}
            >
              {visible.map((product, i) => (
                <motion.div key={product.id} variants={staggerItem}>
                  <ProductCard product={product} index={i} priority={i < 4} />
                </motion.div>
              ))}
            </Stagger>

            {hasMore && (
              <div className="mt-14 flex justify-center">
                <button
                  onClick={() => setVisibleCount((c) => c + 12)}
                  className="btn-luxe-ghost group"
                >
                  Reveal More
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" strokeWidth={1.5} />
                </button>
              </div>
            )}
          </>
        ) : (
          <div className="flex flex-col items-center gap-5 rounded-2xl border border-[hsl(var(--gold)/0.1)] bg-[hsl(0_0%_5%)] py-24 text-center">
            <p className="font-serif-display text-2xl text-champagne">
              The store is being stocked
            </p>
            <p className="max-w-md text-sm text-gray-400">
              Our atelier is preparing a selection of exceptional timepieces.
              Please check back soon, or contact us for private acquisitions.
            </p>
            <Link href="/contact" className="btn-luxe-gold mt-2">
              Contact the Atelier
            </Link>
          </div>
        )}
      </section>
    </div>
  );
}

function SortInline({
  sort,
  setSort,
}: {
  sort: SortKey;
  setSort: (v: SortKey) => void;
}) {
  const labels: Record<SortKey, string> = {
    featured: 'Featured',
    'price-asc': 'Price: Low to High',
    'price-desc': 'Price: High to Low',
    'name-asc': 'Name: A to Z',
  };
  return (
    <div className="flex items-center gap-2">
      <span className="hidden font-mono-label text-[10px] uppercase tracking-[0.25em] text-gray-400 sm:inline">
        Sort
      </span>
      <select
        value={sort}
        onChange={(e) => setSort(e.target.value as SortKey)}
        className="rounded-md border border-[hsl(var(--gold)/0.15)] bg-[hsl(0_0%_8%)] px-3 py-1.5 font-mono-label text-[10px] uppercase tracking-[0.2em] text-champagne focus:border-gold focus:outline-none"
      >
        {(Object.keys(labels) as SortKey[]).map((key) => (
          <option key={key} value={key} className="bg-[hsl(0_0%_8%)]">
            {labels[key]}
          </option>
        ))}
      </select>
    </div>
  );
}
