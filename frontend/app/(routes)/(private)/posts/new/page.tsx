'use client';

import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';

import { CiCalendar } from 'react-icons/ci';
import { RiTwitterXFill } from 'react-icons/ri';
import { RxWidth } from 'react-icons/rx';
import { IoIosArrowDown, IoMdCheckmark } from 'react-icons/io';
import { FaFacebookSquare, FaGithub, FaLinkedin } from 'react-icons/fa';
import { FiCheck, FiEye, FiHeart, FiList, FiMail, FiMessageCircle, FiMove, FiSave, FiTag } from 'react-icons/fi';
import {
  HiOutlineBold,
  HiOutlineChatBubbleLeftRight,
  HiOutlineCodeBracket,
  HiOutlineH1,
  HiOutlineH2,
  HiOutlineH3,
  HiOutlineItalic,
  HiOutlineLink,
  HiOutlineListBullet,
  HiOutlineNumberedList,
  HiOutlinePhoto,
  HiOutlineStrikethrough,
  HiOutlineUnderline,
} from 'react-icons/hi2';

import { renderMarkdownPreview } from './postCreate.utils';
import usePostCreateForm, { usePostCreatePage } from './postCreate.hooks';
import { PREVIEW_MODE_DETAIL, PREVIEW_MODE_LIST } from './postCreate.constants';

import styles from './PostCreate.module.css';
import postListStyles from '@/app/(routes)/(public)/main/components/postList/postList.module.css';

