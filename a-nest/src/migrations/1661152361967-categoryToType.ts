import { MigrationInterface, QueryRunner } from 'typeorm';

export class categoryToType1661152361967 implements MigrationInterface {
  name = 'categoryToType1661152361967';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      'ALTER TABLE `mentions` CHANGE  `category` `type` enum("chat","dm","system")',
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      'ALTER TABLE `mentions` CHANGE `type` `category` enum("chat","dm","system")',
    );
  }
}
