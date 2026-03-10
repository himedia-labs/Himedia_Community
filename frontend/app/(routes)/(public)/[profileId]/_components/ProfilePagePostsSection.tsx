import { FiChevronDown, FiClock, FiTrendingUp } from 'react-icons/fi';

import PostSummaryList from '@/app/shared/components/post/PostSummaryList';

import layoutStyles from '@/app/(routes)/(public)/[profileId]/ProfilePageLayout.module.css';
import styles from '@/app/(routes)/(public)/[profileId]/ProfilePage.module.css';

import type { ProfilePagePostsSectionProps } from '@/app/shared/types/profilePage';

/**
 * 프로필 게시글 섹션
 * @description 필터 드롭다운과 공개 게시글 목록을 렌더링합니다.
 */
export default function ProfilePagePostsSection({
  emptyText,
  sortKey,
  isTagOpen,
  isCategoryOpen,
  filteredPosts,
  postCategories,
  postTags,
  selectedTagId,
  selectedCategoryId,
  selectedTagLabel,
  selectedCategoryLabel,
  handleSortToggle,
  toggleCategory,
  toggleTag,
  handleCategoryButtonClick,
  handleTagButtonClick,
}: ProfilePagePostsSectionProps) {
  return (
    <section className={layoutStyles.settingsSection} aria-label="게시글 목록">
      <div className={layoutStyles.settingsRow}>
        <span className={layoutStyles.settingsLabel}>게시글</span>
        <div className={layoutStyles.settingsControlGroup}>
          <div className={layoutStyles.filterDropdown}>
            <button type="button" className={layoutStyles.filterButton} onClick={toggleCategory} disabled={!postCategories.length}>
              {selectedCategoryLabel ?? '카테고리'}
              <FiChevronDown className={layoutStyles.filterChevron} aria-hidden="true" />
            </button>
            {isCategoryOpen ? (
              <div className={layoutStyles.filterMenu}>
                {postCategories.map(category => (
                  <button
                    key={category.id}
                    type="button"
                    className={`${layoutStyles.filterItem} ${selectedCategoryId === category.id ? layoutStyles.filterItemActive : ''}`}
                    data-category-id={category.id}
                    onClick={handleCategoryButtonClick}
                  >
                    <span>{category.name}</span>
                    <span className={layoutStyles.filterCount}>{category.count}</span>
                  </button>
                ))}
              </div>
            ) : null}
          </div>
          <div className={layoutStyles.filterDropdown}>
            <button type="button" className={layoutStyles.filterButton} onClick={toggleTag} disabled={!postTags.length}>
              <span className={layoutStyles.tagFilterLabel}>{selectedTagLabel ? `#${selectedTagLabel}` : '#태그'}</span>
              <FiChevronDown className={layoutStyles.filterChevron} aria-hidden="true" />
            </button>
            {isTagOpen ? (
              <div className={`${layoutStyles.filterMenu} ${layoutStyles.tagFilterMenu}`}>
                {postTags.map(tag => (
                  <button
                    key={tag.id}
                    type="button"
                    className={`${layoutStyles.filterItem} ${
                      selectedTagId === tag.id ? `${layoutStyles.filterItemActive} ${layoutStyles.tagFilterItemActive}` : ''
                    }`}
                    data-tag-id={tag.id}
                    onClick={handleTagButtonClick}
                  >
                    <span className={layoutStyles.tagFilterName}>#{tag.name}</span>
                    <span className={layoutStyles.filterCount}>{tag.count}</span>
                  </button>
                ))}
              </div>
            ) : null}
          </div>
          <div className={layoutStyles.settingsDivider} aria-hidden="true" />
          <div className={layoutStyles.settingsSortGroup}>
            <button
              type="button"
              className={`${layoutStyles.settingsSortButton} ${layoutStyles.settingsSortButtonActive}`}
              onClick={handleSortToggle}
            >
              {sortKey === 'popular' ? (
                <>
                  <FiTrendingUp className={layoutStyles.settingsSortIcon} aria-hidden="true" />
                  인기순
                </>
              ) : (
                <>
                  <FiClock className={layoutStyles.settingsSortIcon} aria-hidden="true" />
                  최신순
                </>
              )}
            </button>
          </div>
        </div>
      </div>
      <PostSummaryList posts={filteredPosts} emptyText={emptyText} emptyClassName={styles.empty} />
    </section>
  );
}
