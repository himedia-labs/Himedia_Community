// 메뉴 레이블
export const ADMIN_MENU_LABELS = {
  PENDING_USERS: '회원 승인',
  USERS: '사용자',
  AUDIT_LOGS: '감사 로그',
  ACCESS_LOGS: '관리자 접속일지',
} as const;

// 역할 레이블
export const ADMIN_ROLE_LABEL_MAP: Record<string, string> = {
  TRAINEE: '훈련생',
  GRADUATE: '수료생',
  MENTOR: '멘토',
  INSTRUCTOR: '강사',
  ADMIN: '관리자',
};

// 정렬 옵션
export const ADMIN_PENDING_SORT = {
  NEWEST: 'NEWEST',
  OLDEST: 'OLDEST',
  ROLE_ASC: 'ROLE_ASC',
  ROLE_DESC: 'ROLE_DESC',
  COURSE_ASC: 'COURSE_ASC',
  COURSE_DESC: 'COURSE_DESC',
} as const;

// 쿼리 키
export const ADMIN_QUERY_KEYS = {
  TAB: 'tab',
  SORT: 'sort',
} as const;

// 탭 쿼리 값
export const ADMIN_TAB_QUERY_VALUE = {
  PENDING_USERS: 'pending',
  USERS: 'users',
  AUDIT_LOGS: 'audit',
  ACCESS_LOGS: 'access',
} as const;

// 정렬 쿼리 값
export const ADMIN_SORT_QUERY_VALUE = {
  OLDEST: 'oldest',
  NEWEST: 'newest',
  ROLE_ASC: 'role-asc',
  ROLE_DESC: 'role-desc',
  COURSE_ASC: 'course-asc',
  COURSE_DESC: 'course-desc',
} as const;
