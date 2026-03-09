import { EMAIL_MESSAGES } from '@/app/shared/constants/messages/auth.message';

import type { ChangeEvent } from 'react';
import type {
  LoginEmailChangeParams,
  LoginPasswordChangeParams,
  LoginRestoreCodeChangeHandler,
} from '@/app/shared/types/auth';

/**
 * 이메일 입력 핸들러 생성
 * @description 이메일 상태를 갱신하고 형식 에러를 동기화
 */
export const createHandleEmailChange = (params: LoginEmailChangeParams) => {
  return (event: ChangeEvent<HTMLInputElement>) => {
    const next = event.target.value;

    params.setEmail(next);
    if (!params.emailRegex.test(next)) {
      params.setEmailError(EMAIL_MESSAGES.invalid);
      return;
    }
    if (params.emailError) {
      params.setEmailError('');
    }
  };
};

/**
 * 비밀번호 입력 핸들러 생성
 * @description 비밀번호 상태를 갱신하고 에러를 초기화
 */
export const createHandlePasswordChange = (params: LoginPasswordChangeParams) => {
  return (event: ChangeEvent<HTMLInputElement>) => {
    params.setPassword(event.target.value);
    if (params.passwordError) {
      params.setPasswordError('');
    }
  };
};

/**
 * 복구 코드 입력 핸들러 생성
 * @description 복구 코드 상태를 갱신
 */
export const createHandleRestoreCodeChange = (setRestoreCode: (value: string) => void) => {
  const handleRestoreCodeChange: LoginRestoreCodeChangeHandler = event => {
    setRestoreCode(event.target.value);
  };

  return handleRestoreCodeChange;
};
