import { EMAIL_MESSAGES, REGISTER_MESSAGES } from '@/app/shared/constants/messages/auth.message';
import { isValidPassword } from '@/app/shared/utils/auth';

import { formatCode } from '@/app/(routes)/(public)/find-password/utils';

import type { ChangeEvent } from 'react';
import type {
  FindPasswordCodeChangeParams,
  FindPasswordConfirmPasswordChangeParams,
  FindPasswordEmailChangeParams,
  FindPasswordNewPasswordChangeParams,
} from '@/app/shared/types/auth';

/**
 * 이메일 입력 핸들러 생성
 * @description 이메일 값을 반영하고 유효성/에러 상태를 동기화
 */
export const createHandleEmailChange = (params: FindPasswordEmailChangeParams) => {
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
export const createHandleCodeChange = (params: FindPasswordCodeChangeParams) => {
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
export const createHandleNewPasswordChange = (params: FindPasswordNewPasswordChangeParams) => {
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
export const createHandleConfirmPasswordChange = (params: FindPasswordConfirmPasswordChangeParams) => {
  return (event: ChangeEvent<HTMLInputElement>) => {
    params.setConfirmPassword(event.target.value);
    if (params.confirmPasswordError) {
      params.setConfirmPasswordError('');
    }
  };
};
