import { useQuery } from '@tanstack/react-query';

import { commentsApi } from '@/app/api/comments/comments.api';
import { commentsKeys } from '@/app/api/comments/comments.keys';

import type { CommentListResponse, CommentsQueryOptions, MyCommentListResponse } from '@/app/shared/types/comment';

// 게시글 댓글 조회
export const usePostCommentsQuery = (postId?: string, options?: CommentsQueryOptions) => {
  return useQuery<CommentListResponse, Error>({
    queryKey: commentsKeys.list(postId),
    queryFn: () => commentsApi.getComments(postId ?? ''),
    enabled: Boolean(postId) && (options?.enabled ?? true),
  });
};

// 내 댓글 조회
export const useMyCommentsQuery = (options?: CommentsQueryOptions) => {
  return useQuery<MyCommentListResponse, Error>({
    queryKey: commentsKeys.myList(),
    queryFn: () => commentsApi.getMyComments(),
    enabled: options?.enabled ?? true,
  });
};
