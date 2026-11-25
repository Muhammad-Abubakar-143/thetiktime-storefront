/**
 * Hostinger Cart API Client
 * Client-side cart storage for Hostinger products
 */

const CART_API_BASE = 'https://zesty-rosybrown-curlew-26.hostingersite.com/api/index.php';

export interface CartItemData {
  product_id: number;
  variant_id: number;
  quantity: number;
  title: string;
  price: number;
  thumbnail?: string;
}

export interface CartData {
  id: string;
  items: CartItemData[];
  subtotal: number;
  total: number;
  currency_code: string;
}

/**
 * Get cart from local storage
 */
export function getCartFromStorage(): CartData | null {
  if (typeof localStorage === 'undefined') return null;
  try {
    const stored = localStorage.getItem('hostinger_cart');
    return stored ? JSON.parse(stored) : null;
  } catch {
    return null;
  }
}

/**
 * Save cart to local storage
 */
export function saveCartToStorage(cart: CartData): void {
  if (typeof localStorage === 'undefined') return;
  try {
    localStorage.setItem('hostinger_cart', JSON.stringify(cart));
  } catch {
    // quota exceeded or private mode
  }
}

/**
 * Generate a unique cart ID
 */
export function generateCartId(): string {
  return `cart-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

/**
 * Create a new empty cart
 */
export function createCart(currencyCode = 'pkr'): CartData {
  return {
    id: generateCartId(),
    items: [],
    subtotal: 0,
    total: 0,
    currency_code: currencyCode,
  };
}

/**
 * Get or create cart
 */
export function getOrCreateCart(): CartData {
  let cart = getCartFromStorage();
  if (!cart) {
    cart = createCart();
    saveCartToStorage(cart);
  }
  return cart;
}

/**
 * Add item to cart
 */
export function addToCart(
  productId: number,
  variantId: number,
  quantity: number,
  title: string,
  price: number,
  thumbnail?: string
): CartData {
  const cart = getOrCreateCart();

  // Check if item already exists
  const existingIndex = cart.items.findIndex(
    (item) => item.product_id === productId && item.variant_id === variantId
  );

  if (existingIndex >= 0) {
    // Update quantity
    cart.items[existingIndex].quantity += quantity;
  } else {
    // Add new item
    cart.items.push({
      product_id: productId,
      variant_id: variantId,
      quantity,
      title,
      price,
      thumbnail,
    });
  }

  recalculateCart(cart);
  saveCartToStorage(cart);
  return cart;
}

/**
 * Remove item from cart
 */
export function removeFromCart(productId: number, variantId: number): CartData {
  const cart = getOrCreateCart();
  cart.items = cart.items.filter(
    (item) => !(item.product_id === productId && item.variant_id === variantId)
  );
  recalculateCart(cart);
  saveCartToStorage(cart);
  return cart;
}

/**
 * Update item quantity
 */
export function updateQuantity(
  productId: number,
  variantId: number,
  quantity: number
): CartData {
  const cart = getOrCreateCart();
  const item = cart.items.find(
    (i) => i.product_id === productId && i.variant_id === variantId
  );

  if (item) {
    if (quantity <= 0) {
      return removeFromCart(productId, variantId);
    }
    item.quantity = quantity;
    recalculateCart(cart);
    saveCartToStorage(cart);
  }

  return cart;
}

/**
 * Recalculate cart totals
 */
export function recalculateCart(cart: CartData): void {
  cart.subtotal = cart.items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  cart.total = cart.subtotal;
  // Note: tax, shipping, discounts would be added here if needed
}

/**
 * Clear cart
 */
export function clearCart(): CartData {
  const cart = createCart();
  saveCartToStorage(cart);
  return cart;
}

/**
 * Get cart item count
 */
export function getCartItemCount(): number {
  const cart = getOrCreateCart();
  return cart.items.reduce((sum, item) => sum + item.quantity, 0);
}

/**
 * Convert cart to Hostinger order format
 */
export function cartToOrderItems(
  cart: CartData
): Array<{ product_id: number; variant_id: number; quantity: number }> {
  return cart.items.map((item) => ({
    product_id: item.product_id,
    variant_id: item.variant_id,
    quantity: item.quantity,
  }));
}
