import { useEffect } from 'react';

import { useRouter } from 'next/navigation';

import { useCurrentUserQuery } from '@/app/api/auth/auth.queries';
import { useAuthStore } from '@/app/shared/store/authStore';

/**
 * 알림 인증 훅
 * @description 인증 상태를 확인하고 비로그인 사용자를 로그인 페이지로 이동합니다.
 */
export const useNotificationsAuth = () => {
  // 인증 상태
  const router = useRouter();
  const accessToken = useAuthStore(state => state.accessToken);
  const isInitialized = useAuthStore(state => state.isInitialized);
  const canFetchNotifications = Boolean(accessToken) && isInitialized;
  const { data: currentUser } = useCurrentUserQuery();
  const currentUserId = currentUser?.id;
  const profileName = currentUser?.name ?? '사용자';
  const profileImageUrl = currentUser?.profileImageUrl ?? null;
  const profileHandleText = currentUser?.profileHandle ? `@${currentUser.profileHandle}` : '@핸들 미설정';

  // 로그인 리다이렉트
  useEffect(() => {
    if (!isInitialized || accessToken) return;
    router.replace('/login?reason=auth&redirect=/notifications');
  }, [accessToken, isInitialized, router]);

  return {
    accessToken,
    isInitialized,
    canFetchNotifications,
    currentUserId,
    profileName,
    profileImageUrl,
    profileHandleText,
  };
};
