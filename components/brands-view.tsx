'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { BrandCard } from '@/components/brand-card';
import { Reveal, SplitText, Stagger, staggerItem } from '@/components/reveal';
import type { BrandGroup } from '@/lib/format';

interface BrandsViewProps {
  brands: BrandGroup[];
}

export function BrandsView({ brands }: BrandsViewProps) {
  return (
    <div className="relative min-h-screen bg-[hsl(0_0%_4%)] pt-28 sm:pt-32">
      <section className="mx-auto max-w-7xl px-5 sm:px-8">
        <div className="flex flex-col items-center text-center">
          <Reveal>
            <p className="font-mono-label text-[11px] uppercase tracking-[0.4em] text-gold">
              The Maisons
            </p>
          </Reveal>
          <SplitText
            as="h1"
            text="Houses of Horology"
            className="mt-4 font-serif-display text-4xl font-light text-champagne sm:text-6xl md:text-7xl"
          />
          <Reveal delay={0.1}>
            <p className="mt-5 max-w-xl text-sm leading-relaxed text-steel sm:text-base">
              Each maison represents a distinct tradition of craftsmanship.
              Explore the houses behind every timepiece in our collection.
            </p>
          </Reveal>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5 py-16 sm:px-8 sm:py-24">
        {brands.length > 0 ? (
          <Stagger
            className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4"
            stagger={0.06}
          >
            {brands.map((brand, i) => (
              <motion.div key={brand.slug} variants={staggerItem}>
                <BrandCard brand={brand} index={i} />
              </motion.div>
            ))}
          </Stagger>
        ) : (
          <div className="flex flex-col items-center gap-4 rounded-2xl border border-[hsl(var(--gold)/0.1)] bg-[hsl(0_0%_5%)] py-24 text-center">
            <p className="font-serif-display text-2xl text-champagne">
              Maisons incoming
            </p>
            <p className="max-w-md text-sm text-steel">
              Our directory of maisons will appear here once products are
              stocked. Each brand will link to its curated selection.
            </p>
            <Link href="/contact" className="btn-luxe-gold mt-2">
              Contact the Atelier
            </Link>
          </div>
        )}
      </section>

      <section className="relative overflow-hidden border-t border-[hsl(var(--gold)/0.1)] bg-[hsl(0_0%_3%)] py-24">
        <div className="absolute inset-0 radial-spotlight opacity-40" />
        <div className="relative mx-auto max-w-3xl px-6 text-center">
          <Reveal>
            <p className="font-mono-label text-[11px] uppercase tracking-[0.4em] text-gold">
              Can&apos;t find your maison?
            </p>
          </Reveal>
          <SplitText
            as="h2"
            text="We source on request."
            stagger={0.1}
            className="mt-4 font-serif-display text-3xl font-light text-champagne sm:text-5xl"
          />
          <Reveal delay={0.15}>
            <p className="mx-auto mt-5 max-w-lg text-sm leading-relaxed text-steel">
              Our network extends beyond what is listed. Tell us the piece you
              seek and we will endeavor to acquire it.
            </p>
          </Reveal>
          <Reveal delay={0.25}>
            <Link href="/contact" className="btn-luxe-gold mt-8 group">
              Speak with a Specialist
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" strokeWidth={1.5} />
            </Link>
          </Reveal>
        </div>
      </section>
    </div>
  );
}
