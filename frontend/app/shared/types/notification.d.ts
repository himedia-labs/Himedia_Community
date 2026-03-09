// 공통 응답
type NotificationReadResponse = {
  id: string;
};

type NotificationQueryOptions = {
  enabled?: boolean;
};

// 알림 모델
export type NotificationTab = 'today' | 'week' | 'earlier';

export type NotificationType =
  | 'POST_LIKE'
  | 'POST_COMMENT'
  | 'COMMENT_LIKE'
  | 'COMMENT_REPLY'
  | 'REPORT_RECEIVED'
  | 'REPORT_RESOLVED'
  | 'REPORT_REJECTED';

export interface NotificationItem {
  id: string;
  type: NotificationType;
  title: string;
  description: string;
  href: string;
  createdAt: string;
  createdAtMs: number;
  isRead: boolean;
}

export interface NotificationListResponse {
  unreadCount: number;
  items: NotificationItem[];
}

export type MarkNotificationReadResponse = NotificationReadResponse;

export interface MarkNotificationsReadAllResponse {
  updated: number;
}

// API 요청/응답
export type NotificationsQueryOptions = NotificationQueryOptions & {
  limit?: number;
};
