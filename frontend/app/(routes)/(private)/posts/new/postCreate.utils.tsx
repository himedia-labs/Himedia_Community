import { renderMarkdownPreview } from '@/app/shared/utils/markdownPreview';

import type { DraftData, PostDetailResponse } from '@/app/shared/types/post';

// 태그 입력 토큰 분리
export const extractTags = (input: string) =>
  input
    .split(/[,\s]+/)
    .map(tag => tag.replace(/^#+/, '').trim())
    .filter(Boolean);

// 태그 추천 검색어 추출
export const getTagQueryFromInput = (input: string) => {
  const trimmed = input.trim();
  if (!trimmed) return '';

  return (
    trimmed
      .replace(/^#+/, '')
      .split(/[,\s]+/)
      .filter(Boolean)
      .pop() ?? ''
  );
};

// 미리보기 날짜 생성
export const formatDateLabel = (date: Date) => date.toISOString().slice(0, 10).replace(/-/g, '.');

// 마크다운 본문 렌더링
export { renderMarkdownPreview };

// draft 상세 데이터 -> 폼 데이터 변환
export const mapDraftToForm = (draft: PostDetailResponse): DraftData => ({
  title: draft.title ?? '',
  categoryId: draft.category?.id ?? '',
  thumbnailUrl: draft.thumbnailUrl ?? '',
  content: draft.content ?? '',
  tags: draft.tags?.map(tag => tag.name) ?? [],
});
