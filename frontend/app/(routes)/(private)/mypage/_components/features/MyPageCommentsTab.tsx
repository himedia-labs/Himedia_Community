import { Fragment } from 'react';

import Link from 'next/link';
import Image from 'next/image';

import { FaUser } from 'react-icons/fa';
import { FiClock, FiEdit2, FiHeart, FiMessageCircle, FiMoreHorizontal, FiTrash2, FiTrendingUp } from 'react-icons/fi';

import { COMMENT_MAX_LENGTH_MESSAGE } from '@/app/shared/constants/config/mypage.config';

import EmptyState from '@/app/shared/components/empty/EmptyState';
import { splitCommentMentions } from '@/app/shared/utils/comment';
import { formatDate } from '@/app/shared/utils/date';

import {
  stopMenuPropagation,
  createHandleDeleteButtonClick,
  createHandleEditStartButtonClick,
  createHandleEditSubmitButtonClick,
  createHandleCommentMenuButtonClick,
} from '@/app/(routes)/(private)/mypage/_handlers';
import { MyPageCommentsSkeleton } from '@/app/(routes)/(private)/mypage/MyPage.skeleton';

import styles from '@/app/(routes)/(private)/mypage/MyPage.module.css';
import commentStyles from '@/app/shared/components/comment/CommentThread.module.css';

import type { MyPageCommentsTabProps } from '@/app/shared/types/mypage';

/**
 * 남긴 댓글 탭
 * @description 사용자가 작성한 댓글 목록을 표시한다
 */
