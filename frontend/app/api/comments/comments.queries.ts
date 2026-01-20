import { useQuery } from '@tanstack/react-query';

import { commentsApi } from './comments.api';
import { commentsKeys } from './comments.keys';
import type { CommentListResponse } from '@/app/shared/types/comment';

type QueryOptions = {
  enabled?: boolean;
};

export const usePostCommentsQuery = (postId?: string, options?: QueryOptions) => {
  return useQuery<CommentListResponse, Error>({
    queryKey: commentsKeys.list(postId),
    queryFn: () => commentsApi.getComments(postId ?? ''),
    enabled: Boolean(postId) && (options?.enabled ?? true),
  });
};
