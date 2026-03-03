import { FiClock, FiTrendingUp } from 'react-icons/fi';

import EmptyState from '@/app/shared/components/empty/EmptyState';
import PostSummaryList from '@/app/shared/components/post/PostSummaryList';
import { MyPagePostListSkeleton } from '@/app/(routes)/(private)/mypage/MyPage.skeleton';

import styles from '@/app/(routes)/(private)/mypage/MyPage.module.css';

import type { MyPageRecentTabProps } from '@/app/shared/types/mypage';

/**
 * 최근 읽은 포스트 탭
 * @description 최근 조회한 게시글 목록을 표시한다
 */
export default function MyPageRecentTab({
  currentUserId,
  isPostDeleting,
  isRecentPostsListLoading,
  openPostMenuId,
  sortKey,
  sortedRecentPosts,
  handlePostDelete,
  handlePostEdit,
  handlePostMenuToggle,
  handleSortToggle,
}: MyPageRecentTabProps) {
  if (isRecentPostsListLoading) {
    return <MyPagePostListSkeleton label="최근 읽은 포스트" showFilters={false} />;
  }

  return (
    <>
      <div className={styles.settingsRow}>
        <span className={styles.settingsLabel}>최근 읽은 포스트</span>
        <div className={styles.settingsSortGroup}>
          <button
            type="button"
            className={`${styles.settingsSortButton} ${styles.settingsSortButtonActive}`}
            onClick={handleSortToggle}
          >
            {sortKey === 'popular' ? (
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
      {sortedRecentPosts.length ? (
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
    </>
  );
}
