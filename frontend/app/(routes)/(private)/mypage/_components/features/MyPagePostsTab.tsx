import { FiClock, FiTrendingUp } from 'react-icons/fi';

import EmptyState from '@/app/shared/components/empty/EmptyState';
import PostSummaryList from '@/app/shared/components/post/PostSummaryList';
import { MyPagePostListSkeleton } from '@/app/(routes)/(private)/mypage/MyPage.skeleton';
import MyPageFilterDropdown from '@/app/(routes)/(private)/mypage/_components/ui/MyPageFilterDropdown';

import styles from '@/app/(routes)/(private)/mypage/MyPage.module.css';

import type { MyPagePostsTabProps } from '@/app/shared/types/mypage';

/**
 * 내 블로그 탭
 * @description 작성한 게시글 목록을 필터링하여 표시한다
 */
export default function MyPagePostsTab({
  currentUserId,
  filteredPosts,
  isCategoryOpen,
  isMyPostsLoading,
  isPostDeleting,
  isTagOpen,
  myPosts,
  openPostMenuId,
  postCategories,
  postTags,
  selectedCategoryId,
  selectedCategoryLabel,
  selectedTagId,
  selectedTagLabel,
  sortKey,
  handleCategorySelect,
  handlePostDelete,
  handlePostEdit,
  handlePostMenuToggle,
  handleSortToggle,
  handleTagSelect,
  toggleCategory,
  toggleTag,
}: MyPagePostsTabProps) {
  if (isMyPostsLoading) {
    return <MyPagePostListSkeleton label="내 블로그" />;
  }

  return (
    <div className={styles.postsMain}>
      <div className={styles.settingsRow}>
        <span className={styles.settingsLabel}>내 블로그</span>
        <div className={styles.settingsControlGroup}>
          <MyPageFilterDropdown
            type="category"
            items={postCategories}
            selectedId={selectedCategoryId}
            selectedLabel={selectedCategoryLabel}
            isOpen={isCategoryOpen}
            onToggle={toggleCategory}
            onSelect={handleCategorySelect}
          />
          <MyPageFilterDropdown
            type="tag"
            items={postTags}
            selectedId={selectedTagId}
            selectedLabel={selectedTagLabel}
            isOpen={isTagOpen}
            onToggle={toggleTag}
            onSelect={handleTagSelect}
          />
          <div className={styles.settingsDivider} aria-hidden="true" />
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
      </div>
      {myPosts.length ? (
        filteredPosts.length ? (
          <PostSummaryList
            posts={filteredPosts}
            currentUserId={currentUserId}
            emptyText="조건에 맞는 게시물이 없습니다."
            actionHandlers={{
              openPostMenuId,
              isPostDeleting,
              onPostDelete: handlePostDelete,
              onPostEdit: handlePostEdit,
              onPostMenuToggle: handlePostMenuToggle,
            }}
          />
        ) : (
          <EmptyState
            title="조건에 맞는 게시물이 없습니다."
            description="필터를 변경하면 다른 게시글을 볼 수 있습니다."
          />
        )
      ) : (
        <EmptyState
          title="아직 작성한 게시물이 없습니다."
          description="첫 게시글을 작성하면 이곳에 표시됩니다."
        />
      )}
    </div>
  );
}
