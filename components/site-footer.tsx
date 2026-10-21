'use client';

import Link from 'next/link';
import { Clock, Mail, MapPin, Phone, Instagram, Facebook, Twitter } from 'lucide-react';
import { motion } from 'framer-motion';

const FOOTER_LINKS = [
  {
    title: 'Maison',
    links: [
      { label: 'Collection', href: '/shop' },
      { label: 'Store', href: '/store' },
      { label: 'Brands', href: '/brands' },
      { label: 'Our Story', href: '/our-story' },
      { label: 'Contact', href: '/contact' },
    ],
  },
  {
    title: 'Client Care',
    links: [
      { label: 'Shipping & Delivery', href: '/contact' },
      { label: 'Cash on Delivery', href: '/contact' },
      { label: 'Returns & Warranty', href: '/contact' },
      { label: 'Watch Care', href: '/our-story' },
    ],
  },
];

const SocialLinks = [
  { Icon: Instagram, label: 'Instagram', href: 'https://www.instagram.com/thetik.time/' },
  { Icon: Facebook, label: 'Facebook', href: 'https://www.facebook.com/profile.php?id=61591742921704' },
  { Icon: Twitter, label: 'Twitter', href: '#' },
];

export function SiteFooter() {
  return (
    <footer className="relative border-t border-[hsl(var(--gold)/0.12)] bg-[hsl(0_0%_3%)] noise-overlay">
      <div className="mx-auto max-w-7xl px-5 py-16 sm:px-8 sm:py-20">
        <div className="grid gap-12 md:grid-cols-12">
          <div className="md:col-span-5">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-80px' }}
              transition={{ duration: 0.6 }}
            >
              <Link href="/" className="inline-block">
                <span className="font-serif-display text-2xl tracking-[0.3em] text-champagne">
                  THE TIK TIME
                </span>
                <span className="mt-1 block font-mono-label text-[9px] tracking-[0.4em] text-steel">
                  MAISON D&apos;HORLOGERIE · EST. MMXXV
                </span>
              </Link>
              <p className="mt-6 max-w-sm text-sm leading-relaxed text-steel">
                A curated house of luxury wristwatches. Each timepiece is
                selected for its craftsmanship, heritage, and enduring value —
                delivered across Pakistan with the assurance of Cash on
                Delivery.
              </p>
              <div className="mt-6 flex gap-3">
                {[
                  ...SocialLinks
                ].map(({ Icon, label, href }) => (
                  <a
                    key={label}
                    href={href}
                    aria-label={label}
                    className="flex h-9 w-9 items-center justify-center rounded-full border border-[hsl(var(--gold)/0.18)] text-steel transition-all hover:border-[hsl(var(--gold)/0.5)] hover:text-gold"
                  >
                    <Icon className="h-4 w-4" strokeWidth={1.5} />
                  </a>
                ))}
              </div>
            </motion.div>
          </div>

          {FOOTER_LINKS.map((col, idx) => (
            <div key={col.title} className="md:col-span-2">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-80px' }}
                transition={{ duration: 0.6, delay: 0.1 + idx * 0.1 }}
              >
                <h4 className="font-mono-label text-[10px] uppercase tracking-[0.3em] text-gold">
                  {col.title}
                </h4>
                <ul className="mt-5 space-y-3">
                  {col.links.map((link) => (
                    <li key={link.label}>
                      <Link
                        href={link.href}
                        className="text-sm text-steel transition-colors hover:text-champagne"
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </motion.div>
            </div>
          ))}

          <div className="md:col-span-3">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-80px' }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              <h4 className="font-mono-label text-[10px] uppercase tracking-[0.3em] text-gold">
                Atelier
              </h4>
              <ul className="mt-5 space-y-4 text-sm text-steel">
                <li className="flex gap-3">
                  <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-gold/70" strokeWidth={1.5} />
                  <span>Jhelum, Pakistan</span>
                </li>
                <li className="flex gap-3">
                  <Phone className="mt-0.5 h-4 w-4 shrink-0 text-gold/70" strokeWidth={1.5} />
                  <a href="tel:+923089453764">+92 308 9453764</a>
                </li>
                <li className="flex gap-3">
                  <Mail className="mt-0.5 h-4 w-4 shrink-0 text-gold/70" strokeWidth={1.5} />
                  <span>care@thetiktime.com</span>
                </li>
                <li className="flex gap-3">
                  <Clock className="mt-0.5 h-4 w-4 shrink-0 text-gold/70" strokeWidth={1.5} />
                  <span>Mon — Sat · 10am to 8pm</span>
                </li>
              </ul>
            </motion.div>
          </div>
        </div>

        <div className="mt-14 hairline" />

        <div className="mt-6 flex flex-col items-center justify-between gap-4 text-center sm:flex-row sm:text-left">
          <p className="font-mono-label text-[10px] tracking-[0.2em] text-steel">
            © {new Date().getFullYear()} THE TIK TIME — ALL RIGHTS RESERVED
          </p>
          <p className="font-mono-label text-[10px] tracking-[0.2em] text-steel">
            CASH ON DELIVERY · DELIVERED WITH CARE
          </p>
        </div>
      </div>
    </footer>
  );
}
