import { useEffect, useRef } from 'react';

import { useToast } from '@/app/shared/components/toast/toast';

import type { DraftNoticeParams } from '@/app/shared/types/post';

/**
 * 임시저장 알림 훅
 * @description 저장된 임시저장이 있을 때 알림을 표시
 */
export const useDraftNotice = ({ draftId, hasDrafts, isDraftListFetched }: DraftNoticeParams) => {
  const { showToast } = useToast();
  const draftListHandledRef = useRef(false);
  const draftNoticeShownRef = useRef(false);

  useEffect(() => {
    if (!isDraftListFetched) return;
    if (draftListHandledRef.current) return;
    draftListHandledRef.current = true;
    if (draftNoticeShownRef.current) return;
    if (draftId) return;
    if (!hasDrafts) return;
    draftNoticeShownRef.current = true;
    showToast({
      message: '이전에 저장된 초안이 있습니다.',
      type: 'info',
      duration: 4000,
    });
  }, [draftId, hasDrafts, isDraftListFetched, showToast]);
};
