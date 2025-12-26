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

COMMIT;
