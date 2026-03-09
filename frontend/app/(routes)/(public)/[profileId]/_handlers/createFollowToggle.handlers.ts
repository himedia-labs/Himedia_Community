import { followsApi } from '@/app/api/follows/follows.api';
import { LOGIN_MESSAGES } from '@/app/shared/constants/messages/auth.message';
import type { ProfileFollowToggleHandlerParams } from '@/app/shared/types/profilePage';

/**
 * 팔로우 토글 핸들러
 * @description 팔로우/언팔로우 요청을 처리하고 로컬 상태를 갱신합니다.
 */
export const createFollowToggleHandler = (params: ProfileFollowToggleHandlerParams) => async () => {
  if (!params.profileId || params.isMyProfile || params.isFollowLoading) return;
  if (!params.accessToken) {
    params.showToast({ message: LOGIN_MESSAGES.requireAuth, type: 'warning' });
    return;
  }

  try {
    params.setIsFollowLoading(true);
    const result = params.isFollowing
      ? await followsApi.unfollowUser(params.profileId)
      : await followsApi.followUser(params.profileId);

    params.setIsFollowing(result.following);
    params.setFollowerCount(prev => (result.following ? prev + 1 : Math.max(0, prev - 1)));
  } catch {
    params.showToast({ message: '팔로우 처리에 실패했습니다.', type: 'error' });
  } finally {
    params.setIsFollowHover(false);
    params.setIsFollowLoading(false);
  }
};
