export const INVENTORY_EVENTS_PUBLISHER = Symbol('INVENTORY_EVENTS_PUBLISHER');

export interface InventoryEventsPublisher {
  publishInsufficient(orderId: string, reason: string): void;
  publishReserved(payload: {
    orderId: string;
    customerId?: string;
    items: { productId: string; quantity: number }[];
    payment?: unknown;
    delivery?: unknown;
  }): void;
}
