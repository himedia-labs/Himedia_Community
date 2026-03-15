import { FiChevronRight } from 'react-icons/fi';

import { formatDate } from '@/app/shared/utils/date';
import { getAuditResultBadgeClassName } from '@/app/(routes)/(private)/admin/_utils/adminDisplay.utils';
import {
  formatAuditAfterLabel,
  formatAuditActionLabel,
  formatAuditBeforeLabel,
  formatAuditResultLabel,
  formatAuditTargetLabel,
} from '@/app/(routes)/(private)/admin/_utils/formatAuditLog.utils';

import styles from '@/app/(routes)/(private)/admin/AdminPage.module.css';

import type { AdminAuditLogsSectionProps } from '@/app/shared/types/admin';

/**
 * 감사 로그 섹션
 * @description 감사 로그 테이블과 결과 배지를 렌더링합니다.
 */
export default function AdminAuditLogsSection({ auditLogs, isLogsLoading }: AdminAuditLogsSectionProps) {
  return (
    <article className={styles.tableCard}>
      {isLogsLoading ? (
        <p className={styles.notice}>불러오는 중입니다.</p>
      ) : auditLogs.length ? (
        <table className={styles.pendingTable}>
          <thead className={styles.pendingTableHead}>
            <tr>
              <th>순서</th>
              <th>작업</th>
              <th>대상</th>
              <th>변경 전</th>
              <th className={styles.auditDiffArrowCell} aria-label="변경 방향">
                <FiChevronRight aria-hidden="true" />
              </th>
              <th>변경 후</th>
              <th>시각</th>
              <th>결과</th>
            </tr>
          </thead>
          <tbody className={styles.pendingTableBody}>
            {auditLogs.map((log, index) => (
              <tr key={log.id}>
                <td>#{index + 1}</td>
                <td>{formatAuditActionLabel(log.action)}</td>
                <td>{formatAuditTargetLabel(log.targetType, log.targetId, log.targetName, log.targetEmail)}</td>
                <td>{formatAuditBeforeLabel(log.action, log.payload)}</td>
                <td className={styles.auditDiffArrowCell}>
                  <FiChevronRight aria-hidden="true" />
                </td>
                <td>{formatAuditAfterLabel(log.action, log.payload)}</td>
                <td>{formatDate(log.createdAt)}</td>
                <td>
                  <span className={`${styles.auditResultBadge} ${getAuditResultBadgeClassName(styles, log.payload)}`}>
                    <span className={styles.auditResultDot} aria-hidden="true" />
                    {formatAuditResultLabel(log.payload)}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p className={styles.emptyNotice}>감사 로그가 없습니다.</p>
      )}
    </article>
  );
}
