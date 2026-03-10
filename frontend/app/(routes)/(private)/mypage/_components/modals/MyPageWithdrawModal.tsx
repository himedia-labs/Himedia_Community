import { FiAlertCircle, FiEye, FiEyeOff } from 'react-icons/fi';

import ActionModal from '@/app/shared/components/modal/ActionModal';
import { createPasswordInputChangeHandler, createToggleWithdrawPasswordHandler } from '@/app/(routes)/(private)/mypage/_handlers';
import { WITHDRAW_MODAL_MESSAGES } from '@/app/shared/constants/messages/modal.message';

import styles from '@/app/(routes)/(private)/mypage/MyPage.module.css';

import type { MyPageAccountTabProps } from '@/app/shared/types/mypage';

/**
 * 회원탈퇴 모달
 * @description 탈퇴 안내와 비밀번호 확인 입력을 렌더링합니다.
 */
export default function MyPageWithdrawModal({
  isWithdrawing,
  showWithdrawPassword,
  withdrawPassword,
  closeWithdrawModal,
  handleWithdraw,
  setShowWithdrawPassword,
  setWithdrawPassword,
}: MyPageAccountTabProps) {
  const handleWithdrawPasswordChange = createPasswordInputChangeHandler(setWithdrawPassword);
  const handleToggleWithdrawPassword = createToggleWithdrawPasswordHandler(
    setShowWithdrawPassword,
    showWithdrawPassword,
  );

  return (
    <ActionModal
      body={
        <>
          <div className={styles.withdrawGuide}>
            <ul className={styles.withdrawGuideList}>
              {WITHDRAW_MODAL_MESSAGES.guides.map(guide => (
                <li key={guide} className={styles.withdrawGuideItem}>
                  {guide}
                </li>
              ))}
            </ul>
          </div>
          <div className={styles.withdrawGuideWarning}>
            <FiAlertCircle className={styles.withdrawGuideWarningIcon} aria-hidden="true" />
            {WITHDRAW_MODAL_MESSAGES.warning}
          </div>
          <p className={styles.settingsPasswordHint}>{WITHDRAW_MODAL_MESSAGES.description}</p>
          <div className={styles.settingsPasswordInputWrap}>
            <input
              type={showWithdrawPassword ? 'text' : 'password'}
              className={`${styles.settingsInput} ${styles.settingsPasswordInput} ${!showWithdrawPassword ? styles.settingsPasswordInputMasked : ''}`}
              value={withdrawPassword}
              placeholder={WITHDRAW_MODAL_MESSAGES.placeholder}
              autoComplete="current-password"
              disabled={isWithdrawing}
              onChange={handleWithdrawPasswordChange}
            />
            <button
              type="button"
              className={styles.settingsPasswordToggle}
              aria-label={showWithdrawPassword ? '현재 비밀번호 숨기기' : '현재 비밀번호 보기'}
              disabled={isWithdrawing}
              onClick={handleToggleWithdrawPassword}
            >
              {showWithdrawPassword ? (
                <FiEyeOff className={styles.settingsPasswordEye} aria-hidden="true" />
              ) : (
                <FiEye className={styles.settingsPasswordEye} aria-hidden="true" />
              )}
            </button>
          </div>
        </>
      }
      title={WITHDRAW_MODAL_MESSAGES.title}
      cancelLabel={WITHDRAW_MODAL_MESSAGES.cancel}
      confirmLabel={WITHDRAW_MODAL_MESSAGES.confirm}
      confirmVariant="danger"
      cancelDisabled={isWithdrawing}
      confirmDisabled={isWithdrawing}
      onClose={closeWithdrawModal}
      onConfirm={handleWithdraw}
    />
  );
}
