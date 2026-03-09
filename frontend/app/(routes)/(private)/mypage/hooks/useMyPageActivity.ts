import { useMemo, useState } from 'react';

import {
  createHandleCategorySelect,
  createHandleSortToggle,
  createDraftSortToggleHandler,
  createHandleTagSelect,
  createToggleCategory,
  createToggleTag,
} from '@/app/(routes)/(private)/mypage/handlers';
import { useActivitySort } from '@/app/(routes)/(private)/mypage/hooks/useActivitySort';
import { usePostSidebarData } from '@/app/(routes)/(private)/mypage/hooks/usePostSidebarData';
import { sortPostsByKey } from '@/app/shared/utils/post';

import type { DraftSortOrder, UseMyPageActivityParams } from '@/app/shared/types/mypage';

/**
 * 마이페이지 활동 훅
 * @description 활동 정렬, 필터 상태, 게시글 파생 목록을 조합한다
 */
export const useMyPageActivity = (params: UseMyPageActivityParams) => {
  // 정렬 상태
  const { sortKey, sortedPosts, sortedComments, handleSortChange } = useActivitySort(params.myPosts, params.myComments);
  const handleSortToggle = createHandleSortToggle(handleSortChange, sortKey);
  const sortedLikedPosts = useMemo(() => sortPostsByKey(params.likedPosts, sortKey), [params.likedPosts, sortKey]);
  const sortedRecentPosts = useMemo(() => sortPostsByKey(params.recentPosts, sortKey), [params.recentPosts, sortKey]);

  // 필터 상태
  const { categories: postCategories, tags: postTags } = usePostSidebarData(params.myPosts);
  const [isCategoryOpen, setIsCategoryOpen] = useState(false);
  const [isTagOpen, setIsTagOpen] = useState(false);
  const [draftSortOrder, setDraftSortOrder] = useState<DraftSortOrder>('latest');
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(null);
  const [selectedTagId, setSelectedTagId] = useState<string | null>(null);

  // 필터 핸들러
  const toggleCategory = createToggleCategory({ setIsTagOpen, setIsCategoryOpen });
  const toggleTag = createToggleTag({ setIsCategoryOpen, setIsTagOpen });
  const handleCategorySelect = createHandleCategorySelect({ setSelectedCategoryId, setIsCategoryOpen });
  const handleTagSelect = createHandleTagSelect({ setSelectedTagId, setIsTagOpen });
  const handleDraftSortToggle = createDraftSortToggleHandler(setDraftSortOrder);

  // 파생 값
  const selectedCategoryLabel = postCategories.find(category => category.id === selectedCategoryId)?.name;
  const selectedTagLabel = postTags.find(tag => tag.id === selectedTagId)?.name;
  const filteredPosts = useMemo(() => {
    if (!selectedCategoryId && !selectedTagId) return sortedPosts;
    return sortedPosts.filter(post => {
      const matchesCategory = selectedCategoryId ? post.category?.id === selectedCategoryId : true;
      const matchesTag = selectedTagId ? post.tags?.some(tag => tag.id === selectedTagId) : true;
      return matchesCategory && matchesTag;
    });
  }, [selectedCategoryId, selectedTagId, sortedPosts]);

  return {
    sortKey,
    filteredPosts,
    sortedPosts,
    sortedComments,
    sortedLikedPosts,
    sortedRecentPosts,
    draftSortOrder,
    isCategoryOpen,
    isTagOpen,
    postCategories,
    postTags,
    selectedCategoryId,
    selectedCategoryLabel,
    selectedTagId,
    selectedTagLabel,
    handlers: {
      handleSortToggle,
      handleTagSelect,
      toggleTag,
      toggleCategory,
      handleCategorySelect,
      handleDraftSortToggle,
    },
  };
};
