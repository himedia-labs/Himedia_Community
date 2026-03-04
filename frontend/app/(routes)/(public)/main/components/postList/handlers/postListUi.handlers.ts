import type { ChangeEvent, KeyboardEvent as ReactKeyboardEvent } from 'react';
import type {
  PostListSearchInputKeyDownParams,
  PostListToggleViewModeParams,
  PostListSelectSortFilterParams,
  PostListSelectCategoryParams,
  PostListToggleCategoryOrderParams,
} from '@/app/shared/types/post';

/**
 * 검색 입력 엔터 처리 핸들러 생성
 * @description 엔터 입력 시 현재 검색어를 적용
 */
export const createHandleSearchInputKeyDown = (params: PostListSearchInputKeyDownParams) => {
  return (event: ReactKeyboardEvent<HTMLInputElement>) => {
    if (event.key !== 'Enter') return;
    if (event.nativeEvent.isComposing) return;
    params.setSearchKeyword(params.getSearchInputValue());
  };
};

/**
 * 검색 입력 변경 핸들러 생성
 * @description 검색 입력값 상태를 갱신
 */
export const createHandleSearchInputChange = (setSearchInputValue: (value: string) => void) => {
  return (event: ChangeEvent<HTMLInputElement>) => {
    setSearchInputValue(event.target.value);
  };
};

/**
 * 뷰 모드 토글 핸들러 생성
 * @description 리스트/카드 뷰를 토글
 */
export const createHandleToggleViewMode = (params: PostListToggleViewModeParams) => {
  return () => {
    params.setViewMode(params.viewMode === 'list' ? 'card' : 'list');
  };
};

/**
 * 정렬 버튼 핸들러 생성
 * @description 선택한 정렬 필터를 적용
 */
export const createHandleSelectSortFilter = (params: PostListSelectSortFilterParams) => {
  return () => {
    params.handleSortFilter(params.nextFilter);
  };
};

/**
 * 카테고리 선택 핸들러 생성
 * @description 선택한 카테고리를 반영
 */
export const createHandleSelectCategory = (params: PostListSelectCategoryParams) => {
  return () => {
    params.setSelectedCategory(params.category);
  };
};

/**
 * 카테고리 정렬 토글 핸들러 생성
 * @description 최신순/인기순 카테고리 정렬을 전환
 */
export const createHandleToggleCategoryOrder = (params: PostListToggleCategoryOrderParams) => {
  return () => {
    params.setCategoryOrder(params.categoryOrder === 'latest' ? 'popular' : 'latest');
  };
};

/**
 * 검색 모드 종료 핸들러 생성
 * @description 검색 모드를 종료
 */
export const createHandleCloseSearchMode = (setSearchMode: (enabled: boolean) => void) => {
  return () => {
    setSearchMode(false);
  };
};
