import type { DraftData, PostDetailResponse } from '@/app/shared/types/post';

export type PostEditInitializerParams = {
  postDetail?: PostDetailResponse | null;
  applyPartial: (data: Partial<DraftData>) => void;
  setTags: (tags: DraftData['tags']) => void;
};

export type PostEditSaverParams = {
  postId: string;
  formData: DraftData;
};

