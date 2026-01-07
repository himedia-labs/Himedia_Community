import { useQuery } from '@tanstack/react-query';

import { authApi } from './auth.api';
import { authKeys } from './auth.keys';
import { useAuthStore } from '@/app/shared/store/authStore';
import type { User } from '@/app/shared/types/auth';

// 현재 로그인 사용자 조회 쿼리
export const useCurrentUserQuery = () => {
  const { accessToken } = useAuthStore();

  return useQuery<User, Error>({
    queryKey: authKeys.currentUser,
    queryFn: authApi.getCurrentUser,
    enabled: !!accessToken,
  });
};
