import { isValidPassword } from '@/app/shared/utils/password';
import { EMAIL_REGEX } from '@/app/shared/constants/config/auth.config';
import { EMAIL_MESSAGES, REGISTER_MESSAGES } from '@/app/shared/constants/messages/auth.message';

import type { ChangeEvent } from 'react';
import type { RegisterInputHandlersParams } from '@/app/shared/types/auth';

/**
 * 회원가입 입력 핸들러 생성
 * @description 회원가입 페이지의 입력/선택/토글 이벤트를 생성
 */
export const createRegisterInputHandlers = (params: RegisterInputHandlersParams) => {
  /**
   * 이름 입력 변경
   * @description 이름 값을 반영하고 에러를 초기화
   */
  const handleNameInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    params.setFormField('name', event.target.value);
    if (params.nameError) params.setNameError('');
  };

  /**
   * 이메일 입력 변경
   * @description 이메일 상태와 인증 상태를 동기화
   */
  const handleEmailInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;

    params.setFormField('email', value);
    if (params.isEmailVerified || params.isEmailCodeSent || params.emailCode) {
      params.setIsEmailVerified(false);
      params.setIsEmailCodeSent(false);
      params.setEmailCode('');
      params.setEmailCodeError('');
    }

    if (!EMAIL_REGEX.test(value)) {
      params.setEmailError(EMAIL_MESSAGES.invalid);
    } else if (params.emailError) {
      params.setEmailError('');
    }
  };

  /**
   * 인증번호 입력 변경
   * @description 인증번호 값을 반영하고 에러를 초기화
   */
  const handleEmailCodeInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    params.setEmailCode(event.target.value);
    if (params.emailCodeError) params.setEmailCodeError('');
  };

  /**
   * 비밀번호 입력 변경
   * @description 비밀번호 값을 반영하고 형식 에러를 갱신
   */
  const handlePasswordInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;

    params.setFormField('password', value);
    if (value && !isValidPassword(value)) {
      params.setPasswordError(REGISTER_MESSAGES.invalidPassword);
      return;
    }
    params.setPasswordError('');
  };

  /**
   * 비밀번호 확인 입력 변경
   * @description 비밀번호 확인 값을 반영하고 에러를 초기화
   */
  const handlePasswordConfirmInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    params.setFormField('passwordConfirm', event.target.value);
    if (params.passwordConfirmError) params.setPasswordConfirmError('');
  };

  /**
   * 비밀번호 확인 입력 종료
   * @description 비밀번호 확인 에러를 초기화
   */
  const handlePasswordConfirmBlur = () => {
    if (params.passwordConfirmError) {
      params.setPasswordConfirmError('');
    }
  };

  /**
   * 역할 선택 변경
   * @description 역할 변경과 과정 선택 초기화/에러 초기화를 처리
   */
  const handleRoleSelectChange = (event: ChangeEvent<HTMLSelectElement>) => {
    const value = event.target.value;
    const shouldDisableCourse = value === 'instructor' || value === 'mentor';

    params.setFormField('role', value);
    if (shouldDisableCourse) {
      params.setFormField('course', '');
      params.setFormField('courseTerm', '');
    }
    if (params.roleError) params.setRoleError('');
    if (params.courseError) params.setCourseError('');
  };

  /**
   * 기수 선택 변경
   * @description 기수 값을 반영하고 에러를 초기화
   */
  const handleCourseSelectChange = (event: ChangeEvent<HTMLSelectElement>) => {
    params.setFormField('courseTerm', event.target.value);
    if (params.courseError) params.setCourseError('');
  };

  /**
   * 개인정보 동의 변경
   * @description 동의 상태를 반영하고 에러를 초기화
   */
  const handlePrivacyCheckboxChange = (event: ChangeEvent<HTMLInputElement>) => {
    params.setFormField('privacyConsent', event.target.checked);
    if (params.privacyError) params.setPrivacyError('');
  };

  /**
   * 개인정보 동의 링크 클릭
   * @description 입력값이 있으면 캐시 보존 플래그를 저장
   */
  const handlePrivacyLinkClick = () => {
    if (
      params.name ||
      params.email ||
      params.password ||
      params.phone ||
      params.role ||
      params.course ||
      params.courseTerm ||
      params.passwordConfirm ||
      params.birthDate
    ) {
      params.markKeepCache();
    }
  };

  /**
   * 이전 단계 이동
   * @description 회원가입 1단계로 이동
   */
  const handlePrevStep = () => {
    params.setStep(1);
  };

  return {
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
  };
};
