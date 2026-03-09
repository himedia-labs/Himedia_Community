import type { ProfilePageSetBool } from '@/app/shared/types/profilePage';

/**
 * 태그 토글 핸들러
 * @description 태그 메뉴를 열고 카테고리 메뉴를 닫습니다.
 */
export const createToggleTagHandler = (setIsCategoryOpen: ProfilePageSetBool, setIsTagOpen: ProfilePageSetBool) => () => {
  setIsCategoryOpen(false);
  setIsTagOpen(prev => !prev);
};
