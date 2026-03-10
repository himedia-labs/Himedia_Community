import type { MouseEvent } from 'react';

import type {
  PostSummaryDeleteHandlerParams,
  PostSummaryEditHandlerParams,
  PostSummaryMenuHandlerParams,
} from '@/app/shared/types/post';

/**
 * 링크 이동 중단
 * @description 카드 링크 내부 버튼 클릭 시 링크 이동과 이벤트 전파를 막습니다.
 */
export const stopLinkNavigation = (event: MouseEvent<HTMLElement>) => {
  event.preventDefault();
  event.stopPropagation();
};

/**
 * 게시글 메뉴 버튼 핸들러 생성
 * @description 데이터 속성의 게시글 ID를 읽어 메뉴 토글 함수를 실행합니다.
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
 * 게시글 수정 버튼 핸들러 생성
 * @description 데이터 속성의 게시글 ID를 읽어 수정 함수를 실행합니다.
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
 * 게시글 삭제 버튼 핸들러 생성
 * @description 데이터 속성의 게시글 ID를 읽어 삭제 함수를 실행합니다.
 */
export const createHandlePostDeleteButtonClick = (params: PostSummaryDeleteHandlerParams) => {
  return (event: MouseEvent<HTMLButtonElement>) => {
    params.stopLinkNavigation(event);
    const { postId } = event.currentTarget.dataset;
    if (!postId) return;
    params.onPostDelete?.(postId);
  };
};
