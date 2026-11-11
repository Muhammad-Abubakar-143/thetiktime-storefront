'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowLeft,
  Check,
  ShoppingBag,
  Loader2,
  CreditCard,
  ShieldCheck,
  Truck,
} from 'lucide-react';
import { useCart } from '@/hooks/use-cart';
import { formatPrice, getImageUrl, getProductImages } from '@/lib/format';
import type { Order } from '@/lib/medusa';
import { toast } from 'sonner';

type Step = 'details' | 'review' | 'processing' | 'confirmation';

export function CheckoutView() {
  const { cart, region, checkout, itemCount, ready } = useCart();
  const currency = cart?.currency_code ?? region?.currency_code ?? 'pkr';
  const [step, setStep] = useState<Step>('details');
  const [isProcessing, setIsProcessing] = useState(false);
  const [order, setOrder] = useState<Order | null>(null);
  const [form, setForm] = useState({
    email: '',
    firstName: '',
    lastName: '',
    phone: '',
    address1: '',
    address2: '',
    city: '',
    province: '',
    postalCode: '',
  });

  const subtotal = cart?.subtotal ?? 0;
  const shipping = cart?.shipping_total ?? 0;
  const tax = cart?.tax_total ?? 0;
  const total = cart?.total ?? subtotal;

  const handlePlaceOrder = async () => {
    setStep('processing');
    setIsProcessing(true);
    try {
      const result = await checkout({
        email: form.email,
        shippingAddress: {
          first_name: form.firstName,
          last_name: form.lastName,
          phone: form.phone,
          address_1: form.address1,
          address_2: form.address2 || undefined,
          city: form.city,
          province: form.province || undefined,
          postal_code: form.postalCode || undefined,
          country_code: 'pk',
        },
      });
      setOrder(result);
      setStep('confirmation');
      toast.success('Your order has been placed.');
    } catch (err) {
      console.error('Checkout failed:', err);
      toast.error(
        err instanceof Error
          ? err.message
          : 'Unable to complete your order. Please try again.'
      );
      setStep('review');
    } finally {
      setIsProcessing(false);
    }
  };

  // Confirmation screen
  if (step === 'confirmation' && order) {
    return <OrderConfirmation order={order} currency={currency} />;
  }

  // Empty cart
  if (ready && (!cart || itemCount === 0)) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-[hsl(0_0%_4%)] pt-28 text-center">
        <div className="flex h-20 w-20 items-center justify-center rounded-full border border-[hsl(var(--gold)/0.15)]">
          <ShoppingBag className="h-8 w-8 text-gold/50" strokeWidth={1} />
        </div>
        <h1 className="mt-6 font-serif-display text-3xl text-champagne">
          Your cart is empty
        </h1>
        <p className="mt-3 max-w-sm text-sm text-gray-400">
          Add a timepiece to your collection before proceeding to checkout.
        </p>
        <Link href="/collection" className="btn-luxe-gold mt-8">
          Explore the Collection
        </Link>
      </div>
    );
  }

  const isFormValid =
    form.email &&
    form.firstName &&
    form.lastName &&
    form.phone &&
    form.address1 &&
    form.city;

  return (
    <div className="relative min-h-screen bg-[hsl(0_0%_4%)] pt-28 sm:pt-32">
      <div className="mx-auto max-w-6xl px-5 sm:px-8">
        <Link
          href="/store"
          className="flex items-center gap-2 font-mono-label text-[11px] uppercase tracking-[0.25em] text-gray-400 transition-colors hover:text-champagne"
        >
          <ArrowLeft className="h-4 w-4" strokeWidth={1.5} />
          Continue Browsing
        </Link>

        <div className="mt-6 flex flex-col items-center text-center">
          <h1 className="font-serif-display text-4xl font-light text-champagne sm:text-5xl">
            Checkout
          </h1>
          <p className="mt-3 font-mono-label text-[10px] uppercase tracking-[0.3em] text-gold">
            Cash on Delivery
          </p>
        </div>

        {/* Steps indicator */}
        <div className="mx-auto mt-8 flex max-w-md items-center justify-center gap-3">
          {['details', 'review'].map((s, i) => (
            <div key={s} className="flex items-center gap-3">
              <div
                className={`flex h-7 w-7 items-center justify-center rounded-full border text-xs font-mono-label ${
                  step === s || (step === 'processing' && s === 'review')
                    ? 'border-gold bg-gold text-black'
                    : 'border-[hsl(var(--gold)/0.2)] text-gray-400'
                }`}
              >
                {i + 1}
              </div>
              <span className="font-mono-label text-[10px] uppercase tracking-[0.2em] text-gray-400">
                {s === 'details' ? 'Details' : 'Review'}
              </span>
              {i === 0 && <div className="h-px w-8 bg-[hsl(var(--gold)/0.2)]" />}
            </div>
          ))}
        </div>

        <div className="mt-12 grid gap-10 lg:grid-cols-5 lg:gap-16">
          {/* Form / Review */}
          <div className="lg:col-span-3">
            <AnimatePresence mode="wait">
              {step === 'details' && (
                <motion.div
                  key="details"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.4 }}
                >
                  <h2 className="font-serif-display text-xl text-champagne">
                    Contact & Delivery
                  </h2>
                  <div className="mt-6 grid gap-5 sm:grid-cols-2">
                    <CheckoutField
                      label="Email"
                      type="email"
                      required
                      value={form.email}
                      onChange={(v) => setForm((f) => ({ ...f, email: v }))}
                      className="sm:col-span-2"
                    />
                    <CheckoutField
                      label="First Name"
                      required
                      value={form.firstName}
                      onChange={(v) => setForm((f) => ({ ...f, firstName: v }))}
                    />
                    <CheckoutField
                      label="Last Name"
                      required
                      value={form.lastName}
                      onChange={(v) => setForm((f) => ({ ...f, lastName: v }))}
                    />
                    <CheckoutField
                      label="Phone"
                      type="tel"
                      required
                      value={form.phone}
                      onChange={(v) => setForm((f) => ({ ...f, phone: v }))}
                      className="sm:col-span-2"
                    />
                    <CheckoutField
                      label="Address Line 1"
                      required
                      value={form.address1}
                      onChange={(v) => setForm((f) => ({ ...f, address1: v }))}
                      className="sm:col-span-2"
                    />
                    <CheckoutField
                      label="Address Line 2 (Optional)"
                      value={form.address2}
                      onChange={(v) => setForm((f) => ({ ...f, address2: v }))}
                      className="sm:col-span-2"
                    />
                    <CheckoutField
                      label="City"
                      required
                      value={form.city}
                      onChange={(v) => setForm((f) => ({ ...f, city: v }))}
                    />
                    <CheckoutField
                      label="Province"
                      value={form.province}
                      onChange={(v) => setForm((f) => ({ ...f, province: v }))}
                    />
                    <CheckoutField
                      label="Postal Code"
                      value={form.postalCode}
                      onChange={(v) => setForm((f) => ({ ...f, postalCode: v }))}
                    />
                  </div>

                  <button
                    onClick={() => {
                      if (!isFormValid) {
                        toast.error('Please complete all required fields.');
                        return;
                      }
                      setStep('review');
                    }}
                    disabled={!isFormValid}
                    className="btn-luxe-gold mt-8 w-full disabled:opacity-50"
                  >
                    Review Order
                  </button>
                </motion.div>
              )}

              {step === 'review' && (
                <motion.div
                  key="review"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.4 }}
                >
                  <h2 className="font-serif-display text-xl text-champagne">
                    Review Your Order
                  </h2>

                  <div className="mt-6 space-y-4 rounded-xl border border-[hsl(var(--gold)/0.1)] bg-[hsl(0_0%_5%)] p-5">
                    <ReviewRow label="Name" value={`${form.firstName} ${form.lastName}`} />
                    <ReviewRow label="Email" value={form.email} />
                    <ReviewRow label="Phone" value={form.phone} />
                    <ReviewRow
                      label="Delivery Address"
                      value={`${form.address1}${form.address2 ? `, ${form.address2}` : ''}, ${form.city}${form.province ? `, ${form.province}` : ''}${form.postalCode ? ` ${form.postalCode}` : ''}, Pakistan`}
                    />
                  </div>

                  {/* COD notice */}
                  <div className="mt-6 rounded-xl border border-[hsl(var(--gold)/0.2)] bg-[hsl(var(--gold)/0.05)] p-5">
                    <div className="flex items-center gap-3">
                      <CreditCard className="h-5 w-5 text-gold" strokeWidth={1.5} />
                      <div>
                        <p className="font-mono-label text-[10px] uppercase tracking-[0.25em] text-gold">
                          Payment Method
                        </p>
                        <p className="mt-1 text-sm text-champagne">
                          Cash on Delivery
                        </p>
                      </div>
                    </div>
                    <p className="mt-3 text-xs leading-relaxed text-gray-400">
                      Pay in cash when your timepiece arrives at your door. No
                      advance payment is required. Please have the exact amount
                      ready for the courier.
                    </p>
                  </div>

                  <div className="mt-6 flex gap-3">
                    <button
                      onClick={() => setStep('details')}
                      className="btn-luxe-ghost flex-1"
                    >
                      Back
                    </button>
                    <button
                      onClick={handlePlaceOrder}
                      disabled={isProcessing}
                      className="btn-luxe-gold flex-1 disabled:opacity-60"
                    >
                      {isProcessing ? (
                        <>
                          <Loader2 className="h-4 w-4 animate-spin" />
                          Placing Order...
                        </>
                      ) : (
                        'Place Order'
                      )}
                    </button>
                  </div>
                </motion.div>
              )}

              {step === 'processing' && (
                <motion.div
                  key="processing"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex flex-col items-center gap-5 py-20"
                >
                  <Loader2 className="h-10 w-10 animate-spin text-gold" />
                  <p className="font-mono-label text-[11px] uppercase tracking-[0.3em] text-gray-400">
                    Placing Your Order
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Order summary */}
          <div className="lg:col-span-2">
            <div className="sticky top-28 rounded-2xl border border-[hsl(var(--gold)/0.12)] bg-[hsl(0_0%_5%)] p-6">
              <h3 className="font-mono-label text-[10px] uppercase tracking-[0.3em] text-gold">
                Order Summary
              </h3>
              <ul className="mt-5 space-y-4">
                {cart?.items?.map((item) => {
                  const img =
                    item.thumbnail ||
                    item.product?.thumbnail ||
                    getProductImages(item.product)[0] ||
                    '/images/placeholder-watch.svg';
                  const variantTitle =
                    item.variant?.title &&
                    item.variant.title !== 'Default Title'
                      ? item.variant.title
                      : item.variant_title &&
                        item.variant_title !== 'Default Title'
                      ? item.variant_title
                      : null;
                  return (
                    <li key={item.id} className="flex gap-3">
                      <div className="relative h-16 w-14 shrink-0 overflow-hidden rounded border border-[hsl(var(--gold)/0.1)] bg-[hsl(0_0%_8%)]">
                        <Image
                          src={getImageUrl(img)}
                          alt={item.product?.title ?? ''}
                          fill
                          sizes="56px"
                          className="object-cover"
                        />
                      </div>
                      <div className="flex flex-1 flex-col">
                        <p className="font-serif-display text-sm leading-tight text-champagne">
                          {item.product?.title ?? item.title}
                        </p>
                        {variantTitle && (
                          <p className="text-xs text-gray-400">
                            {variantTitle}
                          </p>
                        )}
                        <p className="text-xs text-gray-400">Qty: {item.quantity}</p>
                        <p className="mt-auto font-mono-label text-xs text-gold">
                          {formatPrice(item.total, currency)}
                        </p>
                      </div>
                    </li>
                  );
                })}
              </ul>

              <div className="my-5 hairline" />

              <div className="space-y-2.5">
                <SummaryRow label="Subtotal" value={formatPrice(subtotal, currency)} />
                <SummaryRow
                  label="Shipping"
                  value={shipping > 0 ? formatPrice(shipping, currency) : 'Calculated at delivery'}
                />
                <SummaryRow label="Tax" value={formatPrice(tax, currency)} />
              </div>

              <div className="my-4 hairline" />
              <div className="flex items-center justify-between">
                <span className="font-mono-label text-[11px] uppercase tracking-[0.25em] text-champagne">
                  Total
                </span>
                <span className="font-serif-display text-2xl text-gold">
                  {formatPrice(total, currency)}
                </span>
              </div>

              <div className="mt-5 space-y-2">
                {[
                  { icon: ShieldCheck, text: 'Authenticity Guaranteed' },
                  { icon: Truck, text: 'Nationwide COD Delivery' },
                  { icon: CreditCard, text: 'Pay When You Receive' },
                ].map((item) => (
                  <div key={item.text} className="flex items-center gap-2.5 text-gray-400">
                    <item.icon className="h-4 w-4 shrink-0 text-gold/70" strokeWidth={1.5} />
                    <span className="text-xs">{item.text}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function CheckoutField({
  label,
  value,
  onChange,
  type = 'text',
  required,
  className = '',
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  type?: string;
  required?: boolean;
  className?: string;
}) {
  return (
    <div className={className}>
      <label className="block font-mono-label text-[10px] uppercase tracking-[0.25em] text-gray-400">
        {label} {required && <span className="text-gold/60">*</span>}
      </label>
      <input
        type={type}
        required={required}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="mt-2 w-full rounded-md border border-[hsl(var(--gold)/0.15)] bg-[hsl(0_0%_8%)] px-3 py-2.5 text-sm text-champagne focus:border-gold focus:outline-none"
      />
    </div>
  );
}

function ReviewRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between gap-4 text-sm">
      <span className="font-mono-label text-[10px] uppercase tracking-[0.2em] text-gray-400">
        {label}
      </span>
      <span className="text-right text-champagne">{value}</span>
    </div>
  );
}

function SummaryRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between text-sm">
      <span className="text-gray-400">{label}</span>
      <span className="text-champagne">{value}</span>
    </div>
  );
}

