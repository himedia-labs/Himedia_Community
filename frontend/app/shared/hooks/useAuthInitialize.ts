import { useEffect } from 'react';

import { refreshAccessToken } from '../network/axios.instance';
import { useAuthStore } from '@/app/shared/store/authStore';

/**
 * 앱 초기화 시 한 번만 실행되는 인증 초기화 훅
 * - 성공 시: accessToken 저장
 * - 실패 시: 비로그인 상태 확정
 */
export const useAuthInitialize = () => {
  const { setAccessToken, setInitialized } = useAuthStore();

  useEffect(() => {
    const initializeAuth = async () => {
      const newAccessToken = await refreshAccessToken();
      setAccessToken(newAccessToken);
      setInitialized(true);
    };

    initializeAuth();
  }, [setAccessToken, setInitialized]);
};
