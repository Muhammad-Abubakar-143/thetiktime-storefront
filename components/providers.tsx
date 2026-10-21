'use client';

import { CartProvider } from '@/hooks/use-cart';
import { Toaster } from '@/components/ui/sonner';

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <CartProvider>
      {children}
      <Toaster
        position="bottom-right"
        toastOptions={{
          classNames: {
            toast:
              'bg-[hsl(0_0%_8%)] border border-[hsl(var(--gold)/0.2)] text-champagne',
            description: 'text-gray-400',
          },
        }}
      />
    </CartProvider>
  );
}
