import { useEffect, useRef } from 'react';
import type { EmailVerificationAutoVerifyParams } from '@/app/shared/types/auth';

/**
 * 회원가입 : 이메일 인증 자동 검증 훅
 * @description 인증번호 길이가 충족되면 자동으로 검증을 호출한다
 */
export const useEmailVerificationAutoVerify = (params: EmailVerificationAutoVerifyParams) => {
  const { codeLength, emailCode, isEmailCodeSent, isEmailVerified, isVerifying, onVerify } = params;

  // 자동 검증 중복 방지
  const lastVerifiedCodeRef = useRef<string | null>(null);

  useEffect(() => {
    if (!isEmailCodeSent || isEmailVerified) return;
    if (emailCode.length !== codeLength) {
      lastVerifiedCodeRef.current = null;
      return;
    }
    if (isVerifying) return;
    if (lastVerifiedCodeRef.current === emailCode) return;

    lastVerifiedCodeRef.current = emailCode;
    onVerify();
  }, [codeLength, emailCode, isEmailCodeSent, isEmailVerified, isVerifying, onVerify]);
};
