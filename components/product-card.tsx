'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useRef, useState } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { ArrowUpRight } from 'lucide-react';
import { useRouter } from 'next/navigation';
import type { Product } from '@/lib/medusa';
import {
  extractBrand,
  formatPrice,
  getImageUrl,
  getProductImages,
  getProductPrice,
} from '@/lib/format';
import { useCart } from '@/hooks/use-cart';
import { getMinVariant } from '@/lib/format';
import { toast } from 'sonner';

interface ProductCardProps {
  product: Product;
  index?: number;
  priority?: boolean;
}

export function ProductCard({ product, index = 0, priority }: ProductCardProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [hovered, setHovered] = useState(false);
  const { addItem, region } = useCart();
  const router = useRouter();

  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const rotateX = useSpring(useTransform(my, [-0.5, 0.5], [8, -8]), {
    stiffness: 150,
    damping: 20,
  });
  const rotateY = useSpring(useTransform(mx, [-0.5, 0.5], [-8, 8]), {
    stiffness: 150,
    damping: 20,
  });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = ref.current?.getBoundingClientRect();
    if (!rect) return;
    const px = (e.clientX - rect.left) / rect.width - 0.5;
    const py = (e.clientY - rect.top) / rect.height - 0.5;
    mx.set(px);
    my.set(py);
  };

  const handleMouseLeave = () => {
    mx.set(0);
    my.set(0);
    setHovered(false);
  };

  const images = getProductImages(product);
  const primary = getImageUrl(images[0]);
  const secondary = getImageUrl(images[1]);
  const brand = extractBrand(product);
  const { formatted, original, price } = getProductPrice(product, region?.currency_code);
  const hasDiscount = !!original && original > price;

  const handleQuickAdd = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (product.options?.length) {
      router.push(`/products/${product.handle}`);
      return;
    }
    const variant = getMinVariant(product);
    if (!variant) {
      toast.error('This timepiece is not available for purchase.');
      return;
    }
    try {
      await addItem(variant.id, 1);
      toast.success(`${product.title} added to your cart.`);
    } catch {
      toast.error('Unable to add to cart. Please try again.');
    }
  };

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{
        duration: 0.7,
        delay: (index % 4) * 0.08,
        ease: [0.22, 1, 0.36, 1],
      }}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={handleMouseLeave}
      className="group perspective-1000"
    >
      <Link href={`/products/${product.handle}`} className="block">
        <motion.div
          style={{ rotateX, rotateY, transformPerspective: 1000 }}
          className="preserve-3d relative overflow-hidden rounded-lg border border-[hsl(var(--gold)/0.1)] bg-[hsl(0_0%_6%)] transition-colors duration-500 group-hover:border-[hsl(var(--gold)/0.3)]"
        >
          <div className="relative aspect-[3/4] overflow-hidden">
            <Image
              src={primary}
              alt={product.title}
              fill
              priority={priority}
              sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
              className="object-cover transition-transform duration-700 ease-luxe group-hover:scale-105"
            />
            {secondary && secondary !== primary && (
              <Image
                src={secondary}
                alt={product.title}
                fill
                sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
                className="object-cover opacity-0 transition-opacity duration-700 ease-luxe group-hover:opacity-100"
              />
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-60" />

            <motion.div
              className="absolute inset-x-0 bottom-0 flex translate-y-4 items-center justify-between px-4 pb-4 opacity-0 transition-all duration-500 group-hover:translate-y-0 group-hover:opacity-100"
            >
              <span className="font-mono-label text-[10px] uppercase tracking-[0.25em] text-champagne">
                View Details
              </span>
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-gold text-black">
                <ArrowUpRight className="h-4 w-4" strokeWidth={1.5} />
              </span>
            </motion.div>

            {hasDiscount && (
              <span className="absolute left-3 top-3 rounded-full bg-burgundy px-2.5 py-1 font-mono-label text-[9px] uppercase tracking-[0.2em] text-champagne">
                Reduced
              </span>
            )}
          </div>

          <div className="px-4 py-4">
            {brand && (
              <p className="font-mono-label text-[10px] uppercase tracking-[0.3em] text-gold/80">
                {brand}
              </p>
            )}
            <h3 className="mt-1.5 font-serif-display text-lg leading-tight text-champagne transition-colors group-hover:text-gold">
              {product.title}
            </h3>
            <div className="mt-2 flex items-center justify-between">
              <span className="font-mono-label text-sm text-champagne">
                {formatted}
              </span>
              {hasDiscount && (
                <span className="font-mono-label text-[11px] text-gray-400 line-through">
                  {formatPrice(original, region?.currency_code)}
                </span>
              )}
            </div>
            <button
              onClick={handleQuickAdd}
              className="mt-3 w-full overflow-hidden rounded-full border border-[hsl(var(--gold)/0.2)] py-2 font-mono-label text-[10px] uppercase tracking-[0.25em] text-gray-400 transition-all duration-300 hover:border-gold hover:text-gold"
            >
              {product.options?.length ? 'Choose Options' : 'Quick Add'}
            </button>
          </div>
        </motion.div>
      </Link>
    </motion.div>
  );
}
