import { useEffect, useRef } from 'react';

import { AUTO_SAVE_DELAY_MS } from '@/app/shared/constants/config/post.config';

import type { AutoSaveParams } from '@/app/shared/types/post';

// 게시물 작성 : 자동 저장 훅
export const useAutoSave = ({ formData, isAuthenticated, saveDraft }: AutoSaveParams) => {
  // Ref
  const saveDraftRef = useRef(saveDraft);

  // saveDraft 참조 동기화
  useEffect(() => {
    saveDraftRef.current = saveDraft;
  }, [saveDraft]);

  // 자동 저장 타이머
  useEffect(() => {
    const hasDraft =
      formData.title.trim() ||
      formData.content.trim() ||
      formData.categoryId ||
      formData.thumbnailUrl ||
      formData.tags.length > 0;
    if (!hasDraft) return;
    if (!isAuthenticated) return;

    const timer = window.setTimeout(() => {
      saveDraftRef.current({ silent: true });
    }, AUTO_SAVE_DELAY_MS);

    return () => window.clearTimeout(timer);
  }, [formData.title, formData.categoryId, formData.thumbnailUrl, formData.content, formData.tags, isAuthenticated]);
};
