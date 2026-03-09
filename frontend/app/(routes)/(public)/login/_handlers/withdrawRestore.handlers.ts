import { useAuthStore } from '@/app/shared/store/authStore';
import { LOGIN_MESSAGES } from '@/app/shared/constants/messages/auth.message';
import { LOGIN_WITHDRAW_MODAL_MESSAGES } from '@/app/shared/constants/messages/modal.message';
import { applyQueryDataUpdate } from '@/app/shared/lib/query/queryCache.utils';

import type { AxiosError } from 'axios';
import type { ApiErrorResponse } from '@/app/shared/types/error';
import type {
  LoginCloseWithdrawModalParams,
  LoginRestoreAccountParams,
  LoginSendRestoreCodeParams,
  LoginWithdrawnAccountParams,
} from '@/app/shared/types/auth';

/**
 * 탈퇴 계정 감지 핸들러 생성
 * @description 로그인 실패 시 복구 모달 상태를 초기화하고 연다
 */
export const createHandleWithdrawnAccount = (params: LoginWithdrawnAccountParams) => {
  return () => {
    params.setWithdrawnMessage(LOGIN_WITHDRAW_MODAL_MESSAGES.description);
    params.setRestoreEmail(params.email.trim().toLowerCase());
    params.setRestoreCode('');
    params.setIsRestoreCodeSent(false);
    params.setIsWithdrawnModalOpen(true);
  };
};

/**
 * 복구 모달 닫기 핸들러 생성
 * @description 복구 요청 중이 아닐 때 모달과 입력 상태를 닫는다
 */
export const createHandleCloseWithdrawModal = (params: LoginCloseWithdrawModalParams) => {
  return () => {
    if (params.isRestoreCodePending || params.isRestoreAccountPending) return;

    params.setIsWithdrawnModalOpen(false);
    params.setRestoreCode('');
    params.setIsRestoreCodeSent(false);
  };
};

/**
 * 복구 코드 발송 핸들러 생성
 * @description 탈퇴 계정 복구를 위한 인증코드 발송을 처리
 */
export const createHandleSendRestoreCode = (params: LoginSendRestoreCodeParams) => {
  return async () => {
    if (params.restoreCodeMutation.isPending || !params.restoreEmail) return;

    try {
      const result = await params.restoreCodeMutation.mutateAsync({
        email: params.restoreEmail,
        purpose: 'withdraw-restore',
      });
      params.setIsRestoreCodeSent(true);
      params.showToast({ message: result.message, type: 'success' });
    } catch (error) {
      const axiosError = error as AxiosError<ApiErrorResponse>;
      const message = axiosError.response?.data?.message ?? LOGIN_MESSAGES.fallbackError;
      params.showToast({ message, type: 'error' });
    }
  };
};

/**
 * 계정 복구 핸들러 생성
 * @description 복구 코드 검증 후 로그인 상태를 복원
 */
export const createHandleRestoreAccount = (params: LoginRestoreAccountParams) => {
  return async () => {
    if (params.restoreAccountMutation.isPending) return;

    if (!params.restoreCode.trim()) {
      params.showToast({ message: LOGIN_WITHDRAW_MODAL_MESSAGES.missingCode, type: 'warning' });
      return;
    }

    try {
      const result = await params.restoreAccountMutation.mutateAsync({
        email: params.restoreEmail,
        code: params.restoreCode.trim(),
      });
      const { setAccessToken } = useAuthStore.getState();

      setAccessToken(result.accessToken);
      applyQueryDataUpdate(params.queryClient, params.authKeys.currentUser, () => result.user);
      params.setIsWithdrawnModalOpen(false);
      params.setRestoreCode('');
      params.setIsRestoreCodeSent(false);
      params.showToast({ message: LOGIN_WITHDRAW_MODAL_MESSAGES.restoredSuccess, type: 'success' });
      params.router.push(params.redirectTo || '/');
    } catch (error) {
      const axiosError = error as AxiosError<ApiErrorResponse>;
      const message = axiosError.response?.data?.message ?? LOGIN_MESSAGES.fallbackError;
      params.showToast({ message, type: 'error' });
    }
  };
};