export default function MyPageCommentsTab({
  editingCommentId,
  editingContent,
  hasEditingLengthError,
  isDeleting,
  isMyCommentsListLoading,
  isUpdating,
  myComments,
  openCommentMenuId,
  profileAvatarUrl,
  sortKey,
  sortedComments,
  handleCommentMenuToggle,
  handleDeleteComment,
  handleEditCancel,
  handleEditChange,
  handleEditStart,
  handleEditSubmit,
  handleSortToggle,
}: MyPageCommentsTabProps) {
  const handleCommentMenuButtonClick = createHandleCommentMenuButtonClick(handleCommentMenuToggle);
  const handleEditStartButtonClick = createHandleEditStartButtonClick(handleEditStart);
  const handleDeleteButtonClick = createHandleDeleteButtonClick(handleDeleteComment);
  const handleEditSubmitButtonClick = createHandleEditSubmitButtonClick(handleEditSubmit);

  if (isMyCommentsListLoading) {
    return <MyPageCommentsSkeleton />;
  }

  return (
    <>
      <div className={styles.settingsRow}>
        <span className={styles.settingsLabel}>남긴 댓글</span>
        <div className={styles.settingsSortGroup}>
          <button
            type="button"
            className={`${styles.settingsSortButton} ${styles.settingsSortButtonActive}`}
            onClick={handleSortToggle}
          >
            {sortKey === 'popular' ? (
              <>
                <FiTrendingUp className={styles.settingsSortIcon} aria-hidden="true" />
                인기순
              </>
            ) : (
              <>
                <FiClock className={styles.settingsSortIcon} aria-hidden="true" />
                최신순
              </>
            )}
          </button>
        </div>
      </div>
      {myComments.length ? (
        <div className={commentStyles.commentList}>
          {sortedComments.map((comment, index) => {
            const postId = comment.post?.id ?? '';
            const postTitle = comment.post?.title ?? '게시글 없음';
            const commentLabel = comment.parentId ? '남긴 대댓글' : '남긴 댓글';
            const commentLink = postId ? `/posts/${postId}#comment-${comment.id}` : '';
            const commentDate = formatDate(comment.createdAt);
            const isEditing = editingCommentId === comment.id;
            const isLinkEnabled = Boolean(commentLink) && !isEditing;
            const commentPostLabel = `'${postTitle}'에 ${commentLabel}`;

            return (
              <Fragment key={comment.id}>
                <div className={commentStyles.commentItem} id={`comment-${comment.id}`}>
                  <div className={commentStyles.commentInner}>
                    <div className={commentStyles.commentHeaderRow}>
                      <div className={commentStyles.commentProfile}>
                        <div className={commentStyles.commentAvatarGroup}>
                          <span className={commentStyles.commentAvatar} aria-hidden="true">
                            {profileAvatarUrl ? (
                              <Image
                                className={commentStyles.commentAvatarImage}
                                src={profileAvatarUrl}
                                alt=""
                                width={30}
                                height={30}
                                sizes="30px"
                                unoptimized
                              />
                            ) : (
                              <FaUser />
                            )}
                          </span>
                        </div>
                        <div className={commentStyles.commentMeta}>
                          {isLinkEnabled ? (
                            <Link className={commentStyles.commentAuthor} href={commentLink}>
                              {commentPostLabel}
                            </Link>
                          ) : (
                            <span className={commentStyles.commentAuthor}>{commentPostLabel}</span>
                          )}
                          <span className={commentStyles.commentDate}>{commentDate}</span>
                        </div>
                      </div>
                      <div className={commentStyles.commentMoreWrapper}>
                        <button
                          type="button"
                          className={commentStyles.commentMoreButton}
                          aria-label="댓글 옵션"
                          data-comment-id={comment.id}
                          onClick={handleCommentMenuButtonClick}
                        >
                          <FiMoreHorizontal aria-hidden="true" />
                        </button>
                        {openCommentMenuId === comment.id ? (
                          <div className={commentStyles.commentMoreMenu} role="menu" onClick={stopMenuPropagation}>
                            <button
                              type="button"
                              className={commentStyles.commentMoreItem}
                              role="menuitem"
                              data-comment-id={comment.id}
                              data-comment-content={comment.content}
                              onClick={handleEditStartButtonClick}
                            >
                              <FiEdit2 aria-hidden="true" />
                              수정
                            </button>
                            <button
                              type="button"
                              className={commentStyles.commentMoreItem}
                              role="menuitem"
                              disabled={isDeleting}
                              data-post-id={postId}
                              data-comment-id={comment.id}
                              onClick={handleDeleteButtonClick}
                            >
                              <FiTrash2 aria-hidden="true" />
                              삭제
                            </button>
                          </div>
                        ) : null}
                      </div>
                    </div>
                    <div className={commentStyles.commentContent}>
                      {isEditing ? (
                        <div className={commentStyles.commentEditForm} onClick={stopMenuPropagation}>
                          <textarea
                            className={`${commentStyles.commentTextarea} ${
                              hasEditingLengthError ? commentStyles.commentTextareaError : ''
                            }`}
                            name="comment-edit"
                            value={editingContent}
                            onChange={handleEditChange}
                          />
                          <div className={commentStyles.commentEditActions}>
                            {hasEditingLengthError ? (
                              <span className={commentStyles.commentError}>{COMMENT_MAX_LENGTH_MESSAGE}</span>
                            ) : null}
                            <button
                              type="button"
                              className={commentStyles.commentCancelButton}
                              onClick={handleEditCancel}
                              disabled={isUpdating}
                            >
                              취소
                            </button>
                            <button
                              type="button"
                              className={
                                editingContent.trim()
                                  ? `${commentStyles.commentButton} ${commentStyles.commentButtonActive}`
                                  : commentStyles.commentButton
                              }
                              disabled={!editingContent.trim() || isUpdating || hasEditingLengthError}
                              data-post-id={postId}
                              data-comment-id={comment.id}
                              onClick={handleEditSubmitButtonClick}
                            >
                              수정 완료
                            </button>
                          </div>
                        </div>
                      ) : (
                        <>
                          <p className={commentStyles.commentBody}>
                            {splitCommentMentions(comment.content).map((part, partIndex) =>
                              part.type === 'mention' ? (
                                <span key={`${part.value}-${partIndex}`} className={commentStyles.commentMention}>
                                  {part.value}
                                </span>
                              ) : (
                                <Fragment key={`${part.value}-${partIndex}`}>{part.value}</Fragment>
                              ),
                            )}
                          </p>
                          <div className={commentStyles.commentFooter}>
                            <span className={commentStyles.commentActionButton}>
                              <FiHeart aria-hidden="true" />
                              <span className={commentStyles.commentActionValue}>
                                {comment.likeCount.toLocaleString()}
                              </span>
                            </span>
                            <span className={commentStyles.commentActionButton}>
                              <FiMessageCircle aria-hidden="true" />
                              <span className={commentStyles.commentActionValue}>
                                {comment.replyCount.toLocaleString()}
                              </span>
                            </span>
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                </div>
                {index < sortedComments.length - 1 ? (
                  <div className={commentStyles.commentDividerLine} aria-hidden="true" />
                ) : null}
              </Fragment>
            );
          })}
        </div>
      ) : (
        <EmptyState title="아직 남긴 댓글이 없습니다." description="댓글을 남기면 이곳에 표시됩니다." />
      )}
    </>
  );
}
