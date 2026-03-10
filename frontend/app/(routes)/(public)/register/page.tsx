'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

import {
  useRegisterMutation,
  useSendEmailVerificationCodeMutation,
  useVerifyEmailVerificationCodeMutation,
} from '@/app/api/auth/auth.mutations';

import { useToast } from '@/app/shared/components/toast/toast';
import {
  EMAIL_VERIFICATION_CODE_LENGTH,
} from '@/app/shared/constants/config/register.config';

import {
  useEmailVerificationAutoVerify,
  useRegisterActionHandlers,
  useRegisterForm,
  useRegisterInputHandlers,
  useRegisterRestoredToast,
  useRegisterStepUi,
  useRegisterVerificationState,
} from '@/app/(routes)/(public)/register/_hooks';
import {
  RegisterStepOneSection,
  RegisterStepTwoSection,
} from '@/app/(routes)/(public)/register/_components';

import styles from '@/app/(routes)/(public)/register/register.module.css';

/**
 * 회원가입 페이지
 * @description 회원가입 입력과 제출을 처리
 */
export default function RegisterPage() {
  const router = useRouter();
  const registerMutation = useRegisterMutation();
  const sendCodeMutation = useSendEmailVerificationCodeMutation();
  const { showToast } = useToast();
  const verifyCodeMutation = useVerifyEmailVerificationCodeMutation();

  // 폼 상태/핸들러(캐시 로드 및 저장, 전화번호 포맷 등 포함)
  const {
    form,
    setFormField,
    errors,
    setErrors,
    handlers: { handleBirthDateChange, handlePhoneChange, clearFormCache, markKeepCache },
    hasCache,
    restoredFromKeep,
  } = useRegisterForm();

  // 폼 입력값 상태
  const {
    name,
    email,
    emailCode: cachedEmailCode,
    birthDate,
    password,
    passwordConfirm,
    phone,
    role,
    courseTerm,
    privacyConsent,
    step: cachedStep,
    isEmailVerified: cachedEmailVerified,
    isEmailCodeSent: cachedEmailCodeSent,
  } = form;
  // 폼 에러 상태
  const {
    nameError,
    emailError,
    passwordError,
    passwordConfirmError,
    phoneError,
    birthDateError,
    roleError,
    courseError,
    privacyError,
  } = errors;

  // 인증 상태
  const verification = useRegisterVerificationState({
    cachedStep,
    cachedEmailCode,
    cachedEmailVerified,
    cachedEmailCodeSent,
    setFormField,
  });
  const {
    step,
    emailCode,
    emailCodeError,
    isEmailVerified,
    isEmailCodeSent,
  } = verification;
  const { isCourseDisabled, isStepOneActionDisabled, stepOneActionLabel } = useRegisterStepUi({
    isEmailCodeSent,
    isEmailVerified,
    isSendingCode: sendCodeMutation.isPending,
    isVerifyingCode: verifyCodeMutation.isPending,
    role,
  });

  // 복구 안내
  useRegisterRestoredToast({ hasCache, restoredFromKeep, showToast });

  // 인증/제출 액션
  const { handleNextStep, handleSendEmailCode, handleSubmit, handleVerifyEmailCode } = useRegisterActionHandlers({
    clearFormCache,
    form,
    registerMutation,
    router,
    setErrors,
    sendCodeMutation,
    showToast,
    verification,
    verifyCodeMutation,
  });

  // 입력 핸들러
  const {
    handlePrevStep,
    handleNameInputChange,
    handleEmailInputChange,
    handleEmailCodeInputChange,
    handlePasswordInputChange,
    handlePasswordConfirmInputChange,
    handlePasswordConfirmBlur,
    handleRoleSelectChange,
    handleCourseSelectChange,
    handlePrivacyCheckboxChange,
    handlePrivacyLinkClick,
  } = useRegisterInputHandlers({
    errors,
    form,
    markKeepCache,
    setFormField,
    setErrors,
    showToast,
    verification,
  });

  useEmailVerificationAutoVerify({
    emailCode,
    codeLength: EMAIL_VERIFICATION_CODE_LENGTH,
    isEmailCodeSent,
    isEmailVerified,
    isVerifying: verifyCodeMutation.isPending,
    onVerify: handleVerifyEmailCode,
  });

  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <div className={styles.brand}>
          <Link href="/" className={styles.brandLink}>
            <span className={styles.brandMark}>
              <Image src="/icon/logo.png" alt="하이미디어아카데미 로고" fill priority sizes="90px" draggable={false} />
            </span>
            <span className={styles.brandText}>
              하이미디어커뮤니티
              <span className={styles.brandSub}>HIMEDIA COMMUNITY</span>
            </span>
          </Link>
        </div>
        <div className={styles.signupBox}>
          <h1 className={styles.title}>회원가입</h1>

          <form onSubmit={handleSubmit} className={styles.form}>
            {step === 1 ? (
              <RegisterStepOneSection
                name={name}
                email={email}
                emailCode={emailCode}
                birthDate={birthDate}
                password={password}
                passwordConfirm={passwordConfirm}
                phone={phone}
                nameError={nameError}
                emailError={emailError}
                emailCodeError={emailCodeError}
                birthDateError={birthDateError}
                passwordError={passwordError}
                passwordConfirmError={passwordConfirmError}
                phoneError={phoneError}
                isEmailVerified={isEmailVerified}
                isEmailCodeSent={isEmailCodeSent}
                isStepOneActionDisabled={isStepOneActionDisabled}
                isSendingCode={sendCodeMutation.isPending}
                isVerifyingCode={verifyCodeMutation.isPending}
                stepOneActionLabel={stepOneActionLabel}
                handleBirthDateChange={handleBirthDateChange}
                handleEmailInputChange={handleEmailInputChange}
                handleEmailCodeInputChange={handleEmailCodeInputChange}
                handleNameInputChange={handleNameInputChange}
                handlePasswordConfirmBlur={handlePasswordConfirmBlur}
                handlePasswordConfirmInputChange={handlePasswordConfirmInputChange}
                handlePasswordInputChange={handlePasswordInputChange}
                handlePhoneChange={handlePhoneChange}
                handleNextStep={handleNextStep}
                handleSendEmailCode={handleSendEmailCode}
              />
            ) : (
              <RegisterStepTwoSection
                role={role}
                courseTerm={courseTerm}
                privacyConsent={privacyConsent}
                roleError={roleError}
                courseError={courseError}
                privacyError={privacyError}
                isCourseDisabled={isCourseDisabled}
                handlePrevStep={handlePrevStep}
                handleCourseSelectChange={handleCourseSelectChange}
                handlePrivacyCheckboxChange={handlePrivacyCheckboxChange}
                handlePrivacyLinkClick={handlePrivacyLinkClick}
                handleRoleSelectChange={handleRoleSelectChange}
              />
            )}
          </form>
        </div>
      </div>
    </div>
  );
}
