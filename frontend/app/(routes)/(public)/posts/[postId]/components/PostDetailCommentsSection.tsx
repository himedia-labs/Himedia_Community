import { Fragment } from 'react';

import Link from 'next/link';

import { FiClock, FiTrendingUp } from 'react-icons/fi';
import Skeleton from 'react-loading-skeleton';

import { PostDetailCommentItem } from '@/app/(routes)/(public)/posts/[postId]/components/PostDetailCommentItem';
import { PostDetailMentionLabel } from '@/app/(routes)/(public)/posts/[postId]/components/PostDetailMentionLabel';
import { PostDetailMentionRole } from '@/app/(routes)/(public)/posts/[postId]/components/PostDetailMentionRole';
import { createCommentFormSubmitHandler } from '@/app/(routes)/(public)/posts/[postId]/handlers';

import styles from '@/app/(routes)/(public)/posts/[postId]/PostDetail.module.css';

import type { PostDetailCommentsSectionProps } from '@/app/shared/types/postDetailComments';

/**
 * 댓글 섹션
 * @description 댓글 작성/목록/답글 렌더링과 상호작용 UI를 표시
 */
export const PostDetailCommentsSection = ({
  accessToken,
  commentCount,
  commentListRef,
  commentMentionQuery,
  commentMentionSuggestions,
  commentSort,
  commentTextareaRef,
  content,
  editingCommentId,
  editingContent,
  getFlattenedReplies,
  getReplyMentionSuggestions,
  getReplyState,
  handleCommentBlur,
  handleCommentBlock,
  handleCommentChange,
  handleCommentLikeToggle,
  handleCommentMenuToggle,
  handleCommentMentionSelect,
  handleCommentReport,
  handleCommentShare,
  handleCommentSortToggle,
  handleCommentSubmit,
  handleDeleteComment,
  handleEditCancel,
  handleEditChange,
  handleEditStart,
  handleEditSubmit,
  handleFollowToggle,
  handleReplyBlur,
  handleReplyCompositionEnd,
  handleReplyCompositionStart,
  handleReplyInput,
  handleReplyMentionSelect,
  handleReplySubmit,
  handleReplyToggle,
  hasEditingLengthError,
  hasLengthError,
  isCommentsLoading,
  isSubmitting,
  isUpdating,
  isAdmin,
  mentionRoleMap,
  openCommentMenuId,
  openRepliesIds,
  postAuthorId,
  postId,
  replyCountMap,
  setReplyFormRef,
  setReplyTextareaRef,
  shouldShowCommentMentions,
  syncReplyMentionQuery,
  topLevelComments,
}: PostDetailCommentsSectionProps) => {
  const commentSkeletons = Array.from({ length: 3 });
  const handleCommentFormSubmit = createCommentFormSubmitHandler(handleCommentSubmit);

  return (
    <section aria-label="댓글 작성">
      <div className={styles.commentHeader}>
        <h2 className={styles.commentTitle}>
          댓글 <span className={styles.commentCount}>{commentCount}</span>
        </h2>
      </div>
      <form className={styles.commentForm} onSubmit={handleCommentFormSubmit}>
        <div className={styles.commentTextareaWrapper}>
          <textarea
            className={`${styles.commentTextarea} ${hasLengthError ? styles.commentTextareaError : ''}`}
            name="comment"
            placeholder={
              accessToken
                ? '허위사실, 욕설, 사칭 등 댓글은 통보 없이 삭제될 수 있으며, 커뮤니티 운영정책에 따라 추가 조치가 이루어질 수 있습니다.'
                : '로그인 후 댓글을 작성할 수 있어요.'
            }
            ref={commentTextareaRef}
            value={content}
            onChange={handleCommentChange}
            onBlur={handleCommentBlur}
            disabled={!accessToken}
          />
          {shouldShowCommentMentions ? (
            <div className={styles.commentMentionList} role="listbox">
              {commentMentionSuggestions.map(name => (
                <button
                  key={name}
                  type="button"
                  role="option"
                  aria-selected="false"
                  className={styles.commentMentionItem}
                  onMouseDown={handleCommentMentionSelect(name)}
                >
                  <span className={styles.commentMentionAvatar} aria-hidden="true" />
                  <span className={styles.commentMentionTextGroup}>
                    <PostDetailMentionLabel name={name} query={commentMentionQuery} />
                  </span>
                  <PostDetailMentionRole name={name} mentionRoleMap={mentionRoleMap} />
                </button>
              ))}
            </div>
          ) : null}
        </div>
        <div className={styles.commentActions}>
          {!accessToken ? (
            <span className={styles.commentHint}>
              <Link href={`/login?reason=comment&redirect=/posts/${postId}`}>로그인</Link> 후 이용해주세요.
            </span>
          ) : hasLengthError ? (
            <span className={styles.commentError}>1,000자까지 입력 가능해요.</span>
          ) : null}
          <button
            type="submit"
            className={content.trim() ? `${styles.commentButton} ${styles.commentButtonActive}` : styles.commentButton}
            disabled={!accessToken || isSubmitting || hasLengthError}
          >
            댓글 남기기
          </button>
        </div>
      </form>
      <div className={styles.commentList} aria-live="polite" ref={commentListRef}>
        {isCommentsLoading ? (
          commentSkeletons.map((_, index) => (
            <div key={`comment-skeleton-${index}`} className={styles.commentItem} aria-hidden="true">
              <div className={styles.commentHeaderRow}>
                <Skeleton width={120} height={12} />
                <Skeleton width={60} height={12} />
              </div>
              <Skeleton height={16} count={2} />
            </div>
          ))
        ) : topLevelComments.length > 0 ? (
          <>
            <div className={styles.commentListHeader}>
              <div className={styles.commentSortGroup} role="tablist" aria-label="댓글 정렬">
                <button
                  type="button"
                  className={`${styles.commentSortButton} ${styles.commentSortActive}`}
                  onClick={handleCommentSortToggle}
                >
                  {commentSort === 'popular' ? (
                    <>
                      <FiTrendingUp className={styles.commentSortIcon} aria-hidden="true" />
                      인기순
                    </>
                  ) : (
                    <>
                      <FiClock className={styles.commentSortIcon} aria-hidden="true" />
                      최신순
                    </>
                  )}
                </button>
              </div>
            </div>
            {topLevelComments.map((comment, index) => (
              <Fragment key={comment.id}>
                {index > 0 ? <div className={styles.commentDividerLine} /> : null}
                <PostDetailCommentItem
                  accessToken={accessToken}
                  comment={comment}
                  editingCommentId={editingCommentId}
                  editingContent={editingContent}
                  getFlattenedReplies={getFlattenedReplies}
                  getReplyMentionSuggestions={getReplyMentionSuggestions}
                  getReplyState={getReplyState}
                  handleCommentBlock={handleCommentBlock}
                  handleCommentLikeToggle={handleCommentLikeToggle}
                  handleCommentMenuToggle={handleCommentMenuToggle}
                  handleCommentReport={handleCommentReport}
                  handleCommentShare={handleCommentShare}
                  handleDeleteComment={handleDeleteComment}
                  handleEditCancel={handleEditCancel}
                  handleEditChange={handleEditChange}
                  handleEditStart={handleEditStart}
                  handleEditSubmit={handleEditSubmit}
                  handleFollowToggle={handleFollowToggle}
                  handleReplyBlur={handleReplyBlur}
                  handleReplyCompositionEnd={handleReplyCompositionEnd}
                  handleReplyCompositionStart={handleReplyCompositionStart}
                  handleReplyInput={handleReplyInput}
                  handleReplyMentionSelect={handleReplyMentionSelect}
                  handleReplySubmit={handleReplySubmit}
                  handleReplyToggle={handleReplyToggle}
                  hasEditingLengthError={hasEditingLengthError}
                  isAdmin={isAdmin}
                  isUpdating={isUpdating}
                  mentionRoleMap={mentionRoleMap}
                  openCommentMenuId={openCommentMenuId}
                  openRepliesIds={openRepliesIds}
                  postAuthorId={postAuthorId}
                  replyCountMap={replyCountMap}
                  setReplyFormRef={setReplyFormRef}
                  setReplyTextareaRef={setReplyTextareaRef}
                  syncReplyMentionQuery={syncReplyMentionQuery}
                />
              </Fragment>
            ))}
          </>
        ) : null}
      </div>
    </section>
  );
};
