import { useMemo } from 'react';

import { usePendingUsersSort } from '@/app/(routes)/(private)/admin/_hooks/usePendingUsersSort';

import type { UseAdminPageDataParams } from '@/app/shared/types/admin';

/**
 * 관리자 파생 데이터 훅
 * @description 목록 데이터와 필터 상태를 조합해 화면용 파생값을 반환한다
 */
export const useAdminPageData = (params: UseAdminPageDataParams) => {
  // 원본 목록
  const pendingUsers = useMemo(() => params.pendingUsersData?.items ?? [], [params.pendingUsersData]);
  const allUsers = useMemo(() => params.usersData?.items ?? [], [params.usersData]);
  const rejectedUsers = useMemo(() => params.rejectedUsersData?.items ?? [], [params.rejectedUsersData]);
  const adminUsers = useMemo(() => allUsers.filter(user => user.role === 'ADMIN'), [allUsers]);
  const auditLogs = params.logsData?.items ?? [];
  const accessLogs = useMemo(() => {
    return params.accessLogsData?.pages.flatMap(page => page.items) ?? [];
  }, [params.accessLogsData]);

  // 필터 파생
  const sortedPendingUsers = usePendingUsersSort(pendingUsers, params.pendingSort);
  const courseFilterOptions = useMemo(() => {
    const options = Array.from(new Set(pendingUsers.map(user => user.course).filter(Boolean))) as string[];
    return options.sort((a, b) => a.localeCompare(b, 'ko'));
  }, [pendingUsers]);
  const filteredPendingUsers = useMemo(() => {
    return sortedPendingUsers.filter(user => {
      const userRole = user.requestedRole ?? user.role;
      const matchedRole = params.selectedRoleFilter === 'ALL' || userRole === params.selectedRoleFilter;
      const matchedCourse = params.selectedCourseFilter === 'ALL' || user.course === params.selectedCourseFilter;
      return matchedRole && matchedCourse;
    });
  }, [params.selectedCourseFilter, params.selectedRoleFilter, sortedPendingUsers]);

  return {
    allUsers,
    auditLogs,
    accessLogs,
    adminUsers,
    pendingUsers,
    rejectedUsers,
    courseFilterOptions,
    filteredPendingUsers,
  };
};
