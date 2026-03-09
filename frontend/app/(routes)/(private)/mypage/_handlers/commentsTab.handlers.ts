import type { MouseEvent } from 'react';

import { stopMenuPropagation } from '@/app/(routes)/(private)/mypage/_handlers/stopMenuPropagation.handlers';

/**
 * 댓글 옵션 메뉴 버튼 클릭 핸들러 생성
 * @description 이벤트 전파를 차단하고 댓글 옵션 메뉴를 토글
 */
export const createHandleCommentMenuButtonClick = (handleCommentMenuToggle: (commentId: string) => void) => {
  return (event: MouseEvent<HTMLButtonElement>) => {
    stopMenuPropagation(event);
    const { commentId } = event.currentTarget.dataset;
    if (!commentId) return;
    handleCommentMenuToggle(commentId);
  };
};

/**
 * 댓글 수정 시작 버튼 클릭 핸들러 생성
 * @description 이벤트 전파를 차단하고 댓글 수정 모드를 시작
 */
export const createHandleEditStartButtonClick = (handleEditStart: (commentId: string, content: string) => void) => {
  return (event: MouseEvent<HTMLButtonElement>) => {
    stopMenuPropagation(event);
    const { commentId, commentContent } = event.currentTarget.dataset;
    if (!commentId || commentContent === undefined) return;
    handleEditStart(commentId, commentContent);
  };
};

/**
 * 댓글 삭제 버튼 클릭 핸들러 생성
 * @description 이벤트 전파를 차단하고 댓글 삭제를 수행
 */
export const createHandleDeleteButtonClick = (handleDeleteComment: (postId: string, commentId: string) => void) => {
  return (event: MouseEvent<HTMLButtonElement>) => {
    stopMenuPropagation(event);
    const { postId, commentId } = event.currentTarget.dataset;
    if (!postId || !commentId) return;
    handleDeleteComment(postId, commentId);
  };
};

/**
 * 댓글 수정 저장 버튼 클릭 핸들러 생성
 * @description 버튼 데이터의 게시글 id/댓글 id를 읽어 수정 저장을 수행
 */
export const createHandleEditSubmitButtonClick = (handleEditSubmit: (postId: string, commentId: string) => void) => {
  return (event: MouseEvent<HTMLButtonElement>) => {
    const { postId, commentId } = event.currentTarget.dataset;
    if (!postId || !commentId) return;
    handleEditSubmit(postId, commentId);
  };
};
