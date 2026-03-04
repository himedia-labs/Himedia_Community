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
