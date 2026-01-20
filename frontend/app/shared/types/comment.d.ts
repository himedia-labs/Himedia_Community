export interface CommentAuthorRef {
  id: string;
  name: string;
}

export interface CommentItem {
  id: string;
  content: string;
  parentId: string | null;
  depth: number;
  likeCount: number;
  dislikeCount: number;
  createdAt: string;
  updatedAt: string;
  author: CommentAuthorRef | null;
}

export type CommentListResponse = CommentItem[];
