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
  (20, 'Study Note');

COMMIT;
