import type { ProfilePageSetBool, ProfilePageSetNullableString } from '@/app/shared/types/profilePage';

/**
 * 카테고리 선택 핸들러
 * @description 같은 카테고리를 다시 누르면 선택을 해제합니다.
 */
export const createCategorySelectHandler =
  (setSelectedCategoryId: ProfilePageSetNullableString, setIsCategoryOpen: ProfilePageSetBool) => (categoryId: string) => {
    setSelectedCategoryId(prev => (prev === categoryId ? null : categoryId));
    setIsCategoryOpen(false);
  };
