import type { Dispatch, SetStateAction } from 'react';

import type { AuthStep } from '@/app/shared/types/auth';

/**
 * 인증코드 재전송 핸들러 생성
 * @description 인증번호 발송 액션을 다시 실행
 */
export const createHandleResendCodeClick = (handleSendCode: () => void) => {
  return () => {
    handleSendCode();
  };
};

/**
 * 인증 단계 복귀 핸들러 생성
 * @description 비밀번호 입력 상태를 초기화하고 인증 단계로 이동
 */
export const createHandleBackToVerify = (params: {
  setStep: Dispatch<SetStateAction<AuthStep>>;
  handleResetPasswordState: () => void;
}) => {
  return () => {
    params.setStep('verify');
    params.handleResetPasswordState();
  };
};
