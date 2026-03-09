import type { FindPasswordResetStateParams } from '@/app/shared/types/auth';

/**
 * 비밀번호 상태 초기화
 * @description 비밀번호 입력/에러 상태를 초기화
 */
export const resetPasswordState = (params: FindPasswordResetStateParams) => {
  return () => {
    params.setNewPassword('');
    params.setConfirmPassword('');
    params.setNewPasswordError('');
    params.setConfirmPasswordError('');
  };
};
