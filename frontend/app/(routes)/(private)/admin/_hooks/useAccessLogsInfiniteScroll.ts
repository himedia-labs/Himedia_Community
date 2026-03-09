import { ADMIN_MENU_LABELS } from '@/app/shared/constants/config/admin.config';

import { useInfiniteScrollObserver } from '@/app/shared/hooks/useInfiniteScrollObserver';
import type { UseAccessLogsInfiniteScrollParams } from '@/app/shared/types/admin';

/**
 * 접속일지 무한 스크롤 훅
 * @description 접속일지 탭에서 하단 트리거가 보이면 다음 페이지를 요청
 */
export const useAccessLogsInfiniteScroll = (params: UseAccessLogsInfiniteScrollParams) => {
  const { fetchNextPage, hasNextPage, isFetchingNextPage, loadMoreRef, selectedMenu } = params;
  const isEnabled = selectedMenu === ADMIN_MENU_LABELS.ACCESS_LOGS;

  useInfiniteScrollObserver({
    enabled: isEnabled,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    targetRef: loadMoreRef,
  });
};
