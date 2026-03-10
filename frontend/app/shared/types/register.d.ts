// 회원가입 캐시
export interface RegisterFormCache {
  name: string;
  email: string;
  emailCode: string;
  birthDate: string;
  password: string;
  passwordConfirm: string;
  phone: string;
  role: string;
  course: string;
  courseTerm: string;
  privacyConsent: boolean;
  step: 1 | 2;
  isEmailVerified: boolean;
  isEmailCodeSent: boolean;
}

// 회원가입 인증 상태
export interface UseRegisterVerificationStateParams {
  cachedStep: 1 | 2;
  cachedEmailCode: string;
  cachedEmailVerified: boolean;
  cachedEmailCodeSent: boolean;
  setFormField: <K extends keyof RegisterFormCache>(field: K, value: RegisterFormCache[K]) => void;
}

export interface RegisterStepOneSectionProps {
  name: string;
  email: string;
  emailCode: string;
  birthDate: string;
  password: string;
  passwordConfirm: string;
  phone: string;
  nameError: string;
  emailError: string;
  emailCodeError: string;
  birthDateError: string;
  passwordError: string;
  passwordConfirmError: string;
  phoneError: string;
  isEmailVerified: boolean;
  isEmailCodeSent: boolean;
  isStepOneActionDisabled: boolean;
  isSendingCode: boolean;
  isVerifyingCode: boolean;
  stepOneActionLabel: string;
  handleBirthDateChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  handleEmailInputChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  handleEmailCodeInputChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  handleNameInputChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  handlePasswordConfirmBlur: () => void;
  handlePasswordConfirmInputChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  handlePasswordInputChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  handlePhoneChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  handleNextStep: () => void;
  handleSendEmailCode: () => void;
}

export interface RegisterStepTwoSectionProps {
  role: string;
  courseTerm: string;
  privacyConsent: boolean;
  roleError: string;
  courseError: string;
  privacyError: string;
  isCourseDisabled: boolean;
  handlePrevStep: () => void;
  handleCourseSelectChange: (event: React.ChangeEvent<HTMLSelectElement>) => void;
  handlePrivacyCheckboxChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  handlePrivacyLinkClick: () => void;
  handleRoleSelectChange: (event: React.ChangeEvent<HTMLSelectElement>) => void;
}
