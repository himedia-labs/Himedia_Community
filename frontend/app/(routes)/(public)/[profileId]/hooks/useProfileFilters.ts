import { useMemo, useState } from 'react';

import {
  createCategorySelectHandler,
  createSortToggleHandler,
  createTagSelectHandler,
  createToggleCategoryHandler,
  createToggleTagHandler,
} from '@/app/(routes)/(public)/[profileId]/handlers';
import { buildFilteredPosts, buildPostCategories, buildPostTags } from '@/app/(routes)/(public)/[profileId]/utils';

import type { PostListItem } from '@/app/shared/types/post';

/**
 * 공개 프로필 필터 훅
 * @description 카테고리/태그/정렬 상태와 필터링 결과를 제공합니다.
 */
export const useProfileFilters = (posts: PostListItem[]) => {
  // 필터 상태
  const [isCategoryOpen, setIsCategoryOpen] = useState(false);
  const [isTagOpen, setIsTagOpen] = useState(false);
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(null);
  const [selectedTagId, setSelectedTagId] = useState<string | null>(null);
  const [sortKey, setSortKey] = useState<'latest' | 'popular'>('latest');

  // 파생 데이터
  const postCategories = useMemo(() => buildPostCategories(posts), [posts]);
  const postTags = useMemo(() => buildPostTags(posts), [posts]);
  const filteredPosts = useMemo(
    () => buildFilteredPosts(posts, sortKey, selectedCategoryId, selectedTagId),
    [posts, selectedCategoryId, selectedTagId, sortKey],
  );
  const selectedCategoryLabel = postCategories.find(category => category.id === selectedCategoryId)?.name;
  const selectedTagLabel = postTags.find(tag => tag.id === selectedTagId)?.name;
  const emptyText = selectedCategoryId || selectedTagId ? '조건에 맞는 게시물이 없습니다.' : '아직 작성한 게시물이 없습니다.';

  // 화면 이벤트 핸들러
  const handleCategorySelect = createCategorySelectHandler(setSelectedCategoryId, setIsCategoryOpen);
  const handleSortToggle = createSortToggleHandler(setSortKey);
  const handleTagSelect = createTagSelectHandler(setSelectedTagId, setIsTagOpen);
  const toggleCategory = createToggleCategoryHandler(setIsTagOpen, setIsCategoryOpen);
  const toggleTag = createToggleTagHandler(setIsCategoryOpen, setIsTagOpen);

  return {
    isCategoryOpen,
    isTagOpen,
    postCategories,
    postTags,
    sortKey,
    selectedTagId,
    selectedTagLabel,
    selectedCategoryId,
    selectedCategoryLabel,
    filteredPosts,
    emptyText,
    toggleCategory,
    handleSortToggle,
    handleTagSelect,
    toggleTag,
    handleCategorySelect,
  };
};
