import type { MouseEvent } from 'react';

import { stopMenuPropagation } from '@/app/(routes)/(private)/mypage/handlers/stopMenuPropagation.handlers';

/**
 * 좋아요 목록 메뉴 버튼 클릭 핸들러 생성
 * @description 이벤트 전파를 차단하고 게시글 메뉴를 토글
 */
export const createHandlePostMenuButtonClick = (handlePostMenuToggle: (postId: string) => void) => {
  return (event: MouseEvent<HTMLButtonElement>) => {
    stopMenuPropagation(event);
    const { postId } = event.currentTarget.dataset;
    if (!postId) return;
    handlePostMenuToggle(postId);
  };
};

/**
 * 좋아요 목록 수정 버튼 클릭 핸들러 생성
 * @description 이벤트 전파를 차단하고 게시글 수정 화면으로 이동
 */
export const createHandlePostEditButtonClick = (handlePostEdit: (postId: string) => void) => {
  return (event: MouseEvent<HTMLButtonElement>) => {
    stopMenuPropagation(event);
    const { postId } = event.currentTarget.dataset;
    if (!postId) return;
    handlePostEdit(postId);
  };
};

/**
 * 좋아요 목록 삭제 버튼 클릭 핸들러 생성
 * @description 이벤트 전파를 차단하고 게시글 삭제를 수행
 */
export const createHandlePostDeleteButtonClick = (handlePostDelete: (postId: string) => void) => {
  return (event: MouseEvent<HTMLButtonElement>) => {
    stopMenuPropagation(event);
    const { postId } = event.currentTarget.dataset;
    if (!postId) return;
    handlePostDelete(postId);
  };
};
