import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';

import styles from '@/app/(routes)/(private)/notifications/NotificationsPage.module.css';

const NOTIFICATION_SKELETON_COUNT = 6;

/**
 * 전체 알림 페이지 스켈레톤
 * @description 알림 페이지 로딩 중 레이아웃형 스켈레톤을 렌더링합니다.
 */
export default function NotificationsPageSkeleton() {
  return (
    <section className={styles.container} aria-label="전체 알림 로딩" aria-busy="true">
      <div className={styles.headerBlock} aria-hidden="true">
        <header className={styles.header}>
          <div className={styles.profileCard}>
            <div className={styles.profileMain}>
              <span className={styles.avatar}>
                <Skeleton circle width={62} height={62} />
              </span>
              <div className={styles.profileInfo}>
                <div className={styles.profileNameRow}>
                  <Skeleton width={118} height={32} />
                  <Skeleton width={92} height={16} />
                </div>
                <div className={styles.profileStatsRow}>
                  <Skeleton width={240} height={16} />
                </div>
              </div>
            </div>
          </div>
        </header>
        <div className={styles.headerDivider} />
      </div>

      <section className={styles.settingsSection} aria-hidden="true">
        <div className={styles.settingsRow}>
          <span className={styles.settingsLabel}>알림</span>
          <div className={styles.settingsControlGroup}>
            <div className={styles.settingsSortGroup}>
              <span className={styles.settingsSortButton}>
                <Skeleton width={94} height={14} />
              </span>
            </div>
          </div>
        </div>
      </section>

      <ul className={styles.list} aria-hidden="true">
        {Array.from({ length: NOTIFICATION_SKELETON_COUNT }).map((_, index) => (
          <li key={`notification-skeleton-${index}`} className={styles.listItem}>
            <div className={styles.itemButton}>
              <span className={styles.iconBox}>
                <Skeleton width={14} height={14} />
              </span>
              <span className={styles.itemLine}>
                <span className={styles.itemTitleRow}>
                  <span className={styles.unreadDotSkeleton} />
                  <Skeleton width={190} height={14} />
                </span>
                <span className={styles.itemSeparator}>-</span>
                <Skeleton width="100%" height={14} />
              </span>
              <span className={styles.itemTime}>
                <Skeleton width={58} height={12} />
              </span>
            </div>
            {index < NOTIFICATION_SKELETON_COUNT - 1 ? (
              <div className={styles.listDividerItem}>
                <div className={styles.listDivider} />
              </div>
            ) : null}
          </li>
        ))}
      </ul>
    </section>
  );
}
