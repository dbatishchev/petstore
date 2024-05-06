import { MigrationInterface, QueryRunner } from 'typeorm';

export class Initial1709723677896 implements MigrationInterface {
  name = 'Initial1709723677896';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "category" ("id" SERIAL NOT NULL, "name" character varying(64) NOT NULL, CONSTRAINT "PK_9c4e4a89e3674fc9f382d733f03" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "tag" ("id" SERIAL NOT NULL, "name" character varying(64) NOT NULL, CONSTRAINT "PK_8e4052373c579afc1471f526760" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "pet" ("id" SERIAL NOT NULL, "name" character varying(64) NOT NULL, "photoUrls" text NOT NULL, "status" character varying(64) NOT NULL, "categoryId" integer, CONSTRAINT "PK_b1ac2e88e89b9480e0c5b53fa60" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "pet_tags_tag" ("petId" integer NOT NULL, "tagId" integer NOT NULL, CONSTRAINT "PK_262364c525bec26727cfef41bea" PRIMARY KEY ("petId", "tagId"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_cafc49ef770a77269022401e87" ON "pet_tags_tag" ("petId") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_571f34e2d4a1a419a86110eaa0" ON "pet_tags_tag" ("tagId") `,
    );
    await queryRunner.query(
      `ALTER TABLE "pet" ADD CONSTRAINT "FK_c46f17a55aefa4484cf6bcbe3ab" FOREIGN KEY ("categoryId") REFERENCES "category"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "pet_tags_tag" ADD CONSTRAINT "FK_cafc49ef770a77269022401e872" FOREIGN KEY ("petId") REFERENCES "pet"("id") ON DELETE CASCADE ON UPDATE CASCADE`,
    );
    await queryRunner.query(
      `ALTER TABLE "pet_tags_tag" ADD CONSTRAINT "FK_571f34e2d4a1a419a86110eaa0b" FOREIGN KEY ("tagId") REFERENCES "tag"("id") ON DELETE CASCADE ON UPDATE CASCADE`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "pet_tags_tag" DROP CONSTRAINT "FK_571f34e2d4a1a419a86110eaa0b"`,
    );
    await queryRunner.query(
      `ALTER TABLE "pet_tags_tag" DROP CONSTRAINT "FK_cafc49ef770a77269022401e872"`,
    );
    await queryRunner.query(
      `ALTER TABLE "pet" DROP CONSTRAINT "FK_c46f17a55aefa4484cf6bcbe3ab"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_571f34e2d4a1a419a86110eaa0"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_cafc49ef770a77269022401e87"`,
    );
    await queryRunner.query(`DROP TABLE "pet_tags_tag"`);
    await queryRunner.query(`DROP TABLE "pet"`);
    await queryRunner.query(`DROP TABLE "tag"`);
    await queryRunner.query(`DROP TABLE "category"`);
  }
}
