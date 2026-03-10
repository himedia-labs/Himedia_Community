import { ADMIN_MENU_LABELS } from '@/app/shared/constants/config/admin.config';
import AdminUsersSection from '@/app/(routes)/(private)/admin/_components/sections/AdminUsersSection';
import AdminAdminsSection from '@/app/(routes)/(private)/admin/_components/sections/AdminAdminsSection';
import AdminAuditLogsSection from '@/app/(routes)/(private)/admin/_components/sections/AdminAuditLogsSection';
import AdminAccessLogsSection from '@/app/(routes)/(private)/admin/_components/sections/AdminAccessLogsSection';
import AdminPendingUsersSection from '@/app/(routes)/(private)/admin/_components/sections/AdminPendingUsersSection';
import AdminRejectedUsersSection from '@/app/(routes)/(private)/admin/_components/sections/AdminRejectedUsersSection';

import styles from '@/app/(routes)/(private)/admin/AdminPage.module.css';

import type { AdminContentProps } from '@/app/shared/types/admin';

/**
 * 관리자 콘텐츠
 * @description 선택된 메뉴에 맞는 관리자 섹션 컴포넌트를 렌더링합니다.
 */
export default function AdminContent({
  allUsers,
  auditLogs,
  accessLogs,
  adminUsers,
  rejectedUsers,
  filteredPendingUsers,
  hasNextAccessLogsPage,
  isAccessLogsFetchingMore,
  isAccessLogsLoading,
  isLogsLoading,
  isPendingUsersLoading,
  isRejectedUsersLoading,
  isUsersEditMode,
  isUsersLoading,
  selectedMenu,
  userRoleDrafts,
  accessLogsLoadMoreRef,
  handleApproveUserClick,
  handleDeleteRejectedUserClick,
  handleRejectUserClick,
  handleUserRoleDraftChange,
}: AdminContentProps) {
  return (
    <div className={styles.singleGrid}>
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
    </div>
  );
}
