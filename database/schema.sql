-- Himedia 커뮤니티 데이터베이스 스키마

-- UUID 확장 활성화 (Refresh Token용)
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 사용자 테이블
CREATE TABLE users (
    id BIGINT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    phone VARCHAR(20) NOT NULL UNIQUE,
    role VARCHAR(20) NOT NULL CHECK (role IN ('TRAINEE', 'GRADUATE', 'MENTOR', 'INSTRUCTOR', 'ADMIN')),
    requested_role VARCHAR(20) CHECK (requested_role IN ('TRAINEE', 'GRADUATE', 'MENTOR', 'INSTRUCTOR')),
    course VARCHAR(255),
    birth_date DATE,
    profile_handle VARCHAR(50) UNIQUE,
    profile_image_url VARCHAR(500),
    profile_bio TEXT,
    profile_contact_email VARCHAR(255),
    profile_github_url VARCHAR(500),
    profile_linkedin_url VARCHAR(500),
    profile_twitter_url VARCHAR(500),
    profile_facebook_url VARCHAR(500),
    profile_website_url VARCHAR(500),
    privacy_consent BOOLEAN NOT NULL DEFAULT false,
    approved BOOLEAN NOT NULL DEFAULT false,
    withdrawn BOOLEAN NOT NULL DEFAULT false,
    withdrawn_at TIMESTAMP,
    withdraw_restore_deadline TIMESTAMP,
    withdraw_note VARCHAR(255),
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- 인덱스
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_role ON users(role);
CREATE INDEX idx_users_approved ON users(approved);
CREATE INDEX idx_users_withdrawn ON users(withdrawn);
CREATE INDEX idx_users_withdraw_restore_deadline ON users(withdraw_restore_deadline);
CREATE INDEX idx_users_role_approved ON users(role, approved);
CREATE INDEX idx_users_profile_handle ON users(profile_handle);

-- updated_at 자동 갱신 함수
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- 트리거
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- 카테고리 테이블
CREATE TABLE categories (
    id BIGINT PRIMARY KEY,
    name VARCHAR(50) NOT NULL UNIQUE
);

-- 게시글 테이블
CREATE TABLE posts (
    id BIGINT PRIMARY KEY,
    author_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    category_id BIGINT REFERENCES categories(id) ON DELETE RESTRICT,
    title VARCHAR(200) NOT NULL,
    content TEXT NOT NULL,
    thumbnail_url VARCHAR(500),
    view_count INTEGER NOT NULL DEFAULT 0,
    like_count INTEGER NOT NULL DEFAULT 0,
    share_count INTEGER NOT NULL DEFAULT 0,
    status VARCHAR(20) NOT NULL DEFAULT 'DRAFT' CHECK (status IN ('DRAFT', 'PUBLISHED')),
    published_at TIMESTAMP,
    CONSTRAINT chk_posts_published_at CHECK (status <> 'PUBLISHED' OR published_at IS NOT NULL),
    CONSTRAINT chk_posts_category_required CHECK (status <> 'PUBLISHED' OR category_id IS NOT NULL),
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- 인덱스
CREATE INDEX idx_posts_author_id ON posts(author_id);
CREATE INDEX idx_posts_category_id ON posts(category_id);
CREATE INDEX idx_posts_status_created_at ON posts(status, created_at);
CREATE INDEX idx_posts_created_at ON posts(created_at);

-- 트리거
CREATE TRIGGER update_posts_updated_at BEFORE UPDATE ON posts
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- 게시글 이미지 테이블
CREATE TABLE post_images (
    id BIGINT PRIMARY KEY,
    post_id BIGINT NOT NULL REFERENCES posts(id) ON DELETE CASCADE,
    url VARCHAR(500) NOT NULL,
    type VARCHAR(20) NOT NULL CHECK (type IN ('THUMBNAIL', 'CONTENT')),
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- 인덱스
CREATE INDEX idx_post_images_post_id ON post_images(post_id);
CREATE INDEX idx_post_images_type ON post_images(type);

-- 게시글 공유 로그 테이블
CREATE TABLE post_share_logs (
    id BIGINT PRIMARY KEY,
    post_id BIGINT NOT NULL REFERENCES posts(id) ON DELETE CASCADE,
    user_id BIGINT,
    ip VARCHAR(64) NOT NULL,
    user_agent VARCHAR(255) NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- 인덱스
CREATE INDEX idx_post_share_logs_user ON post_share_logs(post_id, user_id, created_at);
CREATE INDEX idx_post_share_logs_lookup ON post_share_logs(post_id, ip, user_agent, created_at);

-- 게시글 조회 로그 테이블
CREATE TABLE post_view_logs (
    id BIGINT PRIMARY KEY,
    post_id BIGINT NOT NULL REFERENCES posts(id) ON DELETE CASCADE,
    anonymous_id VARCHAR(64),
    ip VARCHAR(64) NOT NULL,
    user_agent VARCHAR(255) NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- 인덱스
CREATE INDEX idx_post_view_logs_lookup ON post_view_logs(post_id, anonymous_id, ip, user_agent, created_at);

-- 사용자 최근 읽은 게시글 테이블
CREATE TABLE user_recent_posts (
    id BIGINT PRIMARY KEY,
    user_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    post_id BIGINT NOT NULL REFERENCES posts(id) ON DELETE CASCADE,
    viewed_at TIMESTAMP NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    UNIQUE (user_id, post_id)
);

-- 인덱스
CREATE INDEX idx_user_recent_posts_user_viewed_at ON user_recent_posts(user_id, viewed_at);

-- 트리거
CREATE TRIGGER update_user_recent_posts_updated_at BEFORE UPDATE ON user_recent_posts
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- 태그 테이블
CREATE TABLE tags (
    id BIGINT PRIMARY KEY,
    name VARCHAR(50) NOT NULL UNIQUE,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- 게시글-태그 연결 테이블
CREATE TABLE post_tags (
    post_id BIGINT NOT NULL REFERENCES posts(id) ON DELETE CASCADE,
    tag_id BIGINT NOT NULL REFERENCES tags(id) ON DELETE CASCADE,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (post_id, tag_id)
);

-- 인덱스
CREATE INDEX idx_post_tags_tag_id ON post_tags(tag_id);

-- 게시글 좋아요 테이블 (중복 방지)
CREATE TABLE post_likes (
    post_id BIGINT NOT NULL REFERENCES posts(id) ON DELETE CASCADE,
    user_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (post_id, user_id)
);

-- 인덱스
CREATE INDEX idx_post_likes_user_id ON post_likes(user_id);

-- 댓글 테이블 (무제한 트리 구조)
CREATE TABLE comments (
    id BIGINT PRIMARY KEY,
    post_id BIGINT NOT NULL REFERENCES posts(id) ON DELETE CASCADE,
    author_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    content TEXT NOT NULL,
    parent_id BIGINT,
    depth INTEGER NOT NULL DEFAULT 0,
    like_count INTEGER NOT NULL DEFAULT 0,
    dislike_count INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP,
    CONSTRAINT uq_comments_id_post_id UNIQUE (id, post_id),
    CONSTRAINT fk_comments_parent_same_post
        FOREIGN KEY (parent_id, post_id)
        REFERENCES comments(id, post_id)
        ON DELETE CASCADE
);

-- 인덱스
CREATE INDEX idx_comments_post_id ON comments(post_id);
CREATE INDEX idx_comments_parent_id ON comments(parent_id);
CREATE INDEX idx_comments_created_at ON comments(created_at);

-- 트리거
CREATE TRIGGER update_comments_updated_at BEFORE UPDATE ON comments
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- 댓글 리액션 테이블 (좋아요/싫어요)
CREATE TABLE comment_reactions (
    comment_id BIGINT NOT NULL REFERENCES comments(id) ON DELETE CASCADE,
    user_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    type VARCHAR(10) NOT NULL CHECK (type IN ('LIKE', 'DISLIKE')),
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (comment_id, user_id)
);

-- 인덱스
CREATE INDEX idx_comment_reactions_user_id ON comment_reactions(user_id);

-- 알림 테이블
CREATE TABLE notifications (
    id BIGINT PRIMARY KEY,
    target_user_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    actor_user_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    post_id BIGINT REFERENCES posts(id) ON DELETE CASCADE,
    comment_id BIGINT REFERENCES comments(id) ON DELETE CASCADE,
    type VARCHAR(20) NOT NULL CHECK (type IN ('POST_LIKE', 'POST_COMMENT', 'COMMENT_LIKE', 'COMMENT_REPLY', 'REPORT_RECEIVED', 'REPORT_RESOLVED', 'REPORT_REJECTED')),
    read_at TIMESTAMP,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- 인덱스
CREATE INDEX idx_notifications_target_user_id ON notifications(target_user_id);
CREATE INDEX idx_notifications_target_user_created_at ON notifications(target_user_id, created_at);
CREATE INDEX idx_notifications_target_user_read_at ON notifications(target_user_id, read_at);

-- 공지사항 테이블
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
);

-- 인덱스
CREATE INDEX idx_notices_type_published_at ON notices(type, published_at);

-- 트리거
CREATE TRIGGER update_notices_updated_at BEFORE UPDATE ON notices
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- 공지 리액션 테이블
CREATE TABLE notice_reactions (
    notice_id BIGINT NOT NULL REFERENCES notices(id) ON DELETE CASCADE,
    user_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    emoji VARCHAR(16) NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (notice_id, user_id, emoji)
);

-- 인덱스
CREATE INDEX idx_notice_reactions_notice_created_at ON notice_reactions(notice_id, created_at);

-- 리프레시 토큰 테이블
CREATE TABLE refresh_tokens (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    token_hash VARCHAR(255) NOT NULL,
    expires_at TIMESTAMP NOT NULL,
    revoked_at TIMESTAMP,
    user_agent VARCHAR(500),
    ip_address VARCHAR(45),
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- 인덱스
CREATE INDEX idx_refresh_tokens_user_id ON refresh_tokens(user_id);
CREATE INDEX idx_refresh_tokens_expires_at ON refresh_tokens(expires_at);
CREATE INDEX idx_refresh_tokens_user_revoked ON refresh_tokens(user_id, revoked_at);

-- 비밀번호 재설정 테이블
CREATE TABLE password_resets (
    id BIGINT PRIMARY KEY,
    user_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    code VARCHAR(255) NOT NULL,
    expires_at TIMESTAMP NOT NULL,
    used BOOLEAN NOT NULL DEFAULT false,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- 인덱스
CREATE INDEX idx_password_resets_user_id ON password_resets(user_id);
CREATE INDEX idx_password_resets_code ON password_resets(code);
CREATE INDEX idx_password_resets_expires_at ON password_resets(expires_at);
CREATE INDEX idx_password_resets_user_code_used ON password_resets(user_id, code, used);

-- 테이블/컬럼 설명
COMMENT ON TABLE users IS '사용자 테이블';
COMMENT ON COLUMN users.id IS '사용자 고유 ID (Snowflake ID)';
COMMENT ON COLUMN users.name IS '사용자 이름';
COMMENT ON COLUMN users.email IS '이메일 (로그인 ID)';
COMMENT ON COLUMN users.password IS '암호화된 비밀번호';
COMMENT ON COLUMN users.phone IS '전화번호';
COMMENT ON COLUMN users.role IS '역할: TRAINEE(훈련생), MENTOR(멘토), INSTRUCTOR(강사), ADMIN(관리자)';
COMMENT ON COLUMN users.requested_role IS '가입 시 신청 역할: TRAINEE(훈련생), MENTOR(멘토), INSTRUCTOR(강사)';
COMMENT ON COLUMN users.course IS '과정명 및 기수';
COMMENT ON COLUMN users.birth_date IS '생년월일';
COMMENT ON COLUMN users.profile_bio IS '자기소개';
COMMENT ON COLUMN users.profile_handle IS '프로필 핸들';
COMMENT ON COLUMN users.profile_image_url IS '프로필 이미지 URL';
COMMENT ON COLUMN users.profile_contact_email IS '프로필 연락용 이메일';
COMMENT ON COLUMN users.profile_github_url IS '프로필 GitHub URL';
COMMENT ON COLUMN users.profile_linkedin_url IS '프로필 LinkedIn URL';
COMMENT ON COLUMN users.profile_twitter_url IS '프로필 X(Twitter) URL';
COMMENT ON COLUMN users.profile_facebook_url IS '프로필 Facebook URL';
COMMENT ON COLUMN users.profile_website_url IS '프로필 홈페이지 URL';
COMMENT ON COLUMN users.privacy_consent IS '개인정보 수집 및 이용 동의 여부';
COMMENT ON COLUMN users.approved IS '관리자 승인 여부';
COMMENT ON COLUMN users.withdrawn IS '회원탈퇴 여부';
COMMENT ON COLUMN users.withdrawn_at IS '회원탈퇴 처리 시각';
COMMENT ON COLUMN users.withdraw_restore_deadline IS '회원탈퇴 후 복구 가능 마감 시각';
COMMENT ON COLUMN users.withdraw_note IS '탈퇴 계정 상태 메모';
COMMENT ON COLUMN users.created_at IS '생성 일시';
COMMENT ON COLUMN users.updated_at IS '수정 일시';

COMMENT ON TABLE categories IS '카테고리 테이블';
COMMENT ON COLUMN categories.id IS '카테고리 고유 ID (Snowflake ID)';
COMMENT ON COLUMN categories.name IS '카테고리 이름';

COMMENT ON TABLE posts IS '게시글 테이블';
COMMENT ON COLUMN posts.id IS '게시글 고유 ID (Snowflake ID)';
COMMENT ON COLUMN posts.author_id IS '작성자 ID';
COMMENT ON COLUMN posts.category_id IS '카테고리 ID';
COMMENT ON COLUMN posts.title IS '제목';
COMMENT ON COLUMN posts.content IS '본문';
COMMENT ON COLUMN posts.thumbnail_url IS '대표 썸네일 이미지 URL';
COMMENT ON COLUMN posts.view_count IS '조회수';
COMMENT ON COLUMN posts.like_count IS '좋아요 수';
COMMENT ON COLUMN posts.share_count IS '공유 수';
COMMENT ON COLUMN posts.status IS '게시 상태: DRAFT(임시저장), PUBLISHED(게시)';
COMMENT ON COLUMN posts.published_at IS '게시 일시';
COMMENT ON COLUMN posts.created_at IS '생성 일시';
COMMENT ON COLUMN posts.updated_at IS '수정 일시';

COMMENT ON TABLE post_share_logs IS '게시글 공유 로그 테이블';
COMMENT ON COLUMN post_share_logs.id IS '공유 로그 고유 ID (Snowflake ID)';
COMMENT ON COLUMN post_share_logs.post_id IS '게시글 ID';
COMMENT ON COLUMN post_share_logs.user_id IS '공유 요청 사용자 ID';
COMMENT ON COLUMN post_share_logs.ip IS '공유 요청 IP';
COMMENT ON COLUMN post_share_logs.user_agent IS '공유 요청 User-Agent';
COMMENT ON COLUMN post_share_logs.created_at IS '공유 로그 생성 일시';

COMMENT ON TABLE post_view_logs IS '게시글 조회 로그 테이블';
COMMENT ON COLUMN post_view_logs.id IS '조회 로그 고유 ID (Snowflake ID)';
COMMENT ON COLUMN post_view_logs.post_id IS '게시글 ID';
COMMENT ON COLUMN post_view_logs.anonymous_id IS '조회 요청 익명 ID';
COMMENT ON COLUMN post_view_logs.ip IS '조회 요청 IP';
COMMENT ON COLUMN post_view_logs.user_agent IS '조회 요청 User-Agent';
COMMENT ON COLUMN post_view_logs.created_at IS '조회 로그 생성 일시';

COMMENT ON TABLE tags IS '태그 테이블';
COMMENT ON COLUMN tags.id IS '태그 고유 ID (Snowflake ID)';
COMMENT ON COLUMN tags.name IS '태그 이름';
COMMENT ON COLUMN tags.created_at IS '생성 일시';

COMMENT ON TABLE post_tags IS '게시글-태그 연결 테이블';
COMMENT ON COLUMN post_tags.post_id IS '게시글 ID';
COMMENT ON COLUMN post_tags.tag_id IS '태그 ID';
COMMENT ON COLUMN post_tags.created_at IS '생성 일시';

COMMENT ON TABLE post_likes IS '게시글 좋아요 테이블';
COMMENT ON COLUMN post_likes.post_id IS '게시글 ID';
COMMENT ON COLUMN post_likes.user_id IS '사용자 ID';
COMMENT ON COLUMN post_likes.created_at IS '생성 일시';

COMMENT ON TABLE comments IS '댓글 테이블';
COMMENT ON COLUMN comments.id IS '댓글 고유 ID (Snowflake ID)';
COMMENT ON COLUMN comments.post_id IS '게시글 ID';
COMMENT ON COLUMN comments.author_id IS '작성자 ID';
COMMENT ON COLUMN comments.content IS '댓글 내용';
COMMENT ON COLUMN comments.parent_id IS '부모 댓글 ID';
COMMENT ON COLUMN comments.depth IS '댓글 깊이';
COMMENT ON COLUMN comments.like_count IS '좋아요 수';
COMMENT ON COLUMN comments.dislike_count IS '싫어요 수';
COMMENT ON COLUMN comments.created_at IS '생성 일시';
COMMENT ON COLUMN comments.updated_at IS '수정 일시';
COMMENT ON COLUMN comments.deleted_at IS '삭제 일시';

COMMENT ON TABLE comment_reactions IS '댓글 좋아요/싫어요 테이블';
COMMENT ON COLUMN comment_reactions.comment_id IS '댓글 ID';
COMMENT ON COLUMN comment_reactions.user_id IS '사용자 ID';
COMMENT ON COLUMN comment_reactions.type IS '리액션 타입';
COMMENT ON COLUMN comment_reactions.created_at IS '생성 일시';

COMMENT ON TABLE notices IS '공지사항/업데이트 테이블';
COMMENT ON COLUMN notices.id IS '공지 고유 ID (Snowflake ID)';
COMMENT ON COLUMN notices.type IS '공지 타입: ANNOUNCEMENT 또는 UPDATE';
COMMENT ON COLUMN notices.title IS '공지 제목';
COMMENT ON COLUMN notices.version IS '업데이트 버전';
COMMENT ON COLUMN notices.admin_name IS '작성 관리자 이름';
COMMENT ON COLUMN notices.admin_initial IS '작성 관리자 이니셜';
COMMENT ON COLUMN notices.release_type IS '배포 유형';
COMMENT ON COLUMN notices.release_scope IS '배포 범위';
COMMENT ON COLUMN notices.markdown_content IS '업데이트 상세 마크다운';
COMMENT ON COLUMN notices.published_at IS '공지 게시 시각';
COMMENT ON COLUMN notices.created_at IS '생성 일시';
COMMENT ON COLUMN notices.updated_at IS '수정 일시';

COMMENT ON TABLE notice_reactions IS '업데이트 공지 리액션 테이블';
COMMENT ON COLUMN notice_reactions.notice_id IS '공지 ID';
COMMENT ON COLUMN notice_reactions.user_id IS '리액션 사용자 ID';
COMMENT ON COLUMN notice_reactions.emoji IS '선택한 이모지';
COMMENT ON COLUMN notice_reactions.created_at IS '생성 일시';

COMMENT ON TABLE refresh_tokens IS '리프레시 토큰 테이블';
COMMENT ON COLUMN refresh_tokens.id IS '토큰 고유 ID (UUID - 보안)';
COMMENT ON COLUMN refresh_tokens.user_id IS '사용자 ID';
COMMENT ON COLUMN refresh_tokens.token_hash IS '토큰 해시값';
COMMENT ON COLUMN refresh_tokens.expires_at IS '토큰 만료 시간';
COMMENT ON COLUMN refresh_tokens.revoked_at IS '토큰 철회 시간';
COMMENT ON COLUMN refresh_tokens.user_agent IS '사용자 브라우저/기기 정보';
COMMENT ON COLUMN refresh_tokens.ip_address IS '요청 IP 주소';
COMMENT ON COLUMN refresh_tokens.created_at IS '생성 일시';

COMMENT ON TABLE password_resets IS '비밀번호 재설정 인증번호 테이블';
COMMENT ON COLUMN password_resets.id IS '고유 ID (Snowflake ID)';
COMMENT ON COLUMN password_resets.user_id IS '사용자 ID';
COMMENT ON COLUMN password_resets.code IS '인증코드 해시(bcrypt)';
COMMENT ON COLUMN password_resets.expires_at IS '인증번호 만료 시간';
COMMENT ON COLUMN password_resets.used IS '사용 여부';
COMMENT ON COLUMN password_resets.created_at IS '생성 일시';

-- 팔로우 테이블
CREATE TABLE user_follows (
    follower_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    following_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (follower_id, following_id)
);

-- 인덱스
CREATE INDEX idx_user_follows_follower_id ON user_follows(follower_id);
CREATE INDEX idx_user_follows_following_id ON user_follows(following_id);

-- 이메일 인증 테이블
CREATE TABLE email_verifications (
    id BIGINT PRIMARY KEY,
    email VARCHAR(255) NOT NULL,
    code VARCHAR(255) NOT NULL,
    expires_at TIMESTAMP NOT NULL,
    used BOOLEAN NOT NULL DEFAULT false,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- 인덱스
CREATE INDEX idx_email_verifications_email ON email_verifications(email);
CREATE INDEX idx_email_verifications_code ON email_verifications(code);
CREATE INDEX idx_email_verifications_expires_at ON email_verifications(expires_at);
CREATE INDEX idx_email_verifications_email_code_used ON email_verifications(email, code, used);

-- 관리자 신고 테이블
CREATE TABLE admin_reports (
    id BIGINT PRIMARY KEY,
    reporter_user_id BIGINT,
    handler_admin_id BIGINT,
    title VARCHAR(120) NOT NULL,
    content TEXT NOT NULL,
    status VARCHAR(20) NOT NULL DEFAULT 'OPEN' CHECK (status IN ('OPEN', 'IN_PROGRESS', 'RESOLVED', 'REJECTED')),
    handled_at TIMESTAMP,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- 인덱스
CREATE INDEX idx_admin_reports_status_created_at ON admin_reports(status, created_at);
CREATE INDEX idx_admin_reports_created_at ON admin_reports(created_at);

-- 트리거
CREATE TRIGGER update_admin_reports_updated_at BEFORE UPDATE ON admin_reports
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- 관리자 감사 로그 테이블
CREATE TABLE admin_audit_logs (
    id BIGINT PRIMARY KEY,
    admin_user_id BIGINT NOT NULL,
    target_type VARCHAR(40) NOT NULL,
    target_id VARCHAR(100) NOT NULL,
    action VARCHAR(80) NOT NULL,
    payload JSONB,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- 인덱스
CREATE INDEX idx_admin_audit_logs_admin_user_id_created_at ON admin_audit_logs(admin_user_id, created_at);
CREATE INDEX idx_admin_audit_logs_target_type_target_id_created_at ON admin_audit_logs(target_type, target_id, created_at);

-- 코멘트
COMMENT ON TABLE user_follows IS '사용자 팔로우 관계 테이블';
COMMENT ON COLUMN user_follows.follower_id IS '팔로워 사용자 ID';
COMMENT ON COLUMN user_follows.following_id IS '팔로잉 사용자 ID';
COMMENT ON COLUMN user_follows.created_at IS '팔로우 시작 일시';

COMMENT ON TABLE email_verifications IS '이메일 인증 테이블';
COMMENT ON COLUMN email_verifications.id IS '고유 ID (Snowflake ID)';
COMMENT ON COLUMN email_verifications.email IS '인증 대상 이메일';
COMMENT ON COLUMN email_verifications.code IS '인증코드 해시';
COMMENT ON COLUMN email_verifications.expires_at IS '인증코드 만료 시간';
COMMENT ON COLUMN email_verifications.used IS '사용 여부';
COMMENT ON COLUMN email_verifications.created_at IS '생성 일시';

COMMENT ON TABLE admin_reports IS '관리자 신고 접수 테이블';
COMMENT ON COLUMN admin_reports.id IS '고유 ID (Snowflake ID)';
COMMENT ON COLUMN admin_reports.reporter_user_id IS '신고자 사용자 ID';
COMMENT ON COLUMN admin_reports.handler_admin_id IS '처리 관리자 ID';
COMMENT ON COLUMN admin_reports.title IS '신고 제목';
COMMENT ON COLUMN admin_reports.content IS '신고 내용';
COMMENT ON COLUMN admin_reports.status IS '처리 상태';
COMMENT ON COLUMN admin_reports.handled_at IS '처리 일시';
COMMENT ON COLUMN admin_reports.created_at IS '신고 접수 일시';
COMMENT ON COLUMN admin_reports.updated_at IS '수정 일시';

COMMENT ON TABLE admin_audit_logs IS '관리자 작업 감사 로그 테이블';
COMMENT ON COLUMN admin_audit_logs.id IS '고유 ID (Snowflake ID)';
COMMENT ON COLUMN admin_audit_logs.admin_user_id IS '관리자 사용자 ID';
COMMENT ON COLUMN admin_audit_logs.target_type IS '대상 엔티티 타입';
COMMENT ON COLUMN admin_audit_logs.target_id IS '대상 엔티티 ID';
COMMENT ON COLUMN admin_audit_logs.action IS '수행한 작업';
COMMENT ON COLUMN admin_audit_logs.payload IS '작업 상세 정보 (JSON)';
COMMENT ON COLUMN admin_audit_logs.created_at IS '작업 일시';
