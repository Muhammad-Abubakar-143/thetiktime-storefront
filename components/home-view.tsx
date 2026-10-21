'use client';

import dynamic from 'next/dynamic';
import { motion, useScroll, useTransform } from 'framer-motion';
import { useRef } from 'react';
import Link from 'next/link';
import { ArrowRight, ShieldCheck, Truck, CreditCard, Sparkles } from 'lucide-react';
import { Reveal, SplitText, Stagger, staggerItem } from '@/components/reveal';
import { ProductCard } from '@/components/product-card';
import { BrandCard } from '@/components/brand-card';
import type { Product } from '@/lib/medusa';
import type { BrandGroup as BrandGroupType } from '@/lib/format';

const HeroScene = dynamic(
  () => import('@/components/3d/hero-scene').then((m) => m.HeroScene),
  { ssr: false }
);

interface HomeViewProps {
  featured: Product[];
  brands: BrandGroupType[];
}

export function HomeView({ featured, brands }: HomeViewProps) {
  const heroRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ['start start', 'end start'],
  });
  const heroOpacity = useTransform(scrollYProgress, [0, 0.7], [1, 0]);
  const heroScale = useTransform(scrollYProgress, [0, 0.7], [1, 1.08]);
  const heroY = useTransform(scrollYProgress, [0, 0.7], [0, 80]);

  return (
    <div className="relative">
      {/* HERO */}
      <section
        ref={heroRef}
        className="relative h-[100svh] w-full overflow-hidden bg-[#222222]"
      >
        <motion.div
          style={{ opacity: heroOpacity, scale: heroScale, y: heroY }}
          className="absolute inset-0"
        >
          <HeroScene />
        </motion.div>

        <div className="pointer-events-none absolute inset-0 radial-spotlight" />
        <div className="pointer-events-none absolute inset-0 vignette" />

        <motion.div
          style={{ opacity: heroOpacity }}
          className="relative z-10 flex h-full flex-col items-center justify-center px-6 text-center"
        >
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.4 }}
            className="font-mono-label text-[11px] uppercase tracking-[0.5em] text-gold sm:text-xs"
          >
            Maison d&apos;Horlogerie
          </motion.p>

          <div className="mt-6 max-w-4xl">
            <SplitText
              as="h1"
              text="Time, Refined."
              delay={0.6}
              stagger={0.12}
              className="font-serif-display text-5xl font-light leading-[0.95] tracking-tight text-champagne text-shadow-luxe sm:text-7xl md:text-8xl"
            />
          </div>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 1.3 }}
            className="mt-7 max-w-xl text-base leading-relaxed text-gray-400 sm:text-lg"
          >
            A curated house of luxury wristwatches. Craftsmanship, heritage, and
            enduring value — delivered across Pakistan.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 1.6 }}
            className="mt-10 flex flex-col items-center gap-4 sm:flex-row"
          >
            <Link href="/store" className="btn-luxe-gold group">
              Explore the Shop
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" strokeWidth={1.5} />
            </Link>
            <Link href="/our-story" className="btn-luxe-ghost">
              Our Story
            </Link>
          </motion.div>
        </motion.div>

        <motion.div
          style={{ opacity: heroOpacity }}
          className="absolute bottom-8 left-1/2 z-10 -translate-x-1/2"
        >
          <div className="flex flex-col items-center gap-2">
            <span className="font-mono-label text-[9px] uppercase tracking-[0.3em] text-gray-400">
              Scroll
            </span>
            <motion.div
              animate={{ y: [0, 8, 0] }}
              transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
              className="h-10 w-px bg-gradient-to-b from-gold/60 to-transparent"
            />
          </div>
        </motion.div>
      </section>

      {/* MARQUEE */}
      <section className="border-y border-[hsl(var(--gold)/0.1)] bg-[hsl(0_0%_3%)] py-5 overflow-hidden">
        <div className="flex w-max animate-marquee">
          {Array.from({ length: 2 }).map((_, dup) => (
            <div key={dup} className="flex items-center gap-12 px-6">
              {['CASH ON DELIVERY', 'AUTHENTIC TIMEPIECES', 'DELIVERED ACROSS PAKISTAN', 'CURATED CRAFTSMANSHIP', 'TIMELESS HERITAGE'].map((text, i) => (
                <span key={`${dup}-${i}`} className="flex items-center gap-12 font-mono-label text-[10px] uppercase tracking-[0.4em] text-gray-400">
                  {text}
                  <Sparkles className="h-3 w-3 text-gold/40" />
                </span>
              ))}
            </div>
          ))}
        </div>
      </section>

      {/* FEATURED */}
      <section className="relative bg-[hsl(0_0%_9%)] py-24 sm:py-32 noise-overlay">
        <div className="mx-auto max-w-7xl px-5 sm:px-8">
          <div className="mb-14 flex flex-col items-center text-center">
            <Reveal>
              <p className="font-mono-label text-[11px] uppercase tracking-[0.4em] text-gold">
                Featured Selection
              </p>
            </Reveal>
            <SplitText
              as="h2"
              text="The Curated Few"
              className="mt-4 font-serif-display text-4xl font-light text-champagne sm:text-5xl md:text-6xl"
            />
            <Reveal delay={0.1}>
              <p className="mt-5 max-w-xl text-sm leading-relaxed text-gray-400 sm:text-base">
                Each timepiece is hand-selected for its craftsmanship, provenance,
                and enduring value — a reflection of taste that transcends trend.
              </p>
            </Reveal>
          </div>

          {featured.length > 0 ? (
            <Stagger className="grid grid-cols-2 gap-4 sm:gap-6 md:grid-cols-3 lg:grid-cols-4">
              {featured.slice(0, 8).map((product, i) => (
                <motion.div key={product.id} variants={staggerItem}>
                  <ProductCard product={product} index={i} priority={i < 4} />
                </motion.div>
              ))}
            </Stagger>
          ) : (
            <EmptyFeatured />
          )}

          <div className="mt-14 flex justify-center">
            <Link href="/shop" className="btn-luxe-ghost group">
              View Full Collection
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" strokeWidth={1.5} />
            </Link>
          </div>
        </div>
      </section>

      {/* BRANDS */}
      <BrandsSection brands={brands} />

      {/* STORY TEASER */}
      <StoryTeaser />

      {/* TRUST INDICATORS */}
      <TrustIndicators />

      {/* FINAL CTA */}
      <FinalCTA />
    </div>
  );
}

