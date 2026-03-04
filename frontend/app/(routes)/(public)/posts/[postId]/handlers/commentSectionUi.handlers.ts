import type { SyntheticEvent } from 'react';

import type { CommentItem } from '@/app/shared/types/comment';

/**
 * 댓글 아이템 액션 핸들러 생성
 * @description 댓글 컨텍스트에 맞는 버튼 클릭 핸들러 묶음을 생성
 */
export const createCommentItemActionHandlers = (params: {
  comment: CommentItem;
  isReply: boolean;
  rootCommentId: string;
  handleCommentMenuToggle: (commentId: string) => void;
  handleEditStart: (commentId: string, nextContent: string) => void;
  handleDeleteComment: (commentId: string) => void;
  handleFollowToggle: (author: CommentItem['author']) => void;
  handleEditSubmit: (commentId: string) => void;
  handleCommentLikeToggle: (commentId: string) => void;
  handleReplyToggle: (rootCommentId: string, comment: CommentItem, isReply: boolean) => void;
  handleCommentShare: (commentId: string) => void;
  handleReplySubmit: (rootCommentId: string) => void;
}) => {
  return {
    handleMenuToggleClick: () => params.handleCommentMenuToggle(params.comment.id),
    handleEditStartClick: () => params.handleEditStart(params.comment.id, params.comment.content),
    handleDeleteClick: () => params.handleDeleteComment(params.comment.id),
    handleFollowClick: () => params.handleFollowToggle(params.comment.author),
    handleEditSubmitClick: () => params.handleEditSubmit(params.comment.id),
    handleLikeToggleClick: () => params.handleCommentLikeToggle(params.comment.id),
    handleReplyToggleClick: () => params.handleReplyToggle(params.rootCommentId, params.comment, params.isReply),
    handleShareClick: () => params.handleCommentShare(params.comment.id),
    handleReplySubmitClick: () => params.handleReplySubmit(params.rootCommentId),
  };
};

/**
 * 댓글 폼 제출 핸들러 생성
 * @description 기본 submit 동작을 막고 댓글 등록 함수를 실행
 */
export const createCommentFormSubmitHandler = (handleCommentSubmit: () => void) => {
  return (event: SyntheticEvent<HTMLFormElement>) => {
    event.preventDefault();
    handleCommentSubmit();
  };
};
