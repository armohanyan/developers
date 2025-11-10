import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddExchangeRates1744935284746 implements MigrationInterface {
    name = 'AddExchangeRates1744935284746';

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.startTransaction();
        try {
            await queryRunner.query(`
            CREATE TABLE "exchange_rate" (
                  "id" UUID NOT NULL DEFAULT uuid_generate_v4(),
                  "country" VARCHAR(255) NOT NULL,
                  "currency" VARCHAR(255) NOT NULL,
                  "amount" DOUBLE PRECISION NOT NULL,
                  "currencyCode" VARCHAR(255) NOT NULL,
                  "rate" DOUBLE PRECISION NOT NULL,
                  "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
                  "updatedAt" TIMESTAMP NOT NULL DEFAULT now(),
                  CONSTRAINT "PK_exchange_rate_id" PRIMARY KEY ("id"),
                  CONSTRAINT "UQ_exchange_rate_currency_code" UNIQUE ("currencyCode")
                )
            `);

            await queryRunner.query(`
        CREATE INDEX "IDX_exchange_rate_currency_code" ON "exchange_rate" ("currencyCode")
      `);

            await queryRunner.commitTransaction();
        } catch (error) {
            await queryRunner.rollbackTransaction();
            throw error;
        }
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.startTransaction();
        try {
            await queryRunner.query(`DROP INDEX IF EXISTS "IDX_exchange_rate_currency_code"`);
            await queryRunner.query(`DROP TABLE IF EXISTS "exchange_rate"`);
            await queryRunner.commitTransaction();
        } catch (error) {
            await queryRunner.rollbackTransaction();
            throw error;
        }
    }
}
