import Link from 'next/link';

import { FaCheck } from 'react-icons/fa';
import { IoIosArrowDown } from 'react-icons/io';
import { TbExternalLink } from 'react-icons/tb';

import { COURSE_NAME, COURSE_TERM_OPTIONS } from '@/app/shared/constants/config/register.config';

import styles from '@/app/(routes)/(public)/register/register.module.css';

import type { RegisterStepTwoSectionProps } from '@/app/shared/types/register';

/**
 * 회원가입 2단계 섹션
 * @description 역할과 과정 정보, 개인정보 동의 입력 영역을 렌더링합니다.
 */
export default function RegisterStepTwoSection({
  role,
  courseTerm,
  privacyConsent,
  roleError,
  courseError,
  privacyError,
  isCourseDisabled,
  handlePrevStep,
  handleCourseSelectChange,
  handlePrivacyCheckboxChange,
  handlePrivacyLinkClick,
  handleRoleSelectChange,
}: RegisterStepTwoSectionProps) {
  return (
    <>
      <div className={styles.formGroup}>
        <label htmlFor="role" className={styles.label}>
          <span className={styles.labelText}>역할</span>
        </label>
        <div className={styles.selectWrapper}>
          <select id="role" value={role} onChange={handleRoleSelectChange} className={roleError ? `${styles.select} ${styles.error}` : styles.select}>
            <option value="">선택해주세요</option>
            <option value="trainee">훈련생</option>
            <option value="graduate">수료생</option>
            <option value="instructor">강사</option>
            <option value="mentor">멘토</option>
          </select>
          <IoIosArrowDown className={styles.selectIcon} aria-hidden />
        </div>
        {roleError ? <p className={styles.errorMessage}>{roleError}</p> : null}
      </div>
      <div className={styles.formGroup}>
        <div className={styles.formRow}>
          <div className={styles.formCol}>
            <label htmlFor="course" className={styles.label}>
              <span className={styles.labelText}>과정명</span>
            </label>
            <input type="text" id="course" value={COURSE_NAME} className={styles.input} disabled readOnly />
          </div>
          <div className={styles.formColAuto}>
            <label htmlFor="courseTerm" className={styles.label}>
              <span className={styles.labelText}>기수</span>
            </label>
            <div className={styles.selectWrapper}>
              <select
                id="courseTerm"
                value={courseTerm}
                onChange={handleCourseSelectChange}
                className={courseError ? `${styles.select} ${styles.error}` : styles.select}
                disabled={isCourseDisabled}
              >
                <option value="">선택</option>
                {COURSE_TERM_OPTIONS.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
              <IoIosArrowDown className={styles.selectIcon} aria-hidden />
            </div>
          </div>
        </div>
        {courseError ? <p className={styles.errorMessage}>{courseError}</p> : null}
      </div>
      <div className={styles.formGroup}>
        <div className={styles.consentWrapper}>
          <div className={styles.checkboxRow}>
            <label className={styles.checkboxBox}>
              <input type="checkbox" checked={privacyConsent} onChange={handlePrivacyCheckboxChange} className={styles.checkbox} />
              <FaCheck className={styles.checkboxIcon} aria-hidden />
            </label>
            <div className={`${styles.checkboxText} ${privacyError ? styles.checkboxTextError : ''}`}>
              <Link
                href="/docs/terms"
                className={`${styles.link} ${styles.consentLink}`}
                target="_blank"
                rel="noopener noreferrer"
                onClick={handlePrivacyLinkClick}
              >
                <span>[필수] 개인정보 수집 및 이용동의</span>
                <TbExternalLink aria-hidden className={styles.consentIcon} />
              </Link>
            </div>
          </div>
        </div>
      </div>
      <div className={styles.footer}>
        <div className={styles.links}>
          <Link href="/login" className={styles.link}>
            이미 계정이 있으신가요?
          </Link>
        </div>
        <div className={styles.stepActions}>
          <button type="button" className={styles.secondaryButton} onClick={handlePrevStep}>
            이전
          </button>
          <button type="submit" className={styles.submitButton}>
            회원가입
          </button>
        </div>
      </div>
    </>
  );
}
