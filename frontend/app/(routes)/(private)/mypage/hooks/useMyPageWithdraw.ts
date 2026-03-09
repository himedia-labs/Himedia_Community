import { useState } from 'react';

import {
  createCloseWithdrawModal,
  createHandleWithdraw,
  createOpenWithdrawModal,
} from '@/app/(routes)/(private)/mypage/handlers';

import type { UseMyPageWithdrawParams } from '@/app/shared/types/mypage';

/**
 * 마이페이지 탈퇴 훅
 * @description 탈퇴 모달 상태와 탈퇴 실행 핸들러를 조합한다
 */
export const useMyPageWithdraw = (params: UseMyPageWithdrawParams) => {
  // 모달 상태
  const [showWithdrawPassword, setShowWithdrawPassword] = useState(false);
  const [withdrawPassword, setWithdrawPassword] = useState('');
  const [isWithdrawModalOpen, setIsWithdrawModalOpen] = useState(false);

  // 모달 핸들러
  const closeWithdrawModal = createCloseWithdrawModal({
    isWithdrawing: params.isWithdrawing,
    setIsWithdrawModalOpen,
    setShowWithdrawPassword,
    setWithdrawPassword,
  });
  const openWithdrawModal = createOpenWithdrawModal({
    isWithdrawing: params.isWithdrawing,
    setShowWithdrawPassword,
    setWithdrawPassword,
    setIsWithdrawModalOpen,
  });
  const handleWithdraw = createHandleWithdraw({
    isWithdrawing: params.isWithdrawing,
    withdrawPassword,
    withdrawAccount: params.withdrawAccount,
    setIsWithdrawModalOpen,
    setShowWithdrawPassword,
    setWithdrawPassword,
    clearAuth: params.clearAuth,
    showToast: params.showToast,
    router: params.router,
  });

  return {
    showWithdrawPassword,
    withdrawPassword,
    isWithdrawModalOpen,
    setShowWithdrawPassword,
    setWithdrawPassword,
    handlers: {
      handleWithdraw,
      openWithdrawModal,
      closeWithdrawModal,
    },
  };
};
