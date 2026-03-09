import type { AxiosError } from 'axios';

import { WITHDRAW_MODAL_MESSAGES } from '@/app/shared/constants/messages/modal.message';

import type { ApiErrorResponse } from '@/app/shared/types/error';
import type {
  MyPageCloseWithdrawModalParams,
  MyPageHandleWithdrawParams,
  MyPageOpenWithdrawModalParams,
} from '@/app/shared/types/mypage';

/**
 * 회원탈퇴 모달 닫기 핸들러 생성
 * @description 모달을 닫고 입력값을 초기화한다
 */
export const createCloseWithdrawModal = (params: MyPageCloseWithdrawModalParams) => {
  return () => {
    if (params.isWithdrawing) return;

    params.setIsWithdrawModalOpen(false);
    params.setShowWithdrawPassword(false);
    params.setWithdrawPassword('');
  };
};

/**
 * 회원탈퇴 모달 열기 핸들러 생성
 * @description 입력값을 초기화하고 모달을 연다
 */
export const createOpenWithdrawModal = (params: MyPageOpenWithdrawModalParams) => {
  return () => {
    if (params.isWithdrawing) return;

    params.setShowWithdrawPassword(false);
    params.setWithdrawPassword('');
    params.setIsWithdrawModalOpen(true);
  };
};

/**
 * 회원탈퇴 실행 핸들러 생성
 * @description 비밀번호를 검증하고 계정을 탈퇴한다
 */
export const createHandleWithdraw = (params: MyPageHandleWithdrawParams) => {
  return async () => {
    if (params.isWithdrawing) return;

    const currentPassword = params.withdrawPassword.trim();
    if (!currentPassword) {
      params.showToast({ message: WITHDRAW_MODAL_MESSAGES.missingPassword, type: 'warning' });
      return;
    }

    try {
      const result = await params.withdrawAccount({ currentPassword });

      params.setIsWithdrawModalOpen(false);
      params.setShowWithdrawPassword(false);
      params.setWithdrawPassword('');
      params.clearAuth();
      params.showToast({ message: result.message, type: 'success' });
      params.router.replace('/');
    } catch (error) {
      const axiosError = error as AxiosError<ApiErrorResponse>;
      const message = axiosError.response?.data?.message ?? WITHDRAW_MODAL_MESSAGES.fallbackError;
      params.showToast({ message, type: 'error' });
    }
  };
};
