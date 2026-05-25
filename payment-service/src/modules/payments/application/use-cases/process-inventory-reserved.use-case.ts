import { Inject, Injectable, Logger } from '@nestjs/common';
import { isInventoryReserved } from '../../domain/types/inventory-reserved.payload';
import { PAYMENT_EVENTS_PUBLISHER } from '../ports/payment-events.publisher.port';
import type { PaymentEventsPublisher } from '../ports/payment-events.publisher.port';
import { PAYMENT_REPOSITORY } from '../ports/payment.repository.port';
import type { PaymentRepository } from '../ports/payment.repository.port';
import { PaymentFailurePolicy } from '../services/payment-failure.policy';

const PROCESSING_DELAY_MS = 400;

@Injectable()
export class ProcessInventoryReservedUseCase {
  private readonly log = new Logger(ProcessInventoryReservedUseCase.name);

  constructor(
    @Inject(PAYMENT_REPOSITORY)
    private readonly payments: PaymentRepository,
    @Inject(PAYMENT_EVENTS_PUBLISHER)
    private readonly events: PaymentEventsPublisher,
    private readonly failurePolicy: PaymentFailurePolicy,
  ) {}

  async execute(data: unknown): Promise<void> {
    if (!isInventoryReserved(data)) {
      throw new Error('Invalid inventory.reserved payload');
    }

    const { orderId, items } = data;

    const existing = await this.payments.findByOrderId(orderId);
    if (existing?.status === 'COMPLETED' || existing?.status === 'FAILED') {
      this.log.debug(`Idempotent skip for payment orderId=${orderId}`);
      return;
    }

    if (this.failurePolicy.shouldSimulateFailure(data)) {
      await this.payments.saveOutcome(orderId, 'FAILED');
      this.events.publishFailed(orderId, items, 'simulated_failure');
      return;
    }

    await new Promise((r) => setTimeout(r, PROCESSING_DELAY_MS));

    try {
      await this.payments.saveOutcome(orderId, 'COMPLETED');
      this.events.publishCompleted(orderId);
    } catch (e) {
      this.log.warn(`Charge failed ${String(e)}`);
      await this.payments.saveOutcome(orderId, 'FAILED');
      this.events.publishFailed(orderId, items, 'gateway_error');
    }
  }
}
