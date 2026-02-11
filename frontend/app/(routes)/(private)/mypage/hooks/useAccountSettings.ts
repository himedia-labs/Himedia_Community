import { useMemo, useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';

import { authKeys } from '@/app/api/auth/auth.keys';
import { useChangePasswordMutation, useUpdateAccountInfoMutation } from '@/app/api/auth/auth.mutations';

import { useAuthStore } from '@/app/shared/store/authStore';

import { isValidPassword } from '@/app/shared/utils/password';
import { useToast } from '@/app/shared/components/toast/toast';
import { BIRTH_DATE_CONFIG, PHONE_CONFIG } from '@/app/shared/constants/config/register.config';

import type { ChangeEvent } from 'react';
import type { AxiosError } from 'axios';
import type { User } from '@/app/shared/types/auth';
import type { ApiErrorResponse } from '@/app/shared/types/error';
import type {
  AccountEditField,
  UseAccountSettingsParams,
} from '@/app/(routes)/(private)/mypage/hooks/useAccountSettings.types';

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

  const [emailValue, setEmailValue] = useState(email);
  const [phoneValue, setPhoneValue] = useState(phone);
  const [newPasswordValue, setNewPasswordValue] = useState('');
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [birthDateValue, setBirthDateValue] = useState(birthDate);
  const [currentPasswordValue, setCurrentPasswordValue] = useState('');
  const [confirmPasswordValue, setConfirmPasswordValue] = useState('');
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [editingField, setEditingField] = useState<AccountEditField>(null);

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
    setShowCurrentPassword(false);
    setShowNewPassword(false);
    setShowConfirmPassword(false);
    setEditingField('password');
  };

  // 편집 취소
  const cancelEdit = () => {
    setEditingField(null);
    setCurrentPasswordValue('');
    setNewPasswordValue('');
    setConfirmPasswordValue('');
    setShowCurrentPassword(false);
    setShowNewPassword(false);
    setShowConfirmPassword(false);
  };

  // 비밀번호 표시 토글
  const toggleCurrentPasswordVisibility = () => setShowCurrentPassword(prev => !prev);
  const toggleNewPasswordVisibility = () => setShowNewPassword(prev => !prev);
  const toggleConfirmPasswordVisibility = () => setShowConfirmPassword(prev => !prev);

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

  // 전화번호 포맷
  const handlePhoneChange = (event: ChangeEvent<HTMLInputElement>) => {
    const digits = event.target.value.replace(/[^0-9]/g, '').slice(0, PHONE_CONFIG.DIGIT_MAX_LENGTH);

    let formatted = digits;
    if (digits.length > 3 && digits.length <= 7) {
      formatted = `${digits.slice(0, 3)} ${digits.slice(3)}`;
    } else if (digits.length > 7) {
      formatted = `${digits.slice(0, 3)} ${digits.slice(3, 7)} ${digits.slice(7)}`;
    }

    setPhoneValue(formatted);
  };

  // 생년월일 포맷
  const handleBirthDateChange = (event: ChangeEvent<HTMLInputElement>) => {
    const digits = event.target.value.replace(/[^0-9]/g, '').slice(0, BIRTH_DATE_CONFIG.DIGIT_MAX_LENGTH);

    let formatted = digits;
    if (digits.length > 4 && digits.length <= 6) {
      formatted = `${digits.slice(0, 4)}-${digits.slice(4)}`;
    } else if (digits.length > 6) {
      formatted = `${digits.slice(0, 4)}-${digits.slice(4, 6)}-${digits.slice(6)}`;
    }

    setBirthDateValue(formatted);
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
    if (!isValidPassword(newPassword)) {
      showToast({
        message: '8~32자, 공백 없이 영문/숫자/특수문자 중 2가지 이상이며 연속 3자 동일 문자는 사용할 수 없습니다.',
        type: 'warning',
      });
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

  // 비밀번호 규칙 상태
  const passwordRuleStatus = useMemo(() => {
    const hasLetter = /[a-zA-Z]/.test(newPasswordValue);
    const hasNumber = /\d/.test(newPasswordValue);
    const hasSpecial = /[@$!%*?&]/.test(newPasswordValue);
    const includedTypeCount = Number(hasLetter) + Number(hasNumber) + Number(hasSpecial);
    const hasNoWhitespace = !/\s/.test(newPasswordValue);

    return {
      hasInput: newPasswordValue.length > 0,
      hasTypeCombination: includedTypeCount >= 2,
      hasValidLength: hasNoWhitespace && newPasswordValue.length >= 8 && newPasswordValue.length <= 32,
      hasNoTripleRepeat: !/(.)\1\1/.test(newPasswordValue),
    };
  }, [newPasswordValue]);

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
    showConfirmPassword,
    showCurrentPassword,
    showNewPassword,
    newPasswordValue,
    phoneValue,
    passwordRuleStatus,
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
    handleBirthDateChange,
    handlePhoneChange,
    toggleConfirmPasswordVisibility,
    toggleCurrentPasswordVisibility,
    toggleNewPasswordVisibility,
    startBirthDateEdit,
    startEmailEdit,
    startPasswordEdit,
    startPhoneEdit,
  };
};
