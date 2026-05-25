import { Injectable } from '@nestjs/common';
import { InventoryReservedPayload } from '../../domain/types/inventory-reserved.payload';

@Injectable()
export class PaymentFailurePolicy {
  shouldSimulateFailure(data: InventoryReservedPayload): boolean {
    const byOrderId =
      process.env.FAIL_ORDER_ID &&
      process.env.FAIL_ORDER_ID === data.orderId;

    const failAmtRaw = process.env.FAIL_PAYMENT_AMOUNT;
    const byAmount =
      failAmtRaw !== undefined &&
      failAmtRaw !== '' &&
      typeof data.payment?.amount === 'number' &&
      data.payment.amount === Number(failAmtRaw);

    return Boolean(byOrderId || byAmount);
  }
}
