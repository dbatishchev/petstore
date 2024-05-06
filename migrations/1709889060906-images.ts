import { MigrationInterface, QueryRunner } from 'typeorm';

export class Images1709889060906 implements MigrationInterface {
  name = 'Images1709889060906';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "image" ("id" SERIAL NOT NULL, "filename" character varying(128) NOT NULL, "path" character varying(128) NOT NULL, "mime" character varying(64) NOT NULL, "type" character varying(64) NOT NULL, "additionalMeta" text NOT NULL, CONSTRAINT "PK_d6db1ab4ee9ad9dbe86c64e4cc3" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "pet_images_image" ("petId" integer NOT NULL, "imageId" integer NOT NULL, CONSTRAINT "PK_a00658f3b4dd326e2e87498b931" PRIMARY KEY ("petId", "imageId"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_0a3ad464eb2a8fadb4afe891f1" ON "pet_images_image" ("petId") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_f3abe0763c69fe9e5362a95ae6" ON "pet_images_image" ("imageId") `,
    );
    await queryRunner.query(
      `ALTER TABLE "pet_images_image" ADD CONSTRAINT "FK_0a3ad464eb2a8fadb4afe891f1b" FOREIGN KEY ("petId") REFERENCES "pet"("id") ON DELETE CASCADE ON UPDATE CASCADE`,
    );
    await queryRunner.query(
      `ALTER TABLE "pet_images_image" ADD CONSTRAINT "FK_f3abe0763c69fe9e5362a95ae60" FOREIGN KEY ("imageId") REFERENCES "image"("id") ON DELETE CASCADE ON UPDATE CASCADE`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "pet_images_image" DROP CONSTRAINT "FK_f3abe0763c69fe9e5362a95ae60"`,
    );
    await queryRunner.query(
      `ALTER TABLE "pet_images_image" DROP CONSTRAINT "FK_0a3ad464eb2a8fadb4afe891f1b"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_f3abe0763c69fe9e5362a95ae6"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_0a3ad464eb2a8fadb4afe891f1"`,
    );
    await queryRunner.query(`DROP TABLE "pet_images_image"`);
    await queryRunner.query(`DROP TABLE "image"`);
  }
}
