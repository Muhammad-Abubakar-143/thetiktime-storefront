import Link from 'next/link';
import {
  BadgeCheck,
  ClipboardList,
  Mail,
  PackageCheck,
  RotateCcw,
  ShieldCheck,
} from 'lucide-react';
import { Reveal, SplitText } from '@/components/reveal';

export const metadata = {
  title: 'Returns & Warranty',
  description:
    'Find out how to contact TheTikTime about a return, refund, exchange, or warranty question.',
};

const SUPPORT_STEPS = [
  {
    icon: Mail,
    title: 'Get in touch first',
    description:
      'Contact us with your order number and a short description of the issue. Please do this before sending a watch or other item back.',
  },
  {
    icon: ClipboardList,
    title: 'Share the details',
    description:
      'For damage or a product concern, include clear photos where helpful and keep the original packaging until we have advised you.',
  },
  {
    icon: PackageCheck,
    title: 'Follow the next steps',
    description:
      'We will review your request and confirm the applicable options and instructions for your order.',
  },
];

export default function RefundsPage() {
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
              Client Care
            </p>
          </Reveal>
          <SplitText
            as="h1"
            text="Returns & Warranty."
            stagger={0.07}
            className="mt-4 font-serif-display text-4xl font-light text-champagne sm:text-6xl md:text-7xl"
          />
          <Reveal delay={0.1}>
            <p className="mt-5 max-w-2xl text-sm leading-relaxed text-gray-400 sm:text-base">
              Have a concern about your order or timepiece? Reach out to our
              team and we&apos;ll help you understand the options and next
              steps for your specific purchase.
            </p>
          </Reveal>
        </div>
      </section>

      <section className="relative mx-auto mt-14 max-w-6xl px-5 sm:px-8 sm:mt-20">
        <div className="grid gap-5 md:grid-cols-3">
          {SUPPORT_STEPS.map(({ icon: Icon, title, description }, index) => (
            <Reveal key={title} delay={index * 0.08}>
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

      <section className="relative mx-auto mt-16 grid max-w-6xl gap-10 px-5 sm:px-8 sm:mt-24 lg:grid-cols-2 lg:gap-16">
        <Reveal>
          <div className="h-full border-t border-[hsl(var(--gold)/0.2)] pt-6">
            <div className="flex items-center gap-3 text-gold">
              <RotateCcw className="h-5 w-5" strokeWidth={1.5} />
              <p className="font-mono-label text-[10px] uppercase tracking-[0.3em]">
                Returns & refunds
              </p>
            </div>
            <h2 className="mt-4 font-serif-display text-2xl text-champagne sm:text-3xl">
              Start with a conversation.
            </h2>
            <p className="mt-4 text-sm leading-relaxed text-gray-400">
              Return, exchange, and refund options depend on the item and the
              circumstances of the order. Contact us with your order details
              before returning anything; we&apos;ll review the request and
              explain the available next steps.
            </p>
            <p className="mt-4 text-sm leading-relaxed text-gray-400">
              If a refund is approved, we&apos;ll confirm the applicable
              process with you directly. Please don&apos;t dispatch a return
              until you have received instructions from our team.
            </p>
          </div>
        </Reveal>

        <Reveal delay={0.1}>
          <div className="h-full border-t border-[hsl(var(--gold)/0.2)] pt-6">
            <div className="flex items-center gap-3 text-gold">
              <ShieldCheck className="h-5 w-5" strokeWidth={1.5} />
              <p className="font-mono-label text-[10px] uppercase tracking-[0.3em]">
                Warranty & product concerns
              </p>
            </div>
            <h2 className="mt-4 font-serif-display text-2xl text-champagne sm:text-3xl">
              Coverage can vary by timepiece.
            </h2>
            <p className="mt-4 text-sm leading-relaxed text-gray-400">
              Warranty coverage, if applicable, depends on the specific
              product and the terms provided with your purchase. Contact us
              with your order number and a description of the issue so we can
              help clarify the applicable coverage.
            </p>
            <p className="mt-4 text-sm leading-relaxed text-gray-400">
              If your item arrives damaged or you notice a fault, please get
              in touch promptly and keep the item and its packaging available
              while we review your request. Avoid attempting repairs before
              speaking with us.
            </p>
          </div>
        </Reveal>
      </section>

      <section className="relative mx-auto mt-16 max-w-6xl px-5 sm:px-8 sm:mt-20">
        <Reveal>
          <div className="flex flex-col items-start justify-between gap-6 rounded-2xl border border-[hsl(var(--gold)/0.15)] bg-[hsl(0_0%_5%)] p-6 sm:flex-row sm:items-center sm:p-8">
            <div className="flex gap-4">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-[hsl(var(--gold)/0.2)] text-gold">
                <BadgeCheck className="h-5 w-5" strokeWidth={1.5} />
              </div>
              <div>
                <h2 className="font-serif-display text-xl text-champagne">
                  Need help with an order?
                </h2>
                <p className="mt-1 max-w-xl text-sm leading-relaxed text-gray-400">
                  Include your order number so our team can assist you more
                  quickly.
                </p>
              </div>
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
