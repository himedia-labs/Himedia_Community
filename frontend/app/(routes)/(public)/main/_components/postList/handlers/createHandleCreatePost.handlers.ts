import type { PostListCreatePostParams } from '@/app/shared/types/post';

/**
 * 게시물 작성 버튼 핸들러
 * @description 게시물 작성 페이지로 이동
 */
export const createHandleCreatePost = (params: PostListCreatePostParams) => {
  return () => {
    params.router.push('/posts/new');
  };
};
