import { useState } from 'react';

import { createFollowToggleHandler } from '@/app/(routes)/(public)/[profileId]/handlers';

import type { Dispatch, SetStateAction } from 'react';
import type { UseProfileFollowParams } from '@/app/shared/types/profilePage';

/**
 * 공개 프로필 팔로우 훅
 * @description 팔로우 상태 동기화와 토글 동작을 제공합니다.
 */
export const useProfileFollow = (params: UseProfileFollowParams) => {
  // 팔로우 상태
  const [isFollowHover, setIsFollowHover] = useState(false);
  const [isFollowLoading, setIsFollowLoading] = useState(false);
  const [overrideProfileId, setOverrideProfileId] = useState<string>();
  const [overrideIsFollowing, setOverrideIsFollowing] = useState<boolean | null>(null);
  const [overrideFollowerCount, setOverrideFollowerCount] = useState<number | null>(null);

  // 팔로우 파생 상태
  const fallbackFollowing = Boolean(params.author?.isFollowing);
  const followingByList = params.profileId ? Boolean(params.followings?.some(item => item.id === params.profileId)) : false;
  const baseIsFollowing = params.accessToken ? followingByList : fallbackFollowing;
  const baseFollowerCount = params.author?.followerCount ?? 0;
  const hasOverride = Boolean(params.profileId && overrideProfileId === params.profileId);
  const isFollowing = hasOverride && overrideIsFollowing !== null ? overrideIsFollowing : baseIsFollowing;
  const followerCount = hasOverride && overrideFollowerCount !== null ? overrideFollowerCount : baseFollowerCount;

  // 팔로우 상태 setter 어댑터
  const setIsFollowing: Dispatch<SetStateAction<boolean>> = nextState => {
    const currentState = isFollowing;
    const resolvedState = typeof nextState === 'function' ? nextState(currentState) : nextState;
    setOverrideProfileId(params.profileId);
    setOverrideIsFollowing(resolvedState);
  };

  const setFollowerCount: Dispatch<SetStateAction<number>> = nextState => {
    const currentState = followerCount;
    const resolvedState = typeof nextState === 'function' ? nextState(currentState) : nextState;
    setOverrideProfileId(params.profileId);
    setOverrideFollowerCount(resolvedState);
  };

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
