import { PaymentOutcome } from '../../domain/entities/payment-record.entity';

export const PAYMENT_REPOSITORY = Symbol('PAYMENT_REPOSITORY');

export interface PaymentRepository {
  findByOrderId(orderId: string): Promise<{ status: PaymentOutcome } | null>;
  saveOutcome(orderId: string, status: PaymentOutcome): Promise<void>;
}
