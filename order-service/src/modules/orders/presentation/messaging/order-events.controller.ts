import { Controller, Logger } from '@nestjs/common';
import { Ctx, EventPattern, Payload, RmqContext } from '@nestjs/microservices';
import { consumeWithAck } from 'src/shared/messaging/rmq-ack.helper';
import { HandleInventoryInsufficientUseCase } from '../../application/use-cases/handle-inventory-insufficient.use-case';
import { HandlePaymentCompletedUseCase } from '../../application/use-cases/handle-payment-completed.use-case';
import { HandlePaymentFailedUseCase } from '../../application/use-cases/handle-payment-failed.use-case';

@Controller()
export class OrderEventsController {
  private readonly log = new Logger(OrderEventsController.name);

  constructor(
    private readonly inventoryInsufficient: HandleInventoryInsufficientUseCase,
    private readonly paymentCompleted: HandlePaymentCompletedUseCase,
    private readonly paymentFailed: HandlePaymentFailedUseCase,
  ) {}

  @EventPattern('inventory.insufficient')
  onInventoryInsufficient(
    @Payload() data: unknown,
    @Ctx() context: RmqContext,
  ) {
    return consumeWithAck(
      context,
      () => this.inventoryInsufficient.execute(data),
      this.log,
    );
  }

  @EventPattern('payment.completed')
  onPaymentCompleted(@Payload() data: unknown, @Ctx() context: RmqContext) {
    return consumeWithAck(
      context,
      () => this.paymentCompleted.execute(data),
      this.log,
    );
  }

  @EventPattern('payment.failed')
  onPaymentFailed(@Payload() data: unknown, @Ctx() context: RmqContext) {
    return consumeWithAck(
      context,
      () => this.paymentFailed.execute(data),
      this.log,
    );
  }
}
