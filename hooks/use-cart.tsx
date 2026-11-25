'use client';

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import type { StorefrontRegion } from '@/lib/storefront-types';
import { createOrder, buildOrderPayload, type PlacedOrder } from '@/lib/orders';
import {
  getOrCreateCart,
  addToCart as hostingerAddToCart,
  removeFromCart,
  updateQuantity,
  clearCart,
  cartToOrderItems,
  type CartData,
} from '@/lib/hostinger-cart';

interface CartItem {
  id: string;
  quantity: number;
  product_id: string;
  variant_id: string;
  product?: { id: string; title: string; handle: string; thumbnail?: string | null };
  variant?: { id: string; title: string };
  unit_price: number;
  total: number;
  subtotal: number;
  title?: string;
  thumbnail?: string | null;
}

interface Cart {
  id: string;
  currency_code: string;
  items: CartItem[];
  total: number;
  subtotal: number;
  tax_total: number;
  discount_total: number;
  shipping_total: number;
}

interface CartContextValue {
  cart: Cart | null;
  region: StorefrontRegion;
  loading: boolean;
  ready: boolean;
  itemCount: number;
  openCart: () => void;
  closeCart: () => void;
  isCartOpen: boolean;
  addItem: (productId: number, variantId: number, quantity: number, title: string, price: number, thumbnail?: string) => Promise<void>;
  removeItem: (productId: number, variantId: number) => Promise<void>;
  setItemQuantity: (productId: number, variantId: number, quantity: number) => Promise<void>;
  refreshCart: () => Promise<void>;
  ensureCart: () => Promise<Cart>;
  checkout: (checkoutInput: CheckoutInput) => Promise<PlacedOrder>;
}

export interface CheckoutInput {
  email: string;
  firstName: string;
  lastName: string;
  phone: string;
  address1: string;
  address2?: string;
  city: string;
  province?: string;
  postalCode?: string;
  notes?: string;
}

const CartContext = createContext<CartContextValue | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [cart, setCart] = useState<Cart | null>(null);
  const region: StorefrontRegion = { currency_code: 'pkr' };
  const [loading, setLoading] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [ready, setReady] = useState(false);

  const toStoreCart = (hostingerCart: CartData): Cart => {
    return {
      id: hostingerCart.id,
      currency_code: hostingerCart.currency_code,
      items: hostingerCart.items.map((item) => ({
        id: `${item.product_id}-${item.variant_id}`,
        quantity: item.quantity,
        product_id: String(item.product_id),
        variant_id: String(item.variant_id),
        unit_price: item.price,
        total: item.price * item.quantity,
        subtotal: item.price * item.quantity,
        title: item.title,
        thumbnail: item.thumbnail,
        product: {
          id: String(item.product_id),
          title: item.title,
          handle: '',
          thumbnail: item.thumbnail,
        },
        variant: {
          id: String(item.variant_id),
          title: item.title,
        },
      })),
      total: hostingerCart.total,
      subtotal: hostingerCart.subtotal,
      tax_total: 0,
      discount_total: 0,
      shipping_total: 0,
    };
  };

  const ensureCart = useCallback(async (): Promise<Cart> => {
    const hostingerCart = getOrCreateCart();
    const storeCart = toStoreCart(hostingerCart);
    setCart(storeCart);
    return storeCart;
  }, []);

  const addItem = useCallback(
    async (productId: number, variantId: number, quantity: number, title: string, price: number, thumbnail?: string) => {
      setLoading(true);
      try {
        const hostingerCart = hostingerAddToCart(productId, variantId, quantity, title, price, thumbnail);
        const storeCart = toStoreCart(hostingerCart);
        setCart(storeCart);
        setIsCartOpen(true);
      } finally {
        setLoading(false);
      }
    },
    []
  );

  const removeItem = useCallback(
    async (productId: number, variantId: number) => {
      setLoading(true);
      try {
        const hostingerCart = removeFromCart(productId, variantId);
        const storeCart = toStoreCart(hostingerCart);
        setCart(storeCart);
      } finally {
        setLoading(false);
      }
    },
    []
  );

  const setItemQuantity = useCallback(
    async (productId: number, variantId: number, quantity: number) => {
      setLoading(true);
      try {
        if (quantity <= 0) {
          await removeItem(productId, variantId);
        } else {
          const hostingerCart = updateQuantity(productId, variantId, quantity);
          const storeCart = toStoreCart(hostingerCart);
          setCart(storeCart);
        }
      } finally {
        setLoading(false);
      }
    },
    [removeItem]
  );

  const refreshCart = useCallback(async () => {
    const hostingerCart = getOrCreateCart();
    const storeCart = toStoreCart(hostingerCart);
    setCart(storeCart);
  }, []);

  const checkout = useCallback(
    async (input: CheckoutInput): Promise<PlacedOrder> => {
      const hostingerCart = getOrCreateCart();
      
      if (!hostingerCart.items || hostingerCart.items.length === 0) {
        throw new Error('Your cart is empty');
      }

      const items = cartToOrderItems(hostingerCart);

      const payload = buildOrderPayload({
        customer_name: `${input.firstName} ${input.lastName}`,
        phone: input.phone,
        email: input.email,
        address_1: input.address1,
        address_2: input.address2,
        city: input.city,
        province: input.province,
        postal_code: input.postalCode,
        notes: input.notes,
        items,
      });

      const orderResult = await createOrder(payload);

      clearCart();
      setCart(null);

      return {
        orderNumber: String(orderResult.order_number ?? orderResult.order_id ?? ''),
        total: hostingerCart.total,
      };
    },
    []
  );

  useEffect(() => {
    const hostingerCart = getOrCreateCart();
    const storeCart = toStoreCart(hostingerCart);
    setCart(storeCart);
    setReady(true);
  }, []);

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
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart(): CartContextValue {
  const ctx = useContext(CartContext);
  if (!ctx) {
    throw new Error('useCart must be used within CartProvider');
  }
  return ctx;
}
