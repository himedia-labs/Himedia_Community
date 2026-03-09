import { DEFAULT_AUTHOR_NAME, DEFAULT_CATEGORY_LABEL, DEFAULT_PREVIEW_STATS } from '@/app/shared/constants/config/post.config';
import { formatDateLabel } from '@/app/shared/utils/date';
import { renderMarkdownPreview } from '@/app/shared/utils/markdown';

import type { CreateEditPreviewParams } from '@/app/shared/types/post';

/**
 * 게시물 수정 미리보기 데이터
 * @description 미리보기 렌더에 필요한 값을 구성
 */
export const createEditPreview = (params: CreateEditPreviewParams) => {
  const { categories, categoryId, content } = params;
  const categoryName = categories?.find(category => String(category.id) === categoryId)?.name ?? DEFAULT_CATEGORY_LABEL;
  const dateLabel = formatDateLabel(new Date());
  const previewStats = DEFAULT_PREVIEW_STATS;
  const authorName = DEFAULT_AUTHOR_NAME;
  const previewContent = renderMarkdownPreview(content);

  return {
    authorName,
    categoryName,
    dateLabel,
    previewStats,
    previewContent,
  };
};