function OrderConfirmation({
  order,
  currency,
}: {
  order: Order;
  currency: string;
}) {
  const orderNumber = order.display_id ?? order.id.slice(-8).toUpperCase();
  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center bg-[hsl(0_0%_4%)] px-6 pt-28 text-center">
      <motion.div
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className="flex h-20 w-20 items-center justify-center rounded-full border-2 border-gold"
      >
        <Check className="h-10 w-10 text-gold" strokeWidth={1.5} />
      </motion.div>

      <motion.h1
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="mt-8 font-serif-display text-4xl font-light text-champagne sm:text-5xl"
      >
        Order Confirmed
      </motion.h1>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="mt-4 max-w-md text-sm leading-relaxed text-gray-400 sm:text-base"
      >
        Thank you for your purchase. Your timepiece is being prepared for
        delivery. Please have the cash amount ready for the courier upon
        arrival.
      </motion.p>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="mt-8 rounded-xl border border-[hsl(var(--gold)/0.12)] bg-[hsl(0_0%_5%)] px-8 py-6"
      >
        <p className="font-mono-label text-[10px] uppercase tracking-[0.3em] text-gray-400">
          Order Number
        </p>
        <p className="mt-2 font-serif-display text-2xl text-gold">
          #{orderNumber}
        </p>
        <div className="my-4 hairline" />
        <div className="flex justify-between gap-8">
          <div className="text-left">
            <p className="font-mono-label text-[10px] uppercase tracking-[0.2em] text-gray-400">
              Total
            </p>
            <p className="mt-1 text-lg text-champagne">
              {formatPrice(order.total, currency)}
            </p>
          </div>
          <div className="text-left">
            <p className="font-mono-label text-[10px] uppercase tracking-[0.2em] text-gray-400">
              Payment
            </p>
            <p className="mt-1 text-lg text-champagne">COD</p>
          </div>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="mt-8 flex flex-col gap-3 sm:flex-row"
      >
        <Link href="/store" className="btn-luxe-gold">
          Continue Browsing
        </Link>
        <Link href="/" className="btn-luxe-ghost">
          Return Home
        </Link>
      </motion.div>
    </div>
  );
}
