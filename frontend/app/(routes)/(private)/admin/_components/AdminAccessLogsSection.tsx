import { formatDate } from '@/app/shared/utils/date';
import { getAccessStatusBadgeClassName } from '@/app/(routes)/(private)/admin/_utils/adminDisplay.utils';
import { formatUserAgentLabel } from '@/app/(routes)/(private)/admin/_utils/formatUserAgentLabel.utils';
import { formatSessionDuration } from '@/app/(routes)/(private)/admin/_utils/formatSessionDuration.utils';

import styles from '@/app/(routes)/(private)/admin/AdminPage.module.css';

import type { AdminAccessLogsSectionProps } from '@/app/shared/types/admin';

/**
 * 접속 로그 섹션
 * @description 관리자 접속 로그 테이블과 무한스크롤 트리거를 렌더링합니다.
 */
export default function AdminAccessLogsSection({
  accessLogs,
  hasNextAccessLogsPage,
  isAccessLogsFetchingMore,
  isAccessLogsLoading,
  accessLogsLoadMoreRef,
}: AdminAccessLogsSectionProps) {
  return (
    <article className={styles.tableCard}>
      {isAccessLogsLoading ? (
        <p className={styles.notice}>불러오는 중입니다.</p>
      ) : accessLogs.length ? (
        <>
          <table className={styles.pendingTable}>
            <thead className={styles.pendingTableHead}>
              <tr>
                <th>순서</th>
                <th>관리자</th>
                <th>로그인 시각</th>
                <th>로그아웃 시각</th>
                <th>접속 IP</th>
                <th>브라우저</th>
                <th>세션 시간</th>
                <th>상태</th>
              </tr>
            </thead>
            <tbody className={styles.pendingTableBody}>
              {accessLogs.map((log, index) => (
                <tr key={log.id}>
                  <td>#{index + 1}</td>
                  <td>{`${log.adminName} (${log.adminEmail})`}</td>
                  <td>{formatDate(log.loginAt)}</td>
                  <td>{log.logoutAt ? formatDate(log.logoutAt) : 'N/A'}</td>
                  <td>{log.ipAddress}</td>
                  <td>{formatUserAgentLabel(log.userAgent)}</td>
                  <td>{formatSessionDuration(log.sessionDurationSec)}</td>
                  <td>
                    <span className={`${styles.auditResultBadge} ${getAccessStatusBadgeClassName(styles, log.status)}`}>
                      <span className={styles.auditResultDot} aria-hidden="true" />
                      {log.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <div ref={accessLogsLoadMoreRef} className={styles.accessLogsLoadMoreTrigger} aria-hidden="true" />
          {isAccessLogsFetchingMore ? <p className={styles.notice}>다음 로그를 불러오는 중입니다.</p> : null}
          {!hasNextAccessLogsPage ? <p className={styles.notice}>모든 로그를 확인했습니다.</p> : null}
        </>
      ) : (
        <p className={styles.emptyNotice}>접속 이력이 없습니다.</p>
      )}
    </article>
  );
}
