import { FiAlertCircle, FiChevronRight, FiEye, FiEyeOff } from 'react-icons/fi';

import ActionModal from '@/app/shared/components/modal/ActionModal';
import { MyPageAccountSkeleton } from '@/app/(routes)/(private)/mypage/MyPage.skeleton';
import {
  createPasswordInputChangeHandler,
  createToggleWithdrawPasswordHandler,
} from '@/app/(routes)/(private)/mypage/handlers';
import { EMAIL_VERIFICATION_CODE_LENGTH, PHONE_CONFIG } from '@/app/shared/constants/config/register.config';
import { WITHDRAW_MODAL_MESSAGES } from '@/app/shared/constants/messages/modal.message';

import styles from '@/app/(routes)/(private)/mypage/MyPage.module.css';

import type { MyPageAccountTabProps } from '@/app/shared/types/mypage';

/**
 * 계정 설정 탭
 * @description 사용자 계정 정보를 수정하는 화면
 */
export default function MyPageAccountTab({
  accountBirthDateValue,
  accountEmailValue,
  accountNameValue,
  accountPhoneValue,
  birthDateValue,
  confirmPasswordValue,
  currentPasswordValue,
  emailCodeValue,
  emailValue,
  isEditingAny,
  isEditingBirthDate,
  isEditingEmail,
  isEditingPassword,
  isEditingPhone,
  isEmailCodeSent,
  isEmailVerified,
  isSaving,
  isSendingEmailCode,
  isUserInfoLoading,
  isVerifyingEmailCode,
  isWithdrawing,
  isWithdrawModalOpen,
  newPasswordValue,
  passwordRuleStatus,
  phoneValue,
  showConfirmPassword,
  showCurrentPassword,
  showNewPassword,
  showWithdrawPassword,
  withdrawPassword,
  cancelEdit,
  closeWithdrawModal,
  handleBirthDateChange,
  handleEmailChange,
  handleEmailCodeChange,
  handlePhoneChange,
  handleWithdraw,
  openWithdrawModal,
  saveBirthDate,
  saveEmail,
  savePassword,
  savePhone,
  sendEmailVerificationCode,
  setConfirmPasswordValue,
  setCurrentPasswordValue,
  setNewPasswordValue,
  setShowWithdrawPassword,
  setWithdrawPassword,
  startBirthDateEdit,
  startEmailEdit,
  startPasswordEdit,
  startPhoneEdit,
  toggleConfirmPasswordVisibility,
  toggleCurrentPasswordVisibility,
  toggleNewPasswordVisibility,
}: MyPageAccountTabProps) {
  const handleWithdrawPasswordChange = createPasswordInputChangeHandler(setWithdrawPassword);
  const handleCurrentPasswordChange = createPasswordInputChangeHandler(setCurrentPasswordValue);
  const handleNewPasswordChange = createPasswordInputChangeHandler(setNewPasswordValue);
  const handleConfirmPasswordChange = createPasswordInputChangeHandler(setConfirmPasswordValue);
  const handleToggleWithdrawPassword = createToggleWithdrawPasswordHandler(
    setShowWithdrawPassword,
    showWithdrawPassword,
  );

  if (isUserInfoLoading) {
    return <MyPageAccountSkeleton />;
  }

  return (
    <>
      <div className={styles.settingsSection}>
        <div className={styles.settingsRow}>
          <span className={styles.settingsLabel}>계정 설정</span>
        </div>
        <div className={styles.settingsBlock}>
          <div className={styles.settingsBlockTitle}>기본 정보</div>
          <div className={styles.settingsGroup}>
            <div className={styles.settingsItem}>
              <div className={styles.settingsItemLabel}>이름</div>
              <div className={styles.settingsItemValue}>{accountNameValue}</div>
            </div>
            <div className={`${styles.settingsItem} ${styles.settingsItemEmail}`}>
              <div className={styles.settingsItemLabel}>이메일 주소</div>
              <div className={styles.settingsEmailContent}>
                {isEditingEmail ? (
                  <div className={styles.settingsEmailPanel}>
                    <div className={styles.settingsEmailFieldGroup}>
                      <div className={styles.settingsEmailInputRow}>
                        <input
                          type="email"
                          className={`${styles.settingsInput} ${styles.settingsItemInput}`}
                          value={emailValue}
                          placeholder="변경할 이메일 주소"
                          onChange={handleEmailChange}
                        />
                      </div>
                      <p className={styles.settingsEmailVerifyHint}>변경할 이메일로 인증번호를 발송해주세요.</p>
                    </div>

                    <div className={styles.settingsEmailFieldGroup}>
                      <div className={styles.settingsEmailInputRow}>
                        <input
                          type="text"
                          className={`${styles.settingsInput} ${styles.settingsItemInput} ${styles.settingsEmailCodeInput}`}
                          value={emailCodeValue}
                          placeholder="8자리 인증번호"
                          maxLength={EMAIL_VERIFICATION_CODE_LENGTH}
                          autoComplete="one-time-code"
                          disabled={!isEmailCodeSent || isSendingEmailCode || isEmailVerified || isVerifyingEmailCode}
                          onChange={handleEmailCodeChange}
                        />
                      </div>
                      <p className={styles.settingsEmailVerifyHint}>
                        {isEmailVerified
                          ? '이메일 인증이 완료되었습니다.'
                          : isEmailCodeSent
                            ? '인증번호 8자리를 입력하면 자동으로 확인됩니다.'
                            : '변경할 이메일로 인증번호를 발송해주세요.'}
                      </p>
                    </div>

                    <div className={styles.settingsEmailActionsRow}>
                      <button
                        type="button"
                        className={styles.settingsButton}
                        disabled={isSaving || isSendingEmailCode}
                        onClick={sendEmailVerificationCode}
                      >
                        {isEmailCodeSent ? '재전송' : '인증번호 발송'}
                      </button>
                      <span className={styles.settingsDivider} aria-hidden="true" />
                      <div className={`${styles.settingsInlineActions} ${styles.settingsInlineActionsInline}`}>
                        <button
                          type="button"
                          className={`${styles.settingsButton} ${styles.settingsInlineCancelButton}`}
                          disabled={isSaving}
                          onClick={cancelEdit}
                        >
                          취소
                        </button>
                        <button
                          type="button"
                          className={styles.settingsButton}
                          disabled={isSaving || !isEmailVerified}
                          onClick={saveEmail}
                        >
                          저장
                        </button>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className={styles.settingsEmailTop}>
                    <div className={styles.settingsItemValue}>{accountEmailValue}</div>
                    {!isEditingAny ? (
                      <button type="button" className={styles.settingsButton} disabled={isSaving} onClick={startEmailEdit}>
                        설정
                      </button>
                    ) : (
                      <span className={styles.settingsButtonPlaceholder} aria-hidden="true">
                        설정
                      </span>
                    )}
                  </div>
                )}
              </div>
            </div>
            <div className={`${styles.settingsItem} ${isEditingPassword ? styles.settingsItemPasswordEditing : ''}`}>
              <div className={styles.settingsItemLabel}>비밀번호</div>
              {isEditingPassword ? (
                <div className={styles.settingsPasswordPanel}>
                  <div className={styles.settingsPasswordFieldGroup}>
                    <div className={styles.settingsPasswordInputWrap}>
                      <input
                        type={showCurrentPassword ? 'text' : 'password'}
                        className={`${styles.settingsInput} ${styles.settingsItemInput} ${styles.settingsPasswordInput} ${
                          !showCurrentPassword ? styles.settingsPasswordInputMasked : ''
                        }`}
                        value={currentPasswordValue}
                        placeholder="현재 비밀번호"
                        onChange={handleCurrentPasswordChange}
                      />
                      <button
                        type="button"
                        className={styles.settingsPasswordToggle}
                        aria-label={showCurrentPassword ? '현재 비밀번호 숨기기' : '현재 비밀번호 보기'}
                        onClick={toggleCurrentPasswordVisibility}
                      >
                        {showCurrentPassword ? (
                          <FiEyeOff className={styles.settingsPasswordEye} aria-hidden="true" />
                        ) : (
                          <FiEye className={styles.settingsPasswordEye} aria-hidden="true" />
                        )}
                      </button>
                    </div>
                    <p className={styles.settingsPasswordHint}>확인을 위해 현재 비밀번호를 다시 입력해 주세요.</p>
                  </div>
                  <div className={styles.settingsPasswordFieldGroup}>
                    <div className={styles.settingsPasswordInputWrap}>
                      <input
                        type={showNewPassword ? 'text' : 'password'}
                        className={`${styles.settingsInput} ${styles.settingsItemInput} ${styles.settingsPasswordInput} ${
                          !showNewPassword ? styles.settingsPasswordInputMasked : ''
                        }`}
                        value={newPasswordValue}
                        placeholder="새 비밀번호"
                        onChange={handleNewPasswordChange}
                      />
                      <button
                        type="button"
                        className={styles.settingsPasswordToggle}
                        aria-label={showNewPassword ? '새 비밀번호 숨기기' : '새 비밀번호 보기'}
                        onClick={toggleNewPasswordVisibility}
                      >
                        {showNewPassword ? (
                          <FiEyeOff className={styles.settingsPasswordEye} aria-hidden="true" />
                        ) : (
                          <FiEye className={styles.settingsPasswordEye} aria-hidden="true" />
                        )}
                      </button>
                    </div>
                    <div className={styles.settingsPasswordRules}>
                      <p
                        className={`${styles.settingsPasswordRule} ${
                          passwordRuleStatus.hasInput
                            ? passwordRuleStatus.hasTypeCombination
                              ? styles.settingsPasswordRuleValid
                              : styles.settingsPasswordRuleInvalid
                            : ''
                        }`}
                      >
                        영문/숫자/특수문자 중, 2가지 이상 포함
                      </p>
                      <p
                        className={`${styles.settingsPasswordRule} ${
                          passwordRuleStatus.hasInput
                            ? passwordRuleStatus.hasValidLength
                              ? styles.settingsPasswordRuleValid
                              : styles.settingsPasswordRuleInvalid
                            : ''
                        }`}
                      >
                        8자 이상 32자 이하 입력 (공백 제외)
                      </p>
                      <p
                        className={`${styles.settingsPasswordRule} ${
                          passwordRuleStatus.hasInput
                            ? passwordRuleStatus.hasNoTripleRepeat
                              ? styles.settingsPasswordRuleValid
                              : styles.settingsPasswordRuleInvalid
                            : ''
                        }`}
                      >
                        연속 3자 이상 동일한 문자/숫자 제외
                      </p>
                    </div>
                  </div>
                  <div className={styles.settingsPasswordFieldGroup}>
                    <div className={styles.settingsPasswordInputWrap}>
                      <input
                        type={showConfirmPassword ? 'text' : 'password'}
                        className={`${styles.settingsInput} ${styles.settingsItemInput} ${styles.settingsPasswordInput} ${
                          !showConfirmPassword ? styles.settingsPasswordInputMasked : ''
                        }`}
                        value={confirmPasswordValue}
                        placeholder="새 비밀번호 확인"
                        onChange={handleConfirmPasswordChange}
                      />
                      <button
                        type="button"
                        className={styles.settingsPasswordToggle}
                        aria-label={showConfirmPassword ? '새 비밀번호 확인 숨기기' : '새 비밀번호 확인 보기'}
                        onClick={toggleConfirmPasswordVisibility}
                      >
                        {showConfirmPassword ? (
                          <FiEyeOff className={styles.settingsPasswordEye} aria-hidden="true" />
                        ) : (
                          <FiEye className={styles.settingsPasswordEye} aria-hidden="true" />
                        )}
                      </button>
                    </div>
                    <p className={styles.settingsPasswordHint}>확인을 위해 새 비밀번호를 다시 입력해 주세요.</p>
                  </div>
                  <div className={styles.settingsPasswordActionsRow}>
                    <div className={`${styles.settingsInlineActions} ${styles.settingsInlineActionsInline}`}>
                      <button
                        type="button"
                        className={`${styles.settingsButton} ${styles.settingsInlineCancelButton}`}
                        disabled={isSaving}
                        onClick={cancelEdit}
                      >
                        취소
                      </button>
                      <button
                        type="button"
                        className={styles.settingsButton}
                        disabled={isSaving}
                        onClick={savePassword}
                      >
                        저장
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                <>
                  <div className={`${styles.settingsItemValue} ${styles.settingsPasswordValueMask}`}>**********</div>
                  {!isEditingAny ? (
                    <button type="button" className={styles.settingsButton} onClick={startPasswordEdit}>
                      설정
                    </button>
                  ) : (
                    <span className={styles.settingsButtonPlaceholder} aria-hidden="true">
                      설정
                    </span>
                  )}
                </>
              )}
            </div>
            <div className={`${styles.settingsItem} ${styles.settingsItemEmail}`}>
              <div className={styles.settingsItemLabel}>전화번호</div>
              <div className={styles.settingsEmailContent}>
                <div className={styles.settingsEmailTop}>
                  {isEditingPhone ? (
                    <>
                      <input
                        type="tel"
                        className={`${styles.settingsInput} ${styles.settingsItemInput}`}
                        value={phoneValue}
                        placeholder="010 1234 5678"
                        maxLength={PHONE_CONFIG.FORMATTED_MAX_LENGTH}
                        onChange={handlePhoneChange}
                      />
                      <div className={`${styles.settingsInlineActions} ${styles.settingsInlineActionsInline}`}>
                        <button
                          type="button"
                          className={`${styles.settingsButton} ${styles.settingsInlineCancelButton}`}
                          disabled={isSaving}
                          onClick={cancelEdit}
                        >
                          취소
                        </button>
                        <button type="button" className={styles.settingsButton} disabled={isSaving} onClick={savePhone}>
                          저장
                        </button>
                      </div>
                    </>
                  ) : (
                    <>
                      <div className={styles.settingsItemValue}>{accountPhoneValue}</div>
                      {!isEditingAny ? (
                        <button type="button" className={styles.settingsButton} onClick={startPhoneEdit}>
                          설정
                        </button>
                      ) : (
                        <span className={styles.settingsButtonPlaceholder} aria-hidden="true">
                          설정
                        </span>
                      )}
                    </>
                  )}
                </div>
              </div>
            </div>
            <div className={`${styles.settingsItem} ${styles.settingsItemEmail}`}>
              <div className={styles.settingsItemLabel}>생년월일</div>
              <div className={styles.settingsEmailContent}>
                <div className={styles.settingsEmailTop}>
                  {isEditingBirthDate ? (
                    <>
                      <input
                        type="text"
                        className={`${styles.settingsInput} ${styles.settingsItemInput}`}
                        value={birthDateValue}
                        placeholder="YYYY-MM-DD"
                        inputMode="numeric"
                        maxLength={10}
                        onChange={handleBirthDateChange}
                      />
                      <div className={`${styles.settingsInlineActions} ${styles.settingsInlineActionsInline}`}>
                        <button
                          type="button"
                          className={`${styles.settingsButton} ${styles.settingsInlineCancelButton}`}
                          disabled={isSaving}
                          onClick={cancelEdit}
                        >
                          취소
                        </button>
                        <button
                          type="button"
                          className={styles.settingsButton}
                          disabled={isSaving}
                          onClick={saveBirthDate}
                        >
                          저장
                        </button>
                      </div>
                    </>
                  ) : (
                    <>
                      <div className={styles.settingsItemValue}>{accountBirthDateValue}</div>
                      {!isEditingAny ? (
                        <button type="button" className={styles.settingsButton} onClick={startBirthDateEdit}>
                          설정
                        </button>
                      ) : (
                        <span className={styles.settingsButtonPlaceholder} aria-hidden="true">
                          설정
                        </span>
                      )}
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className={styles.settingsFooter}>
          <button
            type="button"
            className={styles.withdrawButton}
            disabled={isWithdrawing}
            onClick={openWithdrawModal}
          >
            회원탈퇴 <FiChevronRight aria-hidden="true" />
          </button>
        </div>
      </div>

      {isWithdrawModalOpen ? (
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
                  className={`${styles.settingsInput} ${styles.settingsPasswordInput} ${
                    !showWithdrawPassword ? styles.settingsPasswordInputMasked : ''
                  }`}
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
      ) : null}
    </>
  );
}
