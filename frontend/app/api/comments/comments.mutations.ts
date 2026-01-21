import { useMutation } from '@tanstack/react-query';

import { commentsApi } from './comments.api';
import type { CreateCommentRequest, CreateCommentResponse } from '@/app/shared/types/comment';

// 댓글 생성
export const useCreateCommentMutation = (postId: string) => {
  return useMutation<CreateCommentResponse, Error, CreateCommentRequest>({
    mutationFn: payload => commentsApi.createComment(postId, payload),
  });
};
