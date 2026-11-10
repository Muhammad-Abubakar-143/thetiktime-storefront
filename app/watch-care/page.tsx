import Link from 'next/link';
import {
  Droplets,
  Magnet,
  PackageCheck,
  Sparkles,
  Sun,
  Watch,
} from 'lucide-react';
import { Reveal, SplitText } from '@/components/reveal';

export const metadata = {
  title: 'Watch Care',
  description:
    'Keep your timepiece looking and performing its best with TheTikTime watch care guidance.',
};

const CARE_TIPS = [
  {
    icon: Droplets,
    title: 'Keep it dry',
    description:
      'Water resistance varies by watch and can change over time. Unless your specific model is rated for water exposure, keep it away from water, steam, and humidity.',
  },
  {
    icon: Sparkles,
    title: 'Clean gently',
    description:
      'Wipe the case and bracelet with a soft, clean, dry cloth. Avoid household cleaners, solvents, and abrasive materials that may damage the finish.',
  },
  {
    icon: Magnet,
    title: 'Avoid strong magnets',
    description:
      'Keep your watch away from strong magnetic sources, which can affect the timekeeping of some mechanical and quartz movements.',
  },
  {
    icon: Sun,
    title: 'Protect from extremes',
    description:
      'Avoid prolonged exposure to intense heat, direct sunlight, and sudden temperature changes to help protect the watch and its materials.',
  },
  {
    icon: PackageCheck,
    title: 'Store with care',
    description:
      'When not wearing your watch, store it in a clean, dry place away from dust, moisture, and potential scratches.',
  },
  {
    icon: Watch,
    title: 'Handle the movement thoughtfully',
    description:
      'Follow the instructions for your specific movement when setting or winding your watch. If something feels stuck or unusual, do not force it.',
  },
];

export default function WatchCarePage() {
  return (
    <main className="relative min-h-screen overflow-hidden bg-[hsl(0_0%_9%)] pb-20 pt-28 sm:pt-32">
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute left-1/4 top-1/4 h-96 w-96 rounded-full bg-[hsl(var(--gold)/0.06)] blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 h-80 w-80 rounded-full bg-[hsl(var(--navy)/0.15)] blur-3xl" />
      </div>

      <section className="relative mx-auto max-w-7xl px-5 sm:px-8">
        <div className="flex flex-col items-center text-center">
          <Reveal>
            <p className="font-mono-label text-[11px] uppercase tracking-[0.4em] text-gold">
              A Lasting Companion
            </p>
          </Reveal>
          <SplitText
            as="h1"
            text="The Art of Watch Care."
            stagger={0.07}
            className="mt-4 font-serif-display text-4xl font-light text-champagne sm:text-6xl md:text-7xl"
          />
          <Reveal delay={0.1}>
            <p className="mt-5 max-w-2xl text-sm leading-relaxed text-gray-400 sm:text-base">
              A little attention goes a long way. Follow these simple habits to
              help preserve the finish, function, and character of your
              timepiece.
            </p>
          </Reveal>
        </div>
      </section>

      <section className="relative mx-auto mt-14 max-w-6xl px-5 sm:px-8 sm:mt-20">
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {CARE_TIPS.map(({ icon: Icon, title, description }, index) => (
            <Reveal key={title} delay={(index % 3) * 0.06}>
              <article className="h-full rounded-xl border border-[hsl(var(--gold)/0.12)] bg-[hsl(0_0%_5%)] p-6 sm:p-7">
                <div className="flex h-11 w-11 items-center justify-center rounded-full border border-[hsl(var(--gold)/0.2)] text-gold">
                  <Icon className="h-5 w-5" strokeWidth={1.5} />
                </div>
                <h2 className="mt-5 font-serif-display text-xl text-champagne">
                  {title}
                </h2>
                <p className="mt-2 text-sm leading-relaxed text-gray-400">
                  {description}
                </p>
              </article>
            </Reveal>
          ))}
        </div>
      </section>

      <section className="relative mx-auto mt-16 max-w-6xl px-5 sm:px-8 sm:mt-20">
        <Reveal>
          <div className="grid gap-8 rounded-2xl border border-[hsl(var(--gold)/0.15)] bg-[hsl(0_0%_5%)] p-6 sm:p-8 lg:grid-cols-2 lg:gap-12">
            <div>
              <p className="font-mono-label text-[10px] uppercase tracking-[0.3em] text-gold">
                Before water exposure
              </p>
              <h2 className="mt-3 font-serif-display text-2xl text-champagne sm:text-3xl">
                Check your watch&apos;s rating.
              </h2>
              <p className="mt-4 text-sm leading-relaxed text-gray-400">
                Water resistance is not the same as being waterproof. Check the
                specific water-resistance rating and care instructions for your
                model before swimming, showering, or exposing it to water.
                When in doubt, keep it dry and ask us for guidance.
              </p>
            </div>
            <div className="border-t border-[hsl(var(--gold)/0.12)] pt-6 lg:border-l lg:border-t-0 lg:pl-8 lg:pt-0">
              <p className="font-mono-label text-[10px] uppercase tracking-[0.3em] text-gold">
                Maintenance
              </p>
              <h2 className="mt-3 font-serif-display text-2xl text-champagne sm:text-3xl">
                Leave repairs to a professional.
              </h2>
              <p className="mt-4 text-sm leading-relaxed text-gray-400">
                If your watch needs attention, or you notice a change in
                timekeeping or operation, consult a qualified watch
                professional. Maintenance needs vary by movement and use, so
                follow the guidance for your specific timepiece.
              </p>
            </div>
          </div>
        </Reveal>
      </section>

      <section className="relative mx-auto mt-10 max-w-6xl px-5 sm:px-8">
        <Reveal>
          <div className="flex flex-col items-start justify-between gap-6 rounded-2xl border border-[hsl(var(--gold)/0.15)] bg-[hsl(0_0%_5%)] p-6 sm:flex-row sm:items-center sm:p-8">
            <div>
              <h2 className="font-serif-display text-xl text-champagne">
                Have a question about your timepiece?
              </h2>
              <p className="mt-1 max-w-xl text-sm leading-relaxed text-gray-400">
                Our team can help you find product-specific care information.
              </p>
            </div>
            <Link href="/contact" className="btn-luxe-gold shrink-0">
              Contact Us
            </Link>
          </div>
        </Reveal>
      </section>
    </main>
  );
}
