'use client';

import { useRef } from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useQueryClient } from '@tanstack/react-query';

import { useCurrentUserQuery } from '@/app/api/auth/auth.queries';
import { useToast } from '@/app/shared/components/toast/toast';
import { useAuthStore } from '@/app/shared/store/authStore';
import {
  useAdminAccessLogsQuery,
  useAdminAuditLogsQuery,
  useAdminPendingUsersQuery,
  useAdminRejectedUsersQuery,
  useAdminUsersQuery,
} from '@/app/api/admin/admin.queries';
import {
  useTrackAdminAccessMutation,
  useApproveAdminUserMutation,
  useDeleteRejectedAdminUserMutation,
  useRejectAdminUserMutation,
  useUpdateAdminUserRoleMutation,
} from '@/app/api/admin/admin.mutations';

import {
  createHandleMenuButtonClick,
  createHandlePendingSortClick,
  createHandleRoleFilterClick,
  createHandleCourseFilterClick,
} from '@/app/(routes)/(private)/admin/_handlers/adminUi.handlers';
import {
  AdminContent,
  AdminHeader,
  AdminRejectUserModal,
  AdminSidebar,
} from '@/app/(routes)/(private)/admin/_components';
import { useAdminAccessGuard } from '@/app/(routes)/(private)/admin/_hooks/useAdminAccessGuard';
import { useTrackAdminAccess } from '@/app/(routes)/(private)/admin/_hooks/useTrackAdminAccess';
import { useAccessLogsInfiniteScroll } from '@/app/(routes)/(private)/admin/_hooks/useAccessLogsInfiniteScroll';
import { useAdminPageData } from '@/app/(routes)/(private)/admin/_hooks/useAdminPageData';
import { useAdminPageFilters } from '@/app/(routes)/(private)/admin/_hooks/useAdminPageFilters';
import { useAdminUserActions } from '@/app/(routes)/(private)/admin/_hooks/useAdminUserActions';

import styles from '@/app/(routes)/(private)/admin/AdminPage.module.css';

/**
 * 관리자 페이지
 * @description 신고 목록 조회와 상태 변경 기능을 제공
 */
