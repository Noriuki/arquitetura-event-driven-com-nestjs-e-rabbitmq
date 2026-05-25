import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe());

  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.RMQ,
    options: {
      urls: [process.env.RABBITMQ_URL ?? 'amqp://admin:admin@localhost:5672'],
      queue: process.env.ORDER_EVENTS_QUEUE ?? 'order_events_queue',
      exchange: process.env.RABBITMQ_EXCHANGE ?? 'order_exchange',
      exchangeType: 'topic',
      wildcards: true,
      queueOptions: {
        durable: true,
      },
      noAck: false,
      socketOptions: {
        heartbeatIntervalInSeconds: 60,
      },
    },
  });

  await app.startAllMicroservices();
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
