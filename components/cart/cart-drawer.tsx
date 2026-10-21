'use client';

import { AnimatePresence, motion } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';
import { Minus, Plus, ShoppingBag, Trash2, X } from 'lucide-react';
import { useCart } from '@/hooks/use-cart';
import { formatPrice, getMinVariant, getProductImages } from '@/lib/format';
import { useEffect } from 'react';

export function CartDrawer() {
  const {
    cart,
    isCartOpen,
    closeCart,
    itemCount,
    loading,
    setItemQuantity,
    removeItem,
  } = useCart();

  useEffect(() => {
    document.body.style.overflow = isCartOpen ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [isCartOpen]);

  const subtotal = cart?.subtotal ?? 0;
  const currency = cart?.currency_code ?? 'pkr';

  return (
    <AnimatePresence>
      {isCartOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[70]"
        >
          <div
            className="absolute inset-0 bg-black/70 backdrop-blur-sm"
            onClick={closeCart}
          />
          <motion.aside
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            className="absolute right-0 top-0 flex h-full w-full max-w-md flex-col bg-[hsl(0_0%_5%)]"
          >
            <div className="flex items-center justify-between border-b border-[hsl(var(--gold)/0.12)] px-6 py-5">
              <div className="flex items-center gap-3">
                <ShoppingBag className="h-4 w-4 text-gold" strokeWidth={1.5} />
                <span className="font-mono-label text-[11px] uppercase tracking-[0.3em] text-champagne">
                  Your Cart
                </span>
                {itemCount > 0 && (
                  <span className="font-mono-label text-[10px] text-steel">
                    ({itemCount})
                  </span>
                )}
              </div>
              <button
                onClick={closeCart}
                aria-label="Close cart"
                className="text-steel transition-colors hover:text-champagne"
              >
                <X className="h-5 w-5" strokeWidth={1.5} />
              </button>
            </div>

            {(!cart?.items || cart.items.length === 0) ? (
              <div className="flex flex-1 flex-col items-center justify-center gap-5 px-6 text-center">
                <div className="flex h-20 w-20 items-center justify-center rounded-full border border-[hsl(var(--gold)/0.15)]">
                  <ShoppingBag className="h-8 w-8 text-gold/50" strokeWidth={1} />
                </div>
                <div>
                  <p className="font-serif-display text-xl text-champagne">
                    Your cart awaits
                  </p>
                  <p className="mt-2 text-sm text-steel">
                    Discover timepieces worthy of your collection.
                  </p>
                </div>
                <Link
                  href="/shop"
                  onClick={closeCart}
                  className="btn-luxe-gold mt-2"
                >
                  Explore Collection
                </Link>
              </div>
            ) : (
              <>
                <div className="scrollbar-hidden flex-1 overflow-y-auto px-6 py-5">
                  <ul className="space-y-5">
                    {cart.items.map((item) => {
                      const img =
                        item.thumbnail ||
                        item.product?.thumbnail ||
                        getProductImages(item.product)[0] ||
                        '/images/placeholder-watch.svg';
                      return (
                        <li
                          key={item.id}
                          className="flex gap-4"
                        >
                          <Link
                            href={`/products/${item.product?.handle ?? ''}`}
                            onClick={closeCart}
                            className="relative h-24 w-20 shrink-0 overflow-hidden rounded-md border border-[hsl(var(--gold)/0.1)] bg-[hsl(0_0%_8%)]"
                          >
                            <Image
                              src={img}
                              alt={item.product?.title ?? 'Watch'}
                              fill
                              sizes="80px"
                              className="object-cover"
                            />
                          </Link>
                          <div className="flex flex-1 flex-col">
                            <div className="flex items-start justify-between gap-2">
                              <div>
                                <Link
                                  href={`/products/${item.product?.handle ?? ''}`}
                                  onClick={closeCart}
                                  className="font-serif-display text-base leading-tight text-champagne hover:text-gold"
                                >
                                  {item.product?.title ?? item.title}
                                </Link>
                                {item.variant?.title &&
                                  item.variant.title !== 'Default Title' && (
                                    <p className="mt-0.5 text-xs text-steel">
                                      {item.variant.title}
                                    </p>
                                  )}
                              </div>
                              <button
                                onClick={() => removeItem(item.id)}
                                aria-label="Remove item"
                                className="text-steel transition-colors hover:text-destructive"
                              >
                                <Trash2 className="h-4 w-4" strokeWidth={1.5} />
                              </button>
                            </div>
                            <div className="mt-auto flex items-center justify-between pt-3">
                              <div className="flex items-center border border-[hsl(var(--gold)/0.18)]">
                                <button
                                  onClick={() =>
                                    setItemQuantity(item.id, item.quantity - 1)
                                  }
                                  disabled={loading}
                                  aria-label="Decrease quantity"
                                  className="flex h-7 w-7 items-center justify-center text-steel hover:text-gold disabled:opacity-40"
                                >
                                  <Minus className="h-3 w-3" strokeWidth={2} />
                                </button>
                                <span className="w-8 text-center font-mono-label text-xs text-champagne">
                                  {item.quantity}
                                </span>
                                <button
                                  onClick={() =>
                                    setItemQuantity(item.id, item.quantity + 1)
                                  }
                                  disabled={loading}
                                  aria-label="Increase quantity"
                                  className="flex h-7 w-7 items-center justify-center text-steel hover:text-gold disabled:opacity-40"
                                >
                                  <Plus className="h-3 w-3" strokeWidth={2} />
                                </button>
                              </div>
                              <span className="font-mono-label text-sm text-gold">
                                {formatPrice(item.total, currency)}
                              </span>
                            </div>
                          </div>
                        </li>
                      );
                    })}
                  </ul>
                </div>

                <div className="border-t border-[hsl(var(--gold)/0.12)] px-6 py-5">
                  <div className="flex items-center justify-between">
                    <span className="font-mono-label text-[11px] uppercase tracking-[0.25em] text-steel">
                      Subtotal
                    </span>
                    <span className="font-serif-display text-xl text-champagne">
                      {formatPrice(subtotal, currency)}
                    </span>
                  </div>
                  <p className="mt-2 font-mono-label text-[10px] tracking-[0.15em] text-steel">
                    CASH ON DELIVERY · SHIPPING CALCULATED AT CHECKOUT
                  </p>
                  <Link
                    href="/checkout"
                    onClick={closeCart}
                    className="btn-luxe-gold mt-4 w-full"
                  >
                    Proceed to Checkout
                  </Link>
                  <button
                    onClick={closeCart}
                    className="mt-3 w-full text-center font-mono-label text-[10px] uppercase tracking-[0.25em] text-steel transition-colors hover:text-champagne"
                  >
                    Continue Browsing
                  </button>
                </div>
              </>
            )}
          </motion.aside>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
