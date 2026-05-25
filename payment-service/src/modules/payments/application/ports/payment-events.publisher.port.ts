export const PAYMENT_EVENTS_PUBLISHER = Symbol('PAYMENT_EVENTS_PUBLISHER');

export interface PaymentEventsPublisher {
  publishCompleted(orderId: string): void;
  publishFailed(
    orderId: string,
    items: { productId: string; quantity: number }[],
    reason: string,
  ): void;
}
