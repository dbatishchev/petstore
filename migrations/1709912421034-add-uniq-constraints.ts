import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddUniqConstraints1709912421034 implements MigrationInterface {
  name = 'AddUniqConstraints1709912421034';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "category" ADD CONSTRAINT "UQ_23c05c292c439d77b0de816b500" UNIQUE ("name")`,
    );
    await queryRunner.query(
      `ALTER TABLE "tag" ADD CONSTRAINT "UQ_6a9775008add570dc3e5a0bab7b" UNIQUE ("name")`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "tag" DROP CONSTRAINT "UQ_6a9775008add570dc3e5a0bab7b"`,
    );
    await queryRunner.query(
      `ALTER TABLE "category" DROP CONSTRAINT "UQ_23c05c292c439d77b0de816b500"`,
    );
  }
}
