import type { ChangeEvent, MouseEvent } from 'react';

import { ADMIN_PENDING_SORT } from '@/app/shared/constants/config/admin.config';

/**
 * 관리자 메뉴 클릭 핸들러 생성
 * @description 사이드바 버튼의 메뉴 라벨을 읽어 메뉴 전환을 수행
 */
export const createHandleMenuButtonClick = (handleSelectMenu: (menuLabel: string) => void) => {
  return (event: MouseEvent<HTMLButtonElement>) => {
    const { menuLabel } = event.currentTarget.dataset;
    if (!menuLabel) return;
    handleSelectMenu(menuLabel);
  };
};

/**
 * 승인 정렬 선택 핸들러 생성
 * @description 정렬 버튼 데이터에서 정렬 키를 읽어 승인 목록 정렬을 적용
 */
export const createHandlePendingSortClick = (
  handleSelectPendingSort: (sort: typeof ADMIN_PENDING_SORT.OLDEST | typeof ADMIN_PENDING_SORT.NEWEST) => void,
) => {
  return (event: MouseEvent<HTMLButtonElement>) => {
    const { pendingSort: nextSort } = event.currentTarget.dataset;
    if (!nextSort || (nextSort !== ADMIN_PENDING_SORT.OLDEST && nextSort !== ADMIN_PENDING_SORT.NEWEST)) return;
    handleSelectPendingSort(nextSort);
  };
};

/**
 * 역할 필터 선택 핸들러 생성
 * @description 버튼 데이터의 역할 값을 읽어 필터를 갱신
 */
export const createHandleRoleFilterClick = (handleSelectRoleFilter: (role: string) => void) => {
  return (event: MouseEvent<HTMLButtonElement>) => {
    const { roleFilter } = event.currentTarget.dataset;
    if (!roleFilter) return;
    handleSelectRoleFilter(roleFilter);
  };
};

/**
 * 과정 필터 선택 핸들러 생성
 * @description 버튼 데이터의 과정 값을 읽어 필터를 갱신
 */
export const createHandleCourseFilterClick = (handleSelectCourseFilter: (course: string) => void) => {
  return (event: MouseEvent<HTMLButtonElement>) => {
    const { courseFilter } = event.currentTarget.dataset;
    if (!courseFilter) return;
    handleSelectCourseFilter(courseFilter);
  };
};

/**
 * 회원 승인 클릭 핸들러 생성
 * @description 버튼 데이터의 사용자 id를 읽어 승인 요청을 수행
 */
export const createHandleApproveUserClick = (handleUserApprove: (userId: string) => void) => {
  return (event: MouseEvent<HTMLButtonElement>) => {
    const { userId } = event.currentTarget.dataset;
    if (!userId) return;
    handleUserApprove(userId);
  };
};

/**
 * 역할 변경 핸들러 생성
 * @description 셀렉트 데이터의 사용자 id와 선택 값을 읽어 역할 드래프트를 갱신
 */
export const createHandleUserRoleDraftChange = (
  handleChangeUserRoleDraft: (userId: string, value: string) => void,
) => {
  return (event: ChangeEvent<HTMLSelectElement>) => {
    const { userId } = event.currentTarget.dataset;
    if (!userId) return;
    handleChangeUserRoleDraft(userId, event.target.value);
  };
};
