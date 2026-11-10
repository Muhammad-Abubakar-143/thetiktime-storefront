import Link from 'next/link';
import {
  Clock3,
  CreditCard,
  MapPin,
  PackageCheck,
  ShieldCheck,
  Truck,
} from 'lucide-react';
import { Reveal, SplitText } from '@/components/reveal';

export const metadata = {
  title: 'Shipping & Delivery',
  description:
    'Learn about TheTikTime delivery across Pakistan, shipping charges, tracked orders, and Cash on Delivery.',
};

const DELIVERY_DETAILS = [
  {
    icon: MapPin,
    title: 'Across Pakistan',
    description:
      'We deliver our curated timepieces to customers throughout Pakistan.',
  },
  {
    icon: ShieldCheck,
    title: 'Insured & tracked',
    description:
      'Your order is sent with insured, tracked shipping so you can follow its journey.',
  },
  {
    icon: CreditCard,
    title: 'Pay on delivery',
    description:
      'Cash on Delivery is available. Pay the courier when your timepiece arrives.',
  },
];

export default function ShippingPage() {
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
            text="Shipping & Delivery."
            stagger={0.07}
            className="mt-4 font-serif-display text-4xl font-light text-champagne sm:text-6xl md:text-7xl"
          />
          <Reveal delay={0.1}>
            <p className="mt-5 max-w-2xl text-sm leading-relaxed text-gray-400 sm:text-base">
              From our atelier to your door, every timepiece is prepared for
              careful delivery. We ship across Pakistan with insured, tracked
              shipping and the assurance of Cash on Delivery.
            </p>
          </Reveal>
        </div>
      </section>

      <section className="relative mx-auto mt-14 max-w-6xl px-5 sm:px-8 sm:mt-20">
        <div className="grid gap-5 md:grid-cols-3">
          {DELIVERY_DETAILS.map(({ icon: Icon, title, description }, index) => (
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
              <Truck className="h-5 w-5" strokeWidth={1.5} />
              <p className="font-mono-label text-[10px] uppercase tracking-[0.3em]">
                Delivery & timing
              </p>
            </div>
            <h2 className="mt-4 font-serif-display text-2xl text-champagne sm:text-3xl">
              Made to reach you with care.
            </h2>
            <p className="mt-4 text-sm leading-relaxed text-gray-400">
              Delivery time can vary depending on your location, courier
              availability, and public holidays. For the latest estimate for
              your address, please get in touch with us before placing your
              order.
            </p>
            <p className="mt-4 text-sm leading-relaxed text-gray-400">
              Please provide a complete delivery address and a reachable phone
              number at checkout so the courier can contact you if needed.
            </p>
          </div>
        </Reveal>

        <Reveal delay={0.1}>
          <div className="h-full border-t border-[hsl(var(--gold)/0.2)] pt-6">
            <div className="flex items-center gap-3 text-gold">
              <PackageCheck className="h-5 w-5" strokeWidth={1.5} />
              <p className="font-mono-label text-[10px] uppercase tracking-[0.3em]">
                Shipping & payment
              </p>
            </div>
            <h2 className="mt-4 font-serif-display text-2xl text-champagne sm:text-3xl">
              Clear details at checkout.
            </h2>
            <p className="mt-4 text-sm leading-relaxed text-gray-400">
              Any applicable shipping charges are shown during checkout. If a
              charge is not available yet, checkout will mark it as calculated
              at delivery.
            </p>
            <p className="mt-4 text-sm leading-relaxed text-gray-400">
              We offer Cash on Delivery, so you can pay the courier when your
              order arrives. Please have the order amount ready for delivery.
            </p>
          </div>
        </Reveal>
      </section>

      <section className="relative mx-auto mt-16 max-w-6xl px-5 sm:px-8 sm:mt-20">
        <Reveal>
          <div className="flex flex-col items-start justify-between gap-6 rounded-2xl border border-[hsl(var(--gold)/0.15)] bg-[hsl(0_0%_5%)] p-6 sm:flex-row sm:items-center sm:p-8">
            <div className="flex gap-4">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-[hsl(var(--gold)/0.2)] text-gold">
                <Clock3 className="h-5 w-5" strokeWidth={1.5} />
              </div>
              <div>
                <h2 className="font-serif-display text-xl text-champagne">
                  Need help with delivery?
                </h2>
                <p className="mt-1 max-w-xl text-sm leading-relaxed text-gray-400">
                  Contact our team for an update or help with your delivery
                  details.
                </p>
              </div>
            </div>
            <Link
              href="/contact"
              className="btn-luxe-gold shrink-0"
            >
              Contact Us
            </Link>
          </div>
        </Reveal>
      </section>
    </main>
  );
}
