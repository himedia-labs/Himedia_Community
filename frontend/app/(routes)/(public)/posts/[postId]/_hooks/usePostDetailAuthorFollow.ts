import { useCallback, useEffect, useState } from 'react';

import { followsApi } from '@/app/api/follows/follows.api';
import { useToast } from '@/app/shared/components/toast/toast';
import { LOGIN_MESSAGES } from '@/app/shared/constants/messages/auth.message';

import type { UsePostDetailAuthorFollowParams } from '@/app/shared/types/post';

/**
 * 작성자 팔로우 훅
 * @description 작성자 팔로우 상태 동기화와 토글 액션을 관리
 */
export const usePostDetailAuthorFollow = ({
  author,
  accessToken,
  isMyPost,
  postAuthorId,
}: UsePostDetailAuthorFollowParams) => {
  // 상태/역할
  const { showToast } = useToast();
  const [isAuthorFollowing, setIsAuthorFollowing] = useState(false);
  const [isAuthorFollowHover, setIsAuthorFollowHover] = useState(false);
  const [isAuthorFollowLoading, setIsAuthorFollowLoading] = useState(false);
  const [authorFollowerCount, setAuthorFollowerCount] = useState(0);

  // 존재/상태 확인
  useEffect(() => {
    setIsAuthorFollowing(Boolean(author?.isFollowing));
    setAuthorFollowerCount(author?.followerCount ?? 0);
  }, [author?.followerCount, author?.id, author?.isFollowing]);

  // 핸들러/이벤트
  /**
   * 팔로우 버튼 호버 시작
   * @description 팔로우 버튼 호버 상태를 활성화
   */
  const handleAuthorFollowMouseEnter = useCallback(() => {
    setIsAuthorFollowHover(true);
  }, []);

  /**
   * 팔로우 버튼 호버 종료
   * @description 팔로우 버튼 호버 상태를 비활성화
   */
  const handleAuthorFollowMouseLeave = useCallback(() => {
    setIsAuthorFollowHover(false);
  }, []);

  /**
   * 작성자 팔로우 토글
   * @description 작성자 팔로우/언팔로우 요청 후 상태를 갱신
   */
  const handleAuthorFollowToggle = useCallback(async () => {
    if (!postAuthorId || isMyPost || isAuthorFollowLoading) return;
    if (!accessToken) {
      showToast({ message: LOGIN_MESSAGES.requireAuth, type: 'warning' });
      return;
    }

    try {
      setIsAuthorFollowLoading(true);
      const result = isAuthorFollowing
        ? await followsApi.unfollowUser(postAuthorId)
        : await followsApi.followUser(postAuthorId);

      setIsAuthorFollowing(result.following);
      setAuthorFollowerCount(prev => (result.following ? prev + 1 : Math.max(0, prev - 1)));
    } catch {
      showToast({ message: '팔로우 처리에 실패했습니다.', type: 'error' });
    } finally {
      setIsAuthorFollowLoading(false);
      setIsAuthorFollowHover(false);
    }
  }, [accessToken, isAuthorFollowLoading, isAuthorFollowing, isMyPost, postAuthorId, showToast]);

  return {
    isAuthorFollowing,
    isAuthorFollowHover,
    isAuthorFollowLoading,
    authorFollowerCount,
    handleAuthorFollowToggle,
    handleAuthorFollowMouseEnter,
    handleAuthorFollowMouseLeave,
  };
};
