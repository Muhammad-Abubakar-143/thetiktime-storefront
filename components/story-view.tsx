'use client';

import dynamic from 'next/dynamic';
import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { Reveal, SplitText } from '@/components/reveal';

const StoryScene = dynamic(
  () => import('@/components/3d/story-scene').then((m) => m.StoryScene),
  { ssr: false }
);

export function StoryView() {
  const heroRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ['start start', 'end start'],
  });
  const heroY = useTransform(scrollYProgress, [0, 1], [0, -100]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);

  return (
    <div className="relative min-h-screen bg-[hsl(0_0%_9%)] pt-24 sm:pt-28">
      {/* Hero */}
      <section
        ref={heroRef}
        className="relative flex h-[80svh] items-center justify-center overflow-hidden"
      >
        <div className="absolute inset-0">
          <StoryScene />
        </div>
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-[hsl(0_0%_9%)] via-transparent to-[hsl(0_0%_7%)]" />
        <motion.div
          style={{ y: heroY, opacity: heroOpacity }}
          className="relative z-10 flex flex-col items-center px-6 text-center"
        >
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.3 }}
            className="font-mono-label text-[11px] uppercase tracking-[0.5em] text-gold"
          >
            Our Story
          </motion.p>
          <SplitText
            as="h1"
            text="A Devotion to Time."
            delay={0.5}
            stagger={0.1}
            className="mt-6 font-serif-display text-4xl font-light leading-tight text-champagne text-shadow-luxe sm:text-6xl md:text-7xl"
          />
        </motion.div>
      </section>

      {/* Manifesto */}
      <section className="relative py-24 sm:py-32">
        <div className="mx-auto max-w-3xl px-6">
          <Reveal>
            <p className="font-mono-label text-[11px] uppercase tracking-[0.4em] text-gold">
              The Manifesto
            </p>
          </Reveal>
          <div className="mt-10 space-y-8 text-lg leading-relaxed text-gray-400 sm:text-xl">
            <Reveal>
              <p className="font-serif-display text-2xl leading-relaxed text-champagne sm:text-3xl">
                We believe a watch is never merely an instrument. It is an
                heirloom, a companion, a quiet declaration of taste.
              </p>
            </Reveal>
            <Reveal delay={0.1}>
              <p>
                TheTikTime was founded on a single conviction: that the finest
                timepieces deserve a home worthy of their craftsmanship. We
                travel to ateliers, examine each movement, and admit only those
                watches that will endure for generations.
              </p>
            </Reveal>
            <Reveal delay={0.15}>
              <p>
                Each piece in our collection is selected not for trend, but for
                permanence — for the story it carries and the legacy it
                promises. From the workshop bench to your wrist, every watch
                passes through the hands of those who understand that time, well
                kept, is the ultimate luxury.
              </p>
            </Reveal>
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section className="relative border-y border-[hsl(var(--gold)/0.1)] bg-[hsl(0_0%_3%)] py-24 sm:py-32">
        <div className="mx-auto max-w-4xl px-5 sm:px-8">
          <div className="mb-16 flex flex-col items-center text-center">
            <Reveal>
              <p className="font-mono-label text-[11px] uppercase tracking-[0.4em] text-gold">
                Our Journey
              </p>
            </Reveal>
            <h2 className="mt-4 font-serif-display text-3xl font-light text-champagne sm:text-5xl">
              The Road Thus Far
            </h2>
          </div>

          <div className="relative space-y-12 before:absolute before:left-[7px] before:top-2 before:h-full before:w-px before:bg-gradient-to-b before:from-gold/40 before:via-gold/15 before:to-transparent sm:before:left-1/2">
            {TIMELINE.map((item, i) => (
              <Reveal key={item.year} delay={i * 0.05}>
                <div
                  className={`relative flex gap-6 sm:gap-0 ${
                    i % 2 === 0 ? 'sm:flex-row' : 'sm:flex-row-reverse'
                  }`}
                >
                  <div className="absolute left-0 top-1.5 h-4 w-4 rounded-full border-2 border-gold bg-[hsl(0_0%_3%)] sm:left-1/2 sm:-translate-x-1/2" />
                  <div className="ml-8 sm:ml-0 sm:w-1/2 sm:px-8">
                    <p className="font-mono-label text-sm text-gold">
                      {item.year}
                    </p>
                    <h3 className="mt-1.5 font-serif-display text-xl text-champagne">
                      {item.title}
                    </h3>
                    <p className="mt-2 text-sm leading-relaxed text-gray-400">
                      {item.desc}
                    </p>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="relative py-24 sm:py-32">
        <div className="mx-auto max-w-5xl px-5 sm:px-8">
          <div className="mb-14 flex flex-col items-center text-center">
            <Reveal>
              <p className="font-mono-label text-[11px] uppercase tracking-[0.4em] text-gold">
                What We Stand For
              </p>
            </Reveal>
            <h2 className="mt-4 font-serif-display text-3xl font-light text-champagne sm:text-5xl">
              Our Values
            </h2>
          </div>
          <div className="grid gap-8 sm:grid-cols-2">
            {VALUES.map((value, i) => (
              <Reveal key={value.title} delay={i * 0.08}>
                <div className="rounded-xl border border-[hsl(var(--gold)/0.1)] bg-[hsl(0_0%_5%)] p-7">
                  <h3 className="font-serif-display text-xl text-gold">
                    {value.title}
                  </h3>
                  <p className="mt-3 text-sm leading-relaxed text-gray-400">
                    {value.desc}
                  </p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="relative overflow-hidden border-t border-[hsl(var(--gold)/0.1)] bg-[hsl(0_0%_3%)] py-28 sm:py-36">
        <div className="absolute inset-0 radial-spotlight" />
        <div className="relative mx-auto max-w-3xl px-6 text-center">
          <SplitText
            as="h2"
            text="Become part of the story."
            stagger={0.08}
            className="font-serif-display text-3xl font-light text-champagne sm:text-5xl"
          />
          <Reveal delay={0.15}>
            <p className="mx-auto mt-5 max-w-lg text-sm leading-relaxed text-gray-400 sm:text-base">
              Discover timepieces worthy of your own chapter. Delivered across
              Pakistan with the assurance of Cash on Delivery.
            </p>
          </Reveal>
          <Reveal delay={0.25}>
            <Link href="/shop" className="btn-luxe-gold mt-8 group">
              Explore the Collection
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" strokeWidth={1.5} />
            </Link>
          </Reveal>
        </div>
      </section>
    </div>
  );
}

const TIMELINE = [
  {
    year: 'MMXXV',
    title: 'The Founding',
    desc: 'TheTikTime is established in Lahore with a singular vision: to bring the world\'s finest wristwatches to collectors across Pakistan.',
  },
  {
    year: 'The Craft',
    title: 'The Curation Begins',
    desc: 'Our horologists travel to ateliers and auction houses, examining movements and provenance, admitting only the worthy.',
  },
  {
    year: 'The Promise',
    title: 'Cash on Delivery',
    desc: 'We pioneer trust-first commerce — pay only when your timepiece arrives. No advance, no risk, only confidence.',
  },
  {
    year: 'The Future',
    title: 'A Growing Maison',
    desc: 'Today we continue to seek out rare and remarkable watches, building a collection that honors the past and anticipates the future.',
  },
];

const VALUES = [
  {
    title: 'Authenticity',
    desc: 'Every timepiece is verified for authenticity and provenance. We stake our reputation on the genuineness of each watch.',
  },
  {
    title: 'Curation',
    desc: 'We do not stock everything — only what is worthy. Each piece is chosen with intention, for its craft and its character.',
  },
  {
    title: 'Trust',
    desc: 'Cash on Delivery is more than a payment method. It is our commitment that you see and hold your watch before you pay.',
  },
  {
    title: 'Stewardship',
    desc: 'A watch outlives its first owner. We see ourselves as stewards, matching timepieces to the hands that will carry them forward.',
  },
];
