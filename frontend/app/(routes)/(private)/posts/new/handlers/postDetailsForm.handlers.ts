import type { Dispatch, MouseEvent, SetStateAction } from 'react';

/**
 * 카테고리 드롭다운 토글 핸들러 생성
 * @description 카테고리 목록 열림 상태를 반전
 */
export const createHandleToggleCategoryOpen = (setIsCategoryOpen: Dispatch<SetStateAction<boolean>>) => {
  return () => {
    setIsCategoryOpen(prev => !prev);
  };
};

/**
 * 카테고리 초기화 핸들러 생성
 * @description 선택 카테고리를 비우고 드롭다운을 닫음
 */
export const createHandleResetCategory = (params: {
  onCategoryChange: (value: string) => void;
  setIsCategoryOpen: Dispatch<SetStateAction<boolean>>;
}) => {
  return () => {
    params.onCategoryChange('');
    params.setIsCategoryOpen(false);
  };
};

/**
 * 카테고리 옵션 선택 핸들러 생성
 * @description 버튼 데이터의 카테고리 id를 읽어 선택 후 드롭다운을 닫음
 */
export const createHandleCategoryOptionClick = (params: {
  onCategoryChange: (value: string) => void;
  setIsCategoryOpen: Dispatch<SetStateAction<boolean>>;
}) => {
  return (event: MouseEvent<HTMLButtonElement>) => {
    const { categoryId: nextCategoryId } = event.currentTarget.dataset;
    if (!nextCategoryId) return;
    params.onCategoryChange(nextCategoryId);
    params.setIsCategoryOpen(false);
  };
};

/**
 * 태그 칩 삭제 핸들러 생성
 * @description 버튼 데이터의 태그명을 읽어 태그를 제거
 */
export const createHandleTagChipClick = (onRemoveTag: (tagName: string) => void) => {
  return (event: MouseEvent<HTMLButtonElement>) => {
    const { tagName } = event.currentTarget.dataset;
    if (!tagName) return;
    onRemoveTag(tagName);
  };
};
