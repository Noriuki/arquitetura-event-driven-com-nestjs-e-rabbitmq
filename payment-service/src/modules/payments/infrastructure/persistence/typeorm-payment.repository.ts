import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PaymentRepository } from '../../application/ports/payment.repository.port';
import {
  PaymentOutcome,
  PaymentRecord,
} from '../../domain/entities/payment-record.entity';

@Injectable()
export class TypeOrmPaymentRepository implements PaymentRepository {
  constructor(
    @InjectRepository(PaymentRecord)
    private readonly repo: Repository<PaymentRecord>,
  ) {}

  async findByOrderId(
    orderId: string,
  ): Promise<{ status: PaymentOutcome } | null> {
    const row = await this.repo.findOne({ where: { orderId } });
    return row ? { status: row.status } : null;
  }

  async saveOutcome(orderId: string, status: PaymentOutcome): Promise<void> {
    await this.repo.manager.transaction(async (em) => {
      const row = await em.findOne(PaymentRecord, { where: { orderId } });
      if (row) {
        row.status = status;
        await em.save(row);
        return;
      }
      await em.save(em.create(PaymentRecord, { orderId, status }));
    });
  }
}
