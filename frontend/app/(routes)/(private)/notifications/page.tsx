'use client';

import {
  createNotificationItemClickHandler,
} from '@/app/(routes)/(private)/notifications/_handlers';
import { NotificationsPageContent } from '@/app/(routes)/(private)/notifications/_components';
import NotificationsPageSkeleton from '@/app/(routes)/(private)/notifications/NotificationsPage.skeleton';
import {
  useNotificationsAuth,
  useNotificationsData,
  useNotificationsActions,
} from '@/app/(routes)/(private)/notifications/_hooks';

/**
 * 전체 알림 페이지
 * @description 로그인 사용자의 전체 알림 목록을 표시하고 읽음 처리를 제공합니다.
 */
export default function NotificationsPage() {
  // 인증 상태
  const {
    accessToken,
    isInitialized,
    canFetchNotifications,
    currentUserId,
    profileName,
    profileImageUrl,
    profileHandleText,
  } = useNotificationsAuth();

  // 조회 상태
  const {
    hasUnread,
    postCount,
    followerCount,
    followingCount,
    filteredNotifications,
    isNotificationsLoading,
  } = useNotificationsData(canFetchNotifications, currentUserId);

  // 액션 상태
  const {
    handleMarkAllRead,
    handleNotificationClick,
    isMarkingAllRead,
  } = useNotificationsActions(hasUnread);

  // 이벤트 핸들러
  const handleItemClick = createNotificationItemClickHandler(handleNotificationClick);

  if (!isInitialized) {
    return <NotificationsPageSkeleton />;
  }

  if (!accessToken) {
    return null;
  }

  return (
    <NotificationsPageContent
      hasUnread={hasUnread}
      isLoading={isNotificationsLoading}
      postCount={postCount}
      followerCount={followerCount}
      followingCount={followingCount}
      profileName={profileName}
      profileImageUrl={profileImageUrl}
      profileHandleText={profileHandleText}
      handleItemClick={handleItemClick}
      handleMarkAllRead={handleMarkAllRead}
      isMarkingAllRead={isMarkingAllRead}
      filteredNotifications={filteredNotifications}
    />
  );
}
