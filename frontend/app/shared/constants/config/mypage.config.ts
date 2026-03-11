// 탭 목록
export const MYPAGE_TABS = [
  { key: 'settings', label: '내 정보', href: '/mypage' },
  { key: 'posts', label: '내 블로그', href: '/mypage?tab=posts' },
  { key: 'drafts', label: '임시저장 목록', href: '/mypage?tab=drafts' },
  { key: 'recent', label: '최근 읽은 포스트', href: '/mypage?tab=recent' },
  { key: 'comments', label: '남긴 댓글', href: '/mypage?tab=comments' },
  { key: 'likes', label: '좋아한 포스트', href: '/mypage?tab=likes' },
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
