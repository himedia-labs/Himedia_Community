import {
  serializeAdminMenuToQuery,
  serializeAdminSortToQuery,
} from '@/app/(routes)/(private)/admin/utils/adminUrlState.utils';

import type { AppRouterInstance } from 'next/dist/shared/lib/app-router-context.shared-runtime';
import type { ReadonlyURLSearchParams } from 'next/navigation';
import type { AdminMenuLabel, AdminPendingSort } from '@/app/(routes)/(private)/admin/constants/admin.types';

/**
 * URL 상태 동기화 함수 생성
 * @description 관리자 탭/정렬 상태를 쿼리스트링으로 반영하는 함수를 반환
 */
export const createSyncAdminUrlState = (params: {
  router: AppRouterInstance;
  pathname: string;
  searchParams: ReadonlyURLSearchParams;
}) => {
  return (nextMenu: AdminMenuLabel, nextSort: AdminPendingSort) => {
    const nextParams = new URLSearchParams(params.searchParams.toString());
    nextParams.set('tab', serializeAdminMenuToQuery(nextMenu));
    nextParams.set('sort', serializeAdminSortToQuery(nextSort));
    params.router.replace(`${params.pathname}?${nextParams.toString()}`);
  };
};

/**
 * 메뉴 선택 핸들러 생성
 * @description 선택된 메뉴를 URL 상태로 반영하는 핸들러를 반환
 */
export const createHandleSelectMenu = (params: {
  pendingSort: AdminPendingSort;
  syncAdminUrlState: (nextMenu: AdminMenuLabel, nextSort: AdminPendingSort) => void;
}) => {
  return (nextMenu: AdminMenuLabel) => {
    params.syncAdminUrlState(nextMenu, params.pendingSort);
  };
};

/**
 * 정렬 선택 핸들러 생성
 * @description 선택된 정렬을 URL 상태로 반영하는 핸들러를 반환
 */
export const createHandleSelectSort = (params: {
  selectedMenu: AdminMenuLabel;
  syncAdminUrlState: (nextMenu: AdminMenuLabel, nextSort: AdminPendingSort) => void;
}) => {
  return (nextSort: AdminPendingSort) => {
    params.syncAdminUrlState(params.selectedMenu, nextSort);
  };
};
