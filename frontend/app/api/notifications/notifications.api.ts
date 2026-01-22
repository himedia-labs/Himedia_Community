import { axiosInstance } from '@/app/shared/network/axios.instance';

import type {
  MarkNotificationReadResponse,
  MarkNotificationsReadAllResponse,
  NotificationListResponse,
} from '@/app/shared/types/notification';

const getNotifications = async (limit = 50): Promise<NotificationListResponse> => {
  const res = await axiosInstance.get<NotificationListResponse>('/notifications', {
    params: { limit },
  });
  return res.data;
};

const markNotificationRead = async (notificationId: string): Promise<MarkNotificationReadResponse> => {
  const res = await axiosInstance.patch<MarkNotificationReadResponse>(`/notifications/${notificationId}/read`);
  return res.data;
};

const markNotificationsReadAll = async (): Promise<MarkNotificationsReadAllResponse> => {
  const res = await axiosInstance.patch<MarkNotificationsReadAllResponse>('/notifications/read-all');
  return res.data;
};

export const notificationsApi = {
  getNotifications,
  markNotificationRead,
  markNotificationsReadAll,
};
