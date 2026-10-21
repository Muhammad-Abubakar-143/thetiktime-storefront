export const MEDUSA_BACKEND_URL =
  process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL || 'http://localhost:9000';

export const MEDUSA_PUBLISHABLE_KEY =
  process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY || '';

export const DEFAULT_REGION = process.env.NEXT_PUBLIC_DEFAULT_REGION || 'pk';

export const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || '';

const CART_COOKIE = 'thetiktime_cart_id';
const CART_ID_STORAGE_KEY = 'thetiktime_cart_id';

export function getCartId(): string | null {
  if (typeof document === 'undefined') return null;
  const match = document.cookie.match(
    new RegExp(`(?:^|; )${CART_COOKIE}=([^;]*)`)
  );
  if (match) return decodeURIComponent(match[1]);
  try {
    return localStorage.getItem(CART_ID_STORAGE_KEY);
  } catch {
    return null;
  }
}

export function setCartId(id: string) {
  if (typeof document === 'undefined') return;
  const expires = new Date();
  expires.setFullYear(expires.getFullYear() + 1);
  document.cookie = `${CART_COOKIE}=${encodeURIComponent(
    id
  )};expires=${expires.toUTCString()};path=/;samesite=lax`;
  try {
    localStorage.setItem(CART_ID_STORAGE_KEY, id);
  } catch {
    /* ignore */
  }
}

export function clearCartId() {
  if (typeof document === 'undefined') return;
  document.cookie = `${CART_COOKIE}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/`;
  try {
    localStorage.removeItem(CART_ID_STORAGE_KEY);
  } catch {
    /* ignore */
  }
}

function headers(extra?: Record<string, string>): HeadersInit {
  return {
    'Content-Type': 'application/json',
    'x-publishable-api-key': MEDUSA_PUBLISHABLE_KEY,
    ...extra,
  };
}

export interface RequestOptions {
  method?: string;
  body?: unknown;
  query?: Record<string, string | string[] | number | boolean | undefined>;
  cache?: RequestCache;
  next?: { revalidate?: number; tags?: string[] };
}

export async function medusaRequest<T>(
  path: string,
  options: RequestOptions = {}
): Promise<T> {
  const { method = 'GET', body, query, cache, next } = options;

  let url = `${MEDUSA_BACKEND_URL}${path.startsWith('/') ? path : `/${path}`}`;
  if (query) {
    const params = new URLSearchParams();
    for (const [key, value] of Object.entries(query)) {
      if (value === undefined || value === null) continue;
      if (Array.isArray(value)) {
        for (const v of value) params.append(key, String(v));
      } else {
        params.append(key, String(value));
      }
    }
    const qs = params.toString();
    if (qs) url += `?${qs}`;
  }

  const res = await fetch(url, {
    method,
    headers: body !== undefined ? headers() : { ...headers(), 'Content-Type': 'application/json' },
    body: body !== undefined ? JSON.stringify(body) : undefined,
    cache,
    next,
  });

  if (!res.ok) {
    let message = `Medusa request failed: ${res.status} ${res.statusText}`;
    try {
      const errData = await res.json();
      message = errData?.message || errData?.error || message;
    } catch {
      /* ignore */
    }
    throw new Error(message);
  }

  if (res.status === 204) return undefined as T;
  return res.json() as Promise<T>;
}
