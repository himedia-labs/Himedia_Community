import type { ProfilePageSetBool } from '@/app/shared/types/profilePage';

/**
 * 카테고리 토글 핸들러
 * @description 카테고리 메뉴를 열고 태그 메뉴를 닫습니다.
 */
export const createToggleCategoryHandler = (setIsTagOpen: ProfilePageSetBool, setIsCategoryOpen: ProfilePageSetBool) => () => {
  setIsTagOpen(false);
  setIsCategoryOpen(prev => !prev);
};
