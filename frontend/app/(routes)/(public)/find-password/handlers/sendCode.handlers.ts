import type { AxiosError } from 'axios';
import type { UseMutationResult } from '@tanstack/react-query';
import type { ApiErrorResponse } from '@/app/shared/types/error';
import type { SendResetCodeRequest, SendResetCodeResponse } from '@/app/shared/types/auth';

/**
 * 인증번호 발송
 * @description 이메일 인증번호 발송을 요청
 */
export const sendCode = (params: {
  email: string;
  setEmailError: (value: string) => void;
  setCodeError: (value: string) => void;
  setCodeSent: (value: boolean) => void;
  sendCodeMutation: UseMutationResult<SendResetCodeResponse, Error, SendResetCodeRequest>;
  showToast: (options: { message: string; type: 'success' | 'error' | 'warning' }) => void;
  onSendSuccess?: () => void;
}) => {
  return (e?: React.FormEvent) => {
    if (e?.preventDefault) {
      e.preventDefault();
    }

    if (params.sendCodeMutation.isPending) return;

    // 클라이언트 검증 (체크만, 메시지는 백엔드에서)
    if (!params.email) {
      return;
    }

    params.sendCodeMutation.mutate(
      { email: params.email },
      {
        onSuccess: (data: SendResetCodeResponse) => {
          params.showToast({ message: data.message, type: 'success' });
          params.setCodeSent(true);
          params.onSendSuccess?.();
        },
        onError: (error: unknown) => {
          const axiosError = error as AxiosError<ApiErrorResponse>;
          const data = axiosError.response?.data;
          const code = data?.code;
          const message = data?.message;

          switch (code) {
            case 'VALIDATION_FAILED': {
              const emailMessage = data?.errors?.email?.[0] ?? message;
              if (emailMessage) {
                params.setEmailError(emailMessage);
              }
              break;
            }
            case 'PASSWORD_TOO_MANY_REQUESTS':
              params.showToast({
                message: message ?? '인증번호 요청이 많습니다. 잠시 후 다시 시도해주세요.',
                type: 'warning',
              });
              break;
            case 'EMAIL_SEND_FAILED':
              params.showToast({
                message: message ?? '인증 메일 발송에 실패했습니다. 잠시 후 다시 시도해주세요.',
                type: 'error',
              });
              break;
            default:
              if (message) {
                params.showToast({ message, type: 'error' });
              }
          }
        },
      },
    );
  };
};
