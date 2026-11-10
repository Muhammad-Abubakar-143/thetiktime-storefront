import Link from 'next/link';
import {
  Banknote,
  ClipboardCheck,
  MapPin,
  PackageCheck,
  Phone,
  Truck,
} from 'lucide-react';
import { Reveal, SplitText } from '@/components/reveal';

export const metadata = {
  title: 'Cash on Delivery',
  description:
    'Learn how Cash on Delivery works when ordering a timepiece from TheTikTime.',
};

const ORDER_STEPS = [
  {
    icon: ClipboardCheck,
    title: 'Place your order',
    description:
      'Add your chosen timepiece to your cart and provide your contact details and complete delivery address at checkout.',
  },
  {
    icon: Phone,
    title: 'Stay reachable',
    description:
      'Keep your phone available in case our team or the courier needs to confirm your delivery details.',
  },
  {
    icon: Truck,
    title: 'Receive your delivery',
    description:
      'Your order will be sent to your address. Delivery timing depends on your location and courier availability.',
  },
  {
    icon: Banknote,
    title: 'Pay the courier',
    description:
      'Pay the order amount in cash when your timepiece arrives. Please have the amount shown in your order ready.',
  },
];

export default function CashOnDeliveryPage() {
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
              A Simple Way to Pay
            </p>
          </Reveal>
          <SplitText
            as="h1"
            text="Cash on Delivery."
            stagger={0.07}
            className="mt-4 font-serif-display text-4xl font-light text-champagne sm:text-6xl md:text-7xl"
          />
          <Reveal delay={0.1}>
            <p className="mt-5 max-w-2xl text-sm leading-relaxed text-gray-400 sm:text-base">
              Shop your next timepiece with confidence. With Cash on Delivery,
              no advance payment is required; pay the courier when your order
              arrives.
            </p>
          </Reveal>
        </div>
      </section>

      <section className="relative mx-auto mt-14 max-w-6xl px-5 sm:px-8 sm:mt-20">
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {ORDER_STEPS.map(({ icon: Icon, title, description }, index) => (
            <Reveal key={title} delay={index * 0.06}>
              <article className="h-full rounded-xl border border-[hsl(var(--gold)/0.12)] bg-[hsl(0_0%_5%)] p-6">
                <div className="flex h-11 w-11 items-center justify-center rounded-full border border-[hsl(var(--gold)/0.2)] text-gold">
                  <Icon className="h-5 w-5" strokeWidth={1.5} />
                </div>
                <p className="mt-5 font-mono-label text-[10px] uppercase tracking-[0.3em] text-gold">
                  Step {index + 1}
                </p>
                <h2 className="mt-2 font-serif-display text-xl text-champagne">
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
              <PackageCheck className="h-5 w-5" strokeWidth={1.5} />
              <p className="font-mono-label text-[10px] uppercase tracking-[0.3em]">
                Your order total
              </p>
            </div>
            <h2 className="mt-4 font-serif-display text-2xl text-champagne sm:text-3xl">
              Check the total at checkout.
            </h2>
            <p className="mt-4 text-sm leading-relaxed text-gray-400">
              Your order summary shows the amount due. Any available shipping
              charge will appear there; if it is not available during checkout,
              it may be marked as calculated at delivery.
            </p>
            <p className="mt-4 text-sm leading-relaxed text-gray-400">
              Please have the amount due ready in cash for the courier when
              your order arrives.
            </p>
          </div>
        </Reveal>

        <Reveal delay={0.1}>
          <div className="h-full border-t border-[hsl(var(--gold)/0.2)] pt-6">
            <div className="flex items-center gap-3 text-gold">
              <MapPin className="h-5 w-5" strokeWidth={1.5} />
              <p className="font-mono-label text-[10px] uppercase tracking-[0.3em]">
                Smooth delivery
              </p>
            </div>
            <h2 className="mt-4 font-serif-display text-2xl text-champagne sm:text-3xl">
              Help us reach the right door.
            </h2>
            <p className="mt-4 text-sm leading-relaxed text-gray-400">
              Enter a complete address and a phone number where you can be
              reached. Delivery availability and timing can vary by location;
              contact us if you would like to check your area before ordering.
            </p>
          </div>
        </Reveal>
      </section>

      <section className="relative mx-auto mt-16 max-w-6xl px-5 sm:px-8 sm:mt-20">
        <Reveal>
          <div className="flex flex-col items-start justify-between gap-6 rounded-2xl border border-[hsl(var(--gold)/0.15)] bg-[hsl(0_0%_5%)] p-6 sm:flex-row sm:items-center sm:p-8">
            <div>
              <h2 className="font-serif-display text-xl text-champagne">
                Questions about Cash on Delivery?
              </h2>
              <p className="mt-1 max-w-xl text-sm leading-relaxed text-gray-400">
                Our team is happy to help with payment or delivery questions.
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
