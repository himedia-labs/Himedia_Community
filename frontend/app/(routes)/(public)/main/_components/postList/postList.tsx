'use client';

import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';

import { useCurrentUserQuery } from '@/app/api/auth/auth.queries';
import { useAuthStore } from '@/app/shared/store/authStore';
import {
  PostListContent,
  PostListSidebar,
  PostListToolbar,
} from '@/app/(routes)/(public)/main/_components/postList/_components';
import { usePostList, usePostListInfiniteScroll } from '@/app/(routes)/(public)/main/_components/postList/_hooks';
import {
  createHandleCloseSearchMode,
  createHandleCreatePost,
  createHandleSearchInputChange,
  createHandleSearchInputKeyDown,
  createHandleSelectCategory,
  createHandleSelectSortFilter,
  createHandleSortFilter,
  createHandleToggleCategoryOrder,
  createHandleToggleViewMode,
} from '@/app/(routes)/(public)/main/_components/postList/_handlers';

import styles from '@/app/(routes)/(public)/main/_components/postList/postList.module.css';

/**
 * 메인 포스트 리스트
 * @description 게시물 목록과 카테고리, 인기글 영역을 표시
 */
export default function PostListSection() {
  // 라우트 훅
  const router = useRouter();

  // 인증 상태
  const { accessToken } = useAuthStore();
  const { data: currentUser } = useCurrentUserQuery();

  // 목록 상태
  const {
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    viewMode,
    setViewMode,
    sortFilter,
    setSortFilter,
    isSearchMode,
    setSearchMode,
    searchKeyword,
    setSearchKeyword,
    selectedCategory,
    setSelectedCategory,
    categoryOrder,
    setCategoryOrder,
    categoryNames,
    filteredPosts,
    topPosts,
    isLoading,
    isCategoriesLoading,
    isTopPostsLoading,
    isFollowingEmpty,
    isCategoryEmpty,
    isSearchEmpty,
    isGeneralEmpty,
  } = usePostList();

  // 스켈레톤
  const listSkeletons = Array.from({ length: 5 });
  const topSkeletons = Array.from({ length: 5 });
  const cardSkeletons = Array.from({ length: 6 });
  const categorySkeletons = Array.from({ length: 8 });
  const listTagSkeletonWidths = [48, 64, 56];
  const cardTagSkeletonWidths = [44, 58, 50];
  const sentinelRef = useRef<HTMLDivElement | null>(null);
  const [searchInputValue, setSearchInputValue] = useState(searchKeyword);

  // 핸들러
  const handleCreatePost = createHandleCreatePost({ router });
  const handleSortFilter = createHandleSortFilter({ accessToken, router, setSortFilter });
  const handleCloseSearchMode = createHandleCloseSearchMode(setSearchMode);
  const handleSearchInputChange = createHandleSearchInputChange(setSearchInputValue);
  const handleSearchInputKeyDown = createHandleSearchInputKeyDown({
    getSearchInputValue: () => searchInputValue,
    setSearchKeyword,
  });
  const handleToggleViewMode = createHandleToggleViewMode({ setViewMode, viewMode });
  const handleLatestSortFilter = createHandleSelectSortFilter({ handleSortFilter, nextFilter: 'latest' });
  const handleTopSortFilter = createHandleSelectSortFilter({ handleSortFilter, nextFilter: 'top' });
  const handleFollowingSortFilter = createHandleSelectSortFilter({ handleSortFilter, nextFilter: 'following' });
  const handleSelectQaCategory = createHandleSelectCategory({ category: 'Q&A', setSelectedCategory });
  const handleToggleCategoryOrder = createHandleToggleCategoryOrder({
    categoryOrder,
    setCategoryOrder,
  });

  // 검색 입력 동기화
  useEffect(() => {
    setSearchInputValue(searchKeyword);
  }, [searchKeyword]);

  // 검색 모드 인기순 고정
  useEffect(() => {
    if (!isSearchMode) return;
    if (sortFilter === 'top') return;
    setSortFilter('top');
  }, [isSearchMode, setSortFilter, sortFilter]);

  // 무한 스크롤
  usePostListInfiniteScroll({ fetchNextPage, hasNextPage, isFetchingNextPage, sentinelRef });

  return (
    <section
      className={isSearchMode ? `${styles.container} ${styles.containerSearch}` : styles.container}
      aria-label="포스트 하이라이트"
    >
      <div className={isSearchMode ? `${styles.main} ${styles.mainSearch}` : styles.main}>
        <PostListToolbar
          viewMode={viewMode}
          sortFilter={sortFilter}
          isSearchMode={isSearchMode}
          searchKeyword={searchKeyword}
          searchInputValue={searchInputValue}
          selectedCategory={selectedCategory}
          categoryOrder={categoryOrder}
          filteredPostCount={filteredPosts.length}
          handleCreatePost={handleCreatePost}
          handleCloseSearchMode={handleCloseSearchMode}
          handleLatestSortFilter={handleLatestSortFilter}
          handleTopSortFilter={handleTopSortFilter}
          handleFollowingSortFilter={handleFollowingSortFilter}
          handleSearchInputKeyDown={handleSearchInputKeyDown}
          handleSearchInputChange={handleSearchInputChange}
          handleSelectQaCategory={handleSelectQaCategory}
          handleToggleCategoryOrder={handleToggleCategoryOrder}
          handleToggleViewMode={handleToggleViewMode}
        />
        <PostListContent
          viewMode={viewMode}
          currentUserId={currentUser?.id}
          isLoading={isLoading}
          isSearchMode={isSearchMode}
          isSearchEmpty={isSearchEmpty}
          isFollowingEmpty={isFollowingEmpty}
          isCategoryEmpty={isCategoryEmpty}
          isGeneralEmpty={isGeneralEmpty}
          isFetchingNextPage={isFetchingNextPage}
          filteredPosts={filteredPosts}
          cardTagSkeletonWidths={cardTagSkeletonWidths}
          listTagSkeletonWidths={listTagSkeletonWidths}
          cardSkeletons={cardSkeletons}
          listSkeletons={listSkeletons}
        />
        {!isFollowingEmpty && !isCategoryEmpty ? (
          <div ref={sentinelRef} className={styles.infiniteSentinel} aria-hidden="true" />
        ) : null}
      </div>

      <PostListSidebar
        selectedCategory={selectedCategory}
        isSearchMode={isSearchMode}
        isTopPostsLoading={isTopPostsLoading}
        isCategoriesLoading={isCategoriesLoading}
        topPosts={topPosts}
        categoryNames={categoryNames}
        categorySkeletons={categorySkeletons}
        topSkeletons={topSkeletons}
        setSelectedCategory={setSelectedCategory}
      />
    </section>
  );
}
