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
