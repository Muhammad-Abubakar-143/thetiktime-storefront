const ORDERS_URL = '/api/order';

export interface OrderItem {
  product_id: number;
  variant_id: number;
  quantity: number;
}

export interface CreateOrderPayload {
  customer_name: string;
  phone: string;
  email: string;
  address: string;
  city: string;
  notes?: string;
  items: OrderItem[];
}

export interface OrderResponse {
  success?: boolean;
  message?: string;
  order_id?: number;
  order_number?: string;
  total?: number;
  shipping?: number;
  currency?: string;
  payment_method?: string;
  error?: string;
}

export interface PlacedOrder {
  orderNumber: string;
  total: number;
}

export async function createOrder(payload: CreateOrderPayload): Promise<OrderResponse> {
  const response = await fetch(ORDERS_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    let errorMessage = `Order request failed: ${response.status} ${response.statusText}`;
    try {
      const errorData = await response.json();
      errorMessage = errorData?.message || errorData?.error || errorMessage;
    } catch {
      /* ignore */
    }
    throw new Error(errorMessage);
  }

  const data: OrderResponse = await response.json();
  if (
    data.success === false ||
    (data.success !== true && !data.order_number && !data.order_id)
  ) {
    throw new Error(data.message || data.error || 'Failed to create order');
  }

  return data;
}

export interface OrderInput {
  customer_name: string;
  phone: string;
  email: string;
  address_1: string;
  address_2?: string;
  city: string;
  province?: string;
  postal_code?: string;
  notes?: string;
  items: OrderItem[];
}

export function buildOrderPayload(input: OrderInput): CreateOrderPayload {
  const address = [
    input.address_1,
    input.address_2,
    input.province,
    input.postal_code,
  ]
    .filter(Boolean)
    .join(', ');

  return {
    customer_name: input.customer_name,
    phone: input.phone,
    email: input.email,
    address,
    city: input.city,
    notes: input.notes || '',
    items: input.items,
  };
}
