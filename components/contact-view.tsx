'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, MapPin, Phone, Clock, Send, Check } from 'lucide-react';
import { Reveal, SplitText } from '@/components/reveal';
import { toast } from 'sonner';

export function ContactView() {
  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    subject: 'General Enquiry',
    message: '',
  });
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    await new Promise((r) => setTimeout(r, 1200));
    setSubmitting(false);
    setSubmitted(true);
    toast.success('Your message has been received. We will respond shortly.');
    setForm({
      name: '',
      email: '',
      phone: '',
      subject: 'General Enquiry',
      message: '',
    });
    setTimeout(() => setSubmitted(false), 5000);
  };

  return (
    <div className="relative min-h-screen bg-[hsl(0_0%_9%)] pt-28 sm:pt-32">
      {/* Animated background */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute left-1/4 top-1/4 h-96 w-96 animate-pulse-glow rounded-full bg-[hsl(var(--gold)/0.06)] blur-3xl" />
        <div className="absolute right-1/4 bottom-1/4 h-80 w-80 animate-pulse-glow rounded-full bg-[hsl(var(--navy)/0.15)] blur-3xl" style={{ animationDelay: '1.5s' }} />
      </div>

      <section className="relative mx-auto max-w-7xl px-5 sm:px-8">
        <div className="flex flex-col items-center text-center">
          <Reveal>
            <p className="font-mono-label text-[11px] uppercase tracking-[0.4em] text-gold">
              Get in Touch
            </p>
          </Reveal>
          <SplitText
            as="h1"
            text="Speak with the Atelier."
            stagger={0.08}
            className="mt-4 font-serif-display text-4xl font-light text-champagne sm:text-6xl md:text-7xl"
          />
          <Reveal delay={0.1}>
            <p className="mt-5 max-w-xl text-sm leading-relaxed text-gray-400 sm:text-base">
              Whether you seek a specific timepiece, have a question about your
              order, or simply wish to talk watches — we are at your service.
            </p>
          </Reveal>
        </div>
      </section>

      <div className="relative mx-auto grid max-w-6xl gap-10 px-5 py-16 sm:px-8 sm:py-24 lg:grid-cols-5 lg:gap-16">
        {/* Info */}
        <div className="lg:col-span-2">
          <Reveal>
            <h2 className="font-serif-display text-2xl text-champagne">
              The Atelier
            </h2>
          </Reveal>
          <div className="mt-8 space-y-6">
            {CONTACT_INFO.map((item) => (
              <Reveal key={item.label} delay={0.05}>
                <div className="flex gap-4">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-[hsl(var(--gold)/0.2)] text-gold">
                    <item.icon className="h-5 w-5" strokeWidth={1.5} />
                  </div>
                  <div>
                    <p className="font-mono-label text-[10px] uppercase tracking-[0.3em] text-gray-400">
                      {item.label}
                    </p>
                    <p className="mt-1 text-sm text-champagne">{item.value}</p>
                    {item.sub && (
                      <p className="text-xs text-gray-400">{item.sub}</p>
                    )}
                  </div>
                </div>
              </Reveal>
            ))}
          </div>

          <Reveal delay={0.2}>
            <div className="mt-10 rounded-xl border border-[hsl(var(--gold)/0.12)] bg-[hsl(0_0%_5%)] p-5">
              <p className="font-mono-label text-[10px] uppercase tracking-[0.3em] text-gold">
                Cash on Delivery
              </p>
              <p className="mt-2 text-sm leading-relaxed text-gray-400">
                All orders are delivered with Cash on Delivery. Pay only when
                your timepiece arrives — no advance payment required.
              </p>
            </div>
          </Reveal>
        </div>

        {/* Form */}
        <div className="lg:col-span-3">
          <Reveal delay={0.1}>
            <form
              onSubmit={handleSubmit}
              className="rounded-2xl border border-[hsl(var(--gold)/0.12)] bg-[hsl(0_0%_5%)] p-6 sm:p-8"
            >
              <div className="grid gap-5 sm:grid-cols-2">
                <Field
                  label="Full Name"
                  required
                  value={form.name}
                  onChange={(v) => setForm((f) => ({ ...f, name: v }))}
                />
                <Field
                  label="Email"
                  type="email"
                  required
                  value={form.email}
                  onChange={(v) => setForm((f) => ({ ...f, email: v }))}
                />
                <Field
                  label="Phone"
                  type="tel"
                  value={form.phone}
                  onChange={(v) => setForm((f) => ({ ...f, phone: v }))}
                />
                <div>
                  <label className="block font-mono-label text-[10px] uppercase tracking-[0.25em] text-gray-400">
                    Subject
                  </label>
                  <select
                    value={form.subject}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, subject: e.target.value }))
                    }
                    className="mt-2 w-full rounded-md border border-[hsl(var(--gold)/0.15)] bg-[hsl(0_0%_8%)] px-3 py-2.5 text-sm text-champagne focus:border-gold focus:outline-none"
                  >
                    {['General Enquiry', 'Product Question', 'Order Support', 'Watch Sourcing', 'Other'].map((s) => (
                      <option key={s} value={s} className="bg-[hsl(0_0%_8%)]">
                        {s}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="mt-5">
                <label className="block font-mono-label text-[10px] uppercase tracking-[0.25em] text-gray-400">
                  Message
                </label>
                <textarea
                  required
                  rows={5}
                  value={form.message}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, message: e.target.value }))
                  }
                  placeholder="Tell us how we may assist you..."
                  className="mt-2 w-full resize-none rounded-md border border-[hsl(var(--gold)/0.15)] bg-[hsl(0_0%_8%)] px-3 py-2.5 text-sm text-champagne placeholder:text-gray-400 focus:border-gold focus:outline-none"
                />
              </div>
              <button
                type="submit"
                disabled={submitting}
                className="btn-luxe-gold mt-6 w-full disabled:opacity-60"
              >
                {submitting ? (
                  <>
                    <span className="h-4 w-4 animate-spin rounded-full border-2 border-black/30 border-t-black" />
                    Sending...
                  </>
                ) : submitted ? (
                  <>
                    <Check className="h-4 w-4" />
                    Message Sent
                  </>
                ) : (
                  <>
                    <Send className="h-4 w-4" strokeWidth={1.5} />
                    Send Message
                  </>
                )}
              </button>
            </form>
          </Reveal>
        </div>
      </div>
    </div>
  );
}

function Field({
  label,
  value,
  onChange,
  type = 'text',
  required,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  type?: string;
  required?: boolean;
}) {
  return (
    <div>
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

const CONTACT_INFO = [
  {
    icon: MapPin,
    label: 'Atelier',
    value: 'Jhelum, Pakistan',
    sub: 'By appointment only',
  },
  {
    icon: Phone,
    label: 'Telephone',
    value: '+92 308 9453764',
    sub: 'Mon — Sat',
  },
  {
    icon: Mail,
    label: 'Email',
    value: 'care@thetiktime.com',
    sub: 'We respond within 24 hours',
  },
  {
    icon: Clock,
    label: 'Hours',
    value: '10:00 AM — 8:00 PM',
    sub: 'Monday through Saturday',
  },
];
