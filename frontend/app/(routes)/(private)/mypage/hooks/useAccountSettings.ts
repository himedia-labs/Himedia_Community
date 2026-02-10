import { useMemo, useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';

import { authKeys } from '@/app/api/auth/auth.keys';
import { useChangePasswordMutation, useUpdateAccountInfoMutation } from '@/app/api/auth/auth.mutations';

import { useAuthStore } from '@/app/shared/store/authStore';
import { useToast } from '@/app/shared/components/toast/toast';

import type { AxiosError } from 'axios';
import type { User } from '@/app/shared/types/auth';
import type { ApiErrorResponse } from '@/app/shared/types/error';
import type { AccountEditField, UseAccountSettingsParams } from '@/app/(routes)/(private)/mypage/hooks/useAccountSettings.types';

/**
 * 계정 설정 훅
 * @description 계정 항목 인라인 수정 상태와 저장 동작을 관리
 */
export const useAccountSettings = ({ birthDate, email, phone }: UseAccountSettingsParams) => {
  // 상태/훅
  const queryClient = useQueryClient();
  const { showToast } = useToast();
  const { setAccessToken } = useAuthStore();
  const { mutateAsync: updateAccountInfo, isPending: isUpdatingAccount } = useUpdateAccountInfoMutation();
  const { mutateAsync: changePassword, isPending: isChangingPassword } = useChangePasswordMutation();

  const [editingField, setEditingField] = useState<AccountEditField>(null);
  const [emailValue, setEmailValue] = useState(email);
  const [phoneValue, setPhoneValue] = useState(phone);
  const [birthDateValue, setBirthDateValue] = useState(birthDate);
  const [currentPasswordValue, setCurrentPasswordValue] = useState('');
  const [newPasswordValue, setNewPasswordValue] = useState('');
  const [confirmPasswordValue, setConfirmPasswordValue] = useState('');

  // 공통 유틸
  const isSaving = isUpdatingAccount || isChangingPassword;
  const applyCurrentUser = (nextUser: User) => queryClient.setQueryData(authKeys.currentUser, nextUser);
  const extractErrorMessage = (error: unknown, fallback: string) => {
    const axiosError = error as AxiosError<ApiErrorResponse>;
    return axiosError.response?.data?.message || fallback;
  };

  // 편집 시작
  const startEmailEdit = () => {
    setEmailValue(email);
    setEditingField('email');
  };
  const startPhoneEdit = () => {
    setPhoneValue(phone);
    setEditingField('phone');
  };
  const startBirthDateEdit = () => {
    setBirthDateValue(birthDate);
    setEditingField('birthDate');
  };
  const startPasswordEdit = () => {
    setCurrentPasswordValue('');
    setNewPasswordValue('');
    setConfirmPasswordValue('');
    setEditingField('password');
  };

  // 편집 취소
  const cancelEdit = () => {
    setEditingField(null);
    setCurrentPasswordValue('');
    setNewPasswordValue('');
    setConfirmPasswordValue('');
  };

  // 항목 저장
  const saveEmail = async () => {
    const nextEmail = emailValue.trim();
    if (!nextEmail || nextEmail === email) {
      cancelEdit();
      return;
    }

    try {
      const nextUser = await updateAccountInfo({ email: nextEmail });
      applyCurrentUser(nextUser);
      showToast({ message: '이메일이 수정되었습니다.', type: 'success' });
      setEditingField(null);
    } catch (error) {
      showToast({ message: extractErrorMessage(error, '이메일 수정에 실패했습니다.'), type: 'error' });
    }
  };
  const savePhone = async () => {
    const nextPhone = phoneValue.trim();
    if (!nextPhone || nextPhone === phone) {
      cancelEdit();
      return;
    }

    try {
      const nextUser = await updateAccountInfo({ phone: nextPhone });
      applyCurrentUser(nextUser);
      showToast({ message: '전화번호가 수정되었습니다.', type: 'success' });
      setEditingField(null);
    } catch (error) {
      showToast({ message: extractErrorMessage(error, '전화번호 수정에 실패했습니다.'), type: 'error' });
    }
  };
  const saveBirthDate = async () => {
    const nextBirthDate = birthDateValue.trim();
    if (!nextBirthDate || nextBirthDate === birthDate) {
      cancelEdit();
      return;
    }

    try {
      const nextUser = await updateAccountInfo({ birthDate: nextBirthDate });
      applyCurrentUser(nextUser);
      showToast({ message: '생년월일이 수정되었습니다.', type: 'success' });
      setEditingField(null);
    } catch (error) {
      showToast({ message: extractErrorMessage(error, '생년월일 수정에 실패했습니다.'), type: 'error' });
    }
  };
  const savePassword = async () => {
    const currentPassword = currentPasswordValue.trim();
    const newPassword = newPasswordValue.trim();
    const confirmPassword = confirmPasswordValue.trim();

    if (!currentPassword || !newPassword || !confirmPassword) {
      showToast({ message: '비밀번호를 입력해주세요.', type: 'warning' });
      return;
    }
    if (newPassword !== confirmPassword) {
      showToast({ message: '새 비밀번호 확인이 일치하지 않습니다.', type: 'warning' });
      return;
    }

    try {
      const result = await changePassword({ currentPassword, newPassword });
      setAccessToken(result.accessToken);
      applyCurrentUser(result.user);
      showToast({ message: '비밀번호가 변경되었습니다.', type: 'success' });
      cancelEdit();
    } catch (error) {
      showToast({ message: extractErrorMessage(error, '비밀번호 변경에 실패했습니다.'), type: 'error' });
    }
  };

  // 편집 상태
  const isEditingEmail = editingField === 'email';
  const isEditingPhone = editingField === 'phone';
  const isEditingBirthDate = editingField === 'birthDate';
  const isEditingPassword = editingField === 'password';
  const isEditingAny = useMemo(() => Boolean(editingField), [editingField]);

  return {
    birthDateValue,
    confirmPasswordValue,
    currentPasswordValue,
    emailValue,
    isEditingAny,
    isEditingBirthDate,
    isEditingEmail,
    isEditingPassword,
    isEditingPhone,
    isSaving,
    newPasswordValue,
    phoneValue,
    cancelEdit,
    saveBirthDate,
    saveEmail,
    savePassword,
    savePhone,
    setBirthDateValue,
    setConfirmPasswordValue,
    setCurrentPasswordValue,
    setEmailValue,
    setNewPasswordValue,
    setPhoneValue,
    startBirthDateEdit,
    startEmailEdit,
    startPasswordEdit,
    startPhoneEdit,
  };
};
