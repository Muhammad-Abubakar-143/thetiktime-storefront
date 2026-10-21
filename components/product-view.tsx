'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Minus,
  Plus,
  ShoppingBag,
  Truck,
  ShieldCheck,
  CreditCard,
  ChevronRight,
} from 'lucide-react';
import { toast } from 'sonner';
import { useCart } from '@/hooks/use-cart';
import { Reveal, SplitText } from '@/components/reveal';
import { ProductCard } from '@/components/product-card';
import type { Product } from '@/lib/medusa';
import {
  extractBrand,
  formatPrice,
  getImageUrl,
  getMinVariant,
  getProductImages,
  getProductPrice,
  slugify,
  truncate,
} from '@/lib/format';

interface ProductViewProps {
  product: Product;
  related: Product[];
}

export function ProductView({ product, related }: ProductViewProps) {
  const { addItem, region, loading } = useCart();
  const currency = region?.currency_code ?? 'pkr';
  const images = getProductImages(product);
  const brand = extractBrand(product);
  const { formatted, original, price } = getProductPrice(product, currency);
  const variant = getMinVariant(product);
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [adding, setAdding] = useState(false);

  const handleAdd = async () => {
    if (!variant) {
      toast.error('This timepiece is not available for purchase.');
      return;
    }
    setAdding(true);
    try {
      await addItem(variant.id, quantity);
      toast.success(`${product.title} added to your cart.`);
    } catch {
      toast.error('Unable to add to cart. Please try again.');
    } finally {
      setAdding(false);
    }
  };

  const specs = [
    { label: 'Brand', value: brand || '—' },
    { label: 'Material', value: product.material || '_' },
    { label: 'Origin', value: product.origin_country || '_' },
    { label: 'Weight', value: product.weight ? `${product.weight}g` : '—' },
  ];

  return (
    <div className="relative min-h-screen bg-[hsl(0_0%_9%)] pt-24 sm:pt-28">
      {/* Breadcrumb */}
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <nav className="flex items-center gap-2 font-mono-label text-[10px] uppercase tracking-[0.25em] text-gray-400">
          <Link href="/" className="hover:text-champagne">Home</Link>
          <ChevronRight className="h-3 w-3" />
          <Link href="/collection" className="hover:text-champagne">Collection</Link>
          <ChevronRight className="h-3 w-3" />
          <span className="text-gold">{truncate(product.title, 40)}</span>
        </nav>
      </div>

      <div className="mx-auto grid max-w-7xl gap-10 px-5 py-10 sm:px-8 lg:grid-cols-2 lg:gap-16 lg:py-16">
        {/* Gallery */}
        <div className="flex flex-col gap-4 lg:sticky lg:top-28 lg:self-start">
          <div className="relative aspect-square overflow-hidden rounded-xl border border-[hsl(var(--gold)/0.12)] bg-[hsl(0_0%_6%)]">
            <AnimatePresence mode="wait">
              <motion.div
                key={selectedImage}
                initial={{ opacity: 0, scale: 1.02 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                className="absolute inset-0"
              >
                <Image
                  src={getImageUrl(images[selectedImage])}
                  alt={product.title}
                  fill
                  priority
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  className="object-cover"
                />
              </motion.div>
            </AnimatePresence>
            {original && original > price && (
              <span className="absolute left-4 top-4 rounded-full bg-burgundy px-3 py-1 font-mono-label text-[10px] uppercase tracking-[0.2em] text-champagne">
                Reduced
              </span>
            )}
          </div>
          {images.length > 1 && (
            <div className="flex gap-3 overflow-x-auto scrollbar-hidden">
              {images.map((img, i) => (
                <button
                  key={i}
                  onClick={() => setSelectedImage(i)}
                  className={`relative h-20 w-20 shrink-0 overflow-hidden rounded-lg border transition-all ${
                    selectedImage === i
                      ? 'border-gold opacity-100'
                      : 'border-[hsl(var(--gold)/0.1)] opacity-60 hover:opacity-100'
                  }`}
                >
                  <Image
                    src={getImageUrl(img)}
                    alt={`${product.title} ${i + 1}`}
                    fill
                    sizes="80px"
                    className="object-cover"
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Info */}
        <div className="flex flex-col">
          <Reveal>
            {brand && (
              <Link
                href={`/collection?brand=${slugify(brand)}`}
                className="font-mono-label text-[11px] uppercase tracking-[0.3em] text-gold transition-colors hover:text-champagne"
              >
                {brand}
              </Link>
            )}
          </Reveal>
          <SplitText
            as="h1"
            text={product.title}
            stagger={0.03}
            className="mt-3 font-serif-display text-3xl font-light leading-tight text-champagne sm:text-4xl md:text-5xl"
          />
          {product.subtitle && (
            <Reveal delay={0.1}>
              <p className="mt-3 text-sm text-gray-400 sm:text-base">
                {product.subtitle}
              </p>
            </Reveal>
          )}

          <Reveal delay={0.15}>
            <div className="mt-6 flex items-baseline gap-3">
              <span className="font-serif-display text-3xl text-gold sm:text-4xl">
                {formatted}
              </span>
              {original && original > price && (
                <span className="font-mono-label text-base text-gray-400 line-through">
                  {formatPrice(original, currency)}
                </span>
              )}
            </div>
          </Reveal>

          <div className="my-8 hairline" />

          {product.description && (
            <Reveal delay={0.2}>
              <div className="prose prose-sm max-w-none text-gray-400">
                <p className="text-sm leading-relaxed sm:text-base">
                  {product.description}
                </p>
              </div>
            </Reveal>
          )}

          {/* Quantity + Add to cart */}
          <Reveal delay={0.25}>
            <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:items-center">
              <div className="flex items-center border border-[hsl(var(--gold)/0.2)]">
                <button
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  disabled={quantity <= 1 || adding}
                  aria-label="Decrease quantity"
                  className="flex h-12 w-12 items-center justify-center text-gray-400 transition-colors hover:text-gold disabled:opacity-40"
                >
                  <Minus className="h-4 w-4" strokeWidth={1.5} />
                </button>
                <span className="w-12 text-center font-mono-label text-base text-champagne">
                  {quantity}
                </span>
                <button
                  onClick={() => setQuantity((q) => q + 1)}
                  disabled={adding}
                  aria-label="Increase quantity"
                  className="flex h-12 w-12 items-center justify-center text-gray-400 transition-colors hover:text-gold disabled:opacity-40"
                >
                  <Plus className="h-4 w-4" strokeWidth={1.5} />
                </button>
              </div>
              <button
                onClick={handleAdd}
                disabled={adding || loading || !variant}
                className="btn-luxe-gold group flex-1 disabled:opacity-60"
              >
                {adding ? (
                  <>
                    <span className="h-4 w-4 animate-spin rounded-full border-2 border-black/30 border-t-black" />
                    Adding...
                  </>
                ) : (
                  <>
                    <ShoppingBag className="h-4 w-4" strokeWidth={1.5} />
                    Add to Cart
                  </>
                )}
              </button>
            </div>
          </Reveal>

          {!variant && (
            <p className="mt-3 font-mono-label text-[10px] uppercase tracking-[0.2em] text-burgundy/80">
              Currently unavailable
            </p>
          )}

          {/* Assurances */}
          <Reveal delay={0.3}>
            <div className="mt-8 grid grid-cols-1 gap-3 rounded-xl border border-[hsl(var(--gold)/0.1)] bg-[hsl(0_0%_5%)] p-5 sm:grid-cols-3">
              {[
                { icon: ShieldCheck, label: 'Authenticity Guaranteed' },
                { icon: Truck, label: 'Nationwide Delivery' },
                { icon: CreditCard, label: 'Cash on Delivery' },
              ].map((item) => (
                <div
                  key={item.label}
                  className="flex items-center gap-2.5 text-gray-400"
                >
                  <item.icon className="h-4 w-4 shrink-0 text-gold/70" strokeWidth={1.5} />
                  <span className="text-xs">{item.label}</span>
                </div>
              ))}
            </div>
          </Reveal>

          {/* Specs */}
          <Reveal delay={0.35}>
            <div className="mt-8">
              <h3 className="font-mono-label text-[10px] uppercase tracking-[0.3em] text-gold">
                Specifications
              </h3>
              <dl className="mt-4 divide-y divide-[hsl(var(--gold)/0.08)] border-y border-[hsl(var(--gold)/0.08)]">
                {specs.map((spec) => (
                  <div
                    key={spec.label}
                    className="flex items-center justify-between py-3"
                  >
                    <dt className="font-mono-label text-[11px] uppercase tracking-[0.2em] text-gray-400">
                      {spec.label}
                    </dt>
                    <dd className="text-sm text-champagne">{spec.value}</dd>
                  </div>
                ))}
              </dl>
            </div>
          </Reveal>
        </div>
      </div>

      {/* Related */}
      {related.length > 0 && (
        <section className="border-t border-[hsl(var(--gold)/0.1)] bg-[hsl(0_0%_3%)] py-20 sm:py-28">
          <div className="mx-auto max-w-7xl px-5 sm:px-8">
            <div className="mb-12 flex flex-col items-center text-center">
              <Reveal>
                <p className="font-mono-label text-[11px] uppercase tracking-[0.4em] text-gold">
                  You May Also Admire
                </p>
              </Reveal>
              <h2 className="mt-4 font-serif-display text-3xl font-light text-champagne sm:text-4xl">
                Related Timepieces
              </h2>
            </div>
            <div className="grid grid-cols-2 gap-4 sm:gap-6 md:grid-cols-3 lg:grid-cols-4">
              {related.slice(0, 4).map((p, i) => (
                <ProductCard key={p.id} product={p} index={i} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Mobile sticky bar */}
      <MobileStickyBar
        price={formatted}
        onAdd={handleAdd}
        adding={adding}
        disabled={!variant}
      />
    </div>
  );
}

function MobileStickyBar({
  price,
  onAdd,
  adding,
  disabled,
}: {
  price: string;
  onAdd: () => void;
  adding: boolean;
  disabled: boolean;
}) {
  return (
    <div className="fixed inset-x-0 bottom-0 z-40 border-t border-[hsl(var(--gold)/0.15)] bg-[hsl(0_0%_5%/0.95)] backdrop-blur-xl lg:hidden">
      <div className="flex items-center justify-between gap-4 px-5 py-3">
        <div>
          <p className="font-mono-label text-[9px] uppercase tracking-[0.2em] text-gray-400">
            Price
          </p>
          <p className="font-serif-display text-lg text-gold">{price}</p>
        </div>
        <button
          onClick={onAdd}
          disabled={adding || disabled}
          className="btn-luxe-gold flex-1 max-w-[60%] disabled:opacity-60"
        >
          {adding ? 'Adding...' : 'Add to Cart'}
        </button>
      </div>
    </div>
  );
}
