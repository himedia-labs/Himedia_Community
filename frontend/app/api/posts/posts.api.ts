import { axiosInstance } from '@/app/shared/network/axios.instance';
import type { CreatePostRequest, CreatePostResponse, PostListQuery, PostListResponse } from '@/app/shared/types/post';

const getPosts = async (params?: PostListQuery): Promise<PostListResponse> => {
  const res = await axiosInstance.get<PostListResponse>('/posts', { params });
  return res.data;
};

// 게시물 생성
const createPost = async (payload: CreatePostRequest): Promise<CreatePostResponse> => {
  const res = await axiosInstance.post<CreatePostResponse>('/posts', payload);
  return res.data;
};

export const postsApi = {
  getPosts,
  createPost,
};
