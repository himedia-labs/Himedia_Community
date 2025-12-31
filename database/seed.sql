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

INSERT INTO posts (id, author_id, category_id, title, content, status, published_at)
VALUES
  (1, 1, 1, 'Sample Post', 'Seeded post for API testing.', 'PUBLISHED', CURRENT_TIMESTAMP);

INSERT INTO comments (id, post_id, author_id, content, parent_id, depth)
VALUES
  (1, 1, 1, '첫 번째 댓글입니다.', NULL, 0),
  (2, 1, 1, '첫 번째 댓글에 대한 대댓글입니다.', 1, 1),
  (3, 1, 1, '대댓글에 대한 답글입니다.', 2, 2),
  (4, 1, 1, '두 번째 댓글입니다.', NULL, 0),
  (5, 1, 1, '두 번째 댓글에 대한 대댓글입니다.', 4, 1);

COMMIT;
