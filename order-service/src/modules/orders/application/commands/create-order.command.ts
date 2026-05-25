export interface OrderItemCommand {
  productId: string;
  quantity: number;
  price: number;
}

export interface PaymentCommand {
  method: string;
  amount: number;
}

export interface DeliveryCommand {
  method: string;
  addressId: string;
}

export interface CreateOrderCommand {
  customerId: string;
  items: OrderItemCommand[];
  payment: PaymentCommand;
  delivery: DeliveryCommand;
}
