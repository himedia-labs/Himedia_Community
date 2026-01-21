import { axiosInstance } from '@/app/shared/network/axios.instance';
import type { CommentListResponse, CreateCommentRequest, CreateCommentResponse } from '@/app/shared/types/comment';

const getComments = async (postId: string): Promise<CommentListResponse> => {
  const res = await axiosInstance.get<CommentListResponse>(`/posts/${postId}/comments`);
  return res.data;
};

const createComment = async (postId: string, payload: CreateCommentRequest): Promise<CreateCommentResponse> => {
  const res = await axiosInstance.post<CreateCommentResponse>(`/posts/${postId}/comments`, payload);
  return res.data;
};

export const commentsApi = {
  getComments,
  createComment,
};
