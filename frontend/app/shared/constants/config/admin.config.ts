import { FiBell, FiFileText, FiLogIn, FiRefreshCw, FiUserCheck, FiUsers } from 'react-icons/fi';

import type { IconType } from 'react-icons';

interface AdminSidebarItem {
  menuLabel: string;
  text: string;
  Icon: IconType;
}

interface AdminSidebarSection {
  label: string;
  items: AdminSidebarItem[];
}

// 메뉴 레이블
export const ADMIN_MENU_LABELS = {
  PENDING_USERS: '가입 요청',
  REJECTED_USERS: '거절 계정',
  USERS: '사용자',
  ADMINS: '관리자',
  NOTICE_ANNOUNCEMENTS: '공지사항',
  NOTICE_UPDATES: '업데이트',
  NOTICE_POST_CREATE: '공지사항 글 작성',
  NOTICE_UPDATE_CREATE: '업데이트 내역 글 작성',
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
  REJECTED_USERS: 'rejected',
  USERS: 'users',
  ADMINS: 'admins',
  NOTICE_ANNOUNCEMENTS: 'notice-announcements',
  NOTICE_UPDATES: 'notice-updates',
  NOTICE_POST_CREATE: 'notice-post-create',
  NOTICE_UPDATE_CREATE: 'notice-update-create',
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

// 사이드바 섹션
export const ADMIN_SIDEBAR_SECTIONS: AdminSidebarSection[] = [
  {
    label: '관리',
    items: [
      { menuLabel: ADMIN_MENU_LABELS.USERS, text: '사용자', Icon: FiUsers },
      { menuLabel: ADMIN_MENU_LABELS.ADMINS, text: '관리자', Icon: FiUsers },
      { menuLabel: ADMIN_MENU_LABELS.PENDING_USERS, text: '가입 요청', Icon: FiUserCheck },
      { menuLabel: ADMIN_MENU_LABELS.REJECTED_USERS, text: '거절 계정', Icon: FiUserCheck },
    ],
  },
  {
    label: '공지',
    items: [
      { menuLabel: ADMIN_MENU_LABELS.NOTICE_ANNOUNCEMENTS, text: '공지사항', Icon: FiBell },
      { menuLabel: ADMIN_MENU_LABELS.NOTICE_UPDATES, text: '업데이트', Icon: FiRefreshCw },
    ],
  },
  {
    label: '모니터링',
    items: [
      { menuLabel: ADMIN_MENU_LABELS.AUDIT_LOGS, text: '감사 로그', Icon: FiFileText },
      { menuLabel: ADMIN_MENU_LABELS.ACCESS_LOGS, text: '관리자 접속일지', Icon: FiLogIn },
    ],
  },
];

// 승인 정렬 옵션
export const ADMIN_PENDING_SORT_OPTIONS = [
  { id: ADMIN_PENDING_SORT.OLDEST, label: '오래된 가입 순' },
  { id: ADMIN_PENDING_SORT.NEWEST, label: '최근 가입 순' },
] as const;

// 역할 필터 옵션
export const ADMIN_ROLE_FILTER_OPTIONS = [
  { id: 'ALL', label: '전체 역할' },
  { id: 'TRAINEE', label: '훈련생' },
  { id: 'GRADUATE', label: '수료생' },
  { id: 'MENTOR', label: '멘토' },
  { id: 'INSTRUCTOR', label: '강사' },
] as const;
