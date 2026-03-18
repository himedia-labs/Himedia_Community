import type { AppRouterInstance } from 'next/dist/shared/lib/app-router-context.shared-runtime';

/**
 * 뷰 모드 토글 핸들러 생성
 * @description feeds ↔ sources 뷰 전환 시 URL 업데이트
 */
export const createHandleToggleView = (router: AppRouterInstance, activeView: string) => {
  return () => {
    router.replace(activeView === 'feeds' ? '/blogs?view=sources' : '/blogs');
  };
};
