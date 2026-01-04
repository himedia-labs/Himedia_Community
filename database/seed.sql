-- Initial seed data

BEGIN;

INSERT INTO categories (id, name)
VALUES
  (1, 'Frontend'),
  (2, 'Backend'),
  (3, 'Full Stack'),
  (4, 'DevOps'),
  (5, 'AI Engineer'),
  (6, 'Data Engineer'),
  (7, 'Android'),
  (8, 'iOS'),
  (9, 'QA'),
  (10, 'Product Manager (PM)'),
  (11, 'UI/UX Designer');

INSERT INTO users (id, name, email, password, phone, role, requested_role, course, privacy_consent, approved)
VALUES
  (1, 'Demo User', 'demo@example.com', 'hashed_password', '01000000000', 'TRAINEE', NULL, 'Web Bootcamp', true, true);

INSERT INTO posts (id, author_id, category_id, title, content, status, published_at, view_count, like_count)
VALUES
  (1, 1, 1, '짧은 팁', 'CSS align-items 하나로 정렬 끝.', 'PUBLISHED', CURRENT_TIMESTAMP - INTERVAL '12 days', 15, 1),
  (2, 1, 1, '프론트엔드 성능 개선 체크리스트', '렌더링 최적화와 이미지 전략을 정리했습니다.', 'PUBLISHED', CURRENT_TIMESTAMP - INTERVAL '9 days', 120, 15),
  (3, 1, 2, 'NestJS 에러 핸들링 패턴', '에러 코드와 메시지를 분리해 프론트에서 바로 대응하는 방법.', 'PUBLISHED', CURRENT_TIMESTAMP - INTERVAL '8 days', 85, 8),
  (4, 1, 3, '풀스택 프로젝트 구조 정리와 협업 규칙', '모노레포에서 공통 타입과 API 규칙을 맞추는 팁.', 'PUBLISHED', CURRENT_TIMESTAMP - INTERVAL '7 days', 240, 32),
  (5, 1, 4, '배포 파이프라인 간단 구성', 'CI에서 빌드/테스트/배포까지 최소 구성으로 정리.', 'PUBLISHED', CURRENT_TIMESTAMP - INTERVAL '6 days', 60, 4),
  (6, 1, 5, 'AI 엔지니어 입문 로드맵: 모델보다 데이터', '데이터 준비와 실험 기록이 핵심입니다.', 'PUBLISHED', CURRENT_TIMESTAMP - INTERVAL '5 days', 310, 40),
  (7, 1, 6, '데이터 파이프라인 장애 대응 사례 정리', '재처리 전략과 재현 가능한 로그 설계를 다룹니다.', 'PUBLISHED', CURRENT_TIMESTAMP - INTERVAL '4 days', 45, 3),
  (8, 1, 7, 'Android 스튜디오 세팅 팁', '프로젝트 템플릿과 기본 설정을 빠르게 맞추기.', 'PUBLISHED', CURRENT_TIMESTAMP - INTERVAL '3 days', 180, 12),
  (9, 1, 8, 'iOS 테스트 자동화 시작하기', 'Xcode 테스트 타깃 구성과 기본 실행 흐름.', 'PUBLISHED', CURRENT_TIMESTAMP - INTERVAL '2 days', 95, 6),
  (10, 1, 9, 'QA 관점의 릴리즈 점검표', '스모크 테스트와 회귀 테스트 기준 정리.', 'PUBLISHED', CURRENT_TIMESTAMP - INTERVAL '36 hours', 130, 9),
  (11, 1, 10, 'PM이 보는 요구사항 정리법', '기능 범위와 우선순위를 합의하는 문서화 팁.', 'PUBLISHED', CURRENT_TIMESTAMP - INTERVAL '30 hours', 70, 5),
  (12, 1, 11, '디자인 시스템, 작은 팀에서 시작하는 법', '컴포넌트 규칙과 토큰 합의부터 시작해요.', 'PUBLISHED', CURRENT_TIMESTAMP - INTERVAL '24 hours', 55, 2),
  (13, 1, 1, '한 줄 팁: React re-render 줄이기', 'memo와 key 정리만으로도 큰 차이가 납니다.', 'PUBLISHED', CURRENT_TIMESTAMP - INTERVAL '18 hours', 22, 0),
  (14, 1, 2, '로그인 플로우에서 자주 발생하는 실수 7가지와 해결', '권한/토큰/리다이렉트 흐름을 점검하세요.', 'PUBLISHED', CURRENT_TIMESTAMP - INTERVAL '12 hours', 260, 28),
  (15, 1, 2, 'PostgreSQL 인덱스 튜닝 기록: 느린 쿼리를 줄이는 과정', '실행 계획을 비교하며 인덱스를 재구성했습니다.', 'PUBLISHED', CURRENT_TIMESTAMP - INTERVAL '6 hours', 410, 50),
  (16, 1, 4, 'CI가 자주 실패할 때 체크할 것들 (실전 경험)', '캐시 무효화와 환경 변수 설정을 우선 확인.', 'PUBLISHED', CURRENT_TIMESTAMP - INTERVAL '3 hours', 90, 7),
  (17, 1, 10, '프로덕트 지표가 안 움직일 때 먼저 봐야 할 것', '지표 정의와 세그먼트 분리를 재점검.', 'PUBLISHED', CURRENT_TIMESTAMP - INTERVAL '90 minutes', 150, 11),
  (18, 1, 8, '모바일 앱 배포 전 체크리스트', '스토어 심사 기준과 릴리즈 노트 정리.', 'PUBLISHED', CURRENT_TIMESTAMP - INTERVAL '20 minutes', 33, 1);

