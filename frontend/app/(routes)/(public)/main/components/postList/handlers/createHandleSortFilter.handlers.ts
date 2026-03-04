import type { SortFilter, PostListSortFilterParams } from '@/app/shared/types/post';

/**
 * 정렬 필터 핸들러
 * @description 로그인 필요 필터는 로그인 안내 후 이동
 */
export const createHandleSortFilter = (params: PostListSortFilterParams) => {
  return (nextFilter: SortFilter) => {
    if (nextFilter === 'following' && !params.accessToken) {
      params.router.push('/login?reason=auth');
      return;
    }

    params.setSortFilter(nextFilter);
  };
};
