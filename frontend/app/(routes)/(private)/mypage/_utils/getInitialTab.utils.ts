import type { TabKey } from '@/app/shared/types/mypage';

/**
 * 탭 판별
 * @description 쿼리 탭 값을 현재 탭 구조에 맞게 정규화
 */
export const getInitialTab = (value?: string | null, defaultTab: TabKey = 'profile') => {
  if (value === 'activity' || value === 'account' || value === 'profile') {
    return value;
  }
  if (value === 'comments' || value === 'drafts' || value === 'likes' || value === 'recent' || value === 'posts') {
    return 'activity';
  }
  return defaultTab;
};
