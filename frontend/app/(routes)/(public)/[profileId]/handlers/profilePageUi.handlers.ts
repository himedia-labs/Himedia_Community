import type { MouseEvent } from 'react';

/**
 * 카테고리 버튼 클릭 핸들러 생성
 * @description 버튼 데이터의 카테고리 id를 읽어 필터 선택을 수행
 */
export const createHandleCategoryButtonClick = (handleCategorySelect: (categoryId: string) => void) => {
  return (event: MouseEvent<HTMLButtonElement>) => {
    const { categoryId } = event.currentTarget.dataset;
    if (!categoryId) return;
    handleCategorySelect(categoryId);
  };
};

/**
 * 태그 버튼 클릭 핸들러 생성
 * @description 버튼 데이터의 태그 id를 읽어 필터 선택을 수행
 */
export const createHandleTagButtonClick = (handleTagSelect: (tagId: string) => void) => {
  return (event: MouseEvent<HTMLButtonElement>) => {
    const { tagId } = event.currentTarget.dataset;
    if (!tagId) return;
    handleTagSelect(tagId);
  };
};

/**
 * 팔로우 호버 진입 핸들러 생성
 * @description 팔로우 버튼 hover 상태를 true로 갱신
 */
export const createHandleFollowMouseEnter = (setIsFollowHover: (value: boolean) => void) => {
  return () => {
    setIsFollowHover(true);
  };
};

/**
 * 팔로우 호버 이탈 핸들러 생성
 * @description 팔로우 버튼 hover 상태를 false로 갱신
 */
export const createHandleFollowMouseLeave = (setIsFollowHover: (value: boolean) => void) => {
  return () => {
    setIsFollowHover(false);
  };
};
