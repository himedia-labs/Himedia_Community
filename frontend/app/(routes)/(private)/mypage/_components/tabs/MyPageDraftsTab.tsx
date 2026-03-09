import { FiArrowDown, FiArrowUp } from 'react-icons/fi';

import MyPageDrafts from '@/app/(routes)/(private)/mypage/_components/MyPageDrafts';

import styles from '@/app/(routes)/(private)/mypage/MyPage.module.css';

import type { MyPageDraftsTabProps } from '@/app/shared/types/mypage';

/**
 * 임시저장 탭
 * @description 임시저장된 게시글 목록을 표시한다
 */
export default function MyPageDraftsTab({ draftSortOrder, onSortChange }: MyPageDraftsTabProps) {
  return (
    <div className={styles.postsMain}>
      <div className={styles.settingsRow}>
        <span className={styles.settingsLabel}>임시저장 목록</span>
        <div className={styles.settingsSortGroup}>
          <button
            type="button"
            className={`${styles.settingsSortButton} ${styles.settingsSortButtonActive}`}
            onClick={onSortChange}
          >
            {draftSortOrder === 'latest' ? (
              <>
                <FiArrowDown className={styles.settingsSortIcon} aria-hidden="true" />
                최근 저장순
              </>
            ) : (
              <>
                <FiArrowUp className={styles.settingsSortIcon} aria-hidden="true" />
                오래된 저장순
              </>
            )}
          </button>
        </div>
      </div>
      <MyPageDrafts sortOrder={draftSortOrder} />
    </div>
  );
}
