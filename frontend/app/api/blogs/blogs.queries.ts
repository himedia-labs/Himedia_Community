import { useInfiniteQuery, useQuery } from '@tanstack/react-query';

import { blogsApi } from '@/app/api/blogs/blogs.api';
import { blogsKeys } from '@/app/api/blogs/blogs.keys';

import type { BlogEntriesResponse, BlogFeedSourceView } from '@/app/shared/types/blogs';

// 블로그 글 무한스크롤 조회
export const useBlogsQuery = () => {
  return useInfiniteQuery<BlogEntriesResponse>({
    queryKey: blogsKeys.list(),
    queryFn: ({ pageParam }) => blogsApi.getEntries(pageParam as string | undefined),
    getNextPageParam: lastPage => lastPage.nextCursor ?? undefined,
    initialPageParam: undefined,
  });
};

// 피드 소스 목록 조회
export const useBlogSourcesQuery = () => {
  return useQuery<BlogFeedSourceView[]>({
    queryKey: blogsKeys.sources(),
    queryFn: blogsApi.getSources,
  });
};
