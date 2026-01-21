import { useCallback, useState } from 'react';

import { useQueryClient } from '@tanstack/react-query';

import { commentsKeys } from '@/app/api/comments/comments.keys';
import { useCreateCommentMutation } from '@/app/api/comments/comments.mutations';
import { postsKeys } from '@/app/api/posts/posts.keys';

export const usePostCommentForm = (postId: string) => {
  const queryClient = useQueryClient();
  const [content, setContent] = useState('');
  const { mutateAsync, isPending } = useCreateCommentMutation(postId);

  const handleSubmit = useCallback(async () => {
    if (!postId) return;
    const trimmed = content.trim();
    if (!trimmed) return;

    await mutateAsync({ content: trimmed });
    setContent('');
    await queryClient.invalidateQueries({ queryKey: commentsKeys.list(postId) });
    await queryClient.invalidateQueries({ queryKey: postsKeys.detail(postId) });
  }, [content, mutateAsync, postId, queryClient]);

  return {
    content,
    isSubmitting: isPending,
    setContent,
    handleSubmit,
  };
};
