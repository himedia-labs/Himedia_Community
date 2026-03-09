import type { ChangeEvent } from 'react';
import type { QueryClient, UseMutationResult } from '@tanstack/react-query';
import type { AppRouterInstance } from 'next/dist/shared/lib/app-router-context.shared-runtime';
import type { ToastOptions } from './toast';
import type { RegisterFormCache } from './register';

// 공통 응답
type AuthStatusMessageResponse = {
  success: boolean;
  message: string;
};

// 사용자
export interface User {
  id: string;
  email: string;
  name: string;
  channelTalkMemberHash?: string | null;
  role: 'TRAINEE' | 'GRADUATE' | 'MENTOR' | 'INSTRUCTOR' | 'ADMIN';
  phone: string;
  birthDate?: string | null;
  course?: string | null;
  profileHandle?: string | null;
  profileImageUrl?: string | null;
  profileBio?: string | null;
  profileContactEmail?: string | null;
  profileGithubUrl?: string | null;
  profileLinkedinUrl?: string | null;
  profileTwitterUrl?: string | null;
  profileFacebookUrl?: string | null;
  profileWebsiteUrl?: string | null;
}

export interface PublicProfile {
  id: string;
  name: string;
  profileHandle?: string | null;
  profileImageUrl?: string | null;
  profileBio?: string | null;
  profileContactEmail?: string | null;
  profileGithubUrl?: string | null;
  profileLinkedinUrl?: string | null;
  profileTwitterUrl?: string | null;
  profileFacebookUrl?: string | null;
  profileWebsiteUrl?: string | null;
}

// 프로필 요청
export interface UpdateProfileImageRequest {
  profileImageUrl?: string | null;
}

// 프로필 응답
export type UpdateProfileImageResponse = User;

export interface UpdateProfileRequest {
  name?: string | null;
  profileHandle?: string | null;
  profileContactEmail?: string | null;
  profileGithubUrl?: string | null;
  profileLinkedinUrl?: string | null;
  profileTwitterUrl?: string | null;
  profileFacebookUrl?: string | null;
  profileWebsiteUrl?: string | null;
}

export type UpdateProfileResponse = User;

export interface UpdateAccountInfoRequest {
  email?: string;
  phone?: string;
  birthDate?: string;
}

export type UpdateAccountInfoResponse = User;

// 인증 응답
export interface AuthResponse {
  accessToken: string;
  user: User;
}

// 회원가입 요청
export interface RegisterRequest {
  name: string;
  email: string;
  password: string;
  phone: string;
  birthDate: string;
  role: 'TRAINEE' | 'GRADUATE' | 'MENTOR' | 'INSTRUCTOR';
  course?: string;
  privacyConsent: boolean;
}

// 자기소개 요청
export interface UpdateProfileBioRequest {
  profileBio?: string | null;
}

// 자기소개 응답
export type UpdateProfileBioResponse = User;

// 로그인 요청
export interface LoginRequest {
  email: string;
  password: string;
}

export interface ChangePasswordRequest {
  currentPassword: string;
  newPassword: string;
}

// 로그인 응답
export type ChangePasswordResponse = AuthResponse;

export interface WithdrawAccountRequest {
  currentPassword: string;
}

export type WithdrawAccountResponse = AuthStatusMessageResponse;

export interface RestoreWithdrawnAccountRequest {
  email: string;
  code: string;
}

export type RestoreWithdrawnAccountResponse = AuthResponse;

// 비밀번호 재설정 전송
export interface SendResetCodeRequest {
  email: string;
}

export type SendResetCodeResponse = AuthStatusMessageResponse;

// 비밀번호 재설정 검증
export interface VerifyResetCodeRequest {
  email: string;
  code: string;
}

export type VerifyResetCodeResponse = AuthStatusMessageResponse;

// 비밀번호 재설정 변경
export interface ResetPasswordRequest {
  email: string;
  code: string;
  newPassword: string;
}

export type ResetPasswordResponse = AuthStatusMessageResponse;

// 이메일 인증 전송
export interface SendEmailVerificationCodeRequest {
  email: string;
  purpose?: 'register' | 'account-change' | 'withdraw-restore';
}

