'use client';

import { useMemo } from 'react';
import { FiLogOut, FiSend } from 'react-icons/fi';
import Link from 'next/link';

import { useMarkdownEditor } from '@/app/(routes)/(private)/posts/_hooks/useMarkdownEditor';
import { useAdminNoticeCreateForm } from '@/app/(routes)/(private)/admin/notices/new/_hooks/useAdminNoticeCreateForm';
import {
  createHandleBoldClick,
  createHandleItalicClick,
  createHandleStrikeClick,
  createHandleUnderlineClick,
} from '@/app/(routes)/(private)/posts/_handlers/postCreate.handlers';

import EditorToolbar from '@/app/shared/components/markdown-editor/EditorToolbar';

import { formatDateLabel } from '@/app/shared/utils/date';
import { renderMarkdownPreview } from '@/app/shared/utils/markdown';

import markdownEditorStyles from '@/app/shared/components/markdown-editor/markdownEditor.module.css';
import markdownStyles from '@/app/shared/components/markdown-editor/markdown.module.css';
import styles from '@/app/(routes)/(private)/posts/new/PostCreate.module.css';

import type { ChangeEvent } from 'react';

// 타입 라벨
const NOTICE_TYPE_LABEL_MAP = {
  ANNOUNCEMENT: '공지사항',
  UPDATE: '업데이트',
} as const;

// 복귀 경로
const NOTICE_BACK_LINK_MAP = {
  ANNOUNCEMENT: '/admin?tab=notice-announcements',
  UPDATE: '/admin?tab=notice-updates',
} as const;

/**
 * 관리자 공지 작성 페이지
 * @description 일반 게시글 작성 화면 구조를 재사용해 공지와 업데이트를 작성합니다.
 */
