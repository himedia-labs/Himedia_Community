import type { AdminPendingSort } from '@/app/(routes)/(private)/admin/constants/admin.types';

/**
 * 역할 필터 토글 핸들러 생성
 * @description 역할 드롭다운 열림 상태를 토글하고 다른 드롭다운을 닫는다
 */
export const createToggleRoleSort = (params: {
  setIsPendingSortOpen: (value: boolean) => void;
  setIsCourseSortOpen: (value: boolean) => void;
  setIsRoleSortOpen: (updater: (prev: boolean) => boolean) => void;
}) => {
  return () => {
    params.setIsPendingSortOpen(false);
    params.setIsCourseSortOpen(false);
    params.setIsRoleSortOpen(prev => !prev);
  };
};

/**
 * 과정 필터 토글 핸들러 생성
 * @description 과정 드롭다운 열림 상태를 토글하고 다른 드롭다운을 닫는다
 */
export const createToggleCourseSort = (params: {
  setIsPendingSortOpen: (value: boolean) => void;
  setIsRoleSortOpen: (value: boolean) => void;
  setIsCourseSortOpen: (updater: (prev: boolean) => boolean) => void;
}) => {
  return () => {
    params.setIsPendingSortOpen(false);
    params.setIsRoleSortOpen(false);
    params.setIsCourseSortOpen(prev => !prev);
  };
};

/**
 * 가입일 정렬 토글 핸들러 생성
 * @description 가입일 드롭다운 열림 상태를 토글하고 다른 드롭다운을 닫는다
 */
export const createTogglePendingSort = (params: {
  setIsRoleSortOpen: (value: boolean) => void;
  setIsCourseSortOpen: (value: boolean) => void;
  setIsPendingSortOpen: (updater: (prev: boolean) => boolean) => void;
}) => {
  return () => {
    params.setIsRoleSortOpen(false);
    params.setIsCourseSortOpen(false);
    params.setIsPendingSortOpen(prev => !prev);
  };
};

/**
 * 역할 필터 선택 핸들러 생성
 * @description 역할 필터를 변경하고 드롭다운을 닫는다
 */
export const createHandleSelectRoleFilter = (params: {
  setSelectedRoleFilter: (nextRole: string) => void;
  setIsRoleSortOpen: (value: boolean) => void;
}) => {
  return (nextRole: string) => {
    params.setSelectedRoleFilter(nextRole);
    params.setIsRoleSortOpen(false);
  };
};

/**
 * 과정 필터 선택 핸들러 생성
 * @description 과정 필터를 변경하고 드롭다운을 닫는다
 */
export const createHandleSelectCourseFilter = (params: {
  setSelectedCourseFilter: (nextCourse: string) => void;
  setIsCourseSortOpen: (value: boolean) => void;
}) => {
  return (nextCourse: string) => {
    params.setSelectedCourseFilter(nextCourse);
    params.setIsCourseSortOpen(false);
  };
};

/**
 * 가입일 정렬 선택 핸들러 생성
 * @description 정렬 값을 반영하고 드롭다운을 닫는다
 */
export const createHandleSelectPendingSort = (params: {
  handleSelectSort: (nextSort: AdminPendingSort) => void;
  setIsPendingSortOpen: (value: boolean) => void;
}) => {
  return (nextSort: AdminPendingSort) => {
    params.handleSelectSort(nextSort);
    params.setIsPendingSortOpen(false);
  };
};
