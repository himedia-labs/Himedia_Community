-- Database: himedia
-- Description: Himedia Community Database Schema

-- Enable extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Users Table
CREATE TABLE users (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    phone VARCHAR(20) NOT NULL,
    role VARCHAR(20) NOT NULL CHECK (role IN ('TRAINEE', 'MENTOR', 'INSTRUCTOR')),
    course VARCHAR(255),
    privacy_consent BOOLEAN NOT NULL DEFAULT false,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Create index for email lookup
CREATE INDEX idx_users_email ON users(email);

-- Create index for role filtering
CREATE INDEX idx_users_role ON users(role);

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger to automatically update updated_at
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Refresh Tokens Table
CREATE TABLE refresh_tokens (
    id UUID PRIMARY KEY,
    user_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    token_hash VARCHAR(255) NOT NULL,
    expires_at TIMESTAMP NOT NULL,
    revoked_at TIMESTAMP,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_refresh_tokens_user_id ON refresh_tokens(user_id);

-- Password Resets Table
CREATE TABLE password_resets (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    code VARCHAR(8) NOT NULL,
    expires_at TIMESTAMP NOT NULL,
    used BOOLEAN NOT NULL DEFAULT false,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_password_resets_user_id ON password_resets(user_id);
CREATE INDEX idx_password_resets_code ON password_resets(code);

-- Comments
COMMENT ON TABLE users IS '사용자 테이블';
COMMENT ON COLUMN users.id IS '사용자 고유 ID';
COMMENT ON COLUMN users.name IS '사용자 이름';
COMMENT ON COLUMN users.email IS '이메일 (로그인 ID)';
COMMENT ON COLUMN users.password IS '암호화된 비밀번호';
COMMENT ON COLUMN users.phone IS '전화번호';
COMMENT ON COLUMN users.role IS '역할: TRAINEE(훈련생), MENTOR(멘토), INSTRUCTOR(강사)';
COMMENT ON COLUMN users.course IS '과정명 및 기수';
COMMENT ON COLUMN users.privacy_consent IS '개인정보 수집 및 이용 동의 여부';
COMMENT ON COLUMN users.created_at IS '생성 일시';
COMMENT ON COLUMN users.updated_at IS '수정 일시';

COMMENT ON TABLE password_resets IS '비밀번호 재설정 인증번호 테이블';
COMMENT ON COLUMN password_resets.id IS '고유 ID';
COMMENT ON COLUMN password_resets.user_id IS '사용자 ID';
COMMENT ON COLUMN password_resets.code IS '8자리 인증코드(영문+숫자)';
COMMENT ON COLUMN password_resets.expires_at IS '인증번호 만료 시간';
COMMENT ON COLUMN password_resets.used IS '사용 여부';
COMMENT ON COLUMN password_resets.created_at IS '생성 일시';
