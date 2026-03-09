import type { QueryClient, UseMutationResult } from '@tanstack/react-query';
import type { AppRouterInstance } from 'next/dist/shared/lib/app-router-context.shared-runtime';
import type { MouseEvent } from 'react';
import type { IconType } from 'react-icons';

import type { NotificationTab } from '@/app/shared/types/notification';
import type { ToastOptions } from '@/app/shared/types/toast';

// 헤더 메뉴
export type NavItem = {
  label: string;
  href?: string;
  Icon?: IconType;
  isAuthDependent?: boolean;
};

// 헤더 프롭스
export interface HeaderProps {
  initialIsLoggedIn: boolean;
}

// 헤더 인증
export interface HeaderAuthKeys {
  currentUser: readonly string[];
}

// 로그아웃 파라미터
export interface HeaderLogoutParams {
  clearAuth: () => void;
  queryClient: QueryClient;
  authKeys: HeaderAuthKeys;
  router: AppRouterInstance;
  logoutMutation: UseMutationResult<void, Error, void>;
  showToast: (options: ToastOptions) => void;
  onLogoutSuccess?: () => void;
}

// 헤더 메뉴 파라미터
export interface HeaderLogoutClickParams {
  closeProfileMenu: () => void;
  handleLogout: () => void;
}

export interface HeaderNotificationMenuParams {
  isLoggedIn: boolean;
  router: AppRouterInstance;
  canFetchNotifications: boolean;
}

// 헤더 메뉴 핸들러
export type HeaderNotificationTabHandler = (tab: NotificationTab) => void;
export type HeaderNotificationClickHandler = (
  notificationId: string,
  href: string,
  isRead: boolean,
) => void;
export type HeaderMouseEventHandler = (event: MouseEvent<HTMLElement>) => void;
