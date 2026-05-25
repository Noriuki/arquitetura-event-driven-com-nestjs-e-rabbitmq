export type OrderCreatedPayload = {
  orderId: string;
  items: { productId: string; quantity: number }[];
  customerId?: string;
  payment?: unknown;
  delivery?: unknown;
};

export type StockRevertedPayload = {
  orderId: string;
  items: { productId: string; quantity: number }[];
};

export function isOrderCreated(data: unknown): data is OrderCreatedPayload {
  if (typeof data !== 'object' || data === null) return false;
  const d = data as Record<string, unknown>;
  return (
    typeof d.orderId === 'string' &&
    Array.isArray(d.items) &&
    d.items.every(
      (i) =>
        typeof i === 'object' &&
        i !== null &&
        typeof (i as { productId: unknown }).productId === 'string' &&
        typeof (i as { quantity: unknown }).quantity === 'number',
    )
  );
}

export function isStockReverted(data: unknown): data is StockRevertedPayload {
  if (typeof data !== 'object' || data === null) return false;
  const d = data as Record<string, unknown>;
  return (
    typeof d.orderId === 'string' &&
    Array.isArray(d.items) &&
    d.items.every(
      (i) =>
        typeof i === 'object' &&
        i !== null &&
        typeof (i as { productId: unknown }).productId === 'string' &&
        typeof (i as { quantity: unknown }).quantity === 'number',
    )
  );
}