export type SendEmailVerificationCodeResponse = AuthStatusMessageResponse;

// 이메일 인증 검증
export interface VerifyEmailVerificationCodeRequest {
  email: string;
  code: string;
}

export type VerifyEmailVerificationCodeResponse = AuthStatusMessageResponse;

// 인증 상태
export type AuthStep = 'verify' | 'password';

export interface AuthState {
  accessToken: string | null;
  isInitialized: boolean;
  setAccessToken: (token: string | null) => void;
  setInitialized: (value: boolean) => void;
  clearAuth: () => void;
}

// 로그인 페이지 상태
export type LoginAuthKeys = {
  currentUser: readonly string[];
};

// 로그인 페이지 액션
export type AuthenticateUserParams = {
  email: string;
  password: string;
  isLoginSubmitting: boolean;
  setEmailError: (value: string) => void;
  setPasswordError: (value: string) => void;
  setIsLoginSubmitting: (value: boolean) => void;
  onWithdrawnAccount?: (message?: string) => void;
  redirectTo?: string | null;
  loginMutation: UseMutationResult<AuthResponse, Error, LoginRequest>;
  showToast: (options: ToastOptions) => void;
  queryClient: QueryClient;
  authKeys: LoginAuthKeys;
  router: AppRouterInstance;
};

export type LoginEmailChangeParams = {
  emailError: string;
  setEmail: (value: string) => void;
  setEmailError: (value: string) => void;
  emailRegex: RegExp;
};

export type LoginPasswordChangeParams = {
  passwordError: string;
  setPassword: (value: string) => void;
  setPasswordError: (value: string) => void;
};

export type LoginRestoreCodeChangeHandler = (event: ChangeEvent<HTMLInputElement>) => void;

// 로그인 페이지 모달
export type LoginWithdrawnAccountParams = {
  email: string;
  setRestoreCode: (value: string) => void;
  setRestoreEmail: (value: string) => void;
  setWithdrawnMessage: (value: string) => void;
  setIsRestoreCodeSent: (value: boolean) => void;
  setIsWithdrawnModalOpen: (value: boolean) => void;
};

export type LoginCloseWithdrawModalParams = {
  isRestoreAccountPending: boolean;
  isRestoreCodePending: boolean;
  setRestoreCode: (value: string) => void;
  setIsRestoreCodeSent: (value: boolean) => void;
  setIsWithdrawnModalOpen: (value: boolean) => void;
};

export type LoginSendRestoreCodeParams = {
  restoreEmail: string;
  showToast: (options: ToastOptions) => void;
  setIsRestoreCodeSent: (value: boolean) => void;
  restoreCodeMutation: UseMutationResult<
    SendEmailVerificationCodeResponse,
    Error,
    SendEmailVerificationCodeRequest
  >;
};

export type LoginRestoreAccountParams = {
  authKeys: LoginAuthKeys;
  queryClient: QueryClient;
  redirectTo: string;
  restoreCode: string;
  restoreEmail: string;
  router: AppRouterInstance;
  showToast: (options: ToastOptions) => void;
  setRestoreCode: (value: string) => void;
  setIsRestoreCodeSent: (value: boolean) => void;
  setIsWithdrawnModalOpen: (value: boolean) => void;
  restoreAccountMutation: UseMutationResult<
    RestoreWithdrawnAccountResponse,
    Error,
    RestoreWithdrawnAccountRequest
  >;
};

export type LoginRedirectToastParams = {
  reason: string | null;
  showToast: (options: ToastOptions) => void;
};

// 회원가입 페이지 상태
export type RegisterSetError = (value: string) => void;

// 회원가입 페이지 인증
export type RegisterSendEmailCodeParams = {
  email: string;
  setEmailError: RegisterSetError;
  setCodeError: RegisterSetError;
  setEmailCode: (value: string) => void;
  setIsEmailCodeSent: (value: boolean) => void;
  sendCodeMutation: UseMutationResult<SendEmailVerificationCodeResponse, Error, SendEmailVerificationCodeRequest>;
  showToast: (options: ToastOptions) => void;
};

