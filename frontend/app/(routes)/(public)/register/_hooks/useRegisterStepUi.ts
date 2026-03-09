import type { UseRegisterStepUiParams } from '@/app/shared/types/auth';

/**
 * 회원가입 단계 UI 훅
 * @description 단계별 버튼 라벨과 비활성 상태를 계산
 */
export const useRegisterStepUi = (params: UseRegisterStepUiParams) => {
  const isCourseDisabled = params.role === 'instructor' || params.role === 'mentor';
  const isStepOneActionDisabled =
    params.isSendingCode || params.isVerifyingCode || (params.isEmailCodeSent && !params.isEmailVerified);
  const stepOneActionLabel = params.isSendingCode ? '발송 중...' : params.isEmailVerified || params.isEmailCodeSent ? '다음' : '인증번호 발송';

  return {
    isCourseDisabled,
    isStepOneActionDisabled,
    stepOneActionLabel,
  };
};
