export type InventoryReservedPayload = {
  orderId: string;
  items: { productId: string; quantity: number }[];
  payment?: { amount?: number; method?: string };
};

export function isInventoryReserved(
  data: unknown,
): data is InventoryReservedPayload {
  if (typeof data !== 'object' || data === null) return false;
  const d = data as Record<string, unknown>;
  return typeof d.orderId === 'string' && Array.isArray(d.items);
}
