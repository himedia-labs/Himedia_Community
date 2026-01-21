import type { UserRole } from './post';

export interface CommentAuthorRef {
  id: string;
  name: string;
  role: UserRole;
}

export interface CommentItem {
  id: string;
  content: string;
  parentId: string | null;
  depth: number;
  likeCount: number;
  dislikeCount: number;
  liked: boolean;
  createdAt: string;
  updatedAt: string;
  author: CommentAuthorRef | null;
}

export type CommentListResponse = CommentItem[];

export interface CreateCommentRequest {
  content: string;
  parentId?: string | null;
}

export interface CreateCommentResponse {
  id: string;
}

export interface ToggleCommentLikeResponse {
  likeCount: number;
  liked: boolean;
}
