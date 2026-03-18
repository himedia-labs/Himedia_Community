import { buildRelativeTime, formatDate } from '@/app/shared/utils/date';
import { getRoleBadgeClassName } from '@/app/(routes)/(private)/admin/_utils/adminDisplay.utils';
import { formatRoleLabel } from '@/app/(routes)/(private)/admin/_utils/formatRoleLabel.utils';
import { formatPhoneNumber } from '@/app/(routes)/(private)/admin/_utils/formatPhoneNumber.utils';

import styles from '@/app/(routes)/(private)/admin/AdminPage.module.css';

import type { AdminPendingUsersSectionProps } from '@/app/shared/types/admin';

/**
 * 승인 대기 섹션
 * @description 승인 대기 회원 목록과 승인/거절 액션을 렌더링합니다.
 */
export default function AdminPendingUsersSection({
  filteredPendingUsers,
  isPendingUsersLoading,
  handleApproveUserClick,
  handleRejectUserClick,
}: AdminPendingUsersSectionProps) {
  return (
    <article className={styles.tableCard}>
      {isPendingUsersLoading ? (
        <p className={styles.notice}>불러오는 중입니다.</p>
      ) : filteredPendingUsers.length ? (
        <table className={styles.pendingTable}>
          <thead className={styles.pendingTableHead}>
            <tr>
              <th>순서</th>
              <th>이름</th>
              <th>이메일</th>
              <th>전화번호</th>
              <th>생년월일</th>
              <th>신청 역할</th>
              <th>과정</th>
              <th>가입일</th>
              <th>처리</th>
            </tr>
          </thead>
          <tbody className={styles.pendingTableBody}>
            {filteredPendingUsers.map((user, index) => (
              <tr key={user.id}>
                <td>
                  <div className={styles.orderCell}>
                    <strong className={styles.orderIndex}>#{index + 1}</strong>
                    <span className={styles.orderAgo}>({buildRelativeTime(user.createdAt)})</span>
                  </div>
                </td>
                <td>{user.name}</td>
                <td>{user.email}</td>
                <td>{formatPhoneNumber(user.phone)}</td>
                <td>{user.birthDate ?? '-'}</td>
                <td>
                  <span
                    className={`${styles.roleBadge} ${getRoleBadgeClassName(styles, user.requestedRole ?? user.role)}`}
                  >
                    {formatRoleLabel(user.requestedRole ?? user.role)}
                  </span>
                </td>
                <td>{user.course ?? 'N/A'}</td>
                <td>{formatDate(user.createdAt)}</td>
                <td>
                  <div className={styles.actions}>
                    <button
                      type="button"
                      className={`${styles.actionButton} ${styles.approveActionButton}`}
                      data-user-id={user.id}
                      onClick={handleApproveUserClick}
                    >
                      승인
                    </button>
                    <button
                      type="button"
                      className={`${styles.actionButton} ${styles.rejectActionButton}`}
                      data-user-id={user.id}
                      onClick={handleRejectUserClick}
                    >
                      거절
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p className={styles.emptyNotice}>승인 대기 회원이 없습니다.</p>
      )}
    </article>
  );
}
