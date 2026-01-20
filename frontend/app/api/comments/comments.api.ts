import { axiosInstance } from '@/app/shared/network/axios.instance';
import type { CommentListResponse } from '@/app/shared/types/comment';

const getComments = async (postId: string): Promise<CommentListResponse> => {
  const res = await axiosInstance.get<CommentListResponse>(`/posts/${postId}/comments`);
  return res.data;
};

export const commentsApi = {
  getComments,
};
