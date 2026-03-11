import type { ChangeEvent, MouseEvent, RefObject } from 'react';
import type { CommentAuthorRef, CommentItem } from './comment';
import type { UserRole } from './post';

// 댓글 상태
export interface PostDetailReplyState {
  content: string;
  mentionQuery: string | null;
  parentId: string | null;
}

// 댓글 섹션
export interface PostDetailCommentsSectionProps {
  accessToken: string | null;
  commentCount: number;
  commentListRef: RefObject<HTMLDivElement | null>;
  commentMentionQuery: string | null;
  commentMentionSuggestions: string[];
  commentSort: 'popular' | 'latest';
  commentTextareaRef: RefObject<HTMLTextAreaElement | null>;
  content: string;
  editingCommentId: string | null;
  editingContent: string;
  getFlattenedReplies: (parentId: string) => CommentItem[];
  getReplyMentionSuggestions: (query: string | null) => string[];
  getReplyState: (rootId: string) => PostDetailReplyState;
  handleCommentBlur: () => void;
  handleCommentBlock: () => void;
  handleCommentChange: (event: ChangeEvent<HTMLTextAreaElement>) => void;
  handleCommentLikeToggle: (commentId: string) => void;
  handleCommentMenuToggle: (commentId: string) => void;
  handleCommentMentionSelect: (name: string) => (event: MouseEvent<HTMLButtonElement>) => void;
  handleCommentReport: () => void;
  handleCommentShare: (commentId: string) => void;
  handleCommentSortToggle: () => void;
  handleCommentSubmit: () => void;
  handleDeleteComment: (commentId: string) => void;
  handleEditCancel: () => void;
  handleEditChange: (event: ChangeEvent<HTMLTextAreaElement>) => void;
  handleEditStart: (commentId: string, nextContent: string) => void;
  handleEditSubmit: (commentId: string) => void;
  handleFollowToggle: (author: CommentAuthorRef | null) => void;
  handleReplyBlur: (rootId: string) => () => void;
  handleReplyCompositionEnd: (rootId: string) => () => void;
  handleReplyCompositionStart: (rootId: string) => () => void;
  handleReplyInput: (rootId: string) => () => void;
  handleReplyMentionSelect: (rootId: string, name: string) => (event: MouseEvent<HTMLButtonElement>) => void;
  handleReplySubmit: (rootId: string) => void;
  handleReplyToggle: (rootCommentId: string, comment: CommentItem, isReply: boolean) => void;
  hasEditingLengthError: boolean;
  hasLengthError: boolean;
  isCommentsLoading: boolean;
  isSubmitting: boolean;
  isUpdating: boolean;
  isAdmin: boolean;
  mentionRoleMap: Map<string, string>;
  openCommentMenuId: string | null;
  openRepliesIds: string[];
  postAuthorId: string | null;
  postId: string;
  replyCountMap: Map<string, number>;
  setReplyFormRef: (rootId: string) => (node: HTMLDivElement | null) => void;
  setReplyTextareaRef: (rootId: string) => (node: HTMLDivElement | null) => void;
  shouldShowCommentMentions: boolean;
  syncReplyMentionQuery: (rootId: string) => () => void;
  topLevelComments: CommentItem[];
}

// 훅 파라미터
export interface UsePostDetailCommentsParams {
  accessToken: string | null;
  authorName?: string | null;
  authorRole?: UserRole | null;
  isQueryEnabled: boolean;
  mentionClassName: string;
  postId: string;
}

// 댓글 맵
export type PostDetailReplyStatesMap = Record<string, PostDetailReplyState>;

// 댓글 핸들러
export type CreateCommentItemActionHandlersParams = {
  comment: CommentItem;
  isReply: boolean;
  rootCommentId: string;
  handleCommentMenuToggle: (commentId: string) => void;
  handleEditStart: (commentId: string, nextContent: string) => void;
  handleDeleteComment: (commentId: string) => void;
  handleFollowToggle: (author: CommentAuthorRef | null) => void;
  handleEditSubmit: (commentId: string) => void;
  handleCommentLikeToggle: (commentId: string) => void;
  handleReplyToggle: (rootCommentId: string, comment: CommentItem, isReply: boolean) => void;
  handleCommentShare: (commentId: string) => void;
  handleReplySubmit: (rootCommentId: string) => void;
};

// 댓글 블록
export interface PostDetailCommentBlockProps {
  accessToken: string | null;
  comment: CommentItem;
  depth?: number;
  rootId?: string;
  editingCommentId: string | null;
  editingContent: string;
  getFlattenedReplies: (parentId: string) => CommentItem[];
  getReplyMentionSuggestions: (query: string | null) => string[];
  getReplyState: (rootId: string) => PostDetailReplyState;
  handleCommentBlock: () => void;
  handleCommentLikeToggle: (commentId: string) => void;
  handleCommentMenuToggle: (commentId: string) => void;
  handleCommentReport: () => void;
  handleCommentShare: (commentId: string) => void;
  handleDeleteComment: (commentId: string) => void;
  handleEditCancel: () => void;
  handleEditChange: (event: ChangeEvent<HTMLTextAreaElement>) => void;
  handleEditStart: (commentId: string, nextContent: string) => void;
  handleEditSubmit: (commentId: string) => void;
  handleFollowToggle: (author: CommentAuthorRef | null) => void;
  handleReplyBlur: (rootId: string) => () => void;
  handleReplyCompositionEnd: (rootId: string) => () => void;
  handleReplyCompositionStart: (rootId: string) => () => void;
  handleReplyInput: (rootId: string) => () => void;
  handleReplyMentionSelect: (rootId: string, name: string) => (event: MouseEvent<HTMLButtonElement>) => void;
  handleReplySubmit: (rootId: string) => void;
  handleReplyToggle: (rootCommentId: string, comment: CommentItem, isReply: boolean) => void;
  hasEditingLengthError: boolean;
  isAdmin: boolean;
  isReply?: boolean;
  isUpdating: boolean;
  mentionRoleMap: Map<string, string>;
  openCommentMenuId: string | null;
  openRepliesIds: string[];
  postAuthorId: string | null;
  replyCountMap: Map<string, number>;
  setReplyFormRef: (rootId: string) => (node: HTMLDivElement | null) => void;
  setReplyTextareaRef: (rootId: string) => (node: HTMLDivElement | null) => void;
  syncReplyMentionQuery: (rootId: string) => () => void;
}

// 멘션 라벨
export interface MentionLabelProps {
  name: string;
  query: string | null;
}

// 멘션 역할
export interface MentionRoleProps {
  name: string;
  mentionRoleMap: Map<string, string>;
}
