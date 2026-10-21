'use client';

import { useMemo, useState, useEffect, useCallback } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { SlidersHorizontal, X, Check, ChevronDown } from 'lucide-react';
import { ProductCard } from '@/components/product-card';
import { Reveal } from '@/components/reveal';
import type { Product } from '@/lib/medusa';
import type { BrandGroup } from '@/lib/format';
import {
  extractBrand,
  getProductPrice,
  slugify,
} from '@/lib/format';
import { useCart } from '@/hooks/use-cart';
import { cn } from '@/lib/utils';

type SortKey = 'featured' | 'price-asc' | 'price-desc' | 'name-asc';

interface ShopViewProps {
  products: Product[];
  brands: BrandGroup[];
  collections: { id: string; title: string; handle: string }[];
}

export function ShopView({ products, brands, collections }: ShopViewProps) {
  const params = useSearchParams();
  const router = useRouter();
  const { region } = useCart();
  const currency = region?.currency_code ?? 'pkr';

  const initialBrand = params.get('brand') ?? '';
  const initialCollection = params.get('collection') ?? '';
  const initialSort = (params.get('sort') as SortKey) ?? 'featured';
  const initialQuery = params.get('q') ?? '';

  const [selectedBrand, setSelectedBrand] = useState(initialBrand);
  const [selectedCollection, setSelectedCollection] = useState(initialCollection);
  const [sort, setSort] = useState<SortKey>(initialSort);
  const [query, setQuery] = useState(initialQuery);
  const [visibleCount, setVisibleCount] = useState(12);
  const [filtersOpen, setFiltersOpen] = useState(false);

  useEffect(() => {
    const sp = new URLSearchParams();
    if (selectedBrand) sp.set('brand', selectedBrand);
    if (selectedCollection) sp.set('collection', selectedCollection);
    if (sort !== 'featured') sp.set('sort', sort);
    if (query) sp.set('q', query);
    const qs = sp.toString();
    router.replace(qs ? `/shop?${qs}` : '/shop', { scroll: false });
    setVisibleCount(12);
  }, [selectedBrand, selectedCollection, sort, query, router]);

  const filtered = useMemo(() => {
    let list = [...products];

    if (selectedBrand) {
      list = list.filter((p) => slugify(extractBrand(p)) === selectedBrand);
    }
    if (selectedCollection) {
      list = list.filter((p) => p.collection_id === selectedCollection);
    }
    if (query) {
      const q = query.toLowerCase();
      list = list.filter(
        (p) =>
          p.title.toLowerCase().includes(q) ||
          extractBrand(p).toLowerCase().includes(q) ||
          (p.description ?? '').toLowerCase().includes(q)
      );
    }

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
  }, [products, selectedBrand, selectedCollection, query, sort, currency]);

  const visible = filtered.slice(0, visibleCount);
  const hasMore = visibleCount < filtered.length;

  const activeFilterCount =
    (selectedBrand ? 1 : 0) + (selectedCollection ? 1 : 0) + (query ? 1 : 0);

  const clearAll = () => {
    setSelectedBrand('');
    setSelectedCollection('');
    setQuery('');
    setSort('featured');
  };

  const selectedBrandName = brands.find((b) => b.slug === selectedBrand)?.name;

  return (
    <div className="relative min-h-screen bg-[hsl(0_0%_4%)] pt-28 sm:pt-32">
      {/* Header */}
      <section className="mx-auto max-w-7xl px-5 sm:px-8">
        <div className="flex flex-col items-center text-center">
          <Reveal>
            <p className="font-mono-label text-[11px] uppercase tracking-[0.4em] text-gold">
              The Collection
            </p>
          </Reveal>
          <h1 className="mt-4 font-serif-display text-4xl font-light text-champagne sm:text-6xl md:text-7xl">
            {selectedBrandName ?? 'All Timepieces'}
          </h1>
          <Reveal delay={0.1}>
            <p className="mt-5 max-w-xl text-sm leading-relaxed text-steel sm:text-base">
              {filtered.length} {filtered.length === 1 ? 'piece' : 'pieces'} —
              curated for the discerning collector.
            </p>
          </Reveal>
        </div>
      </section>

      {/* Toolbar */}
      <div className="sticky top-16 z-30 mt-10 border-y border-[hsl(var(--gold)/0.1)] bg-[hsl(0_0%_4%/0.85)] backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-5 py-3.5 sm:px-8">
          <button
            onClick={() => setFiltersOpen((v) => !v)}
            className="flex items-center gap-2 font-mono-label text-[11px] uppercase tracking-[0.25em] text-steel transition-colors hover:text-champagne"
          >
            <SlidersHorizontal className="h-4 w-4" strokeWidth={1.5} />
            Filters
            {activeFilterCount > 0 && (
              <span className="flex h-4 min-w-4 items-center justify-center rounded-full bg-gold px-1 text-[9px] text-black">
                {activeFilterCount}
              </span>
            )}
          </button>

          <div className="hidden flex-1 items-center justify-center gap-2 md:flex">
            {activeFilterCount > 0 && (
              <button
                onClick={clearAll}
                className="flex items-center gap-1 font-mono-label text-[10px] uppercase tracking-[0.25em] text-steel transition-colors hover:text-gold"
              >
                <X className="h-3 w-3" />
                Clear
              </button>
            )}
          </div>

          <div className="flex items-center gap-3">
            <SortDropdown sort={sort} setSort={setSort} />
          </div>
        </div>

        {/* Active filter chips */}
        <AnimatePresence>
          {activeFilterCount > 0 && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden border-t border-[hsl(var(--gold)/0.08)]"
            >
              <div className="mx-auto flex max-w-7xl flex-wrap items-center gap-2 px-5 py-3 sm:px-8">
                {selectedBrand && (
                  <FilterChip
                    label={selectedBrandName ?? selectedBrand}
                    onRemove={() => setSelectedBrand('')}
                  />
                )}
                {selectedCollection && (
                  <FilterChip
                    label={
                      collections.find((c) => c.id === selectedCollection)
                        ?.title ?? 'Collection'
                    }
                    onRemove={() => setSelectedCollection('')}
                  />
                )}
                {query && (
                  <FilterChip
                    label={`"${query}"`}
                    onRemove={() => setQuery('')}
                  />
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="mx-auto flex max-w-7xl gap-8 px-5 sm:px-8">
        {/* Sidebar filters (desktop) */}
        <aside className="hidden w-60 shrink-0 py-10 lg:block">
          <FilterPanel
            brands={brands}
            collections={collections}
            selectedBrand={selectedBrand}
            setSelectedBrand={setSelectedBrand}
            selectedCollection={selectedCollection}
            setSelectedCollection={setSelectedCollection}
            query={query}
            setQuery={setQuery}
            clearAll={clearAll}
          />
        </aside>

        {/* Mobile filter drawer */}
        <AnimatePresence>
          {filtersOpen && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-[60] lg:hidden"
            >
              <div
                className="absolute inset-0 bg-black/70 backdrop-blur-sm"
                onClick={() => setFiltersOpen(false)}
              />
              <motion.div
                initial={{ x: '-100%' }}
                animate={{ x: 0 }}
                exit={{ x: '-100%' }}
                transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                className="absolute left-0 top-0 h-full w-[85%] max-w-sm overflow-y-auto bg-[hsl(0_0%_5%)] px-6 py-7"
              >
                <div className="flex items-center justify-between">
                  <span className="font-mono-label text-[11px] uppercase tracking-[0.3em] text-champagne">
                    Filters
                  </span>
                  <button
                    onClick={() => setFiltersOpen(false)}
                    className="text-steel hover:text-champagne"
                  >
                    <X className="h-5 w-5" strokeWidth={1.5} />
                  </button>
                </div>
                <div className="my-6 hairline" />
                <FilterPanel
                  brands={brands}
                  collections={collections}
                  selectedBrand={selectedBrand}
                  setSelectedBrand={setSelectedBrand}
                  selectedCollection={selectedCollection}
                  setSelectedCollection={setSelectedCollection}
                  query={query}
                  setQuery={setQuery}
                  clearAll={clearAll}
                />
                <button
                  onClick={() => setFiltersOpen(false)}
                  className="btn-luxe-gold mt-8 w-full"
                >
                  Show {filtered.length} Results
                </button>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Grid */}
        <div className="flex-1 py-10">
          {visible.length > 0 ? (
            <>
              <div className="grid grid-cols-2 gap-4 sm:gap-6 md:grid-cols-3 xl:grid-cols-4">
                {visible.map((product, i) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    index={i}
                    priority={i < 4}
                  />
                ))}
              </div>
              {hasMore && (
                <div className="mt-14 flex justify-center">
                  <button
                    onClick={() => setVisibleCount((c) => c + 12)}
                    className="btn-luxe-ghost"
                  >
                    Reveal More
                  </button>
                </div>
              )}
            </>
          ) : (
            <EmptyResults clearAll={clearAll} />
          )}
        </div>
      </div>
    </div>
  );
}

function FilterChip({
  label,
  onRemove,
}: {
  label: string;
  onRemove: () => void;
}) {
  return (
    <span className="flex items-center gap-1.5 rounded-full border border-[hsl(var(--gold)/0.25)] bg-[hsl(0_0%_8%)] px-3 py-1 font-mono-label text-[10px] uppercase tracking-[0.2em] text-champagne">
      {label}
      <button
        onClick={onRemove}
        className="text-steel hover:text-gold"
        aria-label="Remove filter"
      >
        <X className="h-3 w-3" />
      </button>
    </span>
  );
}

interface FilterPanelProps {
  brands: BrandGroup[];
  collections: { id: string; title: string; handle: string }[];
  selectedBrand: string;
  setSelectedBrand: (v: string) => void;
  selectedCollection: string;
  setSelectedCollection: (v: string) => void;
  query: string;
  setQuery: (v: string) => void;
  clearAll: () => void;
}

function FilterPanel({
  brands,
  collections,
  selectedBrand,
  setSelectedBrand,
  selectedCollection,
  setSelectedCollection,
  query,
  setQuery,
  clearAll,
}: FilterPanelProps) {
  return (
    <div className="space-y-8">
      <div>
        <h3 className="mb-3 font-mono-label text-[10px] uppercase tracking-[0.3em] text-gold">
          Search
        </h3>
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search timepieces..."
          className="w-full rounded-md border border-[hsl(var(--gold)/0.15)] bg-[hsl(0_0%_8%)] px-3 py-2.5 text-sm text-champagne placeholder:text-steel focus:border-gold focus:outline-none"
        />
      </div>

      {brands.length > 0 && (
        <div>
          <h3 className="mb-3 font-mono-label text-[10px] uppercase tracking-[0.3em] text-gold">
            Brand
          </h3>
          <ul className="space-y-1">
            <li>
              <FilterRadio
                label="All Brands"
                checked={!selectedBrand}
                onChange={() => setSelectedBrand('')}
              />
            </li>
            {brands.map((brand) => (
              <li key={brand.slug}>
                <FilterRadio
                  label={`${brand.name} (${brand.productCount})`}
                  checked={selectedBrand === brand.slug}
                  onChange={() => setSelectedBrand(brand.slug)}
                />
              </li>
            ))}
          </ul>
        </div>
      )}

      {collections.length > 0 && (
        <div>
          <h3 className="mb-3 font-mono-label text-[10px] uppercase tracking-[0.3em] text-gold">
            Collection
          </h3>
          <ul className="space-y-1">
            <li>
              <FilterRadio
                label="All Collections"
                checked={!selectedCollection}
                onChange={() => setSelectedCollection('')}
              />
            </li>
            {collections.map((col) => (
              <li key={col.id}>
                <FilterRadio
                  label={col.title}
                  checked={selectedCollection === col.id}
                  onChange={() => setSelectedCollection(col.id)}
                />
              </li>
            ))}
          </ul>
        </div>
      )}

      <button
        onClick={clearAll}
        className="font-mono-label text-[10px] uppercase tracking-[0.25em] text-steel transition-colors hover:text-gold"
      >
        Reset All Filters
      </button>
    </div>
  );
}

function FilterRadio({
  label,
  checked,
  onChange,
}: {
  label: string;
  checked: boolean;
  onChange: () => void;
}) {
  return (
    <button
      onClick={onChange}
      className={cn(
        'flex w-full items-center gap-2.5 py-1.5 text-left text-sm transition-colors',
        checked ? 'text-gold' : 'text-steel hover:text-champagne'
      )}
    >
      <span
        className={cn(
          'flex h-4 w-4 shrink-0 items-center justify-center rounded-full border transition-colors',
          checked ? 'border-gold' : 'border-[hsl(var(--gold)/0.2)]'
        )}
      >
        {checked && <Check className="h-3 w-3 text-gold" strokeWidth={2.5} />}
      </span>
      {label}
    </button>
  );
}

function SortDropdown({
  sort,
  setSort,
}: {
  sort: SortKey;
  setSort: (v: SortKey) => void;
}) {
  const [open, setOpen] = useState(false);
  const labels: Record<SortKey, string> = {
    featured: 'Featured',
    'price-asc': 'Price: Low to High',
    'price-desc': 'Price: High to Low',
    'name-asc': 'Name: A to Z',
  };
  return (
    <div className="relative">
      <button
        onClick={() => setOpen((v) => !v)}
        className="flex items-center gap-2 font-mono-label text-[11px] uppercase tracking-[0.25em] text-steel transition-colors hover:text-champagne"
      >
        Sort: <span className="text-champagne">{labels[sort]}</span>
        <ChevronDown className="h-3 w-3" />
      </button>
      <AnimatePresence>
        {open && (
          <>
            <div
              className="fixed inset-0 z-10"
              onClick={() => setOpen(false)}
            />
            <motion.ul
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              className="absolute right-0 top-full z-20 mt-2 min-w-52 rounded-lg border border-[hsl(var(--gold)/0.15)] bg-[hsl(0_0%_6%)] py-2 shadow-luxe"
            >
              {(Object.keys(labels) as SortKey[]).map((key) => (
                <li key={key}>
                  <button
                    onClick={() => {
                      setSort(key);
                      setOpen(false);
                    }}
                    className={cn(
                      'flex w-full items-center justify-between px-4 py-2 text-left text-sm transition-colors hover:bg-[hsl(0_0%_10%)]',
                      sort === key ? 'text-gold' : 'text-steel'
                    )}
                  >
                    {labels[key]}
                    {sort === key && <Check className="h-3.5 w-3.5" />}
                  </button>
                </li>
              ))}
            </motion.ul>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}

function EmptyResults({ clearAll }: { clearAll: () => void }) {
  return (
    <div className="flex flex-col items-center gap-5 rounded-2xl border border-[hsl(var(--gold)/0.1)] bg-[hsl(0_0%_5%)] py-24 text-center">
      <p className="font-serif-display text-2xl text-champagne">
        No timepieces found
      </p>
      <p className="max-w-sm text-sm text-steel">
        No pieces match your current selection. Adjust your filters or explore
        the full collection.
      </p>
      <button onClick={clearAll} className="btn-luxe-ghost mt-2">
        Clear Filters
      </button>
    </div>
  );
}
