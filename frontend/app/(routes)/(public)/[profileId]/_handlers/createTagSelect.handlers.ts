import type { ProfilePageSetBool, ProfilePageSetNullableString } from '@/app/shared/types/profilePage';

/**
 * 태그 선택 핸들러
 * @description 같은 태그를 다시 누르면 선택을 해제합니다.
 */
export const createTagSelectHandler =
  (setSelectedTagId: ProfilePageSetNullableString, setIsTagOpen: ProfilePageSetBool) => (tagId: string) => {
  setSelectedTagId(prev => (prev === tagId ? null : tagId));
  setIsTagOpen(false);
};
