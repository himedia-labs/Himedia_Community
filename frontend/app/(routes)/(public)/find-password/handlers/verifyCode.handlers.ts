import type { AxiosError } from 'axios';
import type { UseMutationResult } from '@tanstack/react-query';
import type { ApiErrorResponse } from '@/app/shared/types/error';
import type { AuthStep, VerifyResetCodeRequest, VerifyResetCodeResponse } from '@/app/shared/types/auth';

/**
 * 인증번호 검증
 * @description 이메일 인증번호를 검증
 */
export const verifyCode = (params: {
  email: string;
  code: string;
  setEmailError: (value: string) => void;
  setCodeError: (value: string) => void;
  setStep: (value: AuthStep) => void;
  verifyCodeMutation: UseMutationResult<VerifyResetCodeResponse, Error, VerifyResetCodeRequest>;
  showToast: (options: { message: string; type: 'success' | 'error' | 'warning' }) => void;
}) => {
  return (e: React.FormEvent) => {
    e.preventDefault();

    if (params.verifyCodeMutation.isPending) return;

    // 클라이언트 검증 (체크만, 메시지는 백엔드에서)
    if (!params.email || !params.code) {
      return;
    }

    params.verifyCodeMutation.mutate(
      { email: params.email, code: params.code },
      {
        onSuccess: (data: VerifyResetCodeResponse) => {
          params.showToast({ message: data.message, type: 'success' });
          params.setStep('password');
        },
        onError: (error: unknown) => {
          const axiosError = error as AxiosError<ApiErrorResponse>;
          const data = axiosError.response?.data;
          const code = data?.code;
          const message = data?.message;

          switch (code) {
            case 'VALIDATION_FAILED':
              if (data?.errors?.email?.[0]) {
                params.setEmailError(data.errors.email[0]);
              }
              if (data?.errors?.code?.[0]) {
                params.setCodeError(data.errors.code[0]);
              }
              break;
            case 'PASSWORD_INVALID_RESET_CODE':
              if (message) {
                params.setCodeError(message);
              }
              break;
            default:
              if (message) {
                params.showToast({ message, type: 'warning' });
              }
          }
        },
      },
    );
  };
};
