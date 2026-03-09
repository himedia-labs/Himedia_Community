import type { ProfilePageSetSortKey } from '@/app/shared/types/profilePage';

/**
 * 정렬 토글 핸들러
 * @description 최신순/인기순을 토글합니다.
 */
export const createSortToggleHandler = (setSortKey: ProfilePageSetSortKey) => () => {
  setSortKey(prev => (prev === 'latest' ? 'popular' : 'latest'));
};
