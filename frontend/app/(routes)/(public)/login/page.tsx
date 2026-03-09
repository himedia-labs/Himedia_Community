'use client';

import { useState } from 'react';

import Image from 'next/image';
import Link from 'next/link';
import { useQueryClient } from '@tanstack/react-query';
import { useRouter, useSearchParams } from 'next/navigation';

import { authKeys } from '@/app/api/auth/auth.keys';
import {
  useLoginMutation,
  useSendEmailVerificationCodeMutation,
  useRestoreWithdrawnAccountMutation,
} from '@/app/api/auth/auth.mutations';
import { useToast } from '@/app/shared/components/toast/toast';
import ActionModal from '@/app/shared/components/modal/ActionModal';
import { EMAIL_REGEX } from '@/app/shared/constants/config/auth.config';
import { LOGIN_WITHDRAW_MODAL_MESSAGES } from '@/app/shared/constants/messages/modal.message';

import {
  authenticateUser,
  createHandleEmailChange,
  createHandlePasswordChange,
  createHandleRestoreCodeChange,
  createHandleWithdrawnAccount,
  createHandleCloseWithdrawModal,
  createHandleSendRestoreCode,
  createHandleRestoreAccount,
} from '@/app/(routes)/(public)/login/_handlers';
import { useLoginRedirectToast } from '@/app/(routes)/(public)/login/_hooks/useLoginRedirectToast';

import styles from '@/app/(routes)/(public)/login/login.module.css';

/**
 * 로그인 페이지
 * @description 이메일/비밀번호 로그인을 처리
 */
