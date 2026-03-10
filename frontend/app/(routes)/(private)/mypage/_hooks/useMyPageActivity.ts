import { useMemo, useState } from 'react';

import {
  createHandleCategorySelect,
  createHandleSortToggle,
  createDraftSortToggleHandler,
  createHandleTagSelect,
  createToggleCategory,
  createToggleTag,
} from '@/app/(routes)/(private)/mypage/_handlers';
import { usePostSidebarData } from '@/app/(routes)/(private)/mypage/_hooks/usePostSidebarData';
import { sortPostsByKey } from '@/app/shared/utils/post';

import type { DraftSortOrder, UseMyPageActivityParams } from '@/app/shared/types/mypage';

/**
 * 마이페이지 활동 훅
 * @description 활동 정렬, 필터 상태, 게시글 파생 목록을 조합한다
 */
export const useMyPageActivity = (params: UseMyPageActivityParams) => {
  // 정렬 상태
  const [postSortKey, setPostSortKey] = useState<'latest' | 'popular'>('latest');
  const [commentSortKey, setCommentSortKey] = useState<'latest' | 'popular'>('latest');
  const [likedPostSortKey, setLikedPostSortKey] = useState<'latest' | 'popular'>('latest');
  const [recentPostSortKey, setRecentPostSortKey] = useState<'latest' | 'popular'>('latest');
  const sortedPosts = useMemo(() => sortPostsByKey(params.myPosts, postSortKey), [params.myPosts, postSortKey]);
  const sortedLikedPosts = useMemo(
    () => sortPostsByKey(params.likedPosts, likedPostSortKey),
    [likedPostSortKey, params.likedPosts],
  );
  const sortedRecentPosts = useMemo(
    () => sortPostsByKey(params.recentPosts, recentPostSortKey),
    [params.recentPosts, recentPostSortKey],
  );
  const sortedComments = useMemo(() => {
    const list = [...params.myComments];
    if (commentSortKey === 'popular') {
      return list.sort(
        (a, b) =>
          b.likeCount - a.likeCount ||
          b.replyCount - a.replyCount ||
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
      );
    }
    return list.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }, [commentSortKey, params.myComments]);
  const handlePostSortToggle = createHandleSortToggle(setPostSortKey, postSortKey);
  const handleCommentSortToggle = createHandleSortToggle(setCommentSortKey, commentSortKey);
  const handleLikedPostSortToggle = createHandleSortToggle(setLikedPostSortKey, likedPostSortKey);
  const handleRecentPostSortToggle = createHandleSortToggle(setRecentPostSortKey, recentPostSortKey);

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
    commentSortKey,
    filteredPosts,
    likedPostSortKey,
    postSortKey,
    recentPostSortKey,
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
      handleCommentSortToggle,
      handleLikedPostSortToggle,
      handlePostSortToggle,
      handleRecentPostSortToggle,
      handleTagSelect,
      toggleTag,
      toggleCategory,
      handleCategorySelect,
      handleDraftSortToggle,
    },
  };
};
