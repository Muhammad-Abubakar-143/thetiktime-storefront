import './globals.css';
import type { Metadata } from 'next';
import { Cormorant_Garamond, Inter, JetBrains_Mono } from 'next/font/google';
import { Providers } from '@/components/providers';
import { SiteHeader } from '@/components/site-header';
import { SiteFooter } from '@/components/site-footer';
import { CartDrawer } from '@/components/cart/cart-drawer';
import { RegionBootstrap } from '@/components/region-bootstrap';
import { PageTransition } from '@/components/page-transition';
import { SmoothScroll } from '@/components/smooth-scroll';

const display = Cormorant_Garamond({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  variable: '--font-display',
  display: 'swap',
});

const body = Inter({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600'],
  variable: '--font-body',
  display: 'swap',
});

const mono = JetBrains_Mono({
  subsets: ['latin'],
  weight: ['400', '500'],
  variable: '--font-mono',
  display: 'swap',
});

export const metadata: Metadata = {
  title: {
    default: 'TheTikTime — Luxury Wristwatches',
    template: '%s — TheTikTime',
  },
  description:
    'TheTikTime is a curated house of luxury wristwatches. Discover timeless craftsmanship, iconic brands, and rare timepieces — delivered across Pakistan with Cash on Delivery.',
  keywords: [
    'luxury watches',
    'wristwatches',
    'TheTikTime',
    'automatic watches',
    'Pakistan watches',
    'cash on delivery watches',
  ],
  openGraph: {
    title: 'TheTikTime — Luxury Wristwatches',
    description:
      'A curated house of luxury wristwatches. Timeless craftsmanship, iconic brands, rare timepieces.',
    type: 'website',
    url: 'https://thetiktime.com',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'TheTikTime — Luxury Wristwatches',
    description:
      'A curated house of luxury wristwatches. Timeless craftsmanship, iconic brands, rare timepieces.',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${display.variable} ${body.variable} ${mono.variable} dark`}
      suppressHydrationWarning
    >
      <body className="font-sans-body bg-background text-foreground antialiased">
        <Providers>
          <RegionBootstrap />
          <SmoothScroll />
          <div className="relative flex min-h-screen flex-col">
            <SiteHeader />
            <PageTransition>
              <main className="flex-1">{children}</main>
            </PageTransition>
            <SiteFooter />
          </div>
          <CartDrawer />
        </Providers>
      </body>
    </html>
  );
}
