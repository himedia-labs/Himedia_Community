import { axiosInstance } from '@/app/shared/network/axios.instance';
import type { TagSuggestionResponse } from '@/app/shared/types/post';

const getTagSuggestions = async (query: string, limit?: number): Promise<TagSuggestionResponse> => {
  const params: { query: string; limit?: number } = { query };
  if (typeof limit === 'number') {
    params.limit = limit;
  }

  const res = await axiosInstance.get<TagSuggestionResponse>('/tags/suggest', { params });
  return res.data;
};

export const tagsApi = {
  getTagSuggestions,
};
