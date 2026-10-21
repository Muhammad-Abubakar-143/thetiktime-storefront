'use client';

import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { ArrowUpRight } from 'lucide-react';
import type { BrandGroup } from '@/lib/format';
import { getImageUrl } from '@/lib/format';

interface BrandCardProps {
  brand: BrandGroup;
  index?: number;
}

export function BrandCard({ brand, index = 0 }: BrandCardProps) {
  const thumb = getImageUrl(brand.thumbnail);
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{
        duration: 0.6,
        delay: (index % 4) * 0.07,
        ease: [0.22, 1, 0.36, 1],
      }}
    >
      <Link
        href={`/shop?brand=${brand.slug}`}
        className="group relative flex aspect-[5/3] flex-col items-center justify-center overflow-hidden rounded-xl border border-[hsl(var(--gold)/0.1)] bg-[hsl(0_0%_5%)] p-6 text-center transition-all duration-500 hover:border-[hsl(var(--gold)/0.35)]"
      >
        {brand.thumbnail && (
          <Image
            src={thumb}
            alt={brand.name}
            fill
            sizes="(max-width: 768px) 50vw, 25vw"
            className="object-cover opacity-20 transition-all duration-700 group-hover:scale-110 group-hover:opacity-30"
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-[hsl(0_0%_3%)] via-transparent to-transparent" />

        <div className="relative z-10 flex flex-col items-center">
          <span className="font-serif-display text-2xl text-champagne transition-colors duration-500 group-hover:text-gold">
            {brand.name}
          </span>
          <span className="mt-2 font-mono-label text-[10px] uppercase tracking-[0.3em] text-steel">
            {brand.productCount} {brand.productCount === 1 ? 'Piece' : 'Pieces'}
          </span>
          <span className="mt-5 flex h-8 w-8 translate-y-2 items-center justify-center rounded-full border border-[hsl(var(--gold)/0.2)] text-gold opacity-0 transition-all duration-500 group-hover:translate-y-0 group-hover:opacity-100">
            <ArrowUpRight className="h-4 w-4" strokeWidth={1.5} />
          </span>
        </div>
      </Link>
    </motion.div>
  );
}
