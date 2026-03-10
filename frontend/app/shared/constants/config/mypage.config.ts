// 탭 목록
export const MYPAGE_TABS = [
  { key: 'profile', label: '내 정보', href: '/mypage' },
  { key: 'activity', label: '내 활동', href: '/mypage?tab=activity' },
  { key: 'account', label: '계정 설정', href: '/mypage?tab=account' },
] as const;

// 입력 제한
export const BIO_MAX_LENGTH = 500;
export const COMMENT_MAX_LENGTH = 1000;
export const COMMENT_MAX_LENGTH_MESSAGE = '1,000자까지 입력 가능해요.';

// 스켈레톤 개수
export const SKELETON_ACCOUNT_ITEM_COUNT = 4;
export const SKELETON_COMMENT_LIST_COUNT = 3;
export const SKELETON_DRAFT_ITEM_COUNT = 5;
export const SKELETON_POST_LIST_COUNT = 3;
export const PROFILE_SOCIAL_SKELETON_COUNT = 6;
