import type { ChangeEvent } from 'react';
import type { QueryClient, UseMutationResult } from '@tanstack/react-query';
import type { AppRouterInstance } from 'next/dist/shared/lib/app-router-context.shared-runtime';
import type { ToastOptions } from './toast';

// User
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

export interface UpdateProfileImageRequest {
  profileImageUrl?: string | null;
}

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

// Auth Response
export interface AuthResponse {
  accessToken: string;
  user: User;
}

// Register Request
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

export interface UpdateProfileBioRequest {
  profileBio?: string | null;
}

export type UpdateProfileBioResponse = User;


// Login Request
export interface LoginRequest {
  email: string;
  password: string;
}

export interface ChangePasswordRequest {
  currentPassword: string;
  newPassword: string;
}

export type ChangePasswordResponse = AuthResponse;

export interface WithdrawAccountRequest {
  currentPassword: string;
}

export interface WithdrawAccountResponse {
  success: boolean;
  message: string;
}

export interface RestoreWithdrawnAccountRequest {
  email: string;
  code: string;
}

export type RestoreWithdrawnAccountResponse = AuthResponse;

// Password Reset - Send Code
export interface SendResetCodeRequest {
  email: string;
}

export interface SendResetCodeResponse {
  success: boolean;
  message: string;
}

// Password Reset - Verify Code
export interface VerifyResetCodeRequest {
  email: string;
  code: string;
}

export interface VerifyResetCodeResponse {
  success: boolean;
  message: string;
}

// Password Reset - Reset Password
export interface ResetPasswordRequest {
  email: string;
  code: string;
  newPassword: string;
}

export interface ResetPasswordResponse {
  success: boolean;
  message: string;
}

// Email Verification - Send Code
export interface SendEmailVerificationCodeRequest {
  email: string;
  purpose?: 'register' | 'account-change' | 'withdraw-restore';
}

export interface SendEmailVerificationCodeResponse {
  success: boolean;
  message: string;
}

// Email Verification - Verify Code
export interface VerifyEmailVerificationCodeRequest {
  email: string;
  code: string;
}

export interface VerifyEmailVerificationCodeResponse {
  success: boolean;
  message: string;
}

// Find Password Page
export type AuthStep = 'verify' | 'password';

// Login Page
export type LoginAuthKeys = {
  currentUser: readonly string[];
};

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
