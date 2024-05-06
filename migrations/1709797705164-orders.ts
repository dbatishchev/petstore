import { MigrationInterface, QueryRunner } from 'typeorm';

export class Orders1709797705164 implements MigrationInterface {
  name = 'Orders1709797705164';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "order" ("id" SERIAL NOT NULL, "quantity" integer NOT NULL, "shipDate" TIMESTAMP WITH TIME ZONE NOT NULL, "status" character varying NOT NULL, "complete" boolean NOT NULL, "petId" integer, CONSTRAINT "PK_1031171c13130102495201e3e20" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `ALTER TABLE "order" ADD CONSTRAINT "FK_cbe3397bd09655d8445e170f878" FOREIGN KEY ("petId") REFERENCES "pet"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "order" DROP CONSTRAINT "FK_cbe3397bd09655d8445e170f878"`,
    );
    await queryRunner.query(`DROP TABLE "order"`);
  }
}
