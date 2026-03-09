import { useEffect, useRef } from 'react';

import type { RegisterRestoredToastParams } from '@/app/shared/types/auth';

/**
 * 회원가입 복구 토스트 훅
 * @description 임시 저장 복구 시 안내 토스트를 한 번만 표시
 */
export const useRegisterRestoredToast = (params: RegisterRestoredToastParams) => {
  const { hasCache, restoredFromKeep, showToast } = params;

  // 표시/중복 방지
  const restoredToastShownRef = useRef(false);

  useEffect(() => {
    if (!hasCache || !restoredFromKeep) return;
    if (restoredToastShownRef.current) return;

    showToast({ message: '임시 저장된 내용을 불러왔습니다.', type: 'info' });
    restoredToastShownRef.current = true;
  }, [hasCache, restoredFromKeep, showToast]);
};