function EmptyFeatured() {
  return (
    <div className="flex flex-col items-center gap-4 rounded-2xl border border-[hsl(var(--gold)/0.1)] bg-[hsl(0_0%_5%)] py-20 text-center">
      <p className="font-serif-display text-2xl text-champagne">
        The collection is being curated
      </p>
      <p className="max-w-md text-sm text-gray-400">
        Our atelier is preparing a selection of exceptional timepieces. Please
        check back soon, or contact us for private acquisitions.
      </p>
      <Link href="/contact" className="btn-luxe-gold mt-2">
        Contact the Atelier
      </Link>
    </div>
  );
}

function BrandsSection({ brands }: { brands: BrandGroupType[] }) {
  return (
    <section className="relative bg-[hsl(0_0%_3%)] py-24 sm:py-32">
        <div className="mx-auto max-w-7xl px-5 sm:px-8">
          <div className="mb-14 flex flex-col items-center text-center">
            <Reveal>
              <p className="font-mono-label text-[11px] uppercase tracking-[0.4em] text-gold">
                The Maisons
              </p>
            </Reveal>
            <SplitText
              as="h2"
              text="Houses of Horology"
              className="mt-4 font-serif-display text-4xl font-light text-champagne sm:text-5xl md:text-6xl"
            />
            <Reveal delay={0.1}>
              <p className="mt-5 max-w-xl text-sm leading-relaxed text-gray-400 sm:text-base">
                Explore the legendary houses behind every timepiece. Select a
                maison to discover its curated collection.
              </p>
            </Reveal>
          </div>

          {brands.length > 0 ? (
            <Stagger
              className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4"
              stagger={0.07}
            >
              {brands.slice(0, 12).map((brand, i) => (
                <motion.div key={brand.slug} variants={staggerItem}>
                  <BrandCard brand={brand} index={i} />
                </motion.div>
              ))}
            </Stagger>
          ) : (
            <div className="flex flex-col items-center gap-4 rounded-2xl border border-[hsl(var(--gold)/0.1)] bg-[hsl(0_0%_5%)] py-20 text-center">
              <p className="font-serif-display text-2xl text-champagne">
                Maisons incoming
              </p>
              <p className="max-w-md text-sm text-gray-400">
                Our brand directory will appear here once products are stocked.
              </p>
            </div>
          )}

          <div className="mt-14 flex justify-center">
            <Link href="/brands" className="btn-luxe-ghost group">
              All Brands
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" strokeWidth={1.5} />
            </Link>
          </div>
        </div>
    </section>
  );
}

