import Skeleton from 'react-loading-skeleton';

import postListStyles from '@/app/shared/components/post/PostListView.module.css';
import layoutStyles from '@/app/(routes)/(public)/[profileId]/ProfilePageLayout.module.css';
import styles from '@/app/(routes)/(public)/[profileId]/ProfilePage.module.css';

/**
 * 공개 프로필 전체 스켈레톤
 * @description 헤더/소개/게시글 영역 로딩 UI를 렌더링합니다.
 */
export function ProfilePageSkeleton() {
  return (
    <section className={styles.container} aria-label="프로필">
      <div className={styles.headerBlock} aria-hidden="true">
        <header className={layoutStyles.header}>
          <div className={layoutStyles.profileCard}>
            <div className={layoutStyles.profileMain}>
              <span className={layoutStyles.avatar}>
                <Skeleton circle width={62} height={62} />
              </span>
              <div className={layoutStyles.profileInfo}>
                <div className={layoutStyles.profileNameRow}>
                  <Skeleton width={130} height={32} />
                  <Skeleton width={84} height={18} />
                </div>
                <div className={layoutStyles.profileStatsRow}>
                  <Skeleton width={220} height={18} />
                </div>
              </div>
              <div className={styles.profileSide}>
                <div className={layoutStyles.profileSocialRow}>
                  {Array.from({ length: 4 }).map((_, index) => (
                    <span key={`profile-social-skeleton-${index}`} className={layoutStyles.profileSocialLink}>
                      <Skeleton width={16} height={16} />
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </header>
        <div className={layoutStyles.headerDivider} aria-hidden="true" />
      </div>
      <section className={layoutStyles.settingsSection} aria-label="소개">
        <div className={layoutStyles.settingsRow}>
          <span className={layoutStyles.settingsLabel}>소개</span>
        </div>
        <div className={layoutStyles.settingsBody} aria-hidden="true">
          <Skeleton width="100%" height={18} />
          <Skeleton width="92%" height={18} />
          <Skeleton width="78%" height={18} />
        </div>
      </section>
      <div className={layoutStyles.headerDivider} aria-hidden="true" />
      <ProfilePostListSkeleton />
    </section>
  );
}

/**
 * 공개 프로필 게시글 스켈레톤
 * @description 게시글 목록 영역 로딩 UI를 렌더링합니다.
 */
export function ProfilePostListSkeleton() {
  return (
    <div className={layoutStyles.postsMain} aria-hidden="true">
      <div className={layoutStyles.settingsRow}>
        <span className={layoutStyles.settingsLabel}>게시글</span>
        <div className={layoutStyles.settingsControlGroup}>
          <span className={layoutStyles.filterButton}>
            <Skeleton width={62} height={14} />
          </span>
          <span className={layoutStyles.filterButton}>
            <Skeleton width={52} height={14} />
          </span>
          <div className={layoutStyles.settingsDivider} />
          <span className={layoutStyles.settingsSortButton}>
            <Skeleton width={58} height={14} />
          </span>
        </div>
      </div>
      <ul className={postListStyles.listView}>
        {Array.from({ length: 5 }).map((_, index) => (
          <li key={`profile-post-list-skeleton-${index}`}>
            <article className={postListStyles.listItem}>
              <div className={postListStyles.listBody}>
                <Skeleton width="72%" height={28} />
                <Skeleton count={2} height={15} />
                <div className={postListStyles.listTagList}>
                  <Skeleton width={52} height={24} borderRadius={4} />
                  <Skeleton width={68} height={24} borderRadius={4} />
                  <Skeleton width={56} height={24} borderRadius={4} />
                </div>
                <div className={postListStyles.meta}>
                  <Skeleton width={220} height={12} />
                  <Skeleton width={170} height={12} />
                </div>
              </div>
              <div className={postListStyles.listThumb}>
                <Skeleton width="100%" height="100%" />
              </div>
            </article>
            {index < 4 ? <div className={postListStyles.listDivider} /> : null}
          </li>
        ))}
      </ul>
    </div>
  );
}
