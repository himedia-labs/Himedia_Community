import { useRouter } from 'next/navigation';
import { useQueryClient } from '@tanstack/react-query';

import {
  useMarkNotificationReadMutation,
  useMarkNotificationsReadAllMutation,
} from '@/app/api/notifications/notifications.mutations';
import { notificationsKeys } from '@/app/api/notifications/notifications.keys';
import { applyQueryDataUpdate } from '@/app/shared/lib/query/queryCache.utils';

import type {
  NotificationListResponse,
  NotificationItemClickHandler,
} from '@/app/shared/types/notification';

/**
 * 알림 액션 훅
 * @description 알림 읽음 처리와 항목 이동 액션을 관리합니다.
 */
export const useNotificationsActions = (hasUnread: boolean) => {
  // 변이/라우팅 상태
  const router = useRouter();
  const queryClient = useQueryClient();
  const markReadMutation = useMarkNotificationReadMutation();
  const markAllReadMutation = useMarkNotificationsReadAllMutation();

  // 캐시 갱신
  const updateNotificationRead = (id: string) => {
    applyQueryDataUpdate<NotificationListResponse>(queryClient, notificationsKeys.list(), old => {
      if (!old) return old;

      const nextItems = old.items.map(item => (item.id === id ? { ...item, isRead: true } : item));
      const nextUnreadCount = nextItems.filter(item => !item.isRead).length;

      return {
        ...old,
        items: nextItems,
        unreadCount: nextUnreadCount,
      };
    });
  };

  const updateNotificationsReadAll = () => {
    applyQueryDataUpdate<NotificationListResponse>(queryClient, notificationsKeys.list(), old => {
      if (!old) return old;

      return {
        ...old,
        unreadCount: 0,
        items: old.items.map(item => ({ ...item, isRead: true })),
      };
    });
  };

  // 이벤트 액션
  const handleNotificationClick: NotificationItemClickHandler = (notificationId, notificationHref, isRead) => {
    if (!isRead) {
      markReadMutation.mutate(notificationId, {
        onSuccess: () => updateNotificationRead(notificationId),
      });
    }

    router.push(notificationHref);
  };

  const handleMarkAllRead = () => {
    if (!hasUnread || markAllReadMutation.isPending) return;
    markAllReadMutation.mutate(undefined, { onSuccess: updateNotificationsReadAll });
  };

  return {
    handleMarkAllRead,
    handleNotificationClick,
    isMarkingAllRead: markAllReadMutation.isPending,
  };
};
