import { useEffect, useRef } from 'react';

import { LOGIN_MESSAGES } from '@/app/shared/constants/messages/auth.message';
import type { LoginRedirectToastParams } from '@/app/shared/types/auth';

/**
 * 로그인 리다이렉트 토스트
 * @description 리다이렉트 사유가 auth일 때 안내 토스트를 표시
 */
export const useLoginRedirectToast = (params: LoginRedirectToastParams) => {
  const { reason, showToast } = params;
  const authToastShownRef = useRef(false);

  useEffect(() => {
    if (authToastShownRef.current) return;
    if (reason !== 'auth') return;
    showToast({ message: LOGIN_MESSAGES.requireAuth, type: 'warning' });
    authToastShownRef.current = true;
  }, [reason, showToast]);
};
