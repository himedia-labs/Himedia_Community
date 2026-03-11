import { FiClock, FiTrendingUp } from 'react-icons/fi';

import { MyPagePostListSkeleton } from '@/app/(routes)/(private)/mypage/MyPage.skeleton';

import EmptyState from '@/app/shared/components/empty/EmptyState';
import PostSummaryList from '@/app/shared/components/post/PostSummaryList';

import styles from '@/app/(routes)/(private)/mypage/MyPage.module.css';

import type { MyPageActivityTabProps } from '@/app/shared/types/mypage';

/**
 * 활동 최근 조회 섹션
 * @description 최근 읽은 포스트 목록을 렌더링한다
 */
export default function MyPageRecentSection({
  currentUserId,
  isPostDeleting,
  isRecentPostsListLoading,
  openPostMenuId,
  recentPostSortKey,
  sortedRecentPosts,
  handlePostDelete,
  handlePostEdit,
  handlePostMenuToggle,
  handleRecentPostSortToggle,
}: MyPageActivityTabProps) {
  return (
    <section className={styles.activitySection} id="mypage-recent">
      <div className={styles.settingsRow}>
        <span className={styles.settingsLabel}>최근 읽은 포스트</span>
        <div className={styles.settingsSortGroup}>
          <button
            type="button"
            className={`${styles.settingsSortButton} ${styles.settingsSortButtonActive}`}
            onClick={handleRecentPostSortToggle}
          >
            {recentPostSortKey === 'popular' ? (
              <>
                <FiTrendingUp className={styles.settingsSortIcon} aria-hidden="true" />
                인기순
              </>
            ) : (
              <>
                <FiClock className={styles.settingsSortIcon} aria-hidden="true" />
                최신순
              </>
            )}
          </button>
        </div>
      </div>
      {isRecentPostsListLoading ? (
        <MyPagePostListSkeleton showHeader={false} />
      ) : sortedRecentPosts.length ? (
        <PostSummaryList
          posts={sortedRecentPosts}
          emptyText="아직 최근 읽은 게시물이 없습니다."
          currentUserId={currentUserId}
          actionHandlers={{
            isPostDeleting,
            openPostMenuId,
            onPostDelete: handlePostDelete,
            onPostEdit: handlePostEdit,
            onPostMenuToggle: handlePostMenuToggle,
          }}
        />
      ) : (
        <EmptyState
          title="아직 최근 읽은 게시물이 없습니다."
          description="게시글을 읽으면 이곳에 표시됩니다."
        />
      )}
    </section>
  );
}
