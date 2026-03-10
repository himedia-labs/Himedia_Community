import EmptyState from '@/app/shared/components/empty/EmptyState';
import PostListCardView from '@/app/(routes)/(public)/main/_components/postList/_components/PostListCardView';
import PostListListView from '@/app/(routes)/(public)/main/_components/postList/_components/PostListListView';

import type { PostListContentProps } from '@/app/shared/types/post';

/**
 * 포스트 리스트 콘텐츠
 * @description 메인 포스트의 빈 상태, 리스트 뷰, 카드 뷰를 렌더링합니다.
 */
export default function PostListContent({
  viewMode,
  currentUserId,
  isLoading,
  isSearchMode,
  isSearchEmpty,
  isFollowingEmpty,
  isCategoryEmpty,
  isGeneralEmpty,
  isFetchingNextPage,
  filteredPosts,
  cardTagSkeletonWidths,
  listTagSkeletonWidths,
  cardSkeletons,
  listSkeletons,
}: PostListContentProps) {
  if (isSearchEmpty || isFollowingEmpty || isCategoryEmpty || isGeneralEmpty) {
    return (
      <EmptyState
        title={
          isSearchEmpty
            ? '검색 결과가 없어요.'
            : isFollowingEmpty
              ? '팔로우한 작성자가 없어요.'
              : isCategoryEmpty
                ? '해당 카테고리에 게시물이 없어요.'
                : '아직 게시물이 없어요.'
        }
        description={
          isSearchEmpty
            ? '다른 키워드로 다시 검색해보세요.'
            : isFollowingEmpty
              ? '관심있는 작성자를 팔로우하면 피드에 모아서 볼 수 있어요.'
              : isCategoryEmpty
                ? '다른 카테고리를 선택하거나 첫 번째 글을 작성해보세요.'
                : '첫 번째 글을 작성해보세요.'
        }
      />
    );
  }

  return isSearchMode || viewMode === 'list' ? (
    <PostListListView
      currentUserId={currentUserId}
      isLoading={isLoading}
      isFetchingNextPage={isFetchingNextPage}
      filteredPosts={filteredPosts}
      listTagSkeletonWidths={listTagSkeletonWidths}
      listSkeletons={listSkeletons}
    />
  ) : (
    <PostListCardView
      currentUserId={currentUserId}
      isLoading={isLoading}
      isFetchingNextPage={isFetchingNextPage}
      filteredPosts={filteredPosts}
      cardTagSkeletonWidths={cardTagSkeletonWidths}
      cardSkeletons={cardSkeletons}
    />
  );
}
