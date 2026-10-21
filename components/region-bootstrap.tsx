'use client';

import { useEffect } from 'react';
import { useCart } from '@/hooks/use-cart';
import { getDefaultRegion } from '@/lib/medusa';

export function RegionBootstrap() {
  const { initializeRegion } = useCart();

  useEffect(() => {
    let cancelled = false;
    getDefaultRegion()
      .then((region) => {
        if (!cancelled) initializeRegion(region);
      })
      .catch((err) => {
        console.warn('Failed to load region:', err);
      });
    return () => {
      cancelled = true;
    };
  }, [initializeRegion]);

  return null;
}
