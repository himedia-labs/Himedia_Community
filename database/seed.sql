-- Initial seed data

BEGIN;

INSERT INTO categories (id, name)
VALUES
  (1, 'Frontend'),
  (2, 'Backend'),
  (3, 'Algorithm'),
  (4, 'Data Structure'),
  (5, 'C / C++'),
  (6, 'Java'),
  (7, 'Python'),
  (8, 'Coding Test'),
  (9, 'Programming Basics'),
  (10, 'CS Basics'),
  (11, 'Network'),
  (12, 'Operating System'),
  (13, 'Database'),
  (14, 'DevOps'),
  (15, 'Cloud'),
  (16, 'Project'),
  (17, 'Troubleshooting'),
  (18, 'Dev Tools'),
  (19, 'Tech Essay'),
  (20, 'Study Note'),
  (21, 'Q&A');

-- External sample user
INSERT INTO users (
  id,
  name,
  email,
  password,
  phone,
  role,
  requested_role,
  course,
  birth_date,
  privacy_consent,
  approved,
  withdrawn,
  created_at,
  updated_at
)
SELECT
  910000000000000101,
  '외부 사용자',
  'external.user.seed@himedia.local',
  '$2b$10$7EqJtq98hPqEX7fNZaFWoO5fV6q8GxY6N5JfQfQAtF5NCz7L3A2G2',
  '01090001001',
  'GRADUATE',
  'GRADUATE',
  '외부 시드 과정',
  DATE '2000-01-01',
  true,
  true,
  false,
  NOW(),
  NOW()
WHERE NOT EXISTS (SELECT 1 FROM users WHERE id = 910000000000000101);

-- Published posts by external sample user
INSERT INTO posts (
  id,
  author_id,
  category_id,
  title,
  content,
  status,
  published_at,
  created_at,
  updated_at
)
VALUES (
  910000000000000001,
  910000000000000101,
  1,
  '외부 사용자 공개 게시글 예시',
  E'# 외부 사용자 공개 게시글\n\n이 게시글은 다른 사용자 계정으로 생성된 공개 게시글 시드 데이터입니다.\n\n- 카테고리: Frontend\n- 상태: PUBLISHED',
  'PUBLISHED',
  NOW(),
  NOW(),
  NOW()
)
ON CONFLICT (id) DO UPDATE SET
  author_id = EXCLUDED.author_id,
  category_id = EXCLUDED.category_id,
  title = EXCLUDED.title,
  content = EXCLUDED.content,
  status = EXCLUDED.status,
  published_at = EXCLUDED.published_at,
  updated_at = NOW();

COMMIT;
