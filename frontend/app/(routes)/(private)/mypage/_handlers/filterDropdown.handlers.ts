import type {
  MyPageHandleCategorySelectParams,
  MyPageHandleTagSelectParams,
  MyPageToggleCategoryParams,
  MyPageToggleTagParams,
} from '@/app/shared/types/mypage';

/**
 * 카테고리 필터 토글 핸들러 생성
 * @description 카테고리 드롭다운 열림 상태를 토글하고 태그 드롭다운을 닫는다
 */
export const createToggleCategory = (params: MyPageToggleCategoryParams) => {
  return () => {
    params.setIsTagOpen(false);
    params.setIsCategoryOpen(prev => !prev);
  };
};

/**
 * 태그 필터 토글 핸들러 생성
 * @description 태그 드롭다운 열림 상태를 토글하고 카테고리 드롭다운을 닫는다
 */
export const createToggleTag = (params: MyPageToggleTagParams) => {
  return () => {
    params.setIsCategoryOpen(false);
    params.setIsTagOpen(prev => !prev);
  };
};

/**
 * 카테고리 선택 핸들러 생성
 * @description 카테고리를 선택하거나 해제하고 드롭다운을 닫는다
 */
export const createHandleCategorySelect = (params: MyPageHandleCategorySelectParams) => {
  return (categoryId: string) => {
    params.setSelectedCategoryId(prev => (prev === categoryId ? null : categoryId));
    params.setIsCategoryOpen(false);
  };
};

/**
 * 태그 선택 핸들러 생성
 * @description 태그를 선택하거나 해제하고 드롭다운을 닫는다
 */
export const createHandleTagSelect = (params: MyPageHandleTagSelectParams) => {
  return (tagId: string) => {
    params.setSelectedTagId(prev => (prev === tagId ? null : tagId));
    params.setIsTagOpen(false);
  };
};
