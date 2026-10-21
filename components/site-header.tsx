'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, ShoppingBag, Search, X } from 'lucide-react';
import { useCart } from '@/hooks/use-cart';
import { cn } from '@/lib/utils';

const NAV_LINKS = [
  { href: '/', label: 'Home' },
  { href: '/shop', label: 'Collection' },
  { href: '/store', label: 'Store' },
  { href: '/brands', label: 'Brands' },
  { href: '/our-story', label: 'Our Story' },
  { href: '/contact', label: 'Contact' },
];

export function SiteHeader() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const { itemCount, openCart } = useCart();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  return (
    <>
      <motion.header
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1], delay: 0.2 }}
        className={cn(
          'fixed inset-x-0 top-0 z-50 transition-all duration-700',
          scrolled
            ? 'glass-panel border-b border-[hsl(var(--gold)/0.12)] py-3'
            : 'border-b border-transparent py-5'
        )}
      >
        <div className="mx-auto flex max-w-7xl items-center justify-between px-5 sm:px-8">
          <button
            className="flex items-center text-champagne lg:hidden"
            onClick={() => setMenuOpen(true)}
            aria-label="Open menu"
          >
            <Menu className="h-5 w-5" strokeWidth={1.5} />
          </button>

          <Link
            href="/"
            className=""
            aria-label="TheTikTime home"
          >
            <span className="block font-serif-display text-xl font-medium tracking-[0.3em] text-champagne sm:text-2xl">
              THE TIK TIME
            </span>
          </Link>

          <div className='flex gap-9'>
          <nav className="hidden items-center gap-9 lg:flex">
            {NAV_LINKS.slice(0, 3).map((link) => (
              <NavLink
                key={link.href}
                href={link.href}
                label={link.label}
                active={isActive(pathname, link.href)}
              />
            ))}
          </nav>

          <nav className="hidden items-center gap-9 lg:flex">
            {NAV_LINKS.slice(3).map((link) => (
              <NavLink
                key={link.href}
                href={link.href}
                label={link.label}
                active={isActive(pathname, link.href)}
              />
            ))}
          </nav>
           </div>

          <div className="flex items-center gap-4">
            <Link
              href="/shop"
              className="hidden text-gray-400 transition-colors hover:text-champagne sm:block"
              aria-label="Search"
            >
              <Search className="h-[18px] w-[18px]" strokeWidth={1.5} />
            </Link>
            <button
              onClick={openCart}
              className="relative text-champagne transition-transform hover:scale-105"
              aria-label="Open cart"
            >
              <ShoppingBag className="h-[18px] w-[18px]" strokeWidth={1.5} />
              <AnimatePresence>
                {itemCount > 0 && (
                  <motion.span
                    key={itemCount}
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0, opacity: 0 }}
                    className="absolute -right-2 -top-2 flex h-4 min-w-4 items-center justify-center rounded-full bg-gold px-1 font-mono-label text-[9px] font-medium text-black"
                  >
                    {itemCount}
                  </motion.span>
                )}
              </AnimatePresence>
            </button>
          </div>
        </div>
      </motion.header>

      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[60] lg:hidden"
          >
            <div
              className="absolute inset-0 bg-black/70 backdrop-blur-sm"
              onClick={() => setMenuOpen(false)}
            />
            <motion.div
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
              className="absolute left-0 top-0 flex h-full w-[82%] max-w-sm flex-col bg-[hsl(0_0%_5%)] px-7 py-8"
            >
              <div className="flex items-center justify-between">
                <span className="font-serif-display text-lg tracking-[0.3em] text-champagne">
                  MENU
                </span>
                <button
                  onClick={() => setMenuOpen(false)}
                  aria-label="Close menu"
                  className="text-gray-400 hover:text-champagne"
                >
                  <X className="h-5 w-5" strokeWidth={1.5} />
                </button>
              </div>
              <div className="my-8 hairline" />
              <nav className="flex flex-col gap-1">
                {NAV_LINKS.map((link, i) => (
                  <motion.div
                    key={link.href}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 + i * 0.06 }}
                  >
                    <Link
                      href={link.href}
                      className={cn(
                        'block py-3 font-serif-display text-2xl tracking-wide transition-colors',
                        isActive(pathname, link.href)
                          ? 'text-gold'
                          : 'text-champagne hover:text-gold'
                      )}
                    >
                      {link.label}
                    </Link>
                  </motion.div>
                ))}
              </nav>
              <div className="mt-auto">
                <div className="hairline mb-6" />
                <p className="font-mono-label text-[10px] tracking-[0.3em] text-gray-400">
                  CASH ON DELIVERY · PAKISTAN
                </p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

function NavLink({
  href,
  label,
  active,
}: {
  href: string;
  label: string;
  active: boolean;
}) {
  return (
    <Link
      href={href}
      className={cn(
        'group relative font-mono-label text-[11px] uppercase tracking-[0.25em] transition-colors duration-300',
        active ? 'text-gold' : 'text-gray-400 hover:text-champagne'
      )}
    >
      {label}
      <span
        className={cn(
          'absolute -bottom-1.5 left-0 h-px bg-gold transition-all duration-500 ease-luxe',
          active ? 'w-full' : 'w-0 group-hover:w-full'
        )}
      />
    </Link>
  );
}

function isActive(pathname: string, href: string) {
  if (href === '/') return pathname === '/';
  return pathname === href || pathname.startsWith(`${href}/`);
}
