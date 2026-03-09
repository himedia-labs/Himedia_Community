import type { MouseEvent } from 'react';
import type {
  PostSummaryDeleteHandlerParams,
  PostSummaryEditHandlerParams,
  PostSummaryMenuHandlerParams,
} from '@/app/shared/types/post';

/**
 * 게시글 메뉴 버튼 클릭 핸들러 생성
 * @description 링크 이동을 막고 게시글 메뉴를 토글
 */
export const createHandlePostMenuButtonClick = (params: PostSummaryMenuHandlerParams) => {
  return (event: MouseEvent<HTMLButtonElement>) => {
    params.stopLinkNavigation(event);
    const { postId } = event.currentTarget.dataset;
    if (!postId) return;
    params.onPostMenuToggle?.(postId);
  };
};

/**
 * 게시글 수정 버튼 클릭 핸들러 생성
 * @description 링크 이동을 막고 게시글 수정 핸들러를 실행
 */
export const createHandlePostEditButtonClick = (params: PostSummaryEditHandlerParams) => {
  return (event: MouseEvent<HTMLButtonElement>) => {
    params.stopLinkNavigation(event);
    const { postId } = event.currentTarget.dataset;
    if (!postId) return;
    params.onPostEdit?.(postId);
  };
};

/**
 * 게시글 삭제 버튼 클릭 핸들러 생성
 * @description 링크 이동을 막고 게시글 삭제 핸들러를 실행
 */
export const createHandlePostDeleteButtonClick = (params: PostSummaryDeleteHandlerParams) => {
  return (event: MouseEvent<HTMLButtonElement>) => {
    params.stopLinkNavigation(event);
    const { postId } = event.currentTarget.dataset;
    if (!postId) return;
    params.onPostDelete?.(postId);
  };
};
