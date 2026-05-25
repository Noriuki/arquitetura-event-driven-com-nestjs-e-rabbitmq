import { Controller, Logger } from '@nestjs/common';
import { Ctx, EventPattern, Payload, RmqContext } from '@nestjs/microservices';
import { consumeWithAck } from 'src/shared/messaging/rmq-ack.helper';
import { ProcessInventoryReservedUseCase } from '../../application/use-cases/process-inventory-reserved.use-case';

@Controller()
export class PaymentEventsController {
  private readonly log = new Logger(PaymentEventsController.name);

  constructor(
    private readonly processReserved: ProcessInventoryReservedUseCase,
  ) {}

  @EventPattern('inventory.reserved')
  onInventoryReserved(@Payload() data: unknown, @Ctx() context: RmqContext) {
    return consumeWithAck(
      context,
      () => this.processReserved.execute(data),
      this.log,
    );
  }
}
