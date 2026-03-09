import type { AxiosError } from 'axios';
import type { ApiErrorResponse } from '@/app/shared/types/error';
import type { FindPasswordResetPasswordParams, ResetPasswordResponse } from '@/app/shared/types/auth';

/**
 * 새 비밀번호 설정
 * @description 검증된 인증번호로 비밀번호를 변경
 */
export const resetPassword = (params: FindPasswordResetPasswordParams) => {
  return (e: React.FormEvent) => {
    e.preventDefault();

    if (params.resetPasswordMutation.isPending) return;

    // 클라이언트 검증 (체크만, 메시지는 백엔드에서)
    if (
      !params.newPassword ||
      !params.isValidPassword(params.newPassword) ||
      !params.confirmPassword ||
      params.newPassword !== params.confirmPassword
    ) {
      return;
    }

    params.resetPasswordMutation.mutate(
      { email: params.email, code: params.code, newPassword: params.newPassword },
      {
        onSuccess: (data: ResetPasswordResponse) => {
          params.showToast({ message: data.message, type: 'success' });
          params.router.push('/login');
        },
        onError: (error: unknown) => {
          const axiosError = error as AxiosError<ApiErrorResponse>;
          const data = axiosError.response?.data;
          const code = data?.code;
          const message = data?.message;

          switch (code) {
            case 'VALIDATION_FAILED':
              if (data?.errors?.newPassword?.[0]) {
                params.setNewPasswordError(data.errors.newPassword[0]);
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
