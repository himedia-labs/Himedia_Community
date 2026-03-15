import { formatDate } from '@/app/shared/utils/date';
import { getRoleBadgeClassName } from '@/app/(routes)/(private)/admin/_utils/adminDisplay.utils';
import { formatRoleLabel } from '@/app/(routes)/(private)/admin/_utils/formatRoleLabel.utils';
import { formatPhoneNumber } from '@/app/(routes)/(private)/admin/_utils/formatPhoneNumber.utils';

import styles from '@/app/(routes)/(private)/admin/AdminPage.module.css';

import type { AdminUsersSectionProps } from '@/app/shared/types/admin';

/**
 * 사용자 섹션
 * @description 전체 회원 목록과 역할 편집 셀을 렌더링합니다.
 */
export default function AdminUsersSection({
  allUsers,
  isUsersEditMode,
  isUsersLoading,
  userRoleDrafts,
  handleUserRoleDraftChange,
}: AdminUsersSectionProps) {
  return (
    <article className={styles.tableCard}>
      {isUsersLoading ? (
        <p className={styles.notice}>불러오는 중입니다.</p>
      ) : allUsers.length ? (
        <table className={styles.pendingTable}>
          <thead className={styles.pendingTableHead}>
            <tr>
              <th>순서</th>
              <th>이름</th>
              <th>이메일</th>
              <th>회원번호</th>
              <th>전화번호</th>
              <th>생년월일</th>
              <th>역할</th>
              <th>과정</th>
              <th>가입일</th>
            </tr>
          </thead>
          <tbody className={styles.pendingTableBody}>
            {allUsers.map((user, index) => (
              <tr key={user.id}>
                <td>#{index + 1}</td>
                <td>{user.name}</td>
                <td>{user.email}</td>
                <td>{user.id}</td>
                <td>{formatPhoneNumber(user.phone)}</td>
                <td>{user.birthDate ?? '-'}</td>
                <td>
                  {isUsersEditMode && user.role !== 'ADMIN' ? (
                    <select
                      className={styles.userRoleSelect}
                      value={userRoleDrafts[user.id] ?? user.requestedRole ?? user.role}
                      data-user-id={user.id}
                      onChange={handleUserRoleDraftChange}
                    >
                      <option value="TRAINEE">훈련생</option>
                      <option value="GRADUATE">수료생</option>
                      <option value="MENTOR">멘토</option>
                      <option value="INSTRUCTOR">강사</option>
                    </select>
                  ) : (
                    <span
                      className={`${styles.roleBadge} ${getRoleBadgeClassName(styles, user.requestedRole ?? user.role)}`}
                    >
                      {formatRoleLabel(user.requestedRole ?? user.role)}
                    </span>
                  )}
                </td>
                <td>{user.course ?? 'N/A'}</td>
                <td>{formatDate(user.createdAt)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p className={styles.emptyNotice}>회원 목록이 없습니다.</p>
      )}
    </article>
  );
}
