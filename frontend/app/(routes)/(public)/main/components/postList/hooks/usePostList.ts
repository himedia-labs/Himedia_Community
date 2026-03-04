import { useEffect } from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';

import { useAuthStore } from '@/app/shared/store/authStore';
import { useCategoriesQuery } from '@/app/api/categories/categories.queries';
import { useInfinitePostsQuery, usePostsQuery } from '@/app/api/posts/posts.queries';
import { toViewPost } from '@/app/(routes)/(public)/main/components/postList/utils/toViewPost.utils';

import type { SortFilter, TopPost, ViewMode } from '@/app/shared/types/post';

const ALL_CATEGORY = 'ALL';

const buildNextUrl = (pathname: string, params: URLSearchParams) => {
  const nextParams = new URLSearchParams(params.toString());
  const hasSearchFlag = pathname === '/' && nextParams.has('search');
  nextParams.delete('search');
  const queryString = nextParams.toString();

  if (!hasSearchFlag) {
    return queryString ? `${pathname}?${queryString}` : pathname;
  }

  return queryString ? `${pathname}?search&${queryString}` : `${pathname}?search`;
};

/**
 * 메인 포스트 목록 훅
 * @description 메인 포스트 목록의 상태와 데이터를 제공
 */
export const usePostList = () => {
  // 인증 상태
  const { accessToken } = useAuthStore();

  // 라우팅 상태
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // 뷰/정렬/카테고리 상태
  const viewMode: ViewMode = searchParams.get('view') === 'card' ? 'card' : 'list';
  const sortParam = searchParams.get('sort');
  const sortFilter: SortFilter = sortParam === 'top' || sortParam === 'following' ? sortParam : 'latest';
  const isSearchMode = searchParams.has('search');
  const searchKeyword = (searchParams.get('q') ?? '').trim();
  const selectedCategory = searchParams.get('category') || ALL_CATEGORY;
  const categoryOrder = searchParams.get('order') === 'popular' ? 'popular' : 'latest';

  // 피드는 로그인 필요 - 비로그인 시 최신으로 리다이렉트
  useEffect(() => {
    if (sortFilter === 'following' && !accessToken) {
      const nextSearchParams = new URLSearchParams(searchParams.toString());
      nextSearchParams.delete('sort');
      const nextUrl = buildNextUrl(pathname, nextSearchParams);
      router.replace(nextUrl);
    }
  }, [sortFilter, accessToken, router, pathname, searchParams]);

  // 뷰 모드 변경
  const setViewMode = (nextViewMode: ViewMode) => {
    const nextSearchParams = new URLSearchParams(searchParams.toString());
    if (nextViewMode === 'list') {
      nextSearchParams.delete('view');
    } else {
      nextSearchParams.set('view', nextViewMode);
    }
    const nextUrl = buildNextUrl(pathname, nextSearchParams);
    router.replace(nextUrl);
  };

  // 정렬 필터 변경
  const setSortFilter = (nextSortFilter: SortFilter) => {
    const nextSearchParams = new URLSearchParams(searchParams.toString());
    if (nextSortFilter === 'latest') {
      nextSearchParams.delete('sort');
    } else {
      nextSearchParams.set('sort', nextSortFilter);
    }
    // 정렬 필터 선택 시 카테고리 리셋
    nextSearchParams.delete('category');
    nextSearchParams.delete('order');
    const nextUrl = buildNextUrl(pathname, nextSearchParams);
    router.replace(nextUrl);
  };

  // 카테고리 변경
  const setSelectedCategory = (nextCategory: string) => {
    const nextSearchParams = new URLSearchParams(searchParams.toString());
    if (nextCategory === ALL_CATEGORY) {
      nextSearchParams.delete('category');
      nextSearchParams.delete('order');
    } else {
      nextSearchParams.set('category', nextCategory);
      // 카테고리 선택 시 정렬 필터 리셋
      nextSearchParams.delete('sort');
    }
    const nextUrl = buildNextUrl(pathname, nextSearchParams);
    router.replace(nextUrl);
  };

  // 검색 모드 변경
  const setSearchMode = (enabled: boolean) => {
    const nextSearchParams = new URLSearchParams(searchParams.toString());
    if (enabled) {
      nextSearchParams.set('search', '');
    } else {
      nextSearchParams.delete('search');
      nextSearchParams.delete('q');
    }
    const nextUrl = buildNextUrl(pathname, nextSearchParams);
    router.replace(nextUrl);
  };

  // 검색어 변경
  const setSearchKeyword = (keyword: string) => {
    const nextSearchParams = new URLSearchParams(searchParams.toString());
    const normalizedKeyword = keyword.trim();
    nextSearchParams.set('search', '');
    if (normalizedKeyword) {
      nextSearchParams.set('q', normalizedKeyword);
    } else {
      nextSearchParams.delete('q');
    }
    const nextUrl = buildNextUrl(pathname, nextSearchParams);
    router.replace(nextUrl);
  };

  // 카테고리 정렬 변경
  const setCategoryOrder = (order: 'latest' | 'popular') => {
    const nextSearchParams = new URLSearchParams(searchParams.toString());
    if (order === 'latest') {
      nextSearchParams.delete('order');
    } else {
      nextSearchParams.set('order', order);
    }
    const nextUrl = buildNextUrl(pathname, nextSearchParams);
    router.replace(nextUrl);
  };

  // 데이터 조회
  const { data: categories, isLoading: isCategoriesLoading } = useCategoriesQuery();
  const selectedCategoryId = categories?.find(category => category.name === selectedCategory)?.id;

  // 정렬 기준 결정 (카테고리 선택 시 categoryOrder 우선)
  const sortBy =
    selectedCategory !== ALL_CATEGORY && categoryOrder === 'popular'
      ? 'likeCount'
      : sortFilter === 'top'
        ? 'likeCount'
        : 'publishedAt';

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading } = useInfinitePostsQuery({
    status: 'PUBLISHED',
    categoryId: selectedCategory === ALL_CATEGORY ? undefined : selectedCategoryId,
    feed: sortFilter === 'following' && accessToken ? 'following' : undefined,
    sort: sortBy,
    order: 'DESC',
    limit: 10,
  });
  const { data: topPostsData, isLoading: isTopPostsLoading } = usePostsQuery({
    status: 'PUBLISHED',
    sort: 'likeCount',
    order: 'DESC',
    limit: 5,
  });
  const dynamicCategoryNames = (categories ?? []).map(category => category.name);
  const categoryNames = [ALL_CATEGORY, ...dynamicCategoryNames];
  const posts = (data?.pages ?? []).flatMap(page => page.items).map(item => toViewPost(item));
  const categoryFilteredPosts =
    selectedCategory === ALL_CATEGORY ? posts : posts.filter(post => post.category === selectedCategory);
  const filteredPosts = !isSearchMode
    ? categoryFilteredPosts
    : categoryFilteredPosts.filter(post => {
        const searchTarget = [
          post.title,
          post.content,
          post.authorName,
          post.category,
          ...(post.tags ?? []),
        ]
          .join(' ')
          .toLowerCase();
        return searchTarget.includes(searchKeyword.toLowerCase());
      });
  const topPosts: TopPost[] = (topPostsData?.items ?? []).map(post => ({ id: post.id, title: post.title }));

  // 빈 상태 체크
  const isFollowingEmpty = sortFilter === 'following' && !isLoading && filteredPosts.length === 0;
  const isCategoryEmpty = selectedCategory !== ALL_CATEGORY && !isLoading && filteredPosts.length === 0;
  const isSearchEmpty = isSearchMode && !isLoading && filteredPosts.length === 0;
  const isGeneralEmpty = !isLoading && filteredPosts.length === 0 && !isSearchMode && selectedCategory === ALL_CATEGORY;

  return {
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
  };
};
