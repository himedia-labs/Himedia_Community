import { BIO_MAX_LENGTH } from '@/app/shared/constants/config/mypage.config';

import EmptyState from '@/app/shared/components/empty/EmptyState';
import EditorToolbar from '@/app/shared/components/markdown-editor/EditorToolbar';

import { MyPageIntroSkeleton } from '@/app/(routes)/(private)/mypage/MyPage.skeleton';

import styles from '@/app/(routes)/(private)/mypage/MyPage.module.css';
import markdownEditorStyles from '@/app/shared/components/markdown-editor/markdownEditor.module.css';
import markdownStyles from '@/app/shared/components/markdown-editor/markdown.module.css';

import type { MyPageSettingsTabProps } from '@/app/shared/types/mypage';

/**
 * 자기소개 탭
 * @description 사용자 자기소개를 작성/수정하는 화면
 */
export default function MyPageSettingsTab({
  bioPreview,
  isBioUpdating,
  isUserInfoLoading,
  profileBio,
  showBioEditor,
  userBio,
  bioEditorRef,
  bioImageInputRef,
  handlers,
  toolbar,
}: MyPageSettingsTabProps) {
  return (
    <div className={styles.settingsSection}>
      <div className={styles.settingsRow}>
        <span className={styles.settingsLabel}>소개</span>
        {!showBioEditor ? (
          <button type="button" className={styles.settingsButton} onClick={handlers.handleBioToggle}>
            {userBio ? '수정하기' : '작성하기'}
          </button>
        ) : null}
      </div>
      {showBioEditor ? (
        <div className={styles.settingsBody}>
          <div className={`${markdownEditorStyles.editorBox} ${styles.settingsEditorBox}`}>
            <EditorToolbar
              onHeading={toolbar.applyHeading}
              onBold={() => toolbar.applyInlineWrap('**')}
              onItalic={() => toolbar.applyInlineWrap('_')}
              onUnderline={() => toolbar.applyInlineWrap('<u>', '</u>')}
              onStrike={() => toolbar.applyInlineWrap('~~')}
              onQuote={toolbar.applyQuote}
              onCode={toolbar.applyCode}
              onLink={toolbar.applyLink}
              onImage={handlers.handleBioImageClick}
              onBullet={toolbar.applyBullet}
              onNumbered={toolbar.applyNumbered}
            />
            <input
              ref={bioImageInputRef}
              className={markdownEditorStyles.srOnly}
              type="file"
              accept="image/*"
              aria-label="자기소개 이미지 선택"
              onChange={handlers.handleBioImageSelect}
            />
            <label className={markdownEditorStyles.srOnly} htmlFor="profile-bio">
              자기소개
            </label>
            <textarea
              ref={bioEditorRef}
              id="profile-bio"
              className={`${markdownEditorStyles.editor} ${styles.settingsEditor}`}
              placeholder="자기소개를 입력하세요."
              value={profileBio}
              maxLength={BIO_MAX_LENGTH}
              onChange={handlers.handleBioChange}
              disabled={isBioUpdating}
            />
          </div>
          <div className={styles.settingsActions}>
            <button type="button" className={styles.settingsCancelButton} onClick={handlers.handleBioToggle}>
              닫기
            </button>
            <button
              type="button"
              className={styles.settingsSaveButton}
              onClick={handlers.handleBioSave}
              disabled={isBioUpdating}
            >
              저장
            </button>
          </div>
        </div>
      ) : isUserInfoLoading ? (
        <MyPageIntroSkeleton />
      ) : profileBio ? (
        <div className={markdownStyles.markdown}>{bioPreview}</div>
      ) : (
        <EmptyState
          title="아직 작성된 소개가 없습니다."
          description="자기소개를 작성하면 내 블로그 상단에 노출됩니다."
        />
      )}
    </div>
  );
}
