import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { getTypeOrmOptions } from './database/typeorm-options';
import { InventoryModule } from './modules/inventory/inventory.module';

@Module({
  imports: [TypeOrmModule.forRoot(getTypeOrmOptions()), InventoryModule],
})
export class AppModule {}
