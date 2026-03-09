import { useState } from 'react';

import type { UseRegisterVerificationStateParams } from '@/app/shared/types/register';

/**
 * 회원가입 인증 상태 훅
 * @description 스텝과 이메일 인증 상태를 캐시 동기화 세터와 함께 관리
 */
export const useRegisterVerificationState = ({
  cachedStep,
  cachedEmailCode,
  cachedEmailVerified,
  cachedEmailCodeSent,
  setFormField,
}: UseRegisterVerificationStateParams) => {
  const [step, setStepState] = useState<1 | 2>(cachedStep);
  const [emailCode, setEmailCodeState] = useState(cachedEmailCode);
  const [emailCodeError, setEmailCodeError] = useState('');
  const [isEmailVerified, setIsEmailVerifiedState] = useState(cachedEmailVerified);
  const [isEmailCodeSent, setIsEmailCodeSentState] = useState(cachedEmailCodeSent);

  const setStep = (nextStep: 1 | 2) => {
    setStepState(nextStep);
    setFormField('step', nextStep);
  };

  const setEmailCode = (nextCode: string) => {
    setEmailCodeState(nextCode);
    setFormField('emailCode', nextCode);
  };

  const setIsEmailVerified = (verified: boolean) => {
    setIsEmailVerifiedState(verified);
    setFormField('isEmailVerified', verified);
  };

  const setIsEmailCodeSent = (sent: boolean) => {
    setIsEmailCodeSentState(sent);
    setFormField('isEmailCodeSent', sent);
  };

  return {
    step,
    setStep,
    emailCode,
    setEmailCode,
    emailCodeError,
    setEmailCodeError,
    isEmailVerified,
    setIsEmailVerified,
    isEmailCodeSent,
    setIsEmailCodeSent,
  };
};
