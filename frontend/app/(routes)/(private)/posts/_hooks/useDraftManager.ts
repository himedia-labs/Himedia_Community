import { useEffect, useRef } from 'react';

import { useRouter } from 'next/navigation';

import { useDraftDetailQuery, useDraftsQuery } from '@/app/api/posts/posts.queries';

import { useAutoSave } from '@/app/(routes)/(private)/posts/_hooks/useAutoSave';
import { useDraftNotice } from '@/app/(routes)/(private)/posts/_hooks/useDraftNotice';
import { useDraftSaver } from '@/app/(routes)/(private)/posts/_hooks/useDraftSaver';

import { useAuthStore } from '@/app/shared/store/authStore';
import { mapDraftToForm } from '@/app/shared/utils/post';

import type { DraftData } from '@/app/shared/types/post';

/**
 * 임시저장 관리 훅
 * @description 임시저장 불러오기/저장/발행/자동저장을 통합 관리
 */
export const useDraftManager = (
  formData: DraftData,
  setFormData: (data: Partial<DraftData>) => void,
  enabled = true,
  routeDraftId?: string,
) => {
  // 라우터 및 유틸리티
  const router = useRouter();
  const { accessToken } = useAuthStore();

  // State
  const prevDraftIdRef = useRef<string | undefined>(routeDraftId);

  // Queries
  const isAuthenticated = !!accessToken;
  const isDraftFlowEnabled = isAuthenticated && enabled;
  const { data: draftList, isFetched: isDraftListFetched } = useDraftsQuery(
    { limit: 20 },
    { enabled: isDraftFlowEnabled },
  );

  // 파생 상태
  const draftId = routeDraftId ?? null;
  const { data: draftDetail } = useDraftDetailQuery(draftId ?? undefined, { enabled: isDraftFlowEnabled });
  const hasDrafts = (draftList?.items?.length ?? 0) > 0;
  const lastSavedAt = draftDetail?.updatedAt;

  // draft 불러오기
  useEffect(() => {
    if (!draftDetail) return;
    setFormData(mapDraftToForm(draftDetail));
  }, [draftDetail, setFormData]);

  // draftId 변경 시 폼 초기화
  useEffect(() => {
    if (prevDraftIdRef.current === routeDraftId) return;
    prevDraftIdRef.current = routeDraftId;

    if (!routeDraftId) {
      setFormData({
        title: '',
        categoryId: '',
        content: '',
        tags: [],
      });
    }
  }, [routeDraftId, setFormData]);

  // draft 알림 표시
  useDraftNotice({
    draftId: enabled ? draftId : null,
    hasDrafts: enabled ? hasDrafts : false,
    isDraftListFetched: enabled ? isDraftListFetched : false,
  });

  // 임시저장
  const { saveDraft, publishPost } = useDraftSaver({ formData, draftId, isAuthenticated: isDraftFlowEnabled });

  // 임시저장 목록 열기
  const openDraftList = () => {
    router.push('/mypage?tab=drafts');
  };

  // 자동저장
  useAutoSave({ formData, isAuthenticated: isDraftFlowEnabled, saveDraft });

  return {
    state: {
      lastSavedAt,
    },
    data: {
      draftList,
    },
    handlers: {
      saveDraft,
      publishPost,
      openDraftList,
    },
  };
};
