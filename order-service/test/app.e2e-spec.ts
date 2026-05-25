import { Module } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import request from 'supertest';
import { App } from 'supertest/types';
import { HealthModule } from './../src/health/health.module';
import { MESSAGING_HEALTH } from './../src/modules/orders/application/ports/messaging-health.port';
import { ORDER_EVENTS_PUBLISHER } from './../src/modules/orders/application/ports/order-events.publisher.port';
import { OrderEntity } from './../src/modules/orders/domain/entities/order.entity';
import { OrdersModule } from './../src/modules/orders/orders.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRoot({
      type: 'better-sqlite3',
      database: ':memory:',
      entities: [OrderEntity],
      synchronize: true,
    }),
    OrdersModule,
    HealthModule,
  ],
})
class OrderE2eModule {}

describe('Order API (e2e)', () => {
  let app: INestApplication<App>;

  beforeEach(async () => {
    const messagingMock = {
      publishOrderCreated: jest.fn(),
      onModuleInit: async () => {},
      isConnected: () => true,
    };

    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [OrderE2eModule],
    })
      .overrideProvider(ORDER_EVENTS_PUBLISHER)
      .useValue(messagingMock)
      .overrideProvider(MESSAGING_HEALTH)
      .useValue(messagingMock)
      .compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe());
    await app.init();
  });

  it('/health (GET)', () => {
    return request(app.getHttpServer())
      .get('/health')
      .expect(200)
      .expect((res) => {
        expect(res.body.status).toBe('ok');
        expect(res.body.service).toBe('order-service');
      });
  });

  it('/health/ready (GET)', () => {
    return request(app.getHttpServer())
      .get('/health/ready')
      .expect(200)
      .expect((res) => {
        expect(res.body.status).toBe('ok');
        expect(res.body.rabbitmq).toBe('connected');
      });
  });

  afterEach(async () => {
    await app.close();
  });
});
