import Link from 'next/link';

import { RxInfoCircled } from 'react-icons/rx';

import { BIRTH_DATE_CONFIG, EMAIL_VERIFICATION_CODE_LENGTH, PHONE_CONFIG } from '@/app/shared/constants/config/register.config';

import styles from '@/app/(routes)/(public)/register/register.module.css';

import type { RegisterStepOneSectionProps } from '@/app/shared/types/register';

/**
 * 회원가입 1단계 섹션
 * @description 기본 정보와 이메일 인증 입력 영역을 렌더링합니다.
 */
export default function RegisterStepOneSection({
  name,
  email,
  emailCode,
  birthDate,
  password,
  passwordConfirm,
  phone,
  nameError,
  emailError,
  emailCodeError,
  birthDateError,
  passwordError,
  passwordConfirmError,
  phoneError,
  isEmailVerified,
  isEmailCodeSent,
  isStepOneActionDisabled,
  isSendingCode,
  isVerifyingCode,
  stepOneActionLabel,
  handleBirthDateChange,
  handleEmailInputChange,
  handleEmailCodeInputChange,
  handleNameInputChange,
  handlePasswordConfirmBlur,
  handlePasswordConfirmInputChange,
  handlePasswordInputChange,
  handlePhoneChange,
  handleNextStep,
  handleSendEmailCode,
}: RegisterStepOneSectionProps) {
  return (
    <>
      <div className={styles.formGroup}>
        <label htmlFor="name" className={styles.label}>
          <span className={styles.labelText}>이름 (본명)</span>
        </label>
        <input type="text" id="name" value={name} onChange={handleNameInputChange} className={nameError ? `${styles.input} ${styles.error}` : styles.input} autoComplete="name" />
        {nameError ? <p className={styles.errorMessage}>{nameError}</p> : null}
      </div>
      <div className={styles.formGroup}>
        <label htmlFor="email" className={styles.label}>
          <span className={styles.labelText}>이메일 주소</span>
          <span className={isEmailVerified ? `${styles.labelHint} ${styles.labelHintVerified}` : styles.labelHint}>
            ({isEmailVerified ? '인증 완료' : '미인증'})
          </span>
        </label>
        <input
          type="email"
          id="email"
          value={email}
          onChange={handleEmailInputChange}
          className={emailError ? `${styles.input} ${styles.error}` : styles.input}
          autoComplete="username"
          disabled={isEmailVerified}
        />
        {emailError ? <p className={styles.errorMessage}>{emailError}</p> : null}
      </div>
      {isEmailCodeSent ? (
        <div className={styles.formGroup}>
          <label htmlFor="emailCode" className={styles.label}>
            <span className={styles.labelText}>인증번호</span>
          </label>
          <input
            type="text"
            id="emailCode"
            value={emailCode}
            onChange={handleEmailCodeInputChange}
            className={emailCodeError ? `${styles.input} ${styles.error}` : isEmailVerified ? styles.input : `${styles.input} ${styles.codeInput}`}
            placeholder="8자리 인증번호"
            maxLength={EMAIL_VERIFICATION_CODE_LENGTH}
            autoComplete="one-time-code"
            autoFocus
            disabled={isEmailVerified}
          />
          {emailCodeError ? (
            <p className={styles.errorMessage}>{emailCodeError}</p>
          ) : !isEmailVerified ? (
            <p className={styles.infoMessage}>이메일로 발송된 인증번호를 입력해주세요</p>
          ) : null}
        </div>
      ) : null}
      <div className={styles.formGroup}>
        <label htmlFor="birthDate" className={styles.label}>
          <span className={styles.labelText}>생년월일</span>
        </label>
        <input
          type="text"
          id="birthDate"
          value={birthDate}
          onChange={handleBirthDateChange}
          className={birthDateError ? `${styles.input} ${styles.error}` : styles.input}
          placeholder="YYYY-MM-DD"
          inputMode="numeric"
          maxLength={BIRTH_DATE_CONFIG.FORMATTED_MAX_LENGTH}
          autoComplete="bday"
        />
        {birthDateError ? <p className={styles.errorMessage}>{birthDateError}</p> : null}
      </div>
      <div className={styles.formGroup}>
        <label htmlFor="password" className={styles.label}>
          <span className={styles.labelText}>비밀번호</span>
        </label>
        <input
          type="password"
          id="password"
          value={password}
          onChange={handlePasswordInputChange}
          className={passwordError ? `${styles.input} ${styles.passwordInput} ${styles.error}` : `${styles.input} ${styles.passwordInput}`}
          autoComplete="new-password"
        />
        {passwordError ? <p className={styles.errorMessage}>{passwordError}</p> : null}
      </div>
      <div className={styles.formGroup}>
        <label htmlFor="passwordConfirm" className={styles.label}>
          <span className={styles.labelText}>비밀번호 확인</span>
        </label>
        <input
          type="password"
          id="passwordConfirm"
          value={passwordConfirm}
          onChange={handlePasswordConfirmInputChange}
          onBlur={handlePasswordConfirmBlur}
          className={passwordConfirmError ? `${styles.input} ${styles.passwordInput} ${styles.error}` : `${styles.input} ${styles.passwordInput}`}
          autoComplete="new-password"
        />
        {passwordConfirmError ? <p className={styles.errorMessage}>{passwordConfirmError}</p> : null}
      </div>
      <div className={styles.formGroup}>
        <label htmlFor="phone" className={styles.label}>
          <span className={styles.labelText}>전화번호</span>
          <span className={styles.infoIcon} role="img" aria-label="전화번호 안내" data-tooltip="전화번호는 계정 보호 및 고객 지원을 위해 사용됩니다.">
            <RxInfoCircled aria-hidden="true" />
          </span>
        </label>
        <input
          type="tel"
          id="phone"
          value={phone}
          onChange={handlePhoneChange}
          className={phoneError ? `${styles.input} ${styles.error}` : styles.input}
          placeholder="010 1234 5678"
          maxLength={PHONE_CONFIG.FORMATTED_MAX_LENGTH}
          autoComplete="tel"
        />
        {phoneError ? <p className={styles.errorMessage}>{phoneError}</p> : null}
      </div>
      <div className={styles.footer}>
        <div className={styles.links}>
          <Link href="/login" className={styles.link}>
            이미 계정이 있으신가요?
          </Link>
          {isEmailCodeSent && !isEmailVerified ? (
            <>
              <span className={styles.separator}>|</span>
              <button
                type="button"
                className={`${styles.link} ${styles.linkButton}`}
                disabled={isSendingCode || isVerifyingCode}
                onClick={handleSendEmailCode}
              >
                재전송
              </button>
            </>
          ) : null}
        </div>
        <button
          type="button"
          className={styles.submitButton}
          disabled={isStepOneActionDisabled}
          onClick={isEmailVerified ? handleNextStep : handleSendEmailCode}
        >
          {stepOneActionLabel}
        </button>
      </div>
    </>
  );
}
