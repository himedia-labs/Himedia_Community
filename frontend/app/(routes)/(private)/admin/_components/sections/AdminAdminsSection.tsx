import { formatDate } from '@/app/shared/utils/date';
import { formatPhoneNumber } from '@/app/(routes)/(private)/admin/_utils/formatPhoneNumber.utils';

import styles from '@/app/(routes)/(private)/admin/AdminPage.module.css';

import type { AdminAdminsSectionProps } from '@/app/shared/types/admin';

/**
 * 관리자 목록 섹션
 * @description 관리자 계정 목록을 테이블 형태로 렌더링합니다.
 */
export default function AdminAdminsSection({ adminUsers, isUsersLoading }: AdminAdminsSectionProps) {
  return (
    <article className={`${styles.card} ${styles.tableCard}`}>
      {isUsersLoading ? (
        <p className={styles.notice}>불러오는 중입니다.</p>
      ) : adminUsers.length ? (
        <div className={styles.tableWrap}>
          <table className={styles.pendingTable}>
            <thead className={styles.pendingTableHead}>
              <tr>
                <th>순서</th>
                <th>이름</th>
                <th>이메일</th>
                <th>회원번호</th>
                <th>전화번호</th>
                <th>가입일</th>
              </tr>
            </thead>
            <tbody className={styles.pendingTableBody}>
              {adminUsers.map((user, index) => (
                <tr key={user.id}>
                  <td>#{index + 1}</td>
                  <td>{user.name}</td>
                  <td>{user.email}</td>
                  <td>{user.id}</td>
                  <td>{formatPhoneNumber(user.phone)}</td>
                  <td>{formatDate(user.createdAt)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <p className={styles.notice}>관리자 목록이 없습니다.</p>
      )}
    </article>
  );
}
