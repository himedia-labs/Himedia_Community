import { sortPostsByKey } from '@/app/(routes)/(private)/mypage/utils';

import type { ProfileSortKey } from '@/app/shared/types/profilePage';
import type { PostListItem } from '@/app/shared/types/post';

/**
 * 게시글 필터/정렬
 * @description 정렬 후 카테고리/태그 조건으로 게시글을 필터링합니다.
 */
export const buildFilteredPosts = (
  posts: PostListItem[],
  sortKey: ProfileSortKey,
  selectedCategoryId: string | null,
  selectedTagId: string | null,
) => {
  const sortedPosts = sortPostsByKey(posts, sortKey);

  if (!selectedCategoryId && !selectedTagId) {
    return sortedPosts;
  }

  return sortedPosts.filter(post => {
    const matchesCategory = selectedCategoryId ? post.category?.id === selectedCategoryId : true;
    const matchesTag = selectedTagId ? post.tags?.some(tag => tag.id === selectedTagId) : true;
    return matchesCategory && matchesTag;
  });
};
