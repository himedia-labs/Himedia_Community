import { formatDate } from '@/app/shared/utils/date';
import { formatPhoneNumber } from '@/app/(routes)/(private)/admin/_utils/formatPhoneNumber.utils';

import styles from '@/app/(routes)/(private)/admin/AdminPage.module.css';

import type { AdminRejectedUsersSectionProps } from '@/app/shared/types/admin';

/**
 * 거절 계정 섹션
 * @description 거절된 계정 목록과 재가입 허용 액션을 렌더링합니다.
 */
export default function AdminRejectedUsersSection({
  rejectedUsers,
  isRejectedUsersLoading,
  handleDeleteRejectedUserClick,
}: AdminRejectedUsersSectionProps) {
  return (
    <article className={`${styles.card} ${styles.tableCard}`}>
      {isRejectedUsersLoading ? (
        <p className={styles.notice}>불러오는 중입니다.</p>
      ) : rejectedUsers.length ? (
        <div className={styles.tableWrap}>
          <table className={styles.pendingTable}>
            <thead className={styles.pendingTableHead}>
              <tr>
                <th>순서</th>
                <th>이름</th>
                <th>이메일</th>
                <th>전화번호</th>
                <th>생년월일</th>
                <th>거절일(가입일)</th>
                <th>거절 사유</th>
                <th>처리</th>
              </tr>
            </thead>
            <tbody className={styles.pendingTableBody}>
              {rejectedUsers.map((user, index) => (
                <tr key={user.id}>
                  <td>#{index + 1}</td>
                  <td>{user.name}</td>
                  <td>{user.email}</td>
                  <td>{formatPhoneNumber(user.phone)}</td>
                  <td>{user.birthDate ?? '-'}</td>
                  <td>{formatDate(user.createdAt)}</td>
                  <td>{user.rejectedReason ?? '-'}</td>
                  <td>
                    <div className={styles.actions}>
                      <button
                        type="button"
                        className={`${styles.actionButton} ${styles.rejectActionButton}`}
                        data-user-id={user.id}
                        onClick={handleDeleteRejectedUserClick}
                      >
                        재가입 허용
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <p className={styles.notice}>거절된 계정이 없습니다.</p>
      )}
    </article>
  );
}
