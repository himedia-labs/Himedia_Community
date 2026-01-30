/**
 * 비밀번호 상태 초기화
 * @description 비밀번호 입력/에러 상태를 초기화
 */
export const resetPasswordState = (params: {
  setNewPassword: (value: string) => void;
  setConfirmPassword: (value: string) => void;
  setNewPasswordError: (value: string) => void;
  setConfirmPasswordError: (value: string) => void;
}) => {
  return () => {
    params.setNewPassword('');
    params.setConfirmPassword('');
    params.setNewPasswordError('');
    params.setConfirmPasswordError('');
  };
};
