import type { CreatePostRequest, PostPayloadInput, PostPayloadStatus } from '@/app/shared/types/post';

export const buildPostPayload = (
  input: PostPayloadInput,
  status: PostPayloadStatus,
  options?: { includeEmptyThumbnail?: boolean },
): CreatePostRequest => ({
  tags: input.tags,
  title: input.title,
  status,
  content: input.content,
  categoryId: input.categoryId,
  thumbnailUrl: options?.includeEmptyThumbnail ? input.thumbnailUrl : input.thumbnailUrl || undefined,
});
