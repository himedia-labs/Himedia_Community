import { useEffect, useState } from 'react';

import { createFollowToggleHandler } from '@/app/(routes)/(public)/[profileId]/handlers';

import type { FollowListResponse } from '@/app/shared/types/follow';
import type { PostAuthorRef } from '@/app/shared/types/post';

type UseProfileFollowParams = {
  profileId?: string;
  accessToken: string | null;
  isMyProfile: boolean;
  author?: PostAuthorRef;
  followings?: FollowListResponse;
  showToast: (params: { message: string; type: 'success' | 'error' | 'warning' | 'info' }) => void;
};

/**
 * 공개 프로필 팔로우 훅
 * @description 팔로우 상태 동기화와 토글 동작을 제공합니다.
 */
export const useProfileFollow = (params: UseProfileFollowParams) => {
  // 팔로우 상태
  const [isFollowHover, setIsFollowHover] = useState(false);
  const [isFollowLoading, setIsFollowLoading] = useState(false);
  const [followerCount, setFollowerCount] = useState(0);
  const [isFollowing, setIsFollowing] = useState(false);

  // 팔로우 상태 동기화
  useEffect(() => {
    const fallbackFollowing = Boolean(params.author?.isFollowing);
    const followingByList = params.profileId
      ? Boolean(params.followings?.some(item => item.id === params.profileId))
      : false;

    setIsFollowing(params.accessToken ? followingByList : fallbackFollowing);
    setFollowerCount(params.author?.followerCount ?? 0);
  }, [params.accessToken, params.author?.followerCount, params.author?.isFollowing, params.followings, params.profileId]);

  // 팔로우 토글
  const handleFollowToggle = createFollowToggleHandler({
    accessToken: params.accessToken,
    isMyProfile: params.isMyProfile,
    showToast: params.showToast,
    profileId: params.profileId,
    isFollowing,
    isFollowLoading,
    setIsFollowing,
    setFollowerCount,
    setIsFollowHover,
    setIsFollowLoading,
  });

  return {
    isFollowHover,
    isFollowLoading,
    isFollowing,
    followerCount,
    setIsFollowHover,
    handleFollowToggle,
  };
};
