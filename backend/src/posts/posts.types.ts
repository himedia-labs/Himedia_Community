import type { Request as ExpressRequest } from 'express';

import { POST_FEED_OPTIONS } from '@/posts/posts.constants';

import type { JwtPayload } from '@/auth/interfaces/jwt.interface';

// 타입/정의
export type AuthRequest = ExpressRequest & { user: JwtPayload };

export type OptionalAuthRequest = ExpressRequest & { user?: JwtPayload };

export enum PostSortOption {
  CREATED_AT = 'createdAt',
  PUBLISHED_AT = 'publishedAt',
  VIEW_COUNT = 'viewCount',
  LIKE_COUNT = 'likeCount',
}

export type PostFeedOption = (typeof POST_FEED_OPTIONS)[number];

export enum SortOrder {
  ASC = 'ASC',
  DESC = 'DESC',
}