export type RegisterVerifyEmailCodeParams = {
  code: string;
  email: string;
  setEmailError: RegisterSetError;
  setCodeError: RegisterSetError;
  setIsEmailVerified: (value: boolean) => void;
  verifyCodeMutation: UseMutationResult<
    VerifyEmailVerificationCodeResponse,
    Error,
    VerifyEmailVerificationCodeRequest
  >;
  showToast: (options: ToastOptions) => void;
};

// 회원가입 페이지 제출
export type RegisterSubmitParams = {
  name: string;
  email: string;
  password: string;
  passwordConfirm: string;
  phone: string;
  birthDate: string;
  role: string;
  course: string;
  courseTerm: string;
  privacyConsent: boolean;
  setNameError: RegisterSetError;
  setEmailError: RegisterSetError;
  setPasswordError: RegisterSetError;
  setPasswordConfirmError: RegisterSetError;
  setPhoneError: RegisterSetError;
  setBirthDateError: RegisterSetError;
  setRoleError: RegisterSetError;
  setCourseError: RegisterSetError;
  setPrivacyError: RegisterSetError;
  setStep: (step: 1 | 2) => void;
  registerMutation: UseMutationResult<void, Error, RegisterRequest>;
  showToast: (options: ToastOptions) => void;
  router: AppRouterInstance;
  onSuccessCleanup?: () => void;
};

// 회원가입 페이지 단계
export type RegisterNextStepParams = {
  name: string;
  email: string;
  birthDate: string;
  password: string;
  passwordConfirm: string;
  phone: string;
  isEmailVerified: boolean;
  setNameError: RegisterSetError;
  setEmailError: RegisterSetError;
  setBirthDateError: RegisterSetError;
  setPasswordError: RegisterSetError;
  setPasswordConfirmError: RegisterSetError;
  setPhoneError: RegisterSetError;
  showToast: (options: ToastOptions) => void;
  setStep: (step: 1 | 2) => void;
};

// 회원가입 페이지 자동 인증
export type EmailVerificationAutoVerifyParams = {
  codeLength: number;
  emailCode: string;
  isEmailCodeSent: boolean;
  isEmailVerified: boolean;
  isVerifying: boolean;
  onVerify: () => void;
};

// 회원가입 페이지 포맷
export type RegisterBirthDateFormatParams = {
  setBirthDate: (value: string) => void;
  birthDateError: string;
  setBirthDateError: RegisterSetError;
};

export type RegisterPhoneFormatParams = {
  setPhone: (value: string) => void;
  phoneError: string;
  setPhoneError: RegisterSetError;
};

// 회원가입 페이지 입력
export type RegisterInputHandlersParams = {
  name: string;
  email: string;
  birthDate: string;
  password: string;
  passwordConfirm: string;
  phone: string;
  role: string;
  course: string;
  courseTerm: string;
  emailCode: string;
  emailError: string;
  roleError: string;
  courseError: string;
  privacyError: string;
  nameError: string;
  emailCodeError: string;
  isEmailVerified: boolean;
  isEmailCodeSent: boolean;
  passwordConfirmError: string;
  setStep: (step: 1 | 2) => void;
  markKeepCache: () => void;
  showToast: (options: ToastOptions) => void;
  setEmailCode: (value: string) => void;
  setRoleError: RegisterSetError;
  setNameError: RegisterSetError;
  setEmailError: RegisterSetError;
  setCourseError: RegisterSetError;
  setPrivacyError: RegisterSetError;
  setIsEmailVerified: (value: boolean) => void;
  setIsEmailCodeSent: (value: boolean) => void;
  setEmailCodeError: RegisterSetError;
  setPasswordError: RegisterSetError;
  setPasswordConfirmError: RegisterSetError;
  setFormField: <K extends keyof RegisterFormCache>(key: K, value: RegisterFormCache[K]) => void;
};

// 회원가입 페이지 알림
export type RegisterRestoredToastParams = {
  hasCache: boolean;
  restoredFromKeep: boolean;
  showToast: (options: ToastOptions) => void;
};
