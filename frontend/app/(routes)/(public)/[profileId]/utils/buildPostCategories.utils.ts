import type { PostListItem } from '@/app/shared/types/post';
import type { ProfileCounterItem } from '@/app/shared/types/profilePage';

/**
 * 카테고리 집계
 * @description 게시글 목록을 카테고리별 개수로 집계합니다.
 */
export const buildPostCategories = (posts: PostListItem[]): ProfileCounterItem[] => {
  const counter = new Map<string, ProfileCounterItem>();

  posts.forEach(post => {
    const category = post.category;
    if (!category) return;

    const existing = counter.get(category.id);
    if (existing) {
      existing.count += 1;
      return;
    }

    counter.set(category.id, { id: category.id, name: category.name, count: 1 });
  });

  return Array.from(counter.values()).sort((a, b) => b.count - a.count);
};
