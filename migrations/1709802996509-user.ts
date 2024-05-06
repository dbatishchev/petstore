import { MigrationInterface, QueryRunner } from 'typeorm';

export class User1709802996509 implements MigrationInterface {
  name = 'User1709802996509';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "user" ("id" SERIAL NOT NULL, "username" character varying(64) NOT NULL, "firstName" character varying(64), "lastName" character varying(64), "email" character varying(64) NOT NULL, "password" character varying(128), "phone" character varying(64), "userStatus" integer NOT NULL DEFAULT '1', CONSTRAINT "UQ_78a916df40e02a9deb1c4b75edb" UNIQUE ("username"), CONSTRAINT "PK_cace4a159ff9f2512dd42373760" PRIMARY KEY ("id"))`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "user"`);
  }
}
