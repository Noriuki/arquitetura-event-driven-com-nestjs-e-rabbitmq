import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { PaymentRecord } from '../modules/payments/domain/entities/payment-record.entity';
import { InitialSchema1735689600000 } from './migrations/1735689600000-InitialSchema';

export function getTypeOrmOptions(): TypeOrmModuleOptions {
  return {
    type: 'postgres',
    url: process.env.DATABASE_URL,
    entities: [PaymentRecord],
    synchronize: false,
    migrations: [InitialSchema1735689600000],
    migrationsRun: process.env.TYPEORM_MIGRATIONS_RUN !== 'false',
  };
}
