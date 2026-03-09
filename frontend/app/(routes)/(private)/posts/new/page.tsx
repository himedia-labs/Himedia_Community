'use client';

import { useCallback, useMemo } from 'react';

import { CiImport } from 'react-icons/ci';
import { FiLogOut, FiSave, FiSend } from 'react-icons/fi';
import { RxWidth } from 'react-icons/rx';
import { useRouter } from 'next/navigation';

import { useCurrentUserQuery } from '@/app/api/auth/auth.queries';
import { useCategoriesQuery } from '@/app/api/categories/categories.queries';
import { useFollowersQuery, useFollowingsQuery } from '@/app/api/follows/follows.queries';
import { usePostDetailQuery, usePostsQuery } from '@/app/api/posts/posts.queries';

import { PostDetailsForm, PostPreview } from '@/app/(routes)/(private)/posts/_components';
import {
  createHandleBoldClick,
  createHandleExit,
  createHandleItalicClick,
  createHandleSaveDraftClick,
  createHandleStrikeClick,
  createHandleUnderlineClick,
} from '@/app/(routes)/(private)/posts/_handlers/postCreate.handlers';
import { useDraftManager, usePostEditInitializer, usePostEditSaver } from '@/app/(routes)/(private)/posts/_hooks';
import { useMarkdownEditor } from '@/app/(routes)/(private)/posts/_hooks/useMarkdownEditor';
import { usePostForm } from '@/app/(routes)/(private)/posts/_hooks/usePostForm';
import { useTagInput } from '@/app/(routes)/(private)/posts/_hooks/useTagInput';
import { createExitHandler } from '@/app/(routes)/(private)/posts/edit/[postId]/handlers';

import EditorToolbar from '@/app/shared/components/markdown-editor/EditorToolbar';

import {
  DEFAULT_AUTHOR_NAME,
  DEFAULT_CATEGORY_LABEL,
  DEFAULT_PREVIEW_STATS,
} from '@/app/shared/constants/config/post.config';
import { useAuthStore } from '@/app/shared/store/authStore';
import { formatDateLabel } from '@/app/shared/utils/date';
import { renderMarkdownPreview } from '@/app/shared/utils/markdown';

import markdownEditorStyles from '@/app/shared/components/markdown-editor/markdownEditor.module.css';
import styles from '@/app/(routes)/(private)/posts/new/PostCreate.module.css';

import type { DraftData, PostComposerPageParams } from '@/app/shared/types/post';

/**
 * 게시물 작성 페이지
 * @description 작성/수정 폼과 미리보기를 제공
 */
