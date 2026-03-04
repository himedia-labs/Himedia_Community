import { isValidPassword } from '@/app/shared/utils/password';
import { REGISTER_MESSAGES } from '@/app/shared/constants/messages/auth.message';
import type { RegisterNextStepParams } from '@/app/shared/types/auth';

/**
 * 회원가입 : 다음 단계 이동
 * @description 1단계 필수 입력 검증 후 스텝을 변경
 */
export const createNextStepHandler = (params: RegisterNextStepParams) => {
  return () => {
    let hasError = false;
    if (!params.name) {
      params.setNameError(REGISTER_MESSAGES.missingName);
      hasError = true;
    }
    if (!params.email) {
      params.setEmailError(REGISTER_MESSAGES.missingEmail);
      hasError = true;
    }
    if (!params.birthDate) {
      params.setBirthDateError(REGISTER_MESSAGES.missingBirthDate);
      hasError = true;
    }
    if (!params.password) {
      params.setPasswordError(REGISTER_MESSAGES.missingPassword);
      hasError = true;
    } else if (!isValidPassword(params.password)) {
      params.setPasswordError(REGISTER_MESSAGES.invalidPassword);
      hasError = true;
    }
    if (!params.passwordConfirm) {
      params.setPasswordConfirmError(REGISTER_MESSAGES.missingPasswordConfirm);
      hasError = true;
    } else if (params.password !== params.passwordConfirm) {
      params.setPasswordConfirmError(REGISTER_MESSAGES.passwordMismatch);
      hasError = true;
    }
    if (!params.phone) {
      params.setPhoneError(REGISTER_MESSAGES.missingPhone);
      hasError = true;
    }

    if (hasError) {
      params.showToast({ message: REGISTER_MESSAGES.missingRequired, type: 'warning' });
      return;
    }

    if (!params.isEmailVerified) {
      params.showToast({ message: REGISTER_MESSAGES.missingEmailVerification, type: 'warning' });
      return;
    }

    params.setStep(2);
  };
};