export default function PostCreatePage() {
  const { state, derived, data, handlers } = usePostCreateForm();
  const { title, categoryId, thumbnailUrl, content, tagInput, tags, tagLengthError, titleLengthError, previewMode } =
    state;
  const {
    categoryName,
    summary,
    dateLabel,
    timeAgoLabel,
    previewStats,
    authorName,
    draftButtonTitle,
    hasTagSuggestions,
  } = derived;
  const { categories, isLoading, tagSuggestions } = data;
  const {
    handleTitleChange,
    handleCategoryChange,
    handleThumbnailChange,
    handleContentChange,
    setContentValue,
    handlePreviewDetail,
    handlePreviewList,
    handleRemoveTag,
    handleTagKeyDown,
    handleTagChange,
    handleTagBlur,
    handleTagCompositionStart,
    handleTagCompositionEnd,
    handleTagSuggestionMouseDown,
    saveDraft,
    handleSave,
  } = handlers;
  const {
    refs: { splitRef, toolbarRef, contentRef, imageInputRef },
    split: { value: splitLeft, min: splitMin, max: splitMax, handlers: splitHandlers },
    toolbar: { isDragging: isToolbarDragging, handlers: toolbarHandlers },
    editor: {
      applyInlineWrap,
      applyCode,
      applyLink,
      handleHeadingClick,
      handleQuoteClick,
      handleBulletClick,
      handleNumberedClick,
      handleImageClick,
      handleImageSelect,
    },
  } = usePostCreatePage({ content, setContentValue });

  return (
    <section className={styles.container} aria-label="게시물 작성">
      <header className={styles.header}>
        <h1 className={styles.headerTitle}>새 게시물 작성</h1>
        <p className={styles.headerDescription}>카테고리와 태그를 설정하고 내용을 작성하세요.</p>
      </header>
      <nav
        ref={toolbarRef}
        className={styles.toolbar}
        aria-label="편집 메뉴"
        data-dragging={isToolbarDragging ? 'true' : 'false'}
        onPointerDown={toolbarHandlers.handlePointerDown}
        onPointerMove={toolbarHandlers.handlePointerMove}
        onPointerUp={toolbarHandlers.handlePointerUp}
        onPointerCancel={toolbarHandlers.handlePointerUp}
      >
        <span className={styles.toolbarHandle} aria-hidden="true">
          <FiMove />
        </span>
        <div className={styles.toolbarGroup}>
          <button
            type="button"
            className={styles.iconButton}
            aria-label="작성 미리보기"
            title="작성 미리보기"
            aria-pressed={previewMode === PREVIEW_MODE_DETAIL}
            onClick={handlePreviewDetail}
          >
            <FiEye aria-hidden />
          </button>
          <button
            type="button"
            className={styles.iconButton}
            aria-label="리스트 미리보기"
            title="리스트 미리보기"
            aria-pressed={previewMode === PREVIEW_MODE_LIST}
            onClick={handlePreviewList}
          >
            <FiList aria-hidden />
          </button>
        </div>
        <div className={styles.toolbarGroup}>
          <button
            type="button"
            className={styles.iconButton}
            aria-label={draftButtonTitle}
            title={draftButtonTitle}
            onClick={saveDraft}
          >
            <FiSave aria-hidden />
          </button>
          <button type="button" className={styles.iconButton} aria-label="저장" title="저장" onClick={handleSave}>
            <FiCheck aria-hidden />
          </button>
        </div>
      </nav>

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

          <div className={styles.metaRow}>
            <div className={styles.metaField}>
              <label className={styles.metaLabel} htmlFor="post-category">
                카테고리
              </label>
              <div className={styles.selectWrapper}>
                <select
                  id="post-category"
                  className={styles.metaControl}
                  value={categoryId}
                  onChange={handleCategoryChange}
                  disabled={isLoading}
                >
                  <option value="">카테고리를 선택하세요</option>
                  {(categories ?? []).map(category => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))}
                </select>
                <IoIosArrowDown className={styles.selectIcon} aria-hidden />
              </div>
            </div>

            <div className={styles.metaField}>
              <label className={styles.metaLabel} htmlFor="post-thumbnail">
                썸네일 URL
              </label>
              <input
                id="post-thumbnail"
                className={styles.metaControl}
                type="url"
                placeholder="https://"
                value={thumbnailUrl}
                onChange={handleThumbnailChange}
              />
            </div>
          </div>

          <div className={styles.metaField}>
            <label className={styles.metaLabel} htmlFor="post-tags">
              태그
            </label>
            <div className={`${styles.metaControl} ${styles.tagInput} ${tagLengthError ? styles.tagInputError : ''}`}>
              {tags.map(tag => (
                <button
                  key={tag}
                  type="button"
                  className={styles.tagChip}
                  onClick={() => handleRemoveTag(tag)}
                  aria-label={`태그 삭제: ${tag}`}
                >
                  #{tag}
                </button>
              ))}
              <input
                id="post-tags"
                className={styles.tagInputField}
                type="text"
                placeholder="태그 입력 후 스페이스/엔터"
                value={tagInput}
                onChange={handleTagChange}
                onKeyDown={handleTagKeyDown}
                onBlur={handleTagBlur}
                onCompositionStart={handleTagCompositionStart}
                onCompositionEnd={handleTagCompositionEnd}
              />
            </div>
            {hasTagSuggestions ? (
              <div className={styles.tagSuggestions} role="listbox" aria-label="태그 추천">
                {tagSuggestions.map(tag => (
                  <button
                    key={tag.id}
                    type="button"
                    className={styles.tagSuggestionItem}
                    onMouseDown={handleTagSuggestionMouseDown(tag.name)}
                  >
                    <span className={styles.tagSuggestionName}>#{tag.name}</span>
                    <span className={styles.tagSuggestionCount}>게시물 {tag.postCount.toLocaleString()}개</span>
                    <span className={styles.tagSuggestionIcon} aria-hidden="true">
                      <IoMdCheckmark />
                    </span>
                  </button>
                ))}
              </div>
            ) : null}
          </div>

          <div className={styles.headingToolbar} role="group" aria-label="서식 도구">
            <button
              type="button"
              className={styles.headingButton}
              aria-label="제목 1"
              title="제목 1"
              onClick={handleHeadingClick(1)}
            >
              <HiOutlineH1 aria-hidden="true" />
            </button>
            <button
              type="button"
              className={styles.headingButton}
              aria-label="제목 2"
              title="제목 2"
              onClick={handleHeadingClick(2)}
            >
              <HiOutlineH2 aria-hidden="true" />
            </button>
            <button
              type="button"
              className={styles.headingButton}
              aria-label="제목 3"
              title="제목 3"
              onClick={handleHeadingClick(3)}
            >
              <HiOutlineH3 aria-hidden="true" />
            </button>
            <span className={styles.headingSeparator} aria-hidden="true">
              |
            </span>
            <button
              type="button"
              className={styles.headingButton}
              aria-label="굵게"
              title="굵게"
              onClick={() => applyInlineWrap('**')}
            >
              <HiOutlineBold aria-hidden="true" />
            </button>
            <button
              type="button"
              className={styles.headingButton}
              aria-label="기울임"
              title="기울임"
              onClick={() => applyInlineWrap('_')}
            >
              <HiOutlineItalic aria-hidden="true" />
            </button>
            <button
              type="button"
              className={styles.headingButton}
              aria-label="밑줄"
              title="밑줄"
              onClick={() => applyInlineWrap('<u>', '</u>')}
            >
              <HiOutlineUnderline aria-hidden="true" />
            </button>
            <button
              type="button"
              className={styles.headingButton}
              aria-label="취소선"
              title="취소선"
              onClick={() => applyInlineWrap('~~')}
            >
              <HiOutlineStrikethrough aria-hidden="true" />
            </button>
            <span className={styles.headingSeparator} aria-hidden="true">
              |
            </span>
            <button
              type="button"
              className={styles.headingButton}
              aria-label="인용"
              title="인용"
              onClick={handleQuoteClick}
            >
              <HiOutlineChatBubbleLeftRight aria-hidden="true" />
            </button>
            <button type="button" className={styles.headingButton} aria-label="코드" title="코드" onClick={applyCode}>
              <HiOutlineCodeBracket aria-hidden="true" />
            </button>
            <span className={styles.headingSeparator} aria-hidden="true">
              |
            </span>
            <button type="button" className={styles.headingButton} aria-label="링크" title="링크" onClick={applyLink}>
              <HiOutlineLink aria-hidden="true" />
            </button>
            <button
              type="button"
              className={styles.headingButton}
              aria-label="이미지"
              title="이미지"
              onClick={handleImageClick}
            >
              <HiOutlinePhoto aria-hidden="true" />
            </button>
            <span className={styles.headingSeparator} aria-hidden="true">
              |
            </span>
            <button
              type="button"
              className={styles.headingButton}
              aria-label="불릿 리스트"
              title="불릿 리스트"
              onClick={handleBulletClick}
            >
              <HiOutlineListBullet aria-hidden="true" />
            </button>
            <button
              type="button"
              className={styles.headingButton}
              aria-label="번호 리스트"
              title="번호 리스트"
              onClick={handleNumberedClick}
            >
              <HiOutlineNumberedList aria-hidden="true" />
            </button>
          </div>
          <input
            ref={imageInputRef}
            className={styles.srOnly}
            type="file"
            accept="image/*"
            aria-label="이미지 파일 선택"
            onChange={handleImageSelect}
          />
          <div className={styles.contentHeader} aria-hidden="true" />

          <label className={styles.srOnly} htmlFor="post-content">
            본문
          </label>
          <textarea
            id="post-content"
            className={styles.editor}
            placeholder="본문 내용을 입력하세요"
            value={content}
            ref={contentRef}
            onChange={handleContentChange}
          />
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
          {previewMode === PREVIEW_MODE_DETAIL ? (
            <article className={styles.previewCard}>
              <div className={styles.previewHeadingBlock}>
                <div className={styles.previewTitleRow}>
                  <h2 className={styles.previewTitle}>
                    {title || '제목이 여기에 표시됩니다'}
                    {categoryName ? <span className={styles.previewCategoryInline}>({categoryName})</span> : null}
                  </h2>
                </div>
                <div className={styles.previewMeta}>
                  <span className={styles.previewMetaGroup}>
                    <span className={styles.previewMetaItem}>{authorName}</span>
                    <span className={styles.previewMetaSeparator} aria-hidden="true">
                      |
                    </span>
                    <span className={styles.previewMetaItem}>{dateLabel}</span>
                  </span>
                  <span className={styles.previewMetaGroup}>
                    <span className={styles.previewMetaItem}>
                      <FiEye aria-hidden="true" /> {previewStats.views.toLocaleString()}
                    </span>
                    <span className={styles.previewMetaSeparator} aria-hidden="true">
                      |
                    </span>
                    <span className={styles.previewMetaItem}>
                      <FiHeart aria-hidden="true" /> {previewStats.likeCount.toLocaleString()}
                    </span>
                    <span className={styles.previewMetaSeparator} aria-hidden="true">
                      |
                    </span>
                    <span className={styles.previewMetaItem}>
                      <FiMessageCircle aria-hidden="true" /> {previewStats.commentCount.toLocaleString()}
                    </span>
                  </span>
                </div>
              </div>
              <div className={styles.previewDivider} aria-hidden="true" />
              <div
                className={styles.previewThumb}
                style={thumbnailUrl ? { backgroundImage: `url(${thumbnailUrl})` } : undefined}
                data-empty={!thumbnailUrl}
              >
                {!thumbnailUrl && '썸네일 미리보기'}
              </div>
              <div className={styles.previewContent}>
                {content ? (
                  renderMarkdownPreview(content)
                ) : (
                  <p className={styles.previewSummary}>본문을 입력하면 요약이 여기에 표시됩니다.</p>
                )}
              </div>
              {tags.length > 0 ? (
                <div className={styles.previewTags}>
                  <span className={styles.previewTagIcon} aria-hidden="true">
                    <FiTag />
                  </span>
                  {tags.map(tag => (
                    <span key={tag} className={styles.previewTag}>
                      #{tag}
                    </span>
                  ))}
                </div>
              ) : null}
              <div className={styles.previewActionsRow}>
                <span className={styles.previewMetaActions}>
                  <span className={styles.previewMetaAction} role="img" aria-label="이메일">
                    <FiMail aria-hidden="true" />
                  </span>
                  <span className={styles.previewMetaAction} role="img" aria-label="깃허브">
                    <FaGithub aria-hidden="true" />
                  </span>
                  <span className={styles.previewMetaAction} role="img" aria-label="트위터">
                    <RiTwitterXFill aria-hidden="true" />
                  </span>
                  <span className={styles.previewMetaAction} role="img" aria-label="페이스북">
                    <FaFacebookSquare aria-hidden="true" />
                  </span>
                  <span className={styles.previewMetaAction} role="img" aria-label="링크드인">
                    <FaLinkedin aria-hidden="true" />
                  </span>
                </span>
              </div>
            </article>
          ) : (
            <article className={styles.listPreview}>
              <ul className={postListStyles.listView}>
                <li>
                  <article className={postListStyles.listItem}>
                    <div className={postListStyles.listBody}>
                      <h3>{title || '제목이 여기에 표시됩니다'}</h3>
                      <p className={postListStyles.summary}>{summary || '본문을 입력하면 요약이 여기에 표시됩니다.'}</p>
                      <div className={postListStyles.meta}>
                        <span className={postListStyles.metaGroup}>
                          <span className={postListStyles.metaItem}>
                            <CiCalendar aria-hidden="true" /> {dateLabel}
                          </span>
                          <span className={postListStyles.separator} aria-hidden="true">
                            |
                          </span>
                          <span className={postListStyles.metaItem}>{timeAgoLabel}</span>
                        </span>
                        <span className={postListStyles.metaGroup}>
                          <span className={postListStyles.metaItem}>
                            <FiEye aria-hidden="true" /> {previewStats.views.toLocaleString()}
                          </span>
                          <span className={postListStyles.separator} aria-hidden="true">
                            |
                          </span>
                          <span className={postListStyles.metaItem}>
                            <FiHeart aria-hidden="true" /> {previewStats.likeCount.toLocaleString()}
                          </span>
                          <span className={postListStyles.separator} aria-hidden="true">
                            |
                          </span>
                          <span className={postListStyles.metaItem}>
                            <FiMessageCircle aria-hidden="true" /> {previewStats.commentCount.toLocaleString()}
                          </span>
                        </span>
                      </div>
                    </div>
                    {thumbnailUrl ? (
                      <div
                        className={postListStyles.listThumb}
                        style={{ backgroundImage: `url(${thumbnailUrl})` }}
                        aria-hidden="true"
                      />
                    ) : null}
                  </article>
                </li>
                {Array.from({ length: 4 }).map((_, index) => (
                  <li key={`list-preview-skeleton-${index}`} aria-hidden="true">
                    <article className={postListStyles.listItem}>
                      <div className={postListStyles.listBody}>
                        <Skeleton height={22} width="68%" />
                        <Skeleton count={2} height={14} style={{ marginBottom: '6px' }} />
                        <div className={postListStyles.meta}>
                          <span className={postListStyles.metaGroup}>
                            <Skeleton width={120} height={12} />
                          </span>
                          <span className={postListStyles.metaGroup}>
                            <Skeleton width={160} height={12} />
                          </span>
                        </div>
                      </div>
                      <Skeleton height={150} width="100%" borderRadius={12} />
                    </article>
                  </li>
                ))}
              </ul>
            </article>
          )}
        </aside>
      </div>
    </section>
  );
}
