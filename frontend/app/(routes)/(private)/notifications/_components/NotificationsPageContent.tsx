import Image from 'next/image';

import { FaUser } from 'react-icons/fa';
import { FiBell, FiCheck } from 'react-icons/fi';

import { formatNotificationTime, getNotificationIcon } from '@/app/shared/utils/notification';

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
    return (
      <section className={styles.container} aria-label="전체 알림">
        <div className={styles.loading}>알림을 불러오는 중입니다.</div>
      </section>
    );
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

            return (
              <li key={notification.id} className={styles.listItem}>
                <button
                  type="button"
                  className={notification.isRead ? styles.itemButton : `${styles.itemButton} ${styles.itemButtonUnread}`}
                  data-notification-id={notification.id}
                  data-notification-href={notification.href}
                  data-notification-is-read={notification.isRead ? 'true' : 'false'}
                  onClick={handleItemClick}
                >
                  <span className={styles.iconBox}>
                    <Icon aria-hidden="true" />
                  </span>
                  <span className={styles.itemContent}>
                    <span className={styles.itemTitleRow}>
                      {!notification.isRead ? <span className={styles.unreadDot} aria-hidden="true" /> : null}
                      <span className={styles.itemTitle}>{notification.title}</span>
                    </span>
                    <span className={styles.itemDescription}>{notification.description}</span>
                    <span className={styles.itemTime}>{formatNotificationTime(notification.createdAtMs)}</span>
                  </span>
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
