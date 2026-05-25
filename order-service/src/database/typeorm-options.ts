import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { OrderEntity } from '../modules/orders/domain/entities/order.entity';
import { InitialSchema1735689600000 } from './migrations/1735689600000-InitialSchema';

export function getTypeOrmOptions(): TypeOrmModuleOptions {
  return {
    type: 'postgres',
    url: process.env.DATABASE_URL,
    entities: [OrderEntity],
    synchronize: false,
    migrations: [InitialSchema1735689600000],
    migrationsRun: process.env.TYPEORM_MIGRATIONS_RUN !== 'false',
  };
}
