import { MigrationInterface, QueryRunner } from 'typeorm';

export class OrdersRequiredFields1709799477823 implements MigrationInterface {
  name = 'OrdersRequiredFields1709799477823';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "order" DROP CONSTRAINT "FK_cbe3397bd09655d8445e170f878"`,
    );
    await queryRunner.query(
      `ALTER TABLE "order" ALTER COLUMN "petId" SET NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "order" ADD CONSTRAINT "FK_cbe3397bd09655d8445e170f878" FOREIGN KEY ("petId") REFERENCES "pet"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "order" DROP CONSTRAINT "FK_cbe3397bd09655d8445e170f878"`,
    );
    await queryRunner.query(
      `ALTER TABLE "order" ALTER COLUMN "petId" DROP NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "order" ADD CONSTRAINT "FK_cbe3397bd09655d8445e170f878" FOREIGN KEY ("petId") REFERENCES "pet"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }
}
