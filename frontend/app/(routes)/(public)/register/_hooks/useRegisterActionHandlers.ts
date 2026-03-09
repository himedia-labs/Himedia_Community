import {
  createNextStepHandler,
  registerSubmit,
  sendEmailCode,
  verifyEmailCode,
} from '@/app/(routes)/(public)/register/_handlers';

import type { UseRegisterActionHandlersParams } from '@/app/shared/types/auth';

/**
 * 회원가입 액션 훅
 * @description 제출/다음 단계/이메일 인증 액션을 조합
 */
export const useRegisterActionHandlers = (params: UseRegisterActionHandlersParams) => {
  // 제출 액션
  const handleSubmit = registerSubmit({
    name: params.form.name,
    email: params.form.email,
    password: params.form.password,
    passwordConfirm: params.form.passwordConfirm,
    phone: params.form.phone,
    birthDate: params.form.birthDate,
    role: params.form.role,
    course: params.form.course,
    courseTerm: params.form.courseTerm,
    privacyConsent: params.form.privacyConsent,
    setNameError: params.setErrors.setNameError,
    setEmailError: params.setErrors.setEmailError,
    setPasswordError: params.setErrors.setPasswordError,
    setPasswordConfirmError: params.setErrors.setPasswordConfirmError,
    setPhoneError: params.setErrors.setPhoneError,
    setBirthDateError: params.setErrors.setBirthDateError,
    setRoleError: params.setErrors.setRoleError,
    setCourseError: params.setErrors.setCourseError,
    setPrivacyError: params.setErrors.setPrivacyError,
    setStep: params.verification.setStep,
    registerMutation: params.registerMutation,
    showToast: params.showToast,
    router: params.router,
    onSuccessCleanup: params.clearFormCache,
  });

  // 단계 이동
  const handleNextStep = createNextStepHandler({
    name: params.form.name,
    email: params.form.email,
    birthDate: params.form.birthDate,
    password: params.form.password,
    passwordConfirm: params.form.passwordConfirm,
    phone: params.form.phone,
    isEmailVerified: params.verification.isEmailVerified,
    setNameError: params.setErrors.setNameError,
    setEmailError: params.setErrors.setEmailError,
    setBirthDateError: params.setErrors.setBirthDateError,
    setPasswordError: params.setErrors.setPasswordError,
    setPasswordConfirmError: params.setErrors.setPasswordConfirmError,
    setPhoneError: params.setErrors.setPhoneError,
    showToast: params.showToast,
    setStep: params.verification.setStep,
  });

  // 인증번호 발송
  const handleSendEmailCode = sendEmailCode({
    email: params.form.email,
    setEmailError: params.setErrors.setEmailError,
    setCodeError: params.verification.setEmailCodeError,
    setEmailCode: params.verification.setEmailCode,
    setIsEmailCodeSent: params.verification.setIsEmailCodeSent,
    sendCodeMutation: params.sendCodeMutation,
    showToast: params.showToast,
  });

  // 인증번호 검증
  const handleVerifyEmailCode = verifyEmailCode({
    code: params.verification.emailCode,
    email: params.form.email,
    setEmailError: params.setErrors.setEmailError,
    setCodeError: params.verification.setEmailCodeError,
    setIsEmailVerified: params.verification.setIsEmailVerified,
    showToast: params.showToast,
    verifyCodeMutation: params.verifyCodeMutation,
  });

  return {
    handleNextStep,
    handleSendEmailCode,
    handleSubmit,
    handleVerifyEmailCode,
  };
};
