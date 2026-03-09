import type { MouseEvent } from 'react';
import type {
  HeaderLogoutClickParams,
  HeaderNotificationClickHandler,
  HeaderNotificationTabHandler,
} from '@/app/shared/types/header';

/**
 * 로그아웃 클릭 핸들러 생성
 * @description 프로필 메뉴를 닫고 로그아웃 액션을 실행
 */
export const createHandleLogoutClick = (params: HeaderLogoutClickParams) => {
  return () => {
    params.closeProfileMenu();
    params.handleLogout();
  };
};

/**
 * 알림 탭 클릭 핸들러 생성
 * @description 탭 데이터 값을 읽어 today/week/earlier 탭으로 전환
 */
export const createHandleNotificationTabClick = (
  setNotificationTab: HeaderNotificationTabHandler,
) => {
  return (event: MouseEvent<HTMLButtonElement>) => {
    const { tab } = event.currentTarget.dataset;
    if (tab !== 'today' && tab !== 'week' && tab !== 'earlier') return;
    setNotificationTab(tab);
  };
};

/**
 * 알림 항목 클릭 핸들러 생성
 * @description 항목 id/href/읽음 여부를 읽어 알림 이동 및 읽음 처리를 수행
 */
export const createHandleNotificationItemClick = (
  handleNotificationClick: HeaderNotificationClickHandler,
) => {
  return (event: MouseEvent<HTMLButtonElement>) => {
    const { notificationId, notificationHref, notificationIsRead } = event.currentTarget.dataset;
    if (!notificationId || !notificationHref) return;
    handleNotificationClick(notificationId, notificationHref, notificationIsRead === 'true');
  };
};