export function PostCreatePage({
  draftId,
  mode = 'create',
  postId,
  headerDescription,
  headerTitle,
  sectionLabel,
  showDraftActions,
  submitLabel,
}: PostComposerPageParams) {
  // 라우트 훅
  const router = useRouter();
  const { accessToken } = useAuthStore();
  const isEditMode = mode === 'edit';

  // 기본 폼 상태
  const { state: formState, setters: formSetters, handlers: formHandlers } = usePostForm();
  const { title, categoryId, content, titleLengthError } = formState;
  const { setContent } = formSetters;
  const { applyPartial, handleTitleChange, handleCategoryChange, handleContentChange } = formHandlers;

  // 태그 입력
  const { state: tagState, data: tagData, setters: tagSetters, handlers: tagHandlers } = useTagInput();
  const { tagInput, tags, tagLengthError, hasTagSuggestions } = tagState;
  const { tagSuggestions } = tagData;
  const { setTags } = tagSetters;
  const {
    handleTagKeyDown,
    handleTagChange,
    handleTagBlur,
    handleTagCompositionStart,
    handleTagCompositionEnd,
    handleTagSuggestionMouseDown,
    handleRemoveTag,
  } = tagHandlers;

  const applyDraftData = useCallback(
    (data: Partial<DraftData>) => {
      applyPartial(data);
      if (data.tags !== undefined) setTags(data.tags);
    },
    [applyPartial, setTags],
  );

  // 작성/수정 데이터
  const {
    data: { draftList },
    handlers: { saveDraft, publishPost, openDraftList },
  } = useDraftManager({ title, categoryId, content, tags }, applyDraftData, !isEditMode, draftId);
  const { data: postDetail } = usePostDetailQuery(postId, { enabled: Boolean(isEditMode && accessToken && postId) });
  usePostEditInitializer({ postDetail, applyPartial, setTags });

  // 수정 저장
  const { handlePostUpdate } = usePostEditSaver({
    postId: postId ?? '',
    formData: { title, categoryId, content, tags },
  });

  // 마크다운 에디터
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
  } = useMarkdownEditor({ content, setContentValue: setContent });

  // 보조 데이터
  const { data: categories, isLoading } = useCategoriesQuery();
  const { data: currentUser } = useCurrentUserQuery();
  const currentUserId = currentUser?.id;
  const { data: followersData } = useFollowersQuery({ enabled: Boolean(accessToken) });
  const { data: followingsData } = useFollowingsQuery({ enabled: Boolean(accessToken) });
  const { data: myPostsData } = usePostsQuery(
    { authorId: currentUserId, status: 'PUBLISHED', sort: 'createdAt', order: 'DESC', page: 1, limit: 1 },
    { enabled: Boolean(accessToken && currentUserId) },
  );

  // 화면 파생값
  const categoryName = categories?.find(category => String(category.id) === categoryId)?.name ?? DEFAULT_CATEGORY_LABEL;
  const dateLabel = formatDateLabel(new Date());
  const previewStats = DEFAULT_PREVIEW_STATS;
  const authorName = DEFAULT_AUTHOR_NAME;
  const draftCount = draftList?.items?.length ?? 0;
  const authorStats = {
    postCount: myPostsData?.total ?? 0,
    followerCount: followersData?.length ?? 0,
    followingCount: followingsData?.length ?? 0,
  };
  const previewContent = useMemo(() => renderMarkdownPreview(content), [content]);
  // 액션 핸들러
  const handleExit = isEditMode ? createExitHandler(router, postId) : createHandleExit(router);
  const handleSubmit = isEditMode ? handlePostUpdate : publishPost;
  const handleSaveDraftClick = createHandleSaveDraftClick(saveDraft);
  const handleBoldClick = createHandleBoldClick(applyInlineWrap);
  const handleItalicClick = createHandleItalicClick(applyInlineWrap);
  const handleUnderlineClick = createHandleUnderlineClick(applyInlineWrap);
  const handleStrikeClick = createHandleStrikeClick(applyInlineWrap);

  return (
    <section className={styles.container} aria-label={sectionLabel}>
      <header className={styles.header}>
        <div className={styles.headerCopy}>
          <h1 className={styles.headerTitle}>{headerTitle}</h1>
          <p className={styles.headerDescription}>{headerDescription}</p>
        </div>
        <div className={styles.headerActions}>
          <button
            type="button"
            className={`${styles.headerAction} ${styles.headerActionText}`}
            aria-label={submitLabel}
            title={submitLabel}
            onClick={handleSubmit}
          >
            <span>{submitLabel}</span>
            <FiSend aria-hidden />
          </button>
        </div>
      </header>
      <div className={styles.split} ref={splitRef}>
        <form className={styles.form}>
          <label className={styles.srOnly} htmlFor="post-title">
            제목
          </label>
          <input
            id="post-title"
            className={`${styles.titleInput} ${titleLengthError ? styles.titleInputError : ''}`}
            type="text"
            placeholder="제목을 입력하세요"
            value={title}
            onChange={handleTitleChange}
          />

          <PostDetailsForm
            category={{
              categoryId,
              categories,
              isLoading,
              onCategoryChange: handleCategoryChange,
            }}
            tag={{
              tagInput,
              tags,
              tagLengthError,
              hasTagSuggestions,
              tagSuggestions,
              onTagChange: handleTagChange,
              onTagKeyDown: handleTagKeyDown,
              onTagBlur: handleTagBlur,
              onTagCompositionStart: handleTagCompositionStart,
              onTagCompositionEnd: handleTagCompositionEnd,
              onRemoveTag: handleRemoveTag,
              onTagSuggestionMouseDown: handleTagSuggestionMouseDown,
            }}
          />

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
            <label className={markdownEditorStyles.srOnly} htmlFor="post-content">
              본문
            </label>
            <textarea
              id="post-content"
              className={markdownEditorStyles.editor}
              placeholder="본문 내용을 입력하세요"
              value={content}
              ref={contentRef}
              onPaste={handleImagePaste}
              onChange={handleContentChange}
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
        >
          <span className={styles.splitHandleIcon} aria-hidden="true">
            <RxWidth />
          </span>
        </div>

        <aside className={styles.preview} aria-label="게시물 미리보기">
          <PostPreview
            title={title}
            categoryName={categoryName}
            authorName={authorName}
            dateLabel={dateLabel}
            authorStats={authorStats}
            previewStats={previewStats}
            content={
              content ? (
                previewContent
              ) : (
                <p className={styles.previewSummary}>본문을 입력하면 요약이 여기에 표시됩니다.</p>
              )
            }
            tags={tags}
          />
        </aside>
      </div>
      <footer className={styles.actionFooter}>
        <button
          type="button"
          className={`${styles.actionButton} ${styles.actionButtonExit}`}
          onClick={handleExit}
          aria-label="나가기"
        >
          <span className={styles.actionLabel}>나가기</span>
          <FiLogOut className={styles.actionIcon} aria-hidden="true" />
        </button>
        {showDraftActions && (
          <>
            <button
              type="button"
              className={styles.actionButton}
              aria-label={`임시저장 ${draftCount}개`}
              title="임시저장"
              onClick={handleSaveDraftClick}
            >
              <span className={styles.actionLabel}>저장하기</span>
              <FiSave className={`${styles.actionIcon} ${styles.actionIconSave}`} aria-hidden="true" />
              <span className={styles.footerDivider} aria-hidden="true">
                |
              </span>
              <span className={styles.footerCount}>{draftCount}</span>
            </button>
            <button type="button" className={styles.actionButton} onClick={openDraftList}>
              <span className={styles.actionLabel}>불러오기</span>
              <CiImport className={styles.actionIcon} aria-hidden="true" />
            </button>
          </>
        )}
      </footer>
    </section>
  );
}

export default function NewPostPage() {
  return (
    <PostCreatePage
      mode="create"
      headerDescription="카테고리와 태그를 설정하고 내용을 작성하세요."
      headerTitle="새 게시물 작성"
      sectionLabel="게시물 작성"
      showDraftActions
      submitLabel="게시하기"
    />
  );
}