export default function AdminNoticeCreatePage() {
  // 작성 상태
  const {
    state: { title, version, releaseType, releaseScope, publishedAt, markdownContent, noticeType, isEditMode, isSubmitting },
    setters: { setTitle, setReleaseType, setReleaseScope, setPublishedAt, setMarkdownContent },
    handlers: { handleSubmit },
  } = useAdminNoticeCreateForm();

  // 에디터 상태
  const {
    refs: { splitRef, contentRef, imageInputRef },
    split: { value: splitLeft, min: splitMin, max: splitMax, handlers: splitHandlers },
    editor: {
      applyInlineWrap,
      applyCode,
      applyLink,
      handleHeadingClick,
      handleQuoteClick,
      handleBulletClick,
      handleNumberedClick,
      handleImageClick,
      handleImagePaste,
      handleImageSelect,
    },
  } = useMarkdownEditor({ content: markdownContent, setContentValue: setMarkdownContent });

  // 화면 파생값
  const dateLabel = formatDateLabel(new Date());
  const noticeTypeLabel = NOTICE_TYPE_LABEL_MAP[noticeType];
  const submitLabel = isEditMode ? '수정하기' : '등록하기';
  const submittingLabel = isEditMode ? '수정 중...' : '등록 중...';
  const previewContent = useMemo(() => renderMarkdownPreview(markdownContent), [markdownContent]);
  const backLinkHref = NOTICE_BACK_LINK_MAP[noticeType];

  // 입력 핸들러
  const handleTitleChange = (event: ChangeEvent<HTMLInputElement>) => setTitle(event.target.value);
  const handleReleaseTypeChange = (event: ChangeEvent<HTMLSelectElement>) => setReleaseType(event.target.value);
  const handleReleaseScopeChange = (event: ChangeEvent<HTMLSelectElement>) => setReleaseScope(event.target.value);
  const handlePublishedAtChange = (event: ChangeEvent<HTMLInputElement>) => setPublishedAt(event.target.value);
  const handleMarkdownContentChange = (event: ChangeEvent<HTMLTextAreaElement>) =>
    setMarkdownContent(event.target.value);
  const handleBoldClick = createHandleBoldClick(applyInlineWrap);
  const handleItalicClick = createHandleItalicClick(applyInlineWrap);
  const handleUnderlineClick = createHandleUnderlineClick(applyInlineWrap);
  const handleStrikeClick = createHandleStrikeClick(applyInlineWrap);

  return (
    <section className={styles.container} aria-label={`${noticeTypeLabel} 작성`}>
      <header className={styles.header}>
        <div className={styles.headerCopy}>
          <h1 className={styles.headerTitle}>{noticeTypeLabel} 글 {isEditMode ? '수정' : '작성'}</h1>
        </div>
        <div className={styles.headerActions}>
          <button
            type="button"
            className={`${styles.headerAction} ${styles.headerActionText}`}
            aria-label={submitLabel}
            title={submitLabel}
            disabled={isSubmitting}
            onClick={handleSubmit}
          >
            <span>{isSubmitting ? submittingLabel : submitLabel}</span>
            <FiSend aria-hidden="true" />
          </button>
        </div>
      </header>

      <div className={styles.split} ref={splitRef}>
        <form className={styles.form} onSubmit={e => e.preventDefault()}>
          <label className={styles.srOnly} htmlFor="admin-notice-title">
            제목
          </label>
          <input
            id="admin-notice-title"
            className={styles.titleInput}
            type="text"
            placeholder="제목을 입력하세요"
            value={title}
            onChange={handleTitleChange}
          />

          {noticeType === 'UPDATE' ? (
            <>
              <div className={styles.metaRow}>
                <div className={styles.metaField}>
                  <label className={styles.metaLabel} htmlFor="admin-notice-version">
                    버전
                  </label>
                  <input
                    id="admin-notice-version"
                    className={styles.metaControl}
                    type="text"
                    placeholder="예: v1.4.0"
                    value={version}
                    readOnly
                  />
                </div>
                <div className={styles.metaField}>
                  <label className={styles.metaLabel} htmlFor="admin-notice-published-at">
                    날짜
                  </label>
                  <input
                    id="admin-notice-published-at"
                    className={styles.metaControl}
                    type="date"
                    value={publishedAt}
                    onChange={handlePublishedAtChange}
                  />
                </div>
              </div>

              <div className={styles.metaRow}>
                <div className={styles.metaField}>
                  <label className={styles.metaLabel} htmlFor="admin-notice-release-type">
                    릴리즈 타입
                  </label>
                  <select
                    id="admin-notice-release-type"
                    className={styles.metaControl}
                    value={releaseType}
                    onChange={handleReleaseTypeChange}
                  >
                    <option value="">선택하세요</option>
                    <option value="Feature">Feature (기능 추가)</option>
                    <option value="Improvement">Improvement (개선)</option>
                    <option value="Bugfix">Bugfix (버그 수정)</option>
                    <option value="Hotfix">Hotfix (긴급 수정)</option>
                    <option value="Security">Security (보안)</option>
                    <option value="Refactor">Refactor (리팩토링)</option>
                    <option value="Deprecation">Deprecation (지원 종료)</option>
                  </select>
                </div>
                <div className={styles.metaField}>
                  <label className={styles.metaLabel} htmlFor="admin-notice-release-scope">
                    릴리즈 범위
                  </label>
                  <select
                    id="admin-notice-release-scope"
                    className={styles.metaControl}
                    value={releaseScope}
                    onChange={handleReleaseScopeChange}
                  >
                    <option value="">선택하세요</option>
                    <option value="Frontend">Frontend</option>
                    <option value="Backend">Backend</option>
                    <option value="Full Stack">Full Stack</option>
                    <option value="DevOps">DevOps</option>
                  </select>
                </div>
              </div>
            </>
          ) : null}

          <div className={markdownEditorStyles.editorBox}>
            <EditorToolbar
              onHeading={handleHeadingClick}
              onBold={handleBoldClick}
              onItalic={handleItalicClick}
              onUnderline={handleUnderlineClick}
              onStrike={handleStrikeClick}
              onQuote={handleQuoteClick}
              onCode={applyCode}
              onLink={applyLink}
              onImage={handleImageClick}
              onBullet={handleBulletClick}
              onNumbered={handleNumberedClick}
            />
            <input
              ref={imageInputRef}
              className={markdownEditorStyles.srOnly}
              type="file"
              accept="image/*"
              aria-label="이미지 파일 선택"
              onChange={handleImageSelect}
            />
            <label className={markdownEditorStyles.srOnly} htmlFor="admin-notice-content">
              본문
            </label>
            <textarea
              id="admin-notice-content"
              ref={contentRef}
              className={markdownEditorStyles.editor}
              placeholder={`${noticeTypeLabel} 본문을 입력하세요`}
              value={markdownContent}
              onPaste={handleImagePaste}
              onChange={handleMarkdownContentChange}
            />
          </div>
        </form>

        <div
          className={styles.splitHandle}
          role="separator"
          aria-orientation="vertical"
          aria-valuemin={splitMin}
          aria-valuemax={splitMax}
          aria-valuenow={Math.round(splitLeft)}
          onPointerDown={splitHandlers.handlePointerDown}
          onPointerMove={splitHandlers.handlePointerMove}
          onPointerUp={splitHandlers.handlePointerUp}
          onPointerCancel={splitHandlers.handlePointerUp}
        />

        <aside className={styles.preview} aria-label={`${noticeTypeLabel} 미리보기`}>
          {noticeType === 'ANNOUNCEMENT' ? (
            <article className={styles.postPreview}>
              <div className={styles.previewHeadingBlock}>
                <div className={styles.previewTitleRow}>
                  <h2 className={styles.previewTitle}>{title || '제목이 여기에 표시됩니다'}</h2>
                </div>
                <div className={styles.previewMeta}>
                  <span className={styles.previewMetaGroup}>
                    <span className={styles.previewMetaItem}>{dateLabel}</span>
                  </span>
                </div>
              </div>
              <div className={`${styles.previewContent} ${markdownStyles.markdown}`}>
                {markdownContent ? (
                  previewContent
                ) : (
                  <p className={styles.previewSummary}>본문을 입력하면 미리보기가 여기에 표시됩니다.</p>
                )}
              </div>
            </article>
          ) : (
            <article className={styles.postPreview}>
              <div className={styles.previewHeadingBlock}>
                <div className={styles.previewTitleRow}>
                  <h2 className={styles.previewTitle}>{title || '제목이 여기에 표시됩니다'}</h2>
                </div>
                <div className={styles.previewMeta}>
                  <span className={styles.previewMetaGroup}>
                    <span className={styles.previewMetaItem}>{dateLabel}</span>
                  </span>
                </div>
              </div>
              <div className={`${styles.previewContent} ${markdownStyles.markdown}`}>
                {markdownContent ? (
                  previewContent
                ) : (
                  <p className={styles.previewSummary}>본문을 입력하면 미리보기가 여기에 표시됩니다.</p>
                )}
              </div>
            </article>
          )}
        </aside>
      </div>

      <footer className={styles.actionFooter}>
        <Link href={backLinkHref} className={`${styles.actionButton} ${styles.actionButtonExit}`}>
          <span className={styles.actionLabel}>나가기</span>
          <FiLogOut className={styles.actionIcon} aria-hidden="true" />
        </Link>
        <button type="button" className={styles.actionButton} disabled={isSubmitting} onClick={handleSubmit}>
          <span className={styles.actionLabel}>{isSubmitting ? submittingLabel : submitLabel}</span>
          <FiSend className={styles.actionIcon} aria-hidden="true" />
        </button>
      </footer>
    </section>
  );
}
