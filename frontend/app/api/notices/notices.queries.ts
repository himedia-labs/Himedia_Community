import { useQuery } from '@tanstack/react-query';

import { noticesApi } from '@/app/api/notices/notices.api';
import { noticesKeys } from '@/app/api/notices/notices.keys';

import type { NoticesListResponse } from '@/app/shared/types/notices';

// 공지 목록 조회
export const useNoticesQuery = (enabled = true) => {
  return useQuery<NoticesListResponse>({
    queryKey: noticesKeys.list(),
    queryFn: () => noticesApi.getNotices(),
    enabled,
  });
};
