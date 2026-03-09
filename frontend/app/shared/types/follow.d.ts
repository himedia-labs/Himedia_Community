import type { UserRole } from './post';

// 팔로우 모델
export interface FollowUserItem {
  id: string;
  name: string;
  role: UserRole;
  isMutual: boolean;
}

export type FollowListResponse = FollowUserItem[];

export interface FollowToggleResponse {
  following: boolean;
}

// API 요청/응답
export type FollowsQueryOptions = {
  enabled?: boolean;
};
