import type { PostListItem } from '@/app/shared/types/post';
import type { ProfileCounterItem } from '@/app/shared/types/profilePage';

/**
 * 태그 집계
 * @description 게시글 목록을 태그별 개수로 집계합니다.
 */
export const buildPostTags = (posts: PostListItem[]): ProfileCounterItem[] => {
  const counter = new Map<string, ProfileCounterItem>();

  posts.forEach(post => {
    post.tags?.forEach(tag => {
      const existing = counter.get(tag.id);
      if (existing) {
        existing.count += 1;
        return;
      }

      counter.set(tag.id, { id: tag.id, name: tag.name, count: 1 });
    });
  });

  return Array.from(counter.values()).sort((a, b) => b.count - a.count);
};
