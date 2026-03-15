import { useMutation, useQueryClient } from '@tanstack/react-query';

import { noticesApi } from '@/app/api/notices/notices.api';
import { noticesKeys } from '@/app/api/notices/notices.keys';

import type { CreateNoticeRequest, CreateNoticeResponse } from '@/app/shared/types/notices';

// 공지 생성
export const useCreateNoticeMutation = () => {
  const queryClient = useQueryClient();

  return useMutation<CreateNoticeResponse, Error, CreateNoticeRequest>({
    mutationFn: noticesApi.createNotice,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: noticesKeys.all });
    },
  });
};
