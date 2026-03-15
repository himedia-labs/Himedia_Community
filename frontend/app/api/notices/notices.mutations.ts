import { useMutation, useQueryClient } from '@tanstack/react-query';

import { noticesApi } from '@/app/api/notices/notices.api';
import { noticesKeys } from '@/app/api/notices/notices.keys';

import type { CreateNoticeRequest, CreateNoticeResponse, UpdateNoticeRequest } from '@/app/shared/types/notices';

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

// 공지 수정
export const useUpdateNoticeMutation = () => {
  const queryClient = useQueryClient();

  return useMutation<{ id: string }, Error, { noticeId: string; payload: UpdateNoticeRequest }>({
    mutationFn: ({ noticeId, payload }) => noticesApi.updateNotice(noticeId, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: noticesKeys.all });
    },
  });
};

// 공지 삭제
export const useDeleteNoticeMutation = () => {
  const queryClient = useQueryClient();

  return useMutation<{ id: string }, Error, string>({
    mutationFn: noticesApi.deleteNotice,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: noticesKeys.all });
    },
  });
};
