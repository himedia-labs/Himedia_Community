import type { MouseEvent } from 'react';
import type { NotificationItemClickHandler } from '@/app/shared/types/notification';

/**
 * 알림 항목 클릭 핸들러 생성
 * @description 항목 dataset 값을 읽어 알림 이동/읽음 처리를 실행합니다.
 */
export const createNotificationItemClickHandler = (handleNotificationClick: NotificationItemClickHandler) => {
  return (event: MouseEvent<HTMLButtonElement>) => {
    const { notificationId, notificationHref, notificationIsRead } = event.currentTarget.dataset;
    if (!notificationId || !notificationHref) return;
    handleNotificationClick(notificationId, notificationHref, notificationIsRead === 'true');
  };
};
