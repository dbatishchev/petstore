import { MigrationInterface, QueryRunner } from 'typeorm';

export class RemoveImageUrls1709889990684 implements MigrationInterface {
  name = 'RemoveImageUrls1709889990684';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "pet" DROP COLUMN "photoUrls"`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "pet" ADD "photoUrls" text NOT NULL`);
  }
}
