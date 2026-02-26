import { adminKeys } from '@/app/api/admin/admin.keys';
import { handleAdminUserApprove } from '@/app/(routes)/(private)/admin/handlers/handleAdminUserApprove.handlers';

import type { QueryClient } from '@tanstack/react-query';
import type { AdminUser } from '@/app/shared/types/admin';

/**
 * 회원 승인 핸들러 생성
 * @description 승인 요청 처리 후 토스트를 표시한다
 */
export const createHandleUserApprove = (params: {
  queryClient: QueryClient;
  mutateAsync: (userId: string) => Promise<unknown>;
  showToast: (options: { message: string; type: 'success' | 'error' | 'info' | 'warning' }) => void;
}) => {
  return async (userId: string) => {
    try {
      await handleAdminUserApprove({
        queryClient: params.queryClient,
        mutateAsync: params.mutateAsync,
        userId,
      });
      params.showToast({ message: '회원 승인이 완료되었습니다.', type: 'success' });
    } catch (error) {
      params.showToast({ message: extractErrorMessage(error, '회원 승인 처리에 실패했습니다.'), type: 'error' });
    }
  };
};

/**
 * 회원 편집 토글 핸들러 생성
 * @description 전체 회원의 역할 편집 모드를 토글한다
 */
export const createHandleUserEdit = (setIsUsersEditMode: (updater: (prev: boolean) => boolean) => void) => {
  return () => setIsUsersEditMode(prev => !prev);
};

/**
 * 역할 변경 입력 핸들러 생성
 * @description 회원별 역할 드래프트 상태를 갱신한다
 */
export const createHandleChangeUserRoleDraft = (
  setUserRoleDrafts: (updater: (prev: Record<string, string>) => Record<string, string>) => void,
) => {
  return (userId: string, role: string) => {
    setUserRoleDrafts(prev => ({ ...prev, [userId]: role }));
  };
};

/**
 * 회원 역할 일괄 저장 핸들러 생성
 * @description 변경된 역할만 저장하고 관련 캐시를 갱신한다
 */
export const createHandleSaveAllUserRoles = (params: {
  allUsers: AdminUser[];
  userRoleDrafts: Record<string, string>;
  queryClient: QueryClient;
  setIsUsersEditMode: (value: boolean) => void;
  mutateAsync: (payload: { userId: string; role: 'TRAINEE' | 'GRADUATE' | 'MENTOR' | 'INSTRUCTOR' }) => Promise<unknown>;
  showToast: (options: { message: string; type: 'success' | 'error' | 'info' | 'warning' }) => void;
}) => {
  return async () => {
    const changedUsers = Object.entries(params.userRoleDrafts)
      .map(([userId, draftRole]) => {
        const user = params.allUsers.find(item => item.id === userId);
        if (!user) return null;
        if (draftRole === user.role) return null;
        return { userId, role: draftRole as 'TRAINEE' | 'GRADUATE' | 'MENTOR' | 'INSTRUCTOR' };
      })
      .filter(item => item !== null);
    if (!changedUsers.length) {
      params.showToast({ message: '변경된 역할이 없습니다.', type: 'info' });
      params.setIsUsersEditMode(false);
      return;
    }

    try {
      await Promise.all(
        changedUsers.map(user =>
          params.mutateAsync({
            userId: user.userId,
            role: user.role,
          }),
        ),
      );
      await params.queryClient.invalidateQueries({ queryKey: adminKeys.users() });
      await params.queryClient.invalidateQueries({ queryKey: adminKeys.auditLogs() });
      params.setIsUsersEditMode(false);
      params.showToast({ message: '회원 역할이 저장되었습니다.', type: 'success' });
    } catch (error) {
      params.showToast({ message: extractErrorMessage(error, '회원 역할 저장에 실패했습니다.'), type: 'error' });
    }
  };
};

/**
 * 에러 메시지 추출
 * @description axios 에러 응답 메시지를 안전하게 추출한다
 */
const extractErrorMessage = (error: unknown, fallback: string) => {
  if (typeof error !== 'object' || !error) return fallback;
  if (!('response' in error) || typeof error.response !== 'object' || !error.response) return fallback;
  if (!('data' in error.response) || typeof error.response.data !== 'object' || !error.response.data) return fallback;
  if (!('message' in error.response.data) || typeof error.response.data.message !== 'string') return fallback;
  return error.response.data.message;
};
