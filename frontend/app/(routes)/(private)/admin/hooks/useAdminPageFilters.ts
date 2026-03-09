import { useState } from 'react';

import {
  createHandleSelectMenu,
  createHandleSelectSort,
  createSyncAdminUrlState,
} from '@/app/(routes)/(private)/admin/handlers/adminUrl.handlers';
import {
  createToggleRoleSort,
  createToggleCourseSort,
  createTogglePendingSort,
  createHandleSelectRoleFilter,
  createHandleSelectCourseFilter,
  createHandleSelectPendingSort,
} from '@/app/(routes)/(private)/admin/handlers/adminFilter.handlers';
import {
  parseAdminMenuFromQuery,
  parseAdminSortFromQuery,
} from '@/app/(routes)/(private)/admin/utils/adminUrlState.utils';

import type { UseAdminPageFiltersParams } from '@/app/shared/types/admin';

/**
 * 관리자 필터 상태 훅
 * @description URL 기반 메뉴/정렬과 드롭다운 UI 상태를 함께 관리한다
 */
export const useAdminPageFilters = (params: UseAdminPageFiltersParams) => {
  // 필터 상태
  const [isRoleSortOpen, setIsRoleSortOpen] = useState(false);
  const [isCourseSortOpen, setIsCourseSortOpen] = useState(false);
  const [isPendingSortOpen, setIsPendingSortOpen] = useState(false);
  const [selectedRoleFilter, setSelectedRoleFilter] = useState<string>('ALL');
  const [selectedCourseFilter, setSelectedCourseFilter] = useState<string>('ALL');

  // URL 상태
  const selectedMenu = parseAdminMenuFromQuery(params.searchParams.get('tab'));
  const pendingSort = parseAdminSortFromQuery(params.searchParams.get('sort'));

  // URL 핸들러
  const syncAdminUrlState = createSyncAdminUrlState(params);
  const handleSelectMenu = createHandleSelectMenu({ pendingSort, syncAdminUrlState });
  const handleSelectSort = createHandleSelectSort({ selectedMenu, syncAdminUrlState });

  // 필터 핸들러
  const toggleRoleSort = createToggleRoleSort({ setIsRoleSortOpen, setIsCourseSortOpen, setIsPendingSortOpen });
  const toggleCourseSort = createToggleCourseSort({ setIsRoleSortOpen, setIsCourseSortOpen, setIsPendingSortOpen });
  const togglePendingSort = createTogglePendingSort({ setIsRoleSortOpen, setIsCourseSortOpen, setIsPendingSortOpen });
  const handleSelectRoleFilter = createHandleSelectRoleFilter({ setSelectedRoleFilter, setIsRoleSortOpen });
  const handleSelectCourseFilter = createHandleSelectCourseFilter({ setSelectedCourseFilter, setIsCourseSortOpen });
  const handleSelectPendingSort = createHandleSelectPendingSort({ handleSelectSort, setIsPendingSortOpen });

  return {
    selectedMenu,
    pendingSort,
    selectedRoleFilter,
    selectedCourseFilter,
    dropdowns: {
      isRoleSortOpen,
      isCourseSortOpen,
      isPendingSortOpen,
    },
    handlers: {
      handleSelectMenu,
      toggleRoleSort,
      toggleCourseSort,
      togglePendingSort,
      handleSelectRoleFilter,
      handleSelectCourseFilter,
      handleSelectPendingSort,
    },
  };
};
