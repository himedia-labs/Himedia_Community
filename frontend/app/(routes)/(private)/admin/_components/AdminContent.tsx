import { ADMIN_MENU_LABELS } from '@/app/shared/constants/config/admin.config';
import { default as AdminAccessLogsSection } from '@/app/(routes)/(private)/admin/_components/AdminAccessLogsSection';
import { default as AdminAdminsSection } from '@/app/(routes)/(private)/admin/_components/AdminAdminsSection';
import AdminContentHeader from '@/app/(routes)/(private)/admin/_components/AdminContentHeader';
import { default as AdminNoticesSection } from '@/app/(routes)/(private)/admin/_components/AdminNoticesSection';
import { default as AdminAuditLogsSection } from '@/app/(routes)/(private)/admin/_components/AdminAuditLogsSection';
import { default as AdminPendingUsersSection } from '@/app/(routes)/(private)/admin/_components/AdminPendingUsersSection';
import { default as AdminRejectedUsersSection } from '@/app/(routes)/(private)/admin/_components/AdminRejectedUsersSection';
import { default as AdminUsersSection } from '@/app/(routes)/(private)/admin/_components/AdminUsersSection';

import type { AdminContentProps } from '@/app/shared/types/admin';

/**
 * 관리자 콘텐츠
 * @description 선택된 메뉴에 맞는 관리자 섹션 컴포넌트를 렌더링합니다.
 */
export default function AdminContent({
  isCourseSortOpen,
  isPendingSortOpen,
  isRoleSortOpen,
  isUsersEditMode,
  pendingSort,
  selectedCourseFilter,
  selectedMenu,
  selectedRoleFilter,
  courseFilterOptions,
  handleCourseFilterClick,
  handlePendingSortClick,
  handleRoleFilterClick,
  handleSaveAllUserRoles,
  handleUserEdit,
  toggleCourseSort,
  togglePendingSort,
  toggleRoleSort,
  allUsers,
  auditLogs,
  accessLogs,
  adminUsers,
  noticesData,
  rejectedUsers,
  filteredPendingUsers,
  hasNextAccessLogsPage,
  isAccessLogsFetchingMore,
  isAccessLogsLoading,
  isLogsLoading,
  isPendingUsersLoading,
  isRejectedUsersLoading,
  isUsersLoading,
  userRoleDrafts,
  accessLogsLoadMoreRef,
  handleApproveUserClick,
  handleDeleteRejectedUserClick,
  handleRejectUserClick,
  handleUserRoleDraftChange,
}: AdminContentProps) {
  return (
    <>
      <AdminContentHeader
        isCourseSortOpen={isCourseSortOpen}
        isPendingSortOpen={isPendingSortOpen}
        isRoleSortOpen={isRoleSortOpen}
        isUsersEditMode={isUsersEditMode}
        pendingSort={pendingSort}
        selectedCourseFilter={selectedCourseFilter}
        selectedMenu={selectedMenu}
        selectedRoleFilter={selectedRoleFilter}
        courseFilterOptions={courseFilterOptions}
        handleCourseFilterClick={handleCourseFilterClick}
        handlePendingSortClick={handlePendingSortClick}
        handleRoleFilterClick={handleRoleFilterClick}
        handleSaveAllUserRoles={handleSaveAllUserRoles}
        handleUserEdit={handleUserEdit}
        toggleCourseSort={toggleCourseSort}
        togglePendingSort={togglePendingSort}
        toggleRoleSort={toggleRoleSort}
      />
      {selectedMenu === ADMIN_MENU_LABELS.PENDING_USERS ? (
        <AdminPendingUsersSection
          filteredPendingUsers={filteredPendingUsers}
          isPendingUsersLoading={isPendingUsersLoading}
          handleApproveUserClick={handleApproveUserClick}
          handleRejectUserClick={handleRejectUserClick}
        />
      ) : null}
      {selectedMenu === ADMIN_MENU_LABELS.REJECTED_USERS ? (
        <AdminRejectedUsersSection
          rejectedUsers={rejectedUsers}
          isRejectedUsersLoading={isRejectedUsersLoading}
          handleDeleteRejectedUserClick={handleDeleteRejectedUserClick}
        />
      ) : null}
      {selectedMenu === ADMIN_MENU_LABELS.USERS ? (
        <AdminUsersSection
          allUsers={allUsers}
          isUsersEditMode={isUsersEditMode}
          isUsersLoading={isUsersLoading}
          userRoleDrafts={userRoleDrafts}
          handleUserRoleDraftChange={handleUserRoleDraftChange}
        />
      ) : null}
      {selectedMenu === ADMIN_MENU_LABELS.ADMINS ? (
        <AdminAdminsSection adminUsers={adminUsers} isUsersLoading={isUsersLoading} />
      ) : null}
      {selectedMenu === ADMIN_MENU_LABELS.NOTICE_ANNOUNCEMENTS ||
      selectedMenu === ADMIN_MENU_LABELS.NOTICE_UPDATES ||
      selectedMenu === ADMIN_MENU_LABELS.NOTICE_POST_CREATE ||
      selectedMenu === ADMIN_MENU_LABELS.NOTICE_UPDATE_CREATE ? (
        <AdminNoticesSection noticesData={noticesData} selectedMenu={selectedMenu} />
      ) : null}
      {selectedMenu === ADMIN_MENU_LABELS.AUDIT_LOGS ? (
        <AdminAuditLogsSection auditLogs={auditLogs} isLogsLoading={isLogsLoading} />
      ) : null}
      {selectedMenu === ADMIN_MENU_LABELS.ACCESS_LOGS ? (
        <AdminAccessLogsSection
          accessLogs={accessLogs}
          hasNextAccessLogsPage={hasNextAccessLogsPage}
          isAccessLogsFetchingMore={isAccessLogsFetchingMore}
          isAccessLogsLoading={isAccessLogsLoading}
          accessLogsLoadMoreRef={accessLogsLoadMoreRef}
        />
      ) : null}
    </>
  );
}
