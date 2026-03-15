import { MigrationInterface, QueryRunner } from 'typeorm';

export class RemoveNoticesSummary1710400000000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE notices DROP COLUMN IF EXISTS summary`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE notices ADD COLUMN summary TEXT`);
    await queryRunner.query(`COMMENT ON COLUMN notices.summary IS '업데이트 요약'`);
  }
}
