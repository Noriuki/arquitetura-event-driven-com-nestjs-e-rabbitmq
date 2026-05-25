import {
  Injectable,
  Logger,
  OnModuleDestroy,
  OnModuleInit,
} from '@nestjs/common';
import amqp, { Channel, ChannelModel } from 'amqplib';
import { InventoryEventsPublisher } from '../../application/ports/inventory-events.publisher.port';

@Injectable()
export class RabbitMqInventoryEventsPublisher
  implements InventoryEventsPublisher, OnModuleInit, OnModuleDestroy
{
  private readonly log = new Logger(RabbitMqInventoryEventsPublisher.name);
  private channel: Channel | null = null;
  private connection: ChannelModel | null = null;

  async onModuleInit() {
    const url = process.env.RABBITMQ_URL ?? 'amqp://admin:admin@localhost:5672';
    const exchange =
      process.env.RABBITMQ_EXCHANGE ?? process.env.EXCHANGE ?? 'order_exchange';

    this.connection = await amqp.connect(url);
    this.channel = await this.connection.createChannel();
    await this.channel.assertExchange(exchange, 'topic', { durable: true });
    this.log.log(`Publisher bound to exchange ${exchange}`);
  }

  async onModuleDestroy() {
    await this.channel?.close().catch(() => undefined);
    await this.connection?.close().catch(() => undefined);
  }

  publishInsufficient(orderId: string, reason: string): void {
    this.publish('inventory.insufficient', { orderId, reason });
  }

  publishReserved(payload: {
    orderId: string;
    customerId?: string;
    items: { productId: string; quantity: number }[];
    payment?: unknown;
    delivery?: unknown;
  }): void {
    this.publish('inventory.reserved', payload);
  }

  private publish(routingKey: string, payload: Record<string, unknown>) {
    const exchange =
      process.env.RABBITMQ_EXCHANGE ?? process.env.EXCHANGE ?? 'order_exchange';
    const body = JSON.stringify({ pattern: routingKey, data: payload });
    this.channel?.publish(exchange, routingKey, Buffer.from(body));
  }
}
