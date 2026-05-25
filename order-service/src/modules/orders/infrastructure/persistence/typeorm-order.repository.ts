import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateOrderCommand } from '../../application/commands/create-order.command';
import { OrderRepository } from '../../application/ports/order.repository.port';
import { OrderEntity } from '../../domain/entities/order.entity';
import { OrderStatus } from '../../domain/enums/order-status.enum';

@Injectable()
export class TypeOrmOrderRepository implements OrderRepository {
  constructor(
    @InjectRepository(OrderEntity)
    private readonly repo: Repository<OrderEntity>,
  ) {}

  findAll(): Promise<OrderEntity[]> {
    return this.repo.find({ order: { createdAt: 'DESC' } });
  }

  findById(id: string): Promise<OrderEntity | null> {
    return this.repo.findOne({ where: { id } });
  }

  async createPending(command: CreateOrderCommand): Promise<OrderEntity> {
    const order = this.repo.create({
      status: OrderStatus.PENDING,
      customerId: command.customerId,
      payload: command as unknown as Record<string, unknown>,
    });
    return this.repo.save(order);
  }

  async transitionFromPending(id: string, next: OrderStatus): Promise<number> {
    const res = await this.repo.update(
      { id, status: OrderStatus.PENDING },
      { status: next },
    );
    return res.affected ?? 0;
  }
}
