import type { UserRole } from './post';

// 공통 응답
type CommentMutationResponse = {
  id: string;
};

type CommentQueryOptions = {
  enabled?: boolean;
};

// 댓글 모델
export interface CommentAuthorRef {
  id: string;
  name: string;
  role: UserRole;
  profileImageUrl?: string | null;
  followerCount?: number;
  isFollowing?: boolean;
}

export interface CommentItem {
  id: string;
  content: string;
  parentId: string | null;
  depth: number;
  likeCount: number;
  dislikeCount: number;
  liked: boolean;
  isOwner: boolean;
  createdAt: string;
  updatedAt: string;
  author: CommentAuthorRef | null;
}

export type CommentListResponse = CommentItem[];

export interface CommentPostRef {
  id: string;
  title: string;
  thumbnailUrl: string | null;
}

export interface MyCommentItem {
  id: string;
  content: string;
  createdAt: string;
  likeCount: number;
  replyCount: number;
  parentId?: string | null;
  post: CommentPostRef | null;
}

export type MyCommentListResponse = MyCommentItem[];

// API 요청/응답
export type CommentsQueryOptions = CommentQueryOptions;

export interface CreateCommentRequest {
  content: string;
  parentId?: string | null;
}

export type CreateCommentResponse = CommentMutationResponse;

export interface UpdateCommentRequest {
  content: string;
}

export type UpdateCommentResponse = CommentMutationResponse;

export type DeleteCommentResponse = CommentMutationResponse;

export interface ToggleCommentLikeResponse {
  likeCount: number;
  liked: boolean;
}
