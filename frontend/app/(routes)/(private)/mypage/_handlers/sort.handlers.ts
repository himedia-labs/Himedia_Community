import type { ActivitySortKey } from '@/app/shared/types/mypage';

/**
 * 정렬 토글 핸들러 생성
 * @description 최신순과 인기순 상태를 번갈아 전환
 */
export const createHandleSortToggle = (handleSortChange: (nextSortKey: ActivitySortKey) => void, sortKey: ActivitySortKey) => {
  return () => {
    handleSortChange(sortKey === 'latest' ? 'popular' : 'latest');
  };
};
