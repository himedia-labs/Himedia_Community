import type { AppRouterInstance } from 'next/dist/shared/lib/app-router-context.shared-runtime';

/**
 * 게시물 수정 나가기 핸들러
 * @description 상세 페이지로 이동
 */
export const createExitHandler = (router: AppRouterInstance, postId?: string) => () => {
  router.push(postId ? `/posts/${postId}` : '/');
};
