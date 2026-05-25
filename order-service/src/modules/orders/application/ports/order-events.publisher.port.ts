import type { CreateOrderCommand } from '../commands/create-order.command';

export const ORDER_EVENTS_PUBLISHER = Symbol('ORDER_EVENTS_PUBLISHER');

export interface OrderCreatedEventPayload {
  orderId: string;
  customerId: string;
  items: CreateOrderCommand['items'];
  payment: CreateOrderCommand['payment'];
  delivery: CreateOrderCommand['delivery'];
}

export interface OrderEventsPublisher {
  publishOrderCreated(payload: OrderCreatedEventPayload): void;
}