function StoryTeaser() {
  return (
    <section className="relative overflow-hidden bg-[hsl(0_0%_9%)] py-28 sm:py-40">
      <div className="absolute inset-0 radial-spotlight opacity-50" />
      <div className="mx-auto grid max-w-6xl items-center gap-14 px-5 sm:px-8 md:grid-cols-2">
        <div>
          <Reveal>
            <p className="font-mono-label text-[11px] uppercase tracking-[0.4em] text-gold">
              Our Philosophy
            </p>
          </Reveal>
          <SplitText
            as="h2"
            text="Every Watch Tells a Story."
            stagger={0.08}
            className="mt-5 font-serif-display text-4xl font-light leading-tight text-champagne sm:text-5xl md:text-6xl"
          />
          <Reveal delay={0.15}>
            <p className="mt-7 max-w-md text-sm leading-relaxed text-gray-400 sm:text-base">
              TheTikTime was founded on a single conviction: that a watch is
              never merely an instrument. It is an heirloom, a companion, a
              quiet declaration of taste. We travel to ateliers, examine each
              movement, and admit only those timepieces worthy of a lifetime.
            </p>
          </Reveal>
          <Reveal delay={0.25}>
            <Link href="/our-story" className="btn-luxe-ghost mt-8 group">
              Read Our Story
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" strokeWidth={1.5} />
            </Link>
          </Reveal>
        </div>
        <Reveal delay={0.1} className="relative">
          <div className="relative aspect-[4/5] overflow-hidden rounded-2xl border border-[hsl(var(--gold)/0.15)] shadow-luxe">
            <div className="absolute inset-0 bg-gradient-to-br from-[hsl(38_45%_58%/0.15)] via-transparent to-[hsl(0_0%_1%)]" />
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="relative h-56 w-56">
                <div className="absolute inset-0 animate-slow-spin rounded-full border border-[hsl(var(--gold)/0.3)]" />
                <div className="absolute inset-4 animate-slow-spin-reverse rounded-full border border-[hsl(var(--gold)/0.2)]" />
                <div className="absolute inset-8 rounded-full border border-[hsl(var(--gold)/0.15)]" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="font-serif-display text-5xl text-gold/40">∞</span>
                </div>
              </div>
            </div>
            <div className="absolute bottom-6 left-6 right-6">
              <p className="font-mono-label text-[9px] uppercase tracking-[0.4em] text-gray-400">
                Established
              </p>
              <p className="mt-1 font-serif-display text-3xl text-champagne">
                MMXXV
              </p>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

function TrustIndicators() {
  const items = [
    {
      icon: ShieldCheck,
      title: 'Authentic Guarantee',
      desc: 'Every timepiece verified for authenticity and provenance.',
    },
    {
      icon: Truck,
      title: 'Nationwide Delivery',
      desc: 'Delivered across Pakistan with insured, tracked shipping.',
    },
    {
      icon: CreditCard,
      title: 'Cash on Delivery',
      desc: 'Pay in cash when your timepiece arrives — no advance required.',
    },
    {
      icon: Sparkles,
      title: 'Curated Selection',
      desc: 'Each watch hand-picked by our master horologists.',
    },
  ];
  return (
    <section className="border-y border-[hsl(var(--gold)/0.1)] bg-[hsl(0_0%_3%)] py-20">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <Stagger className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-4">
          {items.map((item) => (
            <motion.div
              key={item.title}
              variants={staggerItem}
              className="flex flex-col items-center text-center"
            >
              <div className="flex h-14 w-14 items-center justify-center rounded-full border border-[hsl(var(--gold)/0.2)] text-gold">
                <item.icon className="h-6 w-6" strokeWidth={1.25} />
              </div>
              <h3 className="mt-5 font-serif-display text-lg text-champagne">
                {item.title}
              </h3>
              <p className="mt-2 max-w-[16rem] text-xs leading-relaxed text-gray-400">
                {item.desc}
              </p>
            </motion.div>
          ))}
        </Stagger>
      </div>
    </section>
  );
}

function FinalCTA() {
  return (
    <section className="relative overflow-hidden bg-[hsl(0_0%_4%)] py-32 sm:py-40">
      <div className="absolute inset-0 radial-spotlight" />
      <div className="relative mx-auto max-w-3xl px-6 text-center">
        <Reveal>
          <p className="font-mono-label text-[11px] uppercase tracking-[0.4em] text-gold">
            Begin Your Collection
          </p>
        </Reveal>
        <SplitText
          as="h2"
          text="Find Your Forever Watch."
          stagger={0.1}
          className="mt-5 font-serif-display text-4xl font-light text-champagne sm:text-6xl"
        />
        <Reveal delay={0.15}>
          <p className="mx-auto mt-6 max-w-lg text-sm leading-relaxed text-gray-400 sm:text-base">
            From the iconic to the obscure, discover the timepiece that will
            accompany you through a lifetime of moments.
          </p>
        </Reveal>
        <Reveal delay={0.25}>
          <Link href="/shop" className="btn-luxe-gold mt-10 group">
            Explore the Collection
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" strokeWidth={1.5} />
          </Link>
        </Reveal>
      </div>
    </section>
  );
}
