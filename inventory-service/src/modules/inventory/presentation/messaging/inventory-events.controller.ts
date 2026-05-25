import { Controller, Logger } from '@nestjs/common';
import { Ctx, EventPattern, Payload, RmqContext } from '@nestjs/microservices';
import { consumeWithAck } from 'src/shared/messaging/rmq-ack.helper';
import { ReserveStockOnOrderCreatedUseCase } from '../../application/use-cases/reserve-stock-on-order-created.use-case';
import { RevertStockUseCase } from '../../application/use-cases/revert-stock.use-case';

@Controller()
export class InventoryEventsController {
  private readonly log = new Logger(InventoryEventsController.name);

  constructor(
    private readonly reserveStock: ReserveStockOnOrderCreatedUseCase,
    private readonly revertStock: RevertStockUseCase,
  ) {}

  @EventPattern('order.created')
  onOrderCreated(@Payload() data: unknown, @Ctx() context: RmqContext) {
    return consumeWithAck(
      context,
      () => this.reserveStock.execute(data),
      this.log,
    );
  }

  @EventPattern('inventory.stock_reverted')
  onStockReverted(@Payload() data: unknown, @Ctx() context: RmqContext) {
    return consumeWithAck(
      context,
      () => this.revertStock.execute(data),
      this.log,
    );
  }
}
