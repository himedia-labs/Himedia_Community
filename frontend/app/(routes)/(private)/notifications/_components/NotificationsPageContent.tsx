import Image from 'next/image';

import { FaUser } from 'react-icons/fa';
import { FiBell, FiCheck } from 'react-icons/fi';

import NotificationsPageSkeleton from '@/app/(routes)/(private)/notifications/NotificationsPage.skeleton';
import { formatNotificationTime, getNotificationIcon, isNotificationNavigable } from '@/app/shared/utils/notification';

import styles from '@/app/(routes)/(private)/notifications/NotificationsPage.module.css';

import type { NotificationsPageContentProps } from '@/app/shared/types/notification';

/**
 * 알림 페이지 콘텐츠
 * @description 전체 알림 헤더/탭/목록을 렌더링합니다.
 */
export default function NotificationsPageContent({
  hasUnread,
  isLoading,
  postCount,
  followerCount,
  followingCount,
  profileName,
  profileImageUrl,
  profileHandleText,
  handleItemClick,
  handleMarkAllRead,
  isMarkingAllRead,
  filteredNotifications,
}: NotificationsPageContentProps) {
  if (isLoading) {
    return <NotificationsPageSkeleton />;
  }

  return (
    <section className={styles.container} aria-label="전체 알림">
      <div className={styles.headerBlock}>
        <header className={styles.header}>
          <div className={styles.profileCard}>
            <div className={styles.profileMain}>
              <div className={styles.avatar} aria-hidden="true">
                {profileImageUrl ? (
                  <Image
                    className={styles.avatarImage}
                    src={profileImageUrl}
                    alt=""
                    width={62}
                    height={62}
                    sizes="62px"
                    unoptimized
                  />
                ) : (
                  <FaUser className={styles.avatarIcon} />
                )}
              </div>
              <div className={styles.profileInfo}>
                <div className={styles.profileNameRow}>
                  <span className={styles.profileName}>{profileName}</span>
                  <span className={styles.profileHandle}>{profileHandleText}</span>
                </div>
                <div className={styles.profileStatsRow}>
                  <div className={styles.profileStats}>
                    <span className={styles.profileStat}>
                      글 <strong>{postCount}</strong>
                    </span>
                    <span className={styles.profileDivider}>·</span>
                    <span className={styles.profileStat}>
                      팔로워 <strong>{followerCount}</strong>
                    </span>
                    <span className={styles.profileDivider}>·</span>
                    <span className={styles.profileStat}>
                      팔로잉 <strong>{followingCount}</strong>
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </header>
        <div className={styles.headerDivider} aria-hidden="true" />
      </div>

      <section className={styles.settingsSection} aria-label="전체 알림">
        <div className={styles.settingsRow}>
          <span className={styles.settingsLabel}>알림</span>
          <div className={styles.settingsControlGroup}>
            <div className={styles.settingsSortGroup}>
              <button
                type="button"
                className={`${styles.settingsSortButton} ${styles.settingsSortButtonActive}`}
                disabled={!hasUnread || isMarkingAllRead}
                onClick={handleMarkAllRead}
              >
                <FiCheck className={styles.settingsSortIcon} aria-hidden="true" />
                모두 읽음 처리
              </button>
            </div>
          </div>
        </div>
      </section>

      {filteredNotifications.length ? (
        <ul className={styles.list}>
          {filteredNotifications.map((notification, index) => {
            const Icon = getNotificationIcon(notification.type);
            const isNavigable = isNotificationNavigable(notification.type, notification.href);

            return (
              <li key={notification.id} className={styles.listItem}>
                <button
                  type="button"
                  className={
                    notification.isRead
                      ? isNavigable
                        ? styles.itemButton
                        : `${styles.itemButton} ${styles.itemButtonStatic}`
                      : isNavigable
                        ? `${styles.itemButton} ${styles.itemButtonUnread}`
                        : `${styles.itemButton} ${styles.itemButtonUnread} ${styles.itemButtonStatic}`
                  }
                  data-notification-id={notification.id}
                  data-notification-href={isNavigable ? notification.href : ''}
                  data-notification-is-read={notification.isRead ? 'true' : 'false'}
                  onClick={isNavigable ? handleItemClick : undefined}
                  aria-disabled={!isNavigable}
                >
                  <span className={styles.iconBox}>
                    <Icon aria-hidden="true" />
                  </span>
                  <span className={styles.itemLine}>
                    <span className={styles.itemTitleRow}>
                      <span
                        className={notification.isRead ? `${styles.unreadDot} ${styles.unreadDotRead}` : styles.unreadDot}
                        aria-hidden="true"
                      />
                      <span className={styles.itemTitle}>{notification.title}</span>
                    </span>
                    <span className={styles.itemSeparator} aria-hidden="true">
                      -
                    </span>
                    <span className={styles.itemDescription}>{notification.description}</span>
                  </span>
                  <span className={styles.itemTime}>{formatNotificationTime(notification.createdAtMs)}</span>
                </button>
                {index < filteredNotifications.length - 1 ? (
                  <div className={styles.listDividerItem} aria-hidden="true">
                    <div className={styles.listDivider} />
                  </div>
                ) : null}
              </li>
            );
          })}
        </ul>
      ) : (
        <div className={styles.empty}>
          <FiBell aria-hidden="true" />
          <span>표시할 알림이 없습니다.</span>
        </div>
      )}
    </section>
  );
}