export default function AdminPage() {
  // 라우팅/공용 훅
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const queryClient = useQueryClient();
  const { showToast } = useToast();

  // 인증/권한 상태
  const accessToken = useAuthStore(state => state.accessToken);
  const isInitialized = useAuthStore(state => state.isInitialized);
  const { data: currentUser, isLoading: isUserLoading } = useCurrentUserQuery();
  const isAdmin = currentUser?.role === 'ADMIN';
  const canAccess = Boolean(accessToken) && isAdmin;

  // 조회/뮤테이션 훅
  const { data: pendingUsersData, isLoading: isPendingUsersLoading } = useAdminPendingUsersQuery(canAccess);
  const { data: rejectedUsersData, isLoading: isRejectedUsersLoading } = useAdminRejectedUsersQuery(canAccess);
  const { data: usersData, isLoading: isUsersLoading } = useAdminUsersQuery(canAccess);
  const { data: logsData, isLoading: isLogsLoading } = useAdminAuditLogsQuery(canAccess);
  const {
    data: accessLogsData,
    isLoading: isAccessLogsLoading,
    isFetchingNextPage: isAccessLogsFetchingMore,
    hasNextPage: hasNextAccessLogsPage,
    fetchNextPage: fetchNextAccessLogsPage,
  } = useAdminAccessLogsQuery(canAccess);
  const approveUserMutation = useApproveAdminUserMutation();
  const rejectUserMutation = useRejectAdminUserMutation();
  const deleteRejectedUserMutation = useDeleteRejectedAdminUserMutation();
  const updateUserRoleMutation = useUpdateAdminUserRoleMutation();
  const trackAdminAccessMutation = useTrackAdminAccessMutation();

  // UI 상태
  const accessLogsLoadMoreRef = useRef<HTMLDivElement | null>(null);
  const {
    selectedMenu,
    pendingSort,
    selectedRoleFilter,
    selectedCourseFilter,
    dropdowns: { isRoleSortOpen, isCourseSortOpen, isPendingSortOpen },
    handlers: {
      handleSelectMenu,
      toggleRoleSort,
      toggleCourseSort,
      togglePendingSort,
      handleSelectRoleFilter,
      handleSelectCourseFilter,
      handleSelectPendingSort,
    },
  } = useAdminPageFilters({
    router,
    pathname,
    searchParams,
  });
  const {
    allUsers,
    auditLogs,
    accessLogs,
    adminUsers,
    rejectedUsers,
    CurrentMenuIcon,
    courseFilterOptions,
    filteredPendingUsers,
  } = useAdminPageData({
    pendingSort,
    selectedMenu,
    selectedRoleFilter,
    selectedCourseFilter,
    pendingUsersData,
    rejectedUsersData,
    usersData,
    logsData,
    accessLogsData,
  });
  const {
    isUsersEditMode,
    rejectReason,
    rejectTargetUserId,
    userRoleDrafts,
    handlers: {
      handleCloseRejectModal,
      handleConfirmRejectUser,
      handleUserEdit,
      handleApproveUserClick,
      handleRejectUserClick,
      handleRejectReasonChange,
      handleSaveAllUserRoles,
      handleDeleteRejectedUserClick,
      handleUserRoleDraftChange,
    },
  } = useAdminUserActions({
    allUsers,
    queryClient,
    showToast,
    approveUser: approveUserMutation.mutateAsync,
    rejectUser: rejectUserMutation.mutateAsync,
    deleteRejectedUser: deleteRejectedUserMutation.mutateAsync,
    updateUserRole: updateUserRoleMutation.mutateAsync,
  });

  // 접근/추적 훅
  useAdminAccessGuard({ accessToken, isInitialized, isUserLoading, isAdmin });
  useTrackAdminAccess({
    canAccess,
    queryClient,
    mutate: trackAdminAccessMutation.mutate,
  });
  useAccessLogsInfiniteScroll({
    selectedMenu,
    hasNextPage: hasNextAccessLogsPage,
    isFetchingNextPage: isAccessLogsFetchingMore,
    loadMoreRef: accessLogsLoadMoreRef,
    fetchNextPage: fetchNextAccessLogsPage,
  });

  // 이벤트/핸들러 생성
  const handleMenuButtonClick = createHandleMenuButtonClick(handleSelectMenu);
  const handlePendingSortClick = createHandlePendingSortClick(handleSelectPendingSort);
  const handleRoleFilterClick = createHandleRoleFilterClick(handleSelectRoleFilter);
  const handleCourseFilterClick = createHandleCourseFilterClick(handleSelectCourseFilter);

  if (!isInitialized || !accessToken || isUserLoading || !isAdmin) {
    return null;
  }

  return (
    <section className={styles.container} aria-label="관리자 페이지">
      <AdminHeader
        currentUserName={currentUser?.name}
        isCourseSortOpen={isCourseSortOpen}
        isPendingSortOpen={isPendingSortOpen}
        isRoleSortOpen={isRoleSortOpen}
        isUsersEditMode={isUsersEditMode}
        pendingSort={pendingSort}
        selectedCourseFilter={selectedCourseFilter}
        selectedMenu={selectedMenu}
        selectedRoleFilter={selectedRoleFilter}
        courseFilterOptions={courseFilterOptions}
        CurrentMenuIcon={CurrentMenuIcon}
        handleCourseFilterClick={handleCourseFilterClick}
        handlePendingSortClick={handlePendingSortClick}
        handleRoleFilterClick={handleRoleFilterClick}
        handleSaveAllUserRoles={handleSaveAllUserRoles}
        handleUserEdit={handleUserEdit}
        toggleCourseSort={toggleCourseSort}
        togglePendingSort={togglePendingSort}
        toggleRoleSort={toggleRoleSort}
      />
      <div className={styles.dashboard}>
        <AdminSidebar selectedMenu={selectedMenu} handleMenuButtonClick={handleMenuButtonClick} />

        <main className={styles.content}>
          <div className={styles.contentInner}>
            <AdminContent
              allUsers={allUsers}
              auditLogs={auditLogs}
              accessLogs={accessLogs}
              adminUsers={adminUsers}
              rejectedUsers={rejectedUsers}
              filteredPendingUsers={filteredPendingUsers}
              hasNextAccessLogsPage={hasNextAccessLogsPage}
              isAccessLogsFetchingMore={isAccessLogsFetchingMore}
              isAccessLogsLoading={isAccessLogsLoading}
              isLogsLoading={isLogsLoading}
              isPendingUsersLoading={isPendingUsersLoading}
              isRejectedUsersLoading={isRejectedUsersLoading}
              isUsersEditMode={isUsersEditMode}
              isUsersLoading={isUsersLoading}
              selectedMenu={selectedMenu}
              userRoleDrafts={userRoleDrafts}
              accessLogsLoadMoreRef={accessLogsLoadMoreRef}
              handleApproveUserClick={handleApproveUserClick}
              handleDeleteRejectedUserClick={handleDeleteRejectedUserClick}
              handleRejectUserClick={handleRejectUserClick}
              handleUserRoleDraftChange={handleUserRoleDraftChange}
            />
          </div>
        </main>
      </div>
      {rejectTargetUserId ? (
        <AdminRejectUserModal
          rejectReason={rejectReason}
          isRejectingUser={rejectUserMutation.isPending}
          onClose={handleCloseRejectModal}
          onConfirm={handleConfirmRejectUser}
          onChange={handleRejectReasonChange}
        />
      ) : null}
    </section>
  );
}
