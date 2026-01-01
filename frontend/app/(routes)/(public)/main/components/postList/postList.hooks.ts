import { useState } from 'react';

import { usePostsQuery } from '@/app/api/posts/posts.queries';
import { useCategoriesQuery } from '@/app/api/categories/categories.queries';

import type { Post, PostListItem, ViewMode } from '@/app/shared/types/post';

const formatDate = (value?: string | null) => {
  if (!value) return '--';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return '--';
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}.${month}.${day}`;
};

const extractImageUrl = (content?: string) => {
  if (!content) return undefined;
  const htmlMatch = content.match(/<img[^>]+src=["']([^"']+)["']/i);
  if (htmlMatch?.[1]) return htmlMatch[1];
  const markdownMatch = content.match(/!\[[^\]]*]\(([^)]+)\)/);
  if (markdownMatch?.[1]) return markdownMatch[1];
  return undefined;
};

const buildSummary = (content?: string) => {
  if (!content) return '';
  const trimmed = content.trim();
  if (!trimmed) return '';
  return trimmed.length > 140 ? `${trimmed.slice(0, 140)}...` : trimmed;
};

const buildRelativeTime = (value?: string | null) => {
  if (!value) return '--';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return '--';
  const diffMs = Date.now() - date.getTime();
  if (diffMs < 60000) return '방금 전';
  const minutes = Math.floor(diffMs / 60000);
  if (minutes < 60) return `${minutes}분 전`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}시간 전`;
  const days = Math.floor(hours / 24);
  if (days < 30) return `${days}일 전`;
  const months = Math.floor(days / 30);
  if (months < 12) return `${months}개월 전`;
  const years = Math.floor(days / 365);
  return `${years}년 전`;
};

const toViewPost = (item: PostListItem): Post => {
  const imageUrl = item.thumbnailUrl ?? extractImageUrl(item.content);
  return {
    id: item.id,
    title: item.title,
    summary: buildSummary(item.content),
    imageUrl,
    category: item.category?.name ?? 'ALL',
    date: formatDate(item.publishedAt ?? item.createdAt),
    timeAgo: buildRelativeTime(item.publishedAt ?? item.createdAt),
    views: item.viewCount,
  };
};

export const usePostList = () => {
  const [viewMode, setViewMode] = useState<ViewMode>('list');
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const { data: categories } = useCategoriesQuery();
  const selectedCategoryId = categories?.find(category => category.name === selectedCategory)?.id;
  const { data } = usePostsQuery({
    status: 'PUBLISHED',
    categoryId: selectedCategory === 'ALL' ? undefined : selectedCategoryId,
  });
  const categoryNames = ['ALL', ...(categories ?? []).map(category => category.name)];
  const posts = (data?.items ?? []).map(item => toViewPost(item));
  const filteredPosts = selectedCategory === 'ALL' ? posts : posts.filter(post => post.category === selectedCategory);

  return {
    viewMode,
    setViewMode,
    selectedCategory,
    setSelectedCategory,
    categoryNames,
    filteredPosts,
  };
};

export default usePostList;
