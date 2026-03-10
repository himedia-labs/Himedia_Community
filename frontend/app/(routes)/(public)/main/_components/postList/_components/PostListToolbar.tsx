import { PiList } from 'react-icons/pi';
import { CiGrid41, CiSearch } from 'react-icons/ci';
import { FiClock, FiEdit3, FiTrendingUp } from 'react-icons/fi';

import styles from '@/app/(routes)/(public)/main/_components/postList/postList.module.css';

import type { PostListToolbarProps } from '@/app/shared/types/post';

/**
 * 포스트 리스트 툴바
 * @description 작성 버튼, 정렬, 검색 입력 등 상단 제어 영역을 렌더링합니다.
 */
export default function PostListToolbar({
  viewMode,
  sortFilter,
  isSearchMode,
  searchKeyword,
  searchInputValue,
  selectedCategory,
  categoryOrder,
  filteredPostCount,
  handleCreatePost,
  handleCloseSearchMode,
  handleLatestSortFilter,
  handleTopSortFilter,
  handleFollowingSortFilter,
  handleSearchInputKeyDown,
  handleSearchInputChange,
  handleSelectQaCategory,
  handleToggleCategoryOrder,
  handleToggleViewMode,
}: PostListToolbarProps) {
  // 카테고리 상태
  const isCategorySelected = selectedCategory !== 'ALL';

  return (
    <>
      <div className={styles.header}>
        <button type="button" className={styles.createButton} aria-label="게시물 작성" onClick={handleCreatePost}>
          <FiEdit3 />
        </button>
        <button
          type="button"
          className={styles.toggleButton}
          onClick={handleToggleViewMode}
          aria-label={viewMode === 'list' ? '카드 보기' : '리스트 보기'}
        >
          {viewMode === 'list' ? <CiGrid41 /> : <PiList />}
        </button>
      </div>

      <div className={isSearchMode ? `${styles.sortBar} ${styles.sortBarSearch}` : styles.sortBar}>
        {!isSearchMode ? (
          <>
            <button
              type="button"
              className={sortFilter === 'latest' && !isCategorySelected ? `${styles.sortButton} ${styles.active}` : styles.sortButton}
              onClick={handleLatestSortFilter}
            >
              최신
            </button>
            <button
              type="button"
              className={sortFilter === 'top' && !isCategorySelected ? `${styles.sortButton} ${styles.active}` : styles.sortButton}
              onClick={handleTopSortFilter}
            >
              TOP
            </button>
            <button
              type="button"
              className={
                sortFilter === 'following' && !isCategorySelected ? `${styles.sortButton} ${styles.active}` : styles.sortButton
              }
              onClick={handleFollowingSortFilter}
            >
              피드
            </button>
            <span className={styles.sortDivider} aria-hidden="true">
              |
            </span>
            <button
              type="button"
              className={selectedCategory === 'Q&A' ? `${styles.sortButton} ${styles.active}` : styles.sortButton}
              onClick={handleSelectQaCategory}
            >
              Q&A
            </button>
          </>
        ) : null}
        <div className={styles.sortRightGroup}>
          {!isSearchMode && isCategorySelected ? (
            <button type="button" className={styles.categoryOrderButton} onClick={handleToggleCategoryOrder}>
              {categoryOrder === 'popular' ? (
                <>
                  <FiTrendingUp className={styles.categoryOrderIcon} aria-hidden="true" />
                  인기순
                </>
              ) : (
                <>
                  <FiClock className={styles.categoryOrderIcon} aria-hidden="true" />
                  최신순
                </>
              )}
            </button>
          ) : null}
          {isSearchMode ? (
            <label className={styles.sortSearchField} htmlFor="main-sort-search">
              <input
                id="main-sort-search"
                type="text"
                className={styles.sortSearchInput}
                placeholder="제목, 내용, 작성자, 태그 검색"
                value={searchInputValue}
                onKeyDown={handleSearchInputKeyDown}
                onChange={handleSearchInputChange}
              />
              <button
                type="button"
                className={styles.sortSearchIconButton}
                aria-label="검색 닫기"
                onClick={handleCloseSearchMode}
              >
                <CiSearch aria-hidden="true" />
              </button>
            </label>
          ) : null}
        </div>
      </div>

      {isSearchMode ? (
        searchKeyword ? (
          <p className={styles.searchResultCount}>
            아티클 갯수 <span className={styles.searchResultCountNumber}>{filteredPostCount}개</span>
          </p>
        ) : (
          <div className={styles.searchTopicCopy}>
            <p className={styles.searchTopicTitle}>어떤 글을 찾고 계신가요?</p>
            <p className={styles.searchTopicHint}>요즘 많이 보는 주제</p>
          </div>
        )
      ) : null}
    </>
  );
}
