import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateBlogsTables1773548400000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // 블로그 피드 소스 테이블
    await queryRunner.query(`
      CREATE TABLE blog_feeds (
        id BIGINT PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        domain VARCHAR(200) NOT NULL UNIQUE,
        feed_url VARCHAR(500) NOT NULL,
        active BOOLEAN NOT NULL DEFAULT true,
        created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // 블로그 수집 항목 테이블
    await queryRunner.query(`
      CREATE TABLE blog_entries (
        id BIGINT PRIMARY KEY,
        feed_id BIGINT NOT NULL REFERENCES blog_feeds(id) ON DELETE CASCADE,
        title VARCHAR(500) NOT NULL,
        url VARCHAR(1000) NOT NULL UNIQUE,
        published_at TIMESTAMP NOT NULL,
        views INTEGER NOT NULL DEFAULT 0,
        created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // 인덱스
    await queryRunner.query(`CREATE INDEX idx_blog_entries_published_at ON blog_entries(published_at)`);
    await queryRunner.query(`CREATE INDEX idx_blog_entries_feed_id ON blog_entries(feed_id)`);

    // 테이블/컬럼 설명
    await queryRunner.query(`COMMENT ON TABLE blog_feeds IS '블로그 피드 소스 테이블'`);
    await queryRunner.query(`COMMENT ON COLUMN blog_feeds.id IS '고유 ID (Snowflake ID)'`);
    await queryRunner.query(`COMMENT ON COLUMN blog_feeds.name IS '블로그 이름'`);
    await queryRunner.query(`COMMENT ON COLUMN blog_feeds.domain IS '블로그 도메인'`);
    await queryRunner.query(`COMMENT ON COLUMN blog_feeds.feed_url IS 'RSS 피드 URL'`);
    await queryRunner.query(`COMMENT ON COLUMN blog_feeds.active IS '활성 여부'`);
    await queryRunner.query(`COMMENT ON COLUMN blog_feeds.created_at IS '생성 일시'`);

    await queryRunner.query(`COMMENT ON TABLE blog_entries IS '블로그 수집 항목 테이블'`);
    await queryRunner.query(`COMMENT ON COLUMN blog_entries.id IS '고유 ID (Snowflake ID)'`);
    await queryRunner.query(`COMMENT ON COLUMN blog_entries.feed_id IS '피드 소스 ID'`);
    await queryRunner.query(`COMMENT ON COLUMN blog_entries.title IS '글 제목'`);
    await queryRunner.query(`COMMENT ON COLUMN blog_entries.url IS '글 URL'`);
    await queryRunner.query(`COMMENT ON COLUMN blog_entries.published_at IS '글 발행일'`);
    await queryRunner.query(`COMMENT ON COLUMN blog_entries.views IS '조회수'`);
    await queryRunner.query(`COMMENT ON COLUMN blog_entries.created_at IS '수집 일시'`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE IF EXISTS blog_entries`);
    await queryRunner.query(`DROP TABLE IF EXISTS blog_feeds`);
  }
}
