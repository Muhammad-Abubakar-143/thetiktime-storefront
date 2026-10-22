'use client';

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import {
  addToCart as apiAddToCart,
  completeCart as apiCompleteCart,
  createCart as apiCreateCart,
  deleteLineItem as apiDeleteLineItem,
  getCart as apiGetCart,
  getOrCreateCart,
  initPaymentSessions as apiInitPaymentSessions,
  addShippingMethod as apiAddShippingMethod,
  updateCartEmail as apiUpdateCartEmail,
  updateCartShippingAddress as apiUpdateShippingAddress,
  updateLineItem as apiUpdateLineItem,
  listShippingOptions as apiListShippingOptions,
  type Address,
  type Cart,
  type Order,
  type Region,
} from '@/lib/medusa';
import { clearCartId, getCartId } from '@/lib/medusa-client';

interface CartContextValue {
  cart: Cart | null;
  region: Region | null;
  loading: boolean;
  ready: boolean;
  itemCount: number;
  openCart: () => void;
  closeCart: () => void;
  isCartOpen: boolean;
  addItem: (variantId: string, quantity?: number) => Promise<void>;
  removeItem: (lineId: string) => Promise<void>;
  setItemQuantity: (lineId: string, quantity: number) => Promise<void>;
  refreshCart: () => Promise<void>;
  ensureCart: () => Promise<Cart>;
  checkout: (checkoutInput: CheckoutInput) => Promise<Order>;
  initializeRegion: (region: Region) => void;
}

export interface CheckoutInput {
  email: string;
  shippingAddress: Address;
  shippingOptionId?: string;
}

const CartContext = createContext<CartContextValue | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [cart, setCart] = useState<Cart | null>(null);
  const [region, setRegion] = useState<Region | null>(null);
  const [loading, setLoading] = useState(false);
  const [ready, setReady] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);

  const initializeRegion = useCallback((nextRegion: Region) => {
    setRegion(nextRegion);
  }, []);

  const ensureCart = useCallback(async (): Promise<Cart> => {
    if (cart && !cart.email) return cart;
    if (!region) throw new Error('Region not loaded');
    const next = await getOrCreateCart(region.id);
    setCart(next);
    return next;
  }, [cart, region]);

  const refreshCart = useCallback(async () => {
    const id = getCartId();
    if (!id) return;
    try {
      const next = await apiGetCart(id);
      if (next) setCart(next);
    } catch {
      /* ignore */
    }
  }, []);

  const addItem = useCallback(
    async (variantId: string, quantity = 1) => {
      setLoading(true);
      try {
        const current = await ensureCart();
        const next = await apiAddToCart(current.id, variantId, quantity);
        setCart(next);
        setIsCartOpen(true);
      } finally {
        setLoading(false);
      }
    },
    [ensureCart]
  );

  const removeItem = useCallback(
    async (lineId: string) => {
      if (!cart) return;
      setLoading(true);
      try {
        const next = await apiDeleteLineItem(cart.id, lineId);
        setCart(next);
      } finally {
        setLoading(false);
      }
    },
    [cart]
  );

  const setItemQuantity = useCallback(
    async (lineId: string, quantity: number) => {
      if (!cart) return;
      if (quantity <= 0) {
        await removeItem(lineId);
        return;
      }
      setLoading(true);
      try {
        const next = await apiUpdateLineItem(cart.id, lineId, quantity);
        setCart(next);
      } finally {
        setLoading(false);
      }
    },
    [cart, removeItem]
  );

  const checkout = useCallback(
    async (input: CheckoutInput): Promise<Order> => {
      if (!cart) throw new Error('No cart to checkout');
      let working = await apiUpdateCartEmail(cart.id, input.email);
      setCart(working);
      working = await apiUpdateShippingAddress(cart.id, input.shippingAddress);
      setCart(working);

      const options = await apiListShippingOptions(working.id);
      if (options.length === 0 && !working.shipping_methods?.length) {
        throw new Error(
          'No shipping options are available for this delivery address. Please contact us to complete your order.'
        );
      }
      if (options.length && !working.shipping_methods?.length) {
        const option =
          options.find((o) => o.id === input.shippingOptionId) ?? options[0];
        working = await apiAddShippingMethod(working.id, option.id);
        setCart(working);
      }

      await apiInitPaymentSessions(working.id);
      const order = await apiCompleteCart(working.id);
      clearCartId();
      setCart(null);
      return order;
    },
    [cart]
  );

  useEffect(() => {
    if (!region) return;
    let cancelled = false;
    (async () => {
      const id = getCartId();
      if (id) {
        const existing = await apiGetCart(id);
        if (existing && !cancelled) {
          setCart(existing);
          setReady(true);
          return;
        }
      }
      if (cancelled) return;
      setReady(true);
    })();
    return () => {
      cancelled = true;
    };
  }, [region]);

  const itemCount = useMemo(
    () => cart?.items?.reduce((acc, item) => acc + item.quantity, 0) ?? 0,
    [cart]
  );

  const value: CartContextValue = {
    cart,
    region,
    loading,
    ready,
    itemCount,
    openCart: () => setIsCartOpen(true),
    closeCart: () => setIsCartOpen(false),
    isCartOpen,
    addItem,
    removeItem,
    setItemQuantity,
    refreshCart,
    ensureCart,
    checkout,
    initializeRegion,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart(): CartContextValue {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used within CartProvider');
  return ctx;
}
