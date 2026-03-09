import { createRegisterInputHandlers } from '@/app/(routes)/(public)/register/_handlers';

import type { UseRegisterInputHandlersParams } from '@/app/shared/types/auth';

/**
 * 회원가입 입력 핸들러 훅
 * @description 입력/선택/동의 이벤트 핸들러를 조합
 */
export const useRegisterInputHandlers = (params: UseRegisterInputHandlersParams) => {
  return createRegisterInputHandlers({
    name: params.form.name,
    email: params.form.email,
    birthDate: params.form.birthDate,
    password: params.form.password,
    passwordConfirm: params.form.passwordConfirm,
    phone: params.form.phone,
    role: params.form.role,
    course: params.form.course,
    courseTerm: params.form.courseTerm,
    emailCode: params.verification.emailCode,
    nameError: params.errors.nameError,
    emailError: params.errors.emailError,
    roleError: params.errors.roleError,
    courseError: params.errors.courseError,
    privacyError: params.errors.privacyError,
    emailCodeError: params.verification.emailCodeError,
    isEmailVerified: params.verification.isEmailVerified,
    isEmailCodeSent: params.verification.isEmailCodeSent,
    passwordConfirmError: params.errors.passwordConfirmError,
    setStep: params.verification.setStep,
    markKeepCache: params.markKeepCache,
    showToast: params.showToast,
    setEmailCode: params.verification.setEmailCode,
    setRoleError: params.setErrors.setRoleError,
    setNameError: params.setErrors.setNameError,
    setEmailError: params.setErrors.setEmailError,
    setCourseError: params.setErrors.setCourseError,
    setPrivacyError: params.setErrors.setPrivacyError,
    setIsEmailVerified: params.verification.setIsEmailVerified,
    setIsEmailCodeSent: params.verification.setIsEmailCodeSent,
    setEmailCodeError: params.verification.setEmailCodeError,
    setPasswordError: params.setErrors.setPasswordError,
    setPasswordConfirmError: params.setErrors.setPasswordConfirmError,
    setFormField: params.setFormField,
  });
};