export default function LoginPage() {
  // 라우트/쿼리
  const router = useRouter();
  const searchParams = useSearchParams();

  const reason = searchParams.get('reason');
  const redirectParam = searchParams.get('redirect');
  const redirectTo = redirectParam?.startsWith('/') ? redirectParam : '/';

  // 공통 훅
  const { showToast } = useToast();
  const queryClient = useQueryClient();
  const loginMutation = useLoginMutation();
  const restoreCodeMutation = useSendEmailVerificationCodeMutation();
  const restoreAccountMutation = useRestoreWithdrawnAccountMutation();

  // 폼 상태
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoginSubmitting, setIsLoginSubmitting] = useState(false);

  // 에러 상태
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [restoreCode, setRestoreCode] = useState('');
  const [restoreEmail, setRestoreEmail] = useState('');
  const [withdrawnMessage, setWithdrawnMessage] = useState('');
  const [isWithdrawnModalOpen, setIsWithdrawnModalOpen] = useState(false);
  const [isRestoreCodeSent, setIsRestoreCodeSent] = useState(false);

  // 입력 핸들러
  const handleEmailChange = createHandleEmailChange({
    emailError,
    setEmail,
    setEmailError,
    emailRegex: EMAIL_REGEX,
  });
  const handlePasswordChange = createHandlePasswordChange({
    passwordError,
    setPassword,
    setPasswordError,
  });
  const handleRestoreCodeChange = createHandleRestoreCodeChange(setRestoreCode);

  // 복구 핸들러
  const handleWithdrawnAccount = createHandleWithdrawnAccount({
    email,
    setRestoreCode,
    setRestoreEmail,
    setWithdrawnMessage,
    setIsRestoreCodeSent,
    setIsWithdrawnModalOpen,
  });
  const closeWithdrawModal = createHandleCloseWithdrawModal({
    isRestoreAccountPending: restoreAccountMutation.isPending,
    isRestoreCodePending: restoreCodeMutation.isPending,
    setRestoreCode,
    setIsRestoreCodeSent,
    setIsWithdrawnModalOpen,
  });
  const sendRestoreCode = createHandleSendRestoreCode({
    restoreEmail,
    showToast,
    setIsRestoreCodeSent,
    restoreCodeMutation,
  });
  const restoreAccount = createHandleRestoreAccount({
    authKeys,
    queryClient,
    redirectTo,
    restoreCode,
    restoreEmail,
    router,
    showToast,
    setRestoreCode,
    setIsRestoreCodeSent,
    setIsWithdrawnModalOpen,
    restoreAccountMutation,
  });

  // 로그인 핸들러
  const handleLogin = authenticateUser({
    email,
    password,
    isLoginSubmitting,
    setEmailError,
    setPasswordError,
    setIsLoginSubmitting,
    onWithdrawnAccount: handleWithdrawnAccount,
    redirectTo,
    loginMutation,
    showToast,
    queryClient,
    authKeys,
    router,
  });

  // 리다이렉트 안내
  useLoginRedirectToast({ reason, showToast });

  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <div className={styles.brand}>
          <Link href="/" className={styles.brandLink}>
            <span className={styles.brandMark}>
              <Image src="/icon/logo.png" alt="하이미디어아카데미 로고" fill priority sizes="90px" draggable={false} />
            </span>
            <span className={styles.brandText}>
              하이미디어커뮤니티
              <span className={styles.brandSub}>HIMEDIA COMMUNITY</span>
            </span>
          </Link>
        </div>
        <div className={styles.loginBox}>
          <h1 className={styles.title}>로그인</h1>

          <form onSubmit={handleLogin} className={styles.form}>
            <div className={styles.formGroup}>
              <label htmlFor="email" className={styles.label}>
                이메일 주소
              </label>
              <input
                type="email"
                id="email"
                value={email}
                disabled={isLoginSubmitting || loginMutation.isPending}
                onChange={handleEmailChange}
                className={emailError ? `${styles.input} ${styles.error}` : styles.input}
                autoComplete="username"
              />
              {emailError && <p className={styles.errorMessage}>{emailError}</p>}
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="password" className={styles.label}>
                비밀번호
              </label>
              <input
                type="password"
                id="password"
                value={password}
                disabled={isLoginSubmitting || loginMutation.isPending}
                onChange={handlePasswordChange}
                className={
                  passwordError
                    ? `${styles.input} ${styles.passwordInput} ${styles.error}`
                    : `${styles.input} ${styles.passwordInput}`
                }
                autoComplete="current-password"
              />
              {passwordError && <p className={styles.errorMessage}>{passwordError}</p>}
            </div>

            <div className={styles.footer}>
              <div className={styles.links}>
                <Link href="/register" className={styles.link} tabIndex={-1}>
                  회원가입
                </Link>
                <span className={styles.separator}>|</span>
                <Link href="/find-password" className={styles.link} tabIndex={-1}>
                  비밀번호 찾기
                </Link>
              </div>
              <button
                type="submit"
                className={styles.submitButton}
                disabled={isLoginSubmitting || loginMutation.isPending}
              >
                {isLoginSubmitting || loginMutation.isPending ? '로그인 중...' : '로그인'}
              </button>
            </div>
          </form>
        </div>
      </div>

      {isWithdrawnModalOpen ? (
        <ActionModal
          body={
            <div className={styles.withdrawRestoreBody}>
              <p className={styles.withdrawModalText}>{withdrawnMessage}</p>
              <div className={styles.withdrawRestoreRow}>
                <input
                  type="email"
                  className={`${styles.input} ${styles.withdrawRestoreEmailInput}`}
                  value={restoreEmail}
                  disabled
                  readOnly
                />
              </div>
              <input
                type="text"
                className={styles.input}
                value={restoreCode}
                maxLength={8}
                inputMode="text"
                placeholder={LOGIN_WITHDRAW_MODAL_MESSAGES.codePlaceholder}
                disabled={!isRestoreCodeSent || restoreAccountMutation.isPending}
                onChange={handleRestoreCodeChange}
              />
            </div>
          }
          title={LOGIN_WITHDRAW_MODAL_MESSAGES.title}
          cancelLabel={LOGIN_WITHDRAW_MODAL_MESSAGES.cancel}
          confirmLabel={LOGIN_WITHDRAW_MODAL_MESSAGES.confirm}
          cancelBorderless
          leftAction={
            <button
              type="button"
              className={styles.withdrawRestoreCodeButton}
              disabled={restoreCodeMutation.isPending || restoreAccountMutation.isPending}
              onClick={sendRestoreCode}
            >
              {isRestoreCodeSent ? LOGIN_WITHDRAW_MODAL_MESSAGES.resendCode : LOGIN_WITHDRAW_MODAL_MESSAGES.sendCode}
            </button>
          }
          cancelDisabled={restoreCodeMutation.isPending || restoreAccountMutation.isPending}
          confirmDisabled={!isRestoreCodeSent || !restoreCode.trim() || restoreAccountMutation.isPending}
          onClose={closeWithdrawModal}
          onConfirm={restoreAccount}
        />
      ) : null}
    </div>
  );
}
