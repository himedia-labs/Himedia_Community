import type { TabKey } from '@/app/shared/types/mypage';

/**
 * 탭 판별
 * @description 쿼리 탭 값을 현재 탭 구조에 맞게 정규화
 */
export const getInitialTab = (value?: string | null, defaultTab: TabKey = 'settings') => {
  if (
    value === 'account' ||
    value === 'comments' ||
    value === 'drafts' ||
    value === 'likes' ||
    value === 'posts' ||
    value === 'recent' ||
    value === 'settings'
  ) {
    return value;
  }
  if (value === 'activity') {
    return 'posts';
  }
  if (value === 'profile') {
    return 'settings';
  }
  return defaultTab;
};
