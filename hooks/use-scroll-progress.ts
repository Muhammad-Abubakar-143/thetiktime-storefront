'use client';

import { useEffect, useRef } from 'react';

export type ScrollDirection = 'down' | 'up';

interface ScrollProgressOptions {
  onProgress?: (progress: number) => void;
}

export function useScrollProgress({ onProgress }: ScrollProgressOptions = {}) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el || !onProgress) return;
    const handler = () => {
      const rect = el.getBoundingClientRect();
      const viewport = window.innerHeight;
      const total = rect.height + viewport;
      const passed = viewport - rect.top;
      const progress = Math.max(0, Math.min(1, passed / total));
      onProgress(progress);
    };
    handler();
    window.addEventListener('scroll', handler, { passive: true });
    window.addEventListener('resize', handler);
    return () => {
      window.removeEventListener('scroll', handler);
      window.removeEventListener('resize', handler);
    };
  }, [onProgress]);
  return ref;
}
