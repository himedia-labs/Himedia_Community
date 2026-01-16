import { useEffect, useRef } from 'react';

import { useToast } from '@/app/shared/components/toast/toast';

import type { DraftNoticeParams } from '@/app/shared/types/post';

export const useDraftNotice = ({ draftId, hasDrafts }: DraftNoticeParams) => {
  const { showToast } = useToast();
  const draftNoticeShownRef = useRef(false);

  useEffect(() => {
    if (draftNoticeShownRef.current) return;
    if (draftId) return;
    if (!hasDrafts) return;
    draftNoticeShownRef.current = true;
    showToast({
      message: '이전에 저장된 초안이 있습니다.',
      type: 'info',
      duration: 4000,
    });
  }, [draftId, hasDrafts, showToast]);
};
