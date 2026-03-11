import { FiClock, FiTrendingUp } from 'react-icons/fi';

import { MyPagePostListSkeleton } from '@/app/(routes)/(private)/mypage/MyPage.skeleton';
import MyPageFilterDropdown from '@/app/(routes)/(private)/mypage/_components/MyPageFilterDropdown';

import EmptyState from '@/app/shared/components/empty/EmptyState';
import PostSummaryList from '@/app/shared/components/post/PostSummaryList';

import styles from '@/app/(routes)/(private)/mypage/MyPage.module.css';

import type { MyPageActivityTabProps } from '@/app/shared/types/mypage';

/**
 * 활동 게시글 섹션
 * @description 내가 작성한 게시글 목록과 필터를 렌더링한다
 */
export default function MyPagePostsSection({
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
  postSortKey,
  selectedCategoryId,
  selectedCategoryLabel,
  selectedTagId,
  selectedTagLabel,
  handleCategorySelect,
  handlePostDelete,
  handlePostEdit,
  handlePostMenuToggle,
  handlePostSortToggle,
  handleTagSelect,
  toggleCategory,
  toggleTag,
}: MyPageActivityTabProps) {
  return (
    <section className={styles.activitySection} id="mypage-posts">
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
              onClick={handlePostSortToggle}
            >
              {postSortKey === 'popular' ? (
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
      {isMyPostsLoading ? (
        <MyPagePostListSkeleton showHeader={false} />
      ) : myPosts.length ? (
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
    </section>
  );
}
