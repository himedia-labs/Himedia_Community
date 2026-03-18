import { useMutation } from '@tanstack/react-query';

import { blogsApi } from '@/app/api/blogs/blogs.api';

// 조회수 증가
export const useIncrementViewsMutation = () => {
  return useMutation({
    mutationFn: (entryId: string) => blogsApi.incrementViews(entryId),
  });
};
