import { MigrationInterface, QueryRunner } from 'typeorm';

export class InitialSchema1735689600000 implements MigrationInterface {
  name = 'InitialSchema1735689600000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TABLE "stock_items" (
        "productId" uuid NOT NULL,
        "quantity" integer NOT NULL,
        CONSTRAINT "PK_stock_items_productId" PRIMARY KEY ("productId")
      )
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "stock_items"`);
  }
}
