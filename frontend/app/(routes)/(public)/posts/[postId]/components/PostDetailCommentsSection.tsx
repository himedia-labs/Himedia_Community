import { Fragment } from 'react';

import Image from 'next/image';
import Link from 'next/link';

import { FaHeart } from 'react-icons/fa';
import { FaUser } from 'react-icons/fa6';
import NumberFlow from '@number-flow/react';
import {
  FiClock,
  FiEdit2,
  FiFlag,
  FiHeart,
  FiSlash,
  FiTrash2,
  FiTrendingUp,
  FiMessageCircle,
  FiMoreHorizontal,
  FiCornerDownRight,
  FiShare2,
} from 'react-icons/fi';
import Skeleton from 'react-loading-skeleton';

import { isCommentContentTooLong } from '@/app/shared/utils/comment';
import { formatDate } from '@/app/shared/utils/date';
import {
  formatRole,
  getMentionHighlightSegments,
  splitCommentMentions,
} from '@/app/(routes)/(public)/posts/[postId]/utils';
import {
  createCommentFormSubmitHandler,
  createCommentItemActionHandlers,
} from '@/app/(routes)/(public)/posts/[postId]/handlers';

import styles from '@/app/(routes)/(public)/posts/[postId]/PostDetail.module.css';

import type { CommentItem } from '@/app/shared/types/comment';
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
  // 파생 데이터
  const commentSkeletons = Array.from({ length: 3 });

  /**
   * 멘션 이름 렌더링
   * @description 검색어와 일치하는 멘션 텍스트를 강조해 출력
   */
  const renderMentionLabel = (name: string, query: string | null) => {
    const segments = getMentionHighlightSegments(name, query);

    return (
      <span className={styles.commentMentionName}>
        {segments.map((segment, index) =>
          segment.type === 'match' ? (
            <span key={`${segment.value}-${index}`} className={styles.commentMentionMatch}>
              {segment.value}
            </span>
          ) : (
            <Fragment key={`${segment.value}-${index}`}>{segment.value}</Fragment>
          ),
        )}
      </span>
    );
  };

  /**
   * 멘션 역할 렌더링
   * @description 멘션 사용자 역할 라벨을 표시
   */
  const renderMentionRole = (name: string) => {
    const role = mentionRoleMap.get(name);
    return role ? <span className={styles.commentMentionRole}>{role}</span> : null;
  };

  /**
   * 댓글 아이템 렌더링
   * @description 단일 댓글/답글 UI를 재귀적으로 출력
   */
  const renderCommentItem = (comment: CommentItem, isReply = false, depth = 0, rootId?: string) => {
    const rootCommentId = rootId ?? comment.id;
    const replies = depth === 0 ? getFlattenedReplies(comment.id) : [];
    const canIndent = isReply;
    const shouldIndent = isReply && depth === 1;
    const replyCount = replyCountMap.get(comment.id) ?? 0;
    const isAuthor = Boolean(comment.author?.id && comment.author.id === postAuthorId);
    const isRepliesOpen = openRepliesIds.includes(rootCommentId);
    const replyState = getReplyState(rootCommentId);
    const replyMentionList = getReplyMentionSuggestions(replyState.mentionQuery);
    const isReplyMentionOpen = replyMentionList.length > 0 && replyState.mentionQuery !== null;
    const hasReplyLengthError = isCommentContentTooLong(replyState.content);
    const {
      handleMenuToggleClick,
      handleEditStartClick,
      handleDeleteClick,
      handleFollowClick,
      handleEditSubmitClick,
      handleLikeToggleClick,
      handleReplyToggleClick,
      handleShareClick,
      handleReplySubmitClick,
    } = createCommentItemActionHandlers({
      comment,
      isReply,
      rootCommentId,
      handleCommentMenuToggle,
      handleEditStart,
      handleDeleteComment,
      handleFollowToggle,
      handleEditSubmit,
      handleCommentLikeToggle,
      handleReplyToggle,
      handleCommentShare,
      handleReplySubmit,
    });

    return (
      <div
        key={comment.id}
        id={`comment-${comment.id}`}
        className={`${isReply ? styles.commentReply : styles.commentItem} ${shouldIndent ? styles.commentReplyDepth : ''}`}
      >
        <div className={canIndent ? `${styles.commentInner} ${styles.commentReplyInner}` : styles.commentInner}>
          {canIndent && (
            <span className={styles.commentReplyIcon} aria-hidden="true">
              <FiCornerDownRight />
            </span>
          )}
          <div className={styles.commentHeaderRow}>
            <div className={styles.commentProfile}>
              <div className={styles.commentAvatarGroup}>
                <span className={styles.commentAvatar} aria-hidden="true">
                  {comment.author?.profileImageUrl ? (
                    <Image
                      className={styles.commentAvatarImage}
                      src={comment.author.profileImageUrl}
                      alt=""
                      width={32}
                      height={32}
                      unoptimized
                    />
                  ) : (
                    <FaUser />
                  )}
                </span>
                {isAuthor ? <span className={styles.commentAuthorText}>작성자</span> : null}
              </div>
              <div className={styles.commentMeta}>
                <span className={styles.commentAuthor}>
                  {comment.author?.name ?? '익명'} {comment.author?.role ? formatRole(comment.author.role) : ''}
                </span>
                <span className={styles.commentDate}>
                  {formatDate(comment.createdAt)}
                  {comment.updatedAt !== comment.createdAt ? ' (수정됨)' : ''}
                  {comment.author?.followerCount ? ` · 팔로워 ${comment.author.followerCount}` : ''}
                </span>
              </div>
            </div>
            {comment.isOwner || isAdmin ? (
              <div className={styles.commentMoreWrapper}>
                <button
                  type="button"
                  className={styles.commentMoreButton}
                  aria-label="댓글 옵션"
                  onClick={handleMenuToggleClick}
                >
                  <FiMoreHorizontal aria-hidden="true" />
                </button>
                {openCommentMenuId === comment.id ? (
                  <div className={styles.commentMoreMenu} role="menu">
                    {comment.isOwner ? (
                      <button
                        type="button"
                        className={styles.commentMoreItem}
                        role="menuitem"
                        onClick={handleEditStartClick}
                      >
                        <FiEdit2 aria-hidden="true" />
                        수정
                      </button>
                    ) : null}
                    <button
                      type="button"
                      className={styles.commentMoreItem}
                      role="menuitem"
                      onClick={handleDeleteClick}
                    >
                      <FiTrash2 aria-hidden="true" />
                      삭제
                    </button>
                  </div>
                ) : null}
              </div>
            ) : (
              <div className={styles.commentUserActions}>
                <div className={styles.commentMoreWrapper}>
                  <button
                    type="button"
                    className={styles.commentMoreButton}
                    aria-label="댓글 옵션"
                    onClick={handleMenuToggleClick}
                  >
                    <FiMoreHorizontal aria-hidden="true" />
                  </button>
                  {openCommentMenuId === comment.id ? (
                    <div className={styles.commentMoreMenu} role="menu">
                      <button type="button" className={styles.commentMoreItem} role="menuitem" onClick={handleCommentBlock}>
                        <FiSlash aria-hidden="true" />
                        차단
                      </button>
                      <button type="button" className={styles.commentMoreItem} role="menuitem" onClick={handleCommentReport}>
                        <FiFlag aria-hidden="true" />
                        신고
                      </button>
                    </div>
                  ) : null}
                </div>
                <button
                  type="button"
                  className={
                    comment.author?.isFollowing
                      ? `${styles.commentFollowButton} ${styles.commentFollowButtonActive}`
                      : styles.commentFollowButton
                  }
                  onClick={handleFollowClick}
                >
                  {comment.author?.isFollowing ? '팔로잉' : '팔로우'}
                </button>
              </div>
            )}
          </div>
          <div className={styles.commentContent}>
            {editingCommentId === comment.id ? (
              <div className={styles.commentEditForm}>
                <textarea
                  className={`${styles.commentTextarea} ${hasEditingLengthError ? styles.commentTextareaError : ''}`}
                  name="comment-edit"
                  value={editingContent}
                  onChange={handleEditChange}
                />
                <div className={styles.commentEditActions}>
                  {hasEditingLengthError ? <span className={styles.commentError}>1,000자까지 입력 가능해요.</span> : null}
                  <button type="button" className={styles.commentCancelButton} onClick={handleEditCancel} disabled={isUpdating}>
                    취소
                  </button>
                  <button
                    type="button"
                    className={
                      editingContent.trim() ? `${styles.commentButton} ${styles.commentButtonActive}` : styles.commentButton
                    }
                    disabled={!editingContent.trim() || isUpdating || hasEditingLengthError}
                    onClick={handleEditSubmitClick}
                  >
                    수정 완료
                  </button>
                </div>
              </div>
            ) : (
              <p className={styles.commentBody}>
                {splitCommentMentions(comment.content).map((part, index) =>
                  part.type === 'mention' ? (
                    <span key={`${part.value}-${index}`} className={styles.commentMention}>
                      {part.value}
                    </span>
                  ) : (
                    <Fragment key={`${part.value}-${index}`}>{part.value}</Fragment>
                  ),
                )}
              </p>
            )}
            <div className={styles.commentFooter}>
              <button
                type="button"
                className={`${styles.commentActionButton} ${comment.liked ? styles.commentActionButtonLiked : ''}`}
                aria-label="좋아요"
                onClick={handleLikeToggleClick}
              >
                {comment.liked ? <FaHeart aria-hidden="true" /> : <FiHeart aria-hidden="true" />}
                {comment.likeCount > 0 ? (
                  <span className={styles.commentActionValue}>
                    <NumberFlow value={comment.likeCount} />
                  </span>
                ) : null}
              </button>
              <button
                type="button"
                className={styles.commentActionButton}
                aria-label={isReply ? '답글 달기' : '댓글'}
                onClick={handleReplyToggleClick}
              >
                {isReply ? (
                  <>
                    <FiCornerDownRight aria-hidden="true" />
                    <span>답글 달기</span>
                  </>
                ) : (
                  <>
                    <FiMessageCircle aria-hidden="true" />
                    {replyCount > 0 ? (
                      <span className={styles.commentActionValue}>
                        <NumberFlow value={replyCount} />
                      </span>
                    ) : null}
                  </>
                )}
              </button>
              {!isReply && (
                <button
                  type="button"
                  className={styles.commentActionButton}
                  aria-label="공유"
                  onClick={handleShareClick}
                >
                  <FiShare2 aria-hidden="true" />
                </button>
              )}
            </div>
            {!isReply && isRepliesOpen && (
              <div className={styles.commentInlineReply} ref={setReplyFormRef(rootCommentId)}>
                <span className={styles.commentInlineIcon} aria-hidden="true">
                  <FiCornerDownRight />
                </span>
                <span className={styles.commentAvatar} aria-hidden="true">
                  {comment.author?.profileImageUrl ? (
                    <Image
                      className={styles.commentAvatarImage}
                      src={comment.author.profileImageUrl}
                      alt=""
                      width={32}
                      height={32}
                      unoptimized
                    />
                  ) : (
                    <FaUser />
                  )}
                </span>
                <div className={styles.commentInlineBody}>
                  <div className={styles.commentTextareaWrapper}>
                    <div
                      className={`${styles.commentEditable} ${hasReplyLengthError ? styles.commentTextareaError : ''}`}
                      role="textbox"
                      aria-multiline="true"
                      aria-label="답글 입력"
                      data-placeholder={accessToken ? '답글을 의견을 남겨보세요.' : '로그인 후 답글을 작성할 수 있어요.'}
                      ref={setReplyTextareaRef(rootCommentId)}
                      contentEditable
                      suppressContentEditableWarning
                      onInput={handleReplyInput(rootCommentId)}
                      onKeyUp={syncReplyMentionQuery(rootCommentId)}
                      onMouseUp={syncReplyMentionQuery(rootCommentId)}
                      onCompositionStart={handleReplyCompositionStart(rootCommentId)}
                      onCompositionEnd={handleReplyCompositionEnd(rootCommentId)}
                      onBlur={handleReplyBlur(rootCommentId)}
                    />
                    {isReplyMentionOpen ? (
                      <div className={styles.commentMentionList} role="listbox">
                        {replyMentionList.map(name => (
                          <button
                            key={name}
                            type="button"
                            role="option"
                            aria-selected="false"
                            className={styles.commentMentionItem}
                            onMouseDown={handleReplyMentionSelect(rootCommentId, name)}
                          >
                            <span className={styles.commentMentionAvatar} aria-hidden="true" />
                            <span className={styles.commentMentionTextGroup}>
                              {renderMentionLabel(name, replyState.mentionQuery)}
                            </span>
                            {renderMentionRole(name)}
                          </button>
                        ))}
                      </div>
                    ) : null}
                    <button
                      type="button"
                      className={
                        replyState.content.trim()
                          ? `${styles.commentInlineSubmit} ${styles.commentInlineSubmitActive}`
                          : styles.commentInlineSubmit
                      }
                      disabled={!replyState.content.trim() || hasReplyLengthError}
                      onClick={handleReplySubmitClick}
                    >
                      답글 등록
                    </button>
                  </div>
                  {hasReplyLengthError ? (
                    <div className={styles.commentInlineActions}>
                      <span className={styles.commentError}>1,000자까지 입력 가능해요.</span>
                    </div>
                  ) : null}
                </div>
              </div>
            )}
          </div>
        </div>
        {!isReply && isRepliesOpen && replies.length > 0 && (
          <div className={styles.commentRepliesContainer}>
            {replies.map(reply => (
              <Fragment key={reply.id}>{renderCommentItem(reply, true, depth + 1, rootCommentId)}</Fragment>
            ))}
          </div>
        )}
      </div>
    );
  };

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
                  <span className={styles.commentMentionTextGroup}>{renderMentionLabel(name, commentMentionQuery)}</span>
                  {renderMentionRole(name)}
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
                {index > 0 && <div className={styles.commentDividerLine} />}
                {renderCommentItem(comment, false, 0)}
              </Fragment>
            ))}
          </>
        ) : null}
      </div>
    </section>
  );
};
