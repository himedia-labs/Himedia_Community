import { useMutation } from '@tanstack/react-query';

import { commentsApi } from './comments.api';
import type {
  CreateCommentRequest,
  CreateCommentResponse,
  ToggleCommentLikeResponse,
} from '@/app/shared/types/comment';

// 댓글 생성
export const useCreateCommentMutation = (postId: string) => {
  return useMutation<CreateCommentResponse, Error, CreateCommentRequest>({
    mutationFn: payload => commentsApi.createComment(postId, payload),
  });
};

// 댓글 좋아요 토글
export const useToggleCommentLikeMutation = (postId: string, commentId: string) => {
  return useMutation<ToggleCommentLikeResponse, Error, void>({
    mutationFn: () => commentsApi.toggleCommentLike(postId, commentId),
  });
};
