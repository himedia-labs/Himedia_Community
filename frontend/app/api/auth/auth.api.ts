import { axiosBare } from '@/app/shared/network/axios.config';
import { axiosInstance } from '@/app/shared/network/axios.instance';

import { useAuthStore } from '@/app/shared/store/authStore';

import type {
  User,
  AuthResponse,
  LoginRequest,
  PublicProfile,
  RegisterRequest,
  ResetPasswordRequest,
  UpdateProfileRequest,
  SendResetCodeRequest,
  ResetPasswordResponse,
  UpdateProfileResponse,
  SendResetCodeResponse,
  ChangePasswordRequest,
  WithdrawAccountRequest,
  VerifyResetCodeRequest,
  ChangePasswordResponse,
  VerifyResetCodeResponse,
  WithdrawAccountResponse,
  UpdateProfileBioRequest,
  UpdateProfileBioResponse,
  UpdateAccountInfoRequest,
  UpdateProfileImageRequest,
  UpdateAccountInfoResponse,
  UpdateProfileImageResponse,
  RestoreWithdrawnAccountRequest,
  RestoreWithdrawnAccountResponse,
  SendEmailVerificationCodeRequest,
  SendEmailVerificationCodeResponse,
  VerifyEmailVerificationCodeRequest,
  VerifyEmailVerificationCodeResponse,
} from '@/app/shared/types/auth';

// 회원가입
const register = async (data: RegisterRequest): Promise<void> => {
  const res = await axiosInstance.post('/auth/register', data);
  return res.data;
};

// 회원가입 이메일 인증: 코드 발송
const sendEmailVerificationCode = async (
  data: SendEmailVerificationCodeRequest,
): Promise<SendEmailVerificationCodeResponse> => {
  const res = await axiosInstance.post<SendEmailVerificationCodeResponse>('/auth/email/send-code', data);
  return res.data;
};

// 회원가입 이메일 인증: 코드 검증
const verifyEmailVerificationCode = async (
  data: VerifyEmailVerificationCodeRequest,
): Promise<VerifyEmailVerificationCodeResponse> => {
  const res = await axiosInstance.post<VerifyEmailVerificationCodeResponse>('/auth/email/verify-code', data);
  return res.data;
};

// 로그인
const login = async (data: LoginRequest): Promise<AuthResponse> => {
  const res = await axiosInstance.post<AuthResponse>('/auth/login', data);
  return res.data;
};

// 비밀번호 찾기 - 코드 발송
const sendResetCode = async (data: SendResetCodeRequest): Promise<SendResetCodeResponse> => {
  const res = await axiosInstance.post<SendResetCodeResponse>('/auth/password/send-code', data);
  return res.data;
};

// 비밀번호 찾기 - 코드 검증
const verifyResetCode = async (data: VerifyResetCodeRequest): Promise<VerifyResetCodeResponse> => {
  const res = await axiosInstance.post<VerifyResetCodeResponse>('/auth/password/verify-code', data);
  return res.data;
};

// 비밀번호 재설정
const resetPassword = async (data: ResetPasswordRequest): Promise<ResetPasswordResponse> => {
  const res = await axiosInstance.post<ResetPasswordResponse>('/auth/password/reset-with-code', data);
  return res.data;
};

// 내 정보 조회
const getCurrentUser = async (): Promise<User> => {
  return axiosInstance.get<User>('/auth/me').then(res => res.data);
};

// 공개 프로필 조회
const getProfileByHandle = async (handle: string): Promise<PublicProfile> => {
  const encoded = encodeURIComponent(handle);
  return axiosInstance.get<PublicProfile>(`/auth/profile/${encoded}`).then(res => res.data);
};

// 자기소개 수정
const updateProfileBio = async (payload: UpdateProfileBioRequest): Promise<UpdateProfileBioResponse> => {
  const res = await axiosInstance.patch<UpdateProfileBioResponse>('/auth/me/profile-bio', payload);
  return res.data;
};

// 프로필 이미지 수정
const updateProfileImage = async (payload: UpdateProfileImageRequest): Promise<UpdateProfileImageResponse> => {
  const res = await axiosInstance.patch<UpdateProfileImageResponse>('/auth/me/profile-image', payload);
  return res.data;
};

// 프로필 수정
const updateProfile = async (payload: UpdateProfileRequest): Promise<UpdateProfileResponse> => {
  const res = await axiosInstance.patch<UpdateProfileResponse>('/auth/me/profile', payload);
  return res.data;
};

// 계정 기본 정보 수정
const updateAccountInfo = async (payload: UpdateAccountInfoRequest): Promise<UpdateAccountInfoResponse> => {
  const res = await axiosInstance.patch<UpdateAccountInfoResponse>('/auth/me/account', payload);
  return res.data;
};

// 비밀번호 변경
const changePassword = async (payload: ChangePasswordRequest): Promise<ChangePasswordResponse> => {
  const res = await axiosInstance.post<ChangePasswordResponse>('/auth/password/change', payload);
  return res.data;
};

// 회원탈퇴
const withdrawAccount = async (payload: WithdrawAccountRequest): Promise<WithdrawAccountResponse> => {
  const accessToken = useAuthStore.getState().accessToken;
  const headers = accessToken ? { Authorization: `Bearer ${accessToken}` } : undefined;
  const res = await axiosBare.post<WithdrawAccountResponse>('/auth/withdraw', payload, { headers });
  return res.data;
};

// 탈퇴 계정 복원
const restoreWithdrawnAccount = async (
  payload: RestoreWithdrawnAccountRequest,
): Promise<RestoreWithdrawnAccountResponse> => {
  const res = await axiosBare.post<RestoreWithdrawnAccountResponse>('/auth/restore', payload);
  return res.data;
};

// 로그아웃
const logout = async (): Promise<void> => {
  await axiosInstance.post('/auth/logout');
};

export const authApi = {
  register,
  sendEmailVerificationCode,
  verifyEmailVerificationCode,
  login,
  sendResetCode,
  verifyResetCode,
  resetPassword,
  getCurrentUser,
  getProfileByHandle,
  updateProfileBio,
  updateProfileImage,
  updateProfile,
  updateAccountInfo,
  changePassword,
  withdrawAccount,
  restoreWithdrawnAccount,
  logout,
};
