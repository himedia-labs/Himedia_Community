import type { AxiosError } from 'axios';
import type { UseMutationResult } from '@tanstack/react-query';
import type { AppRouterInstance } from 'next/dist/shared/lib/app-router-context.shared-runtime';

import { isValidPassword } from '@/app/shared/utils/password';
import { REGISTER_MESSAGES } from '@/app/shared/constants/messages/auth';

import type { RegisterRequest, AuthResponse } from '@/app/shared/types/auth';

/**
 * 전화번호 포맷팅
 * @description 사용자가 숫자를 입력하면 자동으로 XXX XXXX XXXX 형식으로 변환해줍니다.
 */
export const formatPhone = (params: {
  setPhone: (value: string) => void;
  phoneError: string;
  setPhoneError: (value: string) => void;
}) => {
  return (e: React.ChangeEvent<HTMLInputElement>) => {
    const digits = e.target.value.replace(/[^0-9]/g, '').slice(0, 11);

    let formatted = digits;
    if (digits.length > 3 && digits.length <= 7) {
      formatted = `${digits.slice(0, 3)} ${digits.slice(3)}`;
    } else if (digits.length > 7) {
      formatted = `${digits.slice(0, 3)} ${digits.slice(3, 7)} ${digits.slice(7)}`;
    }

    params.setPhone(formatted);
    if (params.phoneError) params.setPhoneError('');
  };
};

/**
 * 회원가입
 * @description 회원가입 폼 제출 핸들러
 */
export const register = (params: {
  name: string;
  email: string;
  password: string;
  passwordConfirm: string;
  phone: string;
  role: string;
  course: string;
  privacyConsent: boolean;
  setNameError: (value: string) => void;
  setEmailError: (value: string) => void;
  setPasswordError: (value: string) => void;
  setPasswordConfirmError: (value: string) => void;
  setPhoneError: (value: string) => void;
  setRoleError: (value: string) => void;
  setCourseError: (value: string) => void;
  setPrivacyError: (value: string) => void;
  registerMutation: UseMutationResult<AuthResponse, Error, RegisterRequest>;
  showToast: (options: { message: string; type: 'success' | 'error' | 'warning'; duration?: number }) => void;
  router: AppRouterInstance;
  onSuccessCleanup?: () => void;
}) => {
  return (e: React.FormEvent) => {
    e.preventDefault();

    // 에러 초기화
    params.setNameError('');
    params.setEmailError('');
    params.setPasswordError('');
    params.setPasswordConfirmError('');
    params.setPhoneError('');
    params.setRoleError('');
    params.setCourseError('');
    params.setPrivacyError('');

    let hasError = false;

    // 유효성 검사
    if (!params.name) {
      params.setNameError(REGISTER_MESSAGES.nameRequired);
      hasError = true;
    }

    if (!params.email) {
      params.setEmailError(REGISTER_MESSAGES.emailRequired);
      hasError = true;
    }

    if (!params.password) {
      params.setPasswordError(REGISTER_MESSAGES.passwordRequired);
      hasError = true;
    } else if (!isValidPassword(params.password)) {
      params.setPasswordError(REGISTER_MESSAGES.passwordInvalid);
      hasError = true;
    }

    if (!params.passwordConfirm) {
      params.setPasswordConfirmError(REGISTER_MESSAGES.passwordConfirmRequired);
      hasError = true;
    } else if (params.password !== params.passwordConfirm) {
      params.setPasswordConfirmError(REGISTER_MESSAGES.passwordMismatch);
      hasError = true;
    }

    if (!params.phone) {
      params.setPhoneError(REGISTER_MESSAGES.phoneRequired);
      hasError = true;
    }

    if (!params.role) {
      params.setRoleError(REGISTER_MESSAGES.roleRequired);
      hasError = true;
    }

    if (!params.course) {
      params.setCourseError(REGISTER_MESSAGES.courseRequired);
      hasError = true;
    }

    if (!params.privacyConsent) {
      params.setPrivacyError(REGISTER_MESSAGES.privacyRequired);
      hasError = true;
    }

    if (hasError) {
      params.showToast({ message: REGISTER_MESSAGES.validationToast, type: 'warning' });
      return;
    }

    // 전화번호에서 공백 제거
    const phoneNumber = params.phone.replace(/\s/g, '');

    // role을 대문자로 변환
    const upperRole = params.role.toUpperCase() as 'TRAINEE' | 'MENTOR' | 'INSTRUCTOR';

    params.registerMutation.mutate(
      {
        name: params.name,
        email: params.email,
        password: params.password,
        phone: phoneNumber,
        role: upperRole,
        course: params.course || undefined,
        privacyConsent: params.privacyConsent,
      },
      {
        // 성공 시
        onSuccess: () => {
          params.onSuccessCleanup?.();
          params.showToast({
            message: REGISTER_MESSAGES.success,
            type: 'success',
            duration: 5000,
          });
          params.router.push('/');
        },
        // 실패 시
        onError: (error: unknown) => {
          const axiosError = error as AxiosError<{ message?: string; code?: string }>;
          const { message, code } = axiosError.response?.data || {};

          // 백엔드 에러 코드 기반 처리
          switch (code) {
            case 'AUTH_EMAIL_ALREADY_EXISTS':
              if (message) {
                params.setEmailError(message);
              }
              break;
            case 'AUTH_PHONE_ALREADY_EXISTS':
              if (message) {
                params.setPhoneError(message);
              }
              break;
            default:
              if (message) {
                params.setEmailError(message);
              } else {
                params.showToast({ message: REGISTER_MESSAGES.fallbackError, type: 'error' });
              }
          }
        },
      },
    );
  };
};
