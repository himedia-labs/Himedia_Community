import { EMAIL_MESSAGES, REGISTER_MESSAGES } from '@/app/shared/constants/messages/auth.message';

import { formatCode, isValidPassword } from '@/app/(routes)/(public)/find-password/utils';

import type { ChangeEvent } from 'react';

/**
 * 이메일 입력 핸들러 생성
 * @description 이메일 값을 반영하고 유효성/에러 상태를 동기화
 */
export const createHandleEmailChange = (params: {
  emailError: string;
  codeError: string;
  setEmail: (value: string) => void;
  setCodeError: (value: string) => void;
  setEmailError: (value: string) => void;
  emailRegex: RegExp;
}) => {
  return (event: ChangeEvent<HTMLInputElement>) => {
    const next = event.target.value;

    params.setEmail(next);
    if (!params.emailRegex.test(next)) {
      params.setEmailError(EMAIL_MESSAGES.invalid);
    } else if (params.emailError) {
      params.setEmailError('');
    }
    if (params.codeError) {
      params.setCodeError('');
    }
  };
};

/**
 * 인증코드 입력 핸들러 생성
 * @description 인증코드 포맷 적용과 에러 상태 초기화를 처리
 */
export const createHandleCodeChange = (params: {
  codeError: string;
  setCode: (value: string) => void;
  setCodeError: (value: string) => void;
}) => {
  return (event: ChangeEvent<HTMLInputElement>) => {
    params.setCode(formatCode(event.target.value));
    if (params.codeError) {
      params.setCodeError('');
    }
  };
};

/**
 * 새 비밀번호 입력 핸들러 생성
 * @description 비밀번호 값을 반영하고 규칙 위반 메시지를 갱신
 */
export const createHandleNewPasswordChange = (params: {
  setNewPassword: (value: string) => void;
  setNewPasswordError: (value: string) => void;
}) => {
  return (event: ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;

    params.setNewPassword(value);
    if (value && !isValidPassword(value)) {
      params.setNewPasswordError(REGISTER_MESSAGES.invalidPassword);
      return;
    }
    params.setNewPasswordError('');
  };
};

/**
 * 비밀번호 확인 입력 핸들러 생성
 * @description 비밀번호 확인 값을 반영하고 에러 상태를 초기화
 */
export const createHandleConfirmPasswordChange = (params: {
  confirmPasswordError: string;
  setConfirmPassword: (value: string) => void;
  setConfirmPasswordError: (value: string) => void;
}) => {
  return (event: ChangeEvent<HTMLInputElement>) => {
    params.setConfirmPassword(event.target.value);
    if (params.confirmPasswordError) {
      params.setConfirmPasswordError('');
    }
  };
};
