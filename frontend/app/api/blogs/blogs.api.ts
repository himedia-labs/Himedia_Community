import { axiosBare } from '@/app/shared/lib/axios/axios.config';

import type { BlogEntriesResponse, BlogFeedSourceView } from '@/app/shared/types/blogs';

// 블로그 글 목록 조회
const getEntries = async (cursor?: string): Promise<BlogEntriesResponse> => {
  const params = cursor ? { cursor } : {};
  const res = await axiosBare.get<BlogEntriesResponse>('/blogs', { params });
  return res.data;
};

// 피드 소스 목록 조회
const getSources = async (): Promise<BlogFeedSourceView[]> => {
  const res = await axiosBare.get<BlogFeedSourceView[]>('/blogs/sources');
  return res.data;
};

// 조회수 증가
const incrementViews = async (entryId: string): Promise<{ id: string; views: number }> => {
  const res = await axiosBare.patch<{ id: string; views: number }>(`/blogs/${entryId}/views`);
  return res.data;
};

export const blogsApi = {
  getEntries,
  getSources,
  incrementViews,
};