INSERT INTO comments (id, post_id, author_id, content, parent_id, depth)
VALUES
  (1, 1, 1, '짧지만 유용하네요.', NULL, 0),
  (2, 2, 1, '체계적으로 정리돼서 좋아요.', NULL, 0),
  (3, 2, 1, '에러 코드 분리 팁 감사합니다.', NULL, 0),
  (4, 2, 1, '저도 같은 방식으로 써볼게요.', 2, 1),
  (5, 4, 1, '구조 정리 참고했습니다.', NULL, 0),
  (6, 4, 1, '규칙 문서화 팁도 궁금해요.', NULL, 0),
  (7, 5, 1, '파이프라인 구성 도움이 됐어요.', NULL, 0),
  (8, 6, 1, '로드맵 도움돼요.', NULL, 0),
  (9, 6, 1, '데이터 준비 공감합니다.', NULL, 0),
  (10, 6, 1, '질문 하나 있어요.', NULL, 0),
  (11, 6, 1, '어떤 실험 로그를 남기시나요?', 10, 1),
  (12, 6, 1, '저는 실험 id로 묶어둡니다.', 11, 2),
  (13, 7, 1, '재처리 전략 궁금했어요.', NULL, 0),
  (14, 8, 1, '세팅 과정이 명확하네요.', NULL, 0),
  (15, 8, 1, '에뮬레이터 설정도 추가해주세요.', NULL, 0),
  (16, 8, 1, '추가 예정입니다.', 15, 1),
  (17, 9, 1, '테스트 자동화 시작에 도움됐어요.', NULL, 0),
  (18, 10, 1, '체크리스트 유용합니다.', NULL, 0),
  (19, 11, 1, '문서 템플릿 공유 가능한가요?', NULL, 0),
  (20, 11, 1, '팀에 바로 적용해볼게요.', NULL, 0),
  (21, 12, 1, '작게 시작하는 조언 좋네요.', NULL, 0),
  (22, 14, 1, '실수 사례가 도움돼요.', NULL, 0),
  (23, 14, 1, '권한 처리에서 막혔는데 해결됐어요.', NULL, 0),
  (24, 14, 1, '토큰 재발급 흐름도 중요하죠.', 23, 1),
  (25, 14, 1, '맞아요. 리프레시 토큰 누락이 많아요.', 24, 2),
  (26, 15, 1, '인덱스 설계가 깔끔하네요.', NULL, 0),
  (27, 15, 1, '실행 계획 캡처 공유 부탁해요.', NULL, 0),
  (28, 15, 1, '상황에 따라 다르지만 공유 가능해요.', 27, 1),
  (29, 15, 1, '튜닝 전후 비교 좋습니다.', NULL, 0),
  (30, 15, 1, '파티셔닝도 고려하셨나요?', NULL, 0),
  (31, 16, 1, '캐시 깨짐 때문에 많이 봤던 이슈네요.', NULL, 0),
  (32, 17, 1, '지표 정의부터 다시 보라는 말 공감.', NULL, 0),
  (33, 17, 1, '세그먼트 나눠보는 게 핵심이죠.', NULL, 0),
  (34, 18, 1, '스토어 심사 체크리스트 유용합니다.', NULL, 0),
  (35, 18, 1, '릴리즈 노트 작성 팁도 부탁해요.', 34, 1);

COMMIT;
