import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateNoticesTables1773546380000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // 공지사항 테이블
    await queryRunner.query(`
      CREATE TABLE notices (
        id BIGINT PRIMARY KEY,
        type VARCHAR(20) NOT NULL CHECK (type IN ('ANNOUNCEMENT', 'UPDATE')),
        title VARCHAR(200) NOT NULL,
        version VARCHAR(50),
        admin_name VARCHAR(100),
        admin_initial VARCHAR(10),
        release_type VARCHAR(50),
        release_scope VARCHAR(100),
        markdown_content TEXT,
        published_at TIMESTAMP NOT NULL,
        created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
      )
    `);

    await queryRunner.query(`CREATE INDEX idx_notices_type_published_at ON notices(type, published_at)`);

    await queryRunner.query(`
      CREATE TRIGGER update_notices_updated_at BEFORE UPDATE ON notices
      FOR EACH ROW EXECUTE FUNCTION update_updated_at_column()
    `);

    // 공지 리액션 테이블
    await queryRunner.query(`
      CREATE TABLE notice_reactions (
        notice_id BIGINT NOT NULL REFERENCES notices(id) ON DELETE CASCADE,
        user_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        emoji VARCHAR(16) NOT NULL,
        created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
        PRIMARY KEY (notice_id, user_id, emoji)
      )
    `);

    await queryRunner.query(`CREATE INDEX idx_notice_reactions_notice_created_at ON notice_reactions(notice_id, created_at)`);

    // 테이블/컬럼 설명
    await queryRunner.query(`COMMENT ON TABLE notices IS '공지사항/업데이트 테이블'`);
    await queryRunner.query(`COMMENT ON COLUMN notices.id IS '공지 고유 ID (Snowflake ID)'`);
    await queryRunner.query(`COMMENT ON COLUMN notices.type IS '공지 타입: ANNOUNCEMENT 또는 UPDATE'`);
    await queryRunner.query(`COMMENT ON COLUMN notices.title IS '공지 제목'`);
    await queryRunner.query(`COMMENT ON COLUMN notices.version IS '업데이트 버전'`);
    await queryRunner.query(`COMMENT ON COLUMN notices.admin_name IS '작성 관리자 이름'`);
    await queryRunner.query(`COMMENT ON COLUMN notices.admin_initial IS '작성 관리자 이니셜'`);
    await queryRunner.query(`COMMENT ON COLUMN notices.release_type IS '배포 유형'`);
    await queryRunner.query(`COMMENT ON COLUMN notices.release_scope IS '배포 범위'`);
    await queryRunner.query(`COMMENT ON COLUMN notices.markdown_content IS '업데이트 상세 마크다운'`);
    await queryRunner.query(`COMMENT ON COLUMN notices.published_at IS '공지 게시 시각'`);
    await queryRunner.query(`COMMENT ON COLUMN notices.created_at IS '생성 일시'`);
    await queryRunner.query(`COMMENT ON COLUMN notices.updated_at IS '수정 일시'`);

    await queryRunner.query(`COMMENT ON TABLE notice_reactions IS '업데이트 공지 리액션 테이블'`);
    await queryRunner.query(`COMMENT ON COLUMN notice_reactions.notice_id IS '공지 ID'`);
    await queryRunner.query(`COMMENT ON COLUMN notice_reactions.user_id IS '리액션 사용자 ID'`);
    await queryRunner.query(`COMMENT ON COLUMN notice_reactions.emoji IS '선택한 이모지'`);
    await queryRunner.query(`COMMENT ON COLUMN notice_reactions.created_at IS '생성 일시'`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE IF EXISTS notice_reactions`);
    await queryRunner.query(`DROP TRIGGER IF EXISTS update_notices_updated_at ON notices`);
    await queryRunner.query(`DROP TABLE IF EXISTS notices`);
  }
}
