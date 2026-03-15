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

-- Notices sample users
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
VALUES
  (
    910000000000000102,
    '공지 반응 사용자 1',
    'notice.user1.seed@himedia.local',
    '$2b$10$7EqJtq98hPqEX7fNZaFWoO5fV6q8GxY6N5JfQfQAtF5NCz7L3A2G2',
    '01090001002',
    'GRADUATE',
    'GRADUATE',
    '공지 시드 과정',
    DATE '1999-06-01',
    true,
    true,
    false,
    NOW(),
    NOW()
  ),
  (
    910000000000000103,
    '공지 반응 사용자 2',
    'notice.user2.seed@himedia.local',
    '$2b$10$7EqJtq98hPqEX7fNZaFWoO5fV6q8GxY6N5JfQfQAtF5NCz7L3A2G2',
    '01090001003',
    'GRADUATE',
    'GRADUATE',
    '공지 시드 과정',
    DATE '1998-08-14',
    true,
    true,
    false,
    NOW(),
    NOW()
  )
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  email = EXCLUDED.email,
  password = EXCLUDED.password,
  phone = EXCLUDED.phone,
  role = EXCLUDED.role,
  requested_role = EXCLUDED.requested_role,
  course = EXCLUDED.course,
  birth_date = EXCLUDED.birth_date,
  privacy_consent = EXCLUDED.privacy_consent,
  approved = EXCLUDED.approved,
  withdrawn = EXCLUDED.withdrawn,
  updated_at = NOW();

-- Notices sample data
INSERT INTO notices (
  id,
  type,
  title,
  version,
  admin_name,
  admin_initial,
  release_type,
  release_scope,
  markdown_content,
  published_at,
  created_at,
  updated_at
)
VALUES
  (
    920000000000000001,
    'ANNOUNCEMENT',
    '3월 포트폴리오 피드백 세션 신청 안내',
    NULL,
    NULL,
    NULL,
    NULL,
    NULL,
    NULL,
    TIMESTAMP '2026-03-12 09:00:00',
    NOW(),
    NOW()
  ),
  (
    920000000000000002,
    'ANNOUNCEMENT',
    '웹 프론트엔드 실전 프로젝트 발표 일정 공지',
    NULL,
    NULL,
    NULL,
    NULL,
    NULL,
    NULL,
    TIMESTAMP '2026-03-10 09:00:00',
    NOW(),
    NOW()
  ),
  (
    920000000000000003,
    'ANNOUNCEMENT',
    '채용 연계 기업 설명회 사전 등록 오픈',
    NULL,
    NULL,
    NULL,
    NULL,
    NULL,
    NULL,
    TIMESTAMP '2026-03-04 09:00:00',
    NOW(),
    NOW()
  ),
  (
    920000000000000004,
    'ANNOUNCEMENT',
    '백엔드 심화반 코드리뷰 운영 방식 안내',
    NULL,
    NULL,
    NULL,
    NULL,
    NULL,
    NULL,
    TIMESTAMP '2026-02-27 09:00:00',
    NOW(),
    NOW()
  ),
  (
    920000000000000005,
    'UPDATE',
    '알림 흐름과 프로필 진입 구조를 한 번에 정리했습니다.',
    'v1.4.0',
    'Junho',
    'J',
    'Production',
    'Web App',
    E'### Added\n- 전체 알림 보기 페이지 진입 흐름을 정리했습니다.\n- 헤더에서 바로 주요 활동으로 이동할 수 있도록 연결 구조를 다듬었습니다.\n\n### Changed\n- 읽지 않은 알림 상태 표현을 더 빠르게 확인할 수 있게 조정했습니다.\n- 프로필 드롭다운 동선을 실제 사용 흐름에 맞춰 다시 정렬했습니다.\n\n### Notes\n> 알림 확인과 프로필 진입은 모바일에서도 같은 순서로 동작하도록 맞췄습니다.',
    TIMESTAMP '2026-03-12 09:00:00',
    NOW(),
    NOW()
  ),
  (
    920000000000000006,
    'UPDATE',
    '검색 결과 화면의 밀도와 로딩 체감을 줄였습니다.',
    'v1.3.5',
    'Junho',
    'J',
    'Patch',
    'Search',
    E'### Changed\n- 검색 페이지 로딩 시 리스트 스켈레톤 개수를 줄여 실제 결과와 더 비슷한 밀도로 맞췄습니다.\n- 메인 리스트 로딩 길이도 같은 기준으로 정리했습니다.\n\n### Improved\n- 검색 모드에서 시선이 분산되지 않도록 화면 구성을 조금 더 가볍게 조정했습니다.',
    TIMESTAMP '2026-03-08 09:00:00',
    NOW(),
    NOW()
  ),
  (
    920000000000000007,
    'UPDATE',
    '마이페이지와 공통 레이아웃 기준을 다시 정리했습니다.',
    'v1.3.0',
    'Junho',
    'J',
    'Layout',
    'Global UI',
    E'### Fixed\n- 본문 높이에 따라 footer 위치가 오르내리던 문제를 수정했습니다.\n\n### Changed\n- 전역 layout 기준을 다시 잡아 private/public 페이지 모두 같은 바닥 기준을 사용합니다.\n- 마이페이지와 알림 페이지 프로필 헤더 간격을 동일한 기준으로 통일했습니다.',
    TIMESTAMP '2026-03-01 09:00:00',
    NOW(),
    NOW()
  )
ON CONFLICT (id) DO UPDATE SET
  type = EXCLUDED.type,
  title = EXCLUDED.title,
  version = EXCLUDED.version,
  admin_name = EXCLUDED.admin_name,
  admin_initial = EXCLUDED.admin_initial,
  release_type = EXCLUDED.release_type,
  release_scope = EXCLUDED.release_scope,
  markdown_content = EXCLUDED.markdown_content,
  published_at = EXCLUDED.published_at,
  updated_at = NOW();

-- Notices sample reactions
INSERT INTO notice_reactions (notice_id, user_id, emoji, created_at)
VALUES
  (920000000000000005, 910000000000000101, '👍', NOW()),
  (920000000000000005, 910000000000000102, '👍', NOW()),
  (920000000000000005, 910000000000000103, '🎉', NOW()),
  (920000000000000005, 910000000000000103, '❤️', NOW()),
  (920000000000000007, 910000000000000101, '✅', NOW()),
  (920000000000000007, 910000000000000102, '🛠️', NOW())
ON CONFLICT (notice_id, user_id, emoji) DO NOTHING;

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
