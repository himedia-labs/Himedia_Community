import type { AppRouterInstance } from 'next/dist/shared/lib/app-router-context.shared-runtime';

/**
 * 게시물 수정 핸들러
 * @description 버튼 클릭 등 화면 이벤트를 처리
 */
export const createExitHandler = (router: AppRouterInstance, postId?: string) => () => {
  router.push(postId ? `/posts/${postId}` : '/');
};
