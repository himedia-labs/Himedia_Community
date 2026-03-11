import { useMemo } from 'react';

import { useFollowersQuery, useFollowingsQuery } from '@/app/api/follows/follows.queries';
import { useNotificationsQuery } from '@/app/api/notifications/notifications.queries';
import { usePostsQuery } from '@/app/api/posts/posts.queries';

/**
 * 알림 데이터 훅
 * @description 알림 목록과 통계 데이터를 조회하고 화면 파생값을 구성합니다.
 */
export const useNotificationsData = (canFetchNotifications: boolean, currentUserId?: string) => {
  // 데이터 조회
  const { data: followersData } = useFollowersQuery({ enabled: canFetchNotifications });
  const { data: followingsData } = useFollowingsQuery({ enabled: canFetchNotifications });
  const { data: notificationsData, isLoading: isNotificationsLoading } = useNotificationsQuery({
    enabled: canFetchNotifications,
    limit: 200,
  });
  const { data: myPostsData } = usePostsQuery(
    {
      limit: 1,
      order: 'DESC',
      status: 'PUBLISHED',
      sort: 'publishedAt',
      authorId: currentUserId,
    },
    { enabled: canFetchNotifications && Boolean(currentUserId) },
  );

  // 파생 상태
  const unreadCount = notificationsData?.unreadCount ?? 0;
  const hasUnread = unreadCount > 0;
  const postCount = myPostsData?.total ?? 0;
  const followerCount = followersData?.length ?? 0;
  const followingCount = followingsData?.length ?? 0;
  const filteredNotifications = useMemo(
    () => [...(notificationsData?.items ?? [])].sort((a, b) => b.createdAtMs - a.createdAtMs),
    [notificationsData?.items],
  );

  return {
    hasUnread,
    postCount,
    followerCount,
    followingCount,
    filteredNotifications,
    isNotificationsLoading,
  };
};
