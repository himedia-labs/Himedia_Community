import { useQuery } from '@tanstack/react-query';

import { notificationsApi } from './notifications.api';
import { notificationsKeys } from './notifications.keys';

import type { NotificationListResponse } from '@/app/shared/types/notification';

type NotificationsQueryOptions = {
  enabled?: boolean;
  limit?: number;
};

export const useNotificationsQuery = ({ enabled = true, limit = 50 }: NotificationsQueryOptions = {}) => {
  return useQuery<NotificationListResponse>({
    queryKey: notificationsKeys.list(),
    queryFn: () => notificationsApi.getNotifications(limit),
    enabled,
  });
};
