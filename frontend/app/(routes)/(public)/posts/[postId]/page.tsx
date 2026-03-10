'use client';

import { useEffect } from 'react';

import Image from 'next/image';
import Link from 'next/link';
import { useParams } from 'next/navigation';

import { FaHeart } from 'react-icons/fa';
import { CiShoppingTag } from 'react-icons/ci';
import { FaUser } from 'react-icons/fa6';
import NumberFlow from '@number-flow/react';
import { FiEdit2, FiEye, FiExternalLink, FiHeart, FiShare2, FiTrash2, FiMoreHorizontal } from 'react-icons/fi';

import { useAuthStore } from '@/app/shared/store/authStore';
import { useCurrentUserQuery } from '@/app/api/auth/auth.queries';
import { usePostDetailQuery } from '@/app/api/posts/posts.queries';
import { createTocClickHandler } from '@/app/(routes)/(public)/posts/[postId]/_handlers';
import {
  usePostDetailActions,
  usePostDetailComments,
  usePostDetailAuthorFollow,
  usePostDetailPostMenu,
  usePostDetailRefresh,
} from '@/app/(routes)/(public)/posts/[postId]/_hooks';
import {
  formatRole,
  buildAuthorSocialLinks,
  getAuthorProfilePath,
  getAuthorProfileBioPreview,
} from '@/app/(routes)/(public)/posts/[postId]/_utils';
import { buildRelativeTime, formatDate } from '@/app/shared/utils/date';
import {
  PostDetailCommentsSection,
  PostDetailError,
} from '@/app/(routes)/(public)/posts/[postId]/_components';
import { PostDetailSkeleton } from '@/app/(routes)/(public)/posts/[postId]/PostDetail.skeleton';

import 'react-loading-skeleton/dist/skeleton.css';
import markdownStyles from '@/app/shared/components/markdown-editor/markdown.module.css';
import styles from '@/app/(routes)/(public)/posts/[postId]/PostDetail.module.css';

/**
 * 게시물 상세 페이지
 * @description 게시물 상세 내용과 반응 정보를 표시
 */
export default function PostDetailPage() {
  // 라우트 데이터
  const params = useParams();
  const postId = typeof params?.postId === 'string' ? params.postId : '';

  // 인증 상태
  const accessToken = useAuthStore(state => state.accessToken);
  const isInitialized = useAuthStore(state => state.isInitialized);
  const { data: currentUser } = useCurrentUserQuery();

  // 요청 훅
  const isQueryEnabled = Boolean(postId) && isInitialized;
  const { data, isLoading, isError, refetch } = usePostDetailQuery(postId, { enabled: isQueryEnabled });

  // 파생 데이터
  const viewCount = data?.viewCount ?? 0;
  const likeCount = data?.likeCount ?? 0;
  const shareCount = data?.shareCount ?? 0;
  const commentCount = data?.commentCount ?? 0;
  const authorPostCount = data?.author?.postCount ?? 0;
  const authorFollowingCount = data?.author?.followingCount ?? 0;
  const postAuthorId = data?.author?.id ?? null;
  const authorProfilePath = getAuthorProfilePath(data?.author?.profileHandle);
  const isMyPost = Boolean(currentUser?.id && postAuthorId && currentUser.id === postAuthorId);
  const isAdmin = currentUser?.role === 'ADMIN';
  const canManagePost = isMyPost || isAdmin;
  const canShowAuthorFollowButton = Boolean(currentUser?.id && postAuthorId && currentUser.id !== postAuthorId);
  const authorProfileBioPreview = getAuthorProfileBioPreview(data?.author?.profileBio);
  const authorSocialLinks = buildAuthorSocialLinks(data?.author);

  // 메뉴 상태
  const {
    isPostDeleting,
    isForcingPostDraft,
    isPostMenuOpen,
    handlePostEdit,
    handlePostDelete,
    handlePostMenuToggle,
    handleForcePostDraft,
  } = usePostDetailPostMenu({ isAdmin, postId });

  // 팔로우 상태
  const {
    isAuthorFollowing,
    isAuthorFollowHover,
    isAuthorFollowLoading,
    authorFollowerCount,
    handleAuthorFollowToggle,
    handleAuthorFollowMouseEnter,
    handleAuthorFollowMouseLeave,
  } = usePostDetailAuthorFollow({
    author: data?.author,
    accessToken,
    isMyPost,
    postAuthorId,
  });

  // 댓글 상태
  const {
    commentListRef,
    commentMentionQuery,
    commentMentionSuggestions,
    commentSort,
    commentTextareaRef,
    content,
    editingCommentId,
    editingContent,
    getFlattenedReplies,
    getReplyState,
    handleCommentBlur,
    handleCommentChange,
    handleCommentLikeToggle,
    handleCommentMenuToggle,
    handleCommentMentionSelect,
    handleCommentShare,
    handleCommentSortToggle,
    handleCommentSubmit,
    handleCommentBlock,
    handleCommentReport,
    handleDeleteComment,
    handleEditChange,
    handleEditCancel,
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
    getReplyMentionSuggestions,
    mentionRoleMap,
    openCommentMenuId,
    openRepliesIds,
    refetchComments,
    replyCountMap,
    setReplyFormRef,
    setReplyTextareaRef,
    shouldShowCommentMentions,
    syncReplyMentionQuery,
    topLevelComments,
  } = usePostDetailComments({
    accessToken,
    authorName: data?.author?.name,
    authorRole: data?.author?.role,
    isQueryEnabled,
    mentionClassName: styles.commentMentionInput,
    postId,
  });

  // 액션 핸들러
  const { handleShareCopy, handleLikeClick, previewContent, tocItems } = usePostDetailActions({ data, postId });
  const handleTocClick = createTocClickHandler();

  // 토큰 갱신
  usePostDetailRefresh({
    accessToken,
    isInitialized,
    refetchComments,
    refetchPost: refetch,
  });

  // 페이지 제목 설정
  useEffect(() => {
    if (data?.title) {
      document.title = data.title;
    }
    return () => {
      document.title = '하이미디어 커뮤니티';
    };
  }, [data?.title]);

  if (!isInitialized || isLoading) {
    return <PostDetailSkeleton />;
  }

  if (isError || !data) {
    return <PostDetailError />;
  }

  return (
    <section className={styles.container} aria-label="게시물 상세">
      <div className={styles.header}>
        <div className={styles.categoryRow}>
          <div className={styles.category}>{data.category?.name ?? 'ALL'}</div>
          {canManagePost ? (
            <div className={styles.postMoreWrapper}>
              <button
                type="button"
                className={styles.postMoreButton}
                aria-label="게시글 옵션"
                onClick={handlePostMenuToggle}
              >
                <FiMoreHorizontal aria-hidden="true" />
              </button>
              {isPostMenuOpen ? (
                <div className={styles.postMoreMenu} role="menu">
                  {isMyPost ? (
                    <button type="button" className={styles.postMoreItem} role="menuitem" onClick={handlePostEdit}>
                      <FiEdit2 aria-hidden="true" />
                      수정
                    </button>
                  ) : null}
                  {isMyPost ? (
                    <button
                      type="button"
                      className={styles.postMoreItem}
                      role="menuitem"
                      disabled={isPostDeleting}
                      onClick={handlePostDelete}
                    >
                      <FiTrash2 aria-hidden="true" />
                      삭제
                    </button>
                  ) : null}
                  {isAdmin && !isMyPost ? (
                    <button
                      type="button"
                      className={`${styles.postMoreItem} ${styles.postMoreItemDanger}`}
                      role="menuitem"
                      disabled={isForcingPostDraft}
                      onClick={handleForcePostDraft}
                    >
                      <FiTrash2 aria-hidden="true" />
                      강제삭제 (임시저장)
                    </button>
                  ) : null}
                </div>
              ) : null}
            </div>
          ) : null}
        </div>
        <h1 className={styles.title}>{data.title}</h1>
        <div className={styles.metaRow}>
          <span className={styles.metaItem}>
            {formatDate(data.publishedAt ?? data.createdAt)} ({buildRelativeTime(data.publishedAt ?? data.createdAt)})
          </span>
          <span className={styles.metaDivider} aria-hidden="true">
            ·
          </span>
          <span className={styles.metaItem}>
            {data.author?.name ?? '익명'} {data.author?.role && `${formatRole(data.author.role)}`}
          </span>
        </div>
        {data.tags.length ? (
          <div className={styles.metaTagRow}>
            <CiShoppingTag className={styles.metaTagIcon} aria-hidden="true" />
            <div className={styles.metaTagList}>
              {data.tags.map(tag => (
                <span key={tag.id} className={styles.metaTagItem}>
                  #{tag.name}
                </span>
              ))}
            </div>
          </div>
        ) : null}
      </div>
      <div className={styles.headerDivider} aria-hidden="true" />

      <div className={styles.body}>
        {tocItems.length > 0 ? (
          <aside className={styles.toc} aria-label="본문 목차">
            <div className={styles.tocInner}>
              <div className={styles.tocTitle}>목차</div>
              <ul className={styles.tocList}>
                {tocItems.map(item => (
                  <li key={item.id} className={styles.tocItem}>
                    <a
                      href={`#${item.id}`}
                      onClick={handleTocClick(item.id)}
                      className={`${styles.tocLink} ${
                        item.level === 2 ? styles.tocLevel2 : item.level === 3 ? styles.tocLevel3 : ''
                      }`}
                    >
                      {item.text}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </aside>
        ) : null}

        <div className={styles.mainContent}>
          <article className={markdownStyles.markdown} data-scroll-progress-end="post-content">
            {previewContent}
          </article>
          <aside className={styles.actions} aria-label="게시물 반응">
            <div className={styles.actionsInner}>
              <button
                type="button"
                className={`${styles.actionButton} ${data.liked ? styles.actionButtonActive : ''}`}
                aria-label="좋아요"
                onClick={handleLikeClick}
              >
                {data.liked ? <FaHeart aria-hidden="true" /> : <FiHeart aria-hidden="true" />}
                <span className={styles.actionValue}>
                  <NumberFlow value={likeCount} />
                </span>
              </button>
              <div className={styles.actionItem} aria-label="조회수">
                <FiEye aria-hidden="true" />
                <span className={styles.actionValue}>
                  <NumberFlow value={viewCount} />
                </span>
              </div>
              <button type="button" className={styles.actionButton} onClick={handleShareCopy} aria-label="공유">
                <FiShare2 aria-hidden="true" />
                <span className={styles.actionValue}>
                  <NumberFlow value={shareCount} />
                </span>
              </button>
            </div>
          </aside>

          {data.author ? (
            <section className={styles.authorProfileCard} aria-label="작성자 프로필">
              <div className={styles.authorProfileMain}>
                <div className={styles.authorProfileAvatar} aria-hidden="true">
                  {data.author.profileImageUrl ? (
                    <Image
                      className={styles.authorProfileAvatarImage}
                      src={data.author.profileImageUrl}
                      alt=""
                      width={72}
                      height={72}
                      unoptimized
                    />
                  ) : (
                    <FaUser />
                  )}
                </div>
                <div className={styles.authorProfileInfo}>
                  <div className={styles.authorProfileNameRow}>
                    <div className={styles.authorProfileNameGroup}>
                      {authorProfilePath ? (
                        <Link className={styles.authorProfileNameLink} href={authorProfilePath}>
                          <span className={styles.authorProfileName}>{data.author.name}</span>
                          <span className={`${styles.authorProfileRole} ${styles.authorProfileRoleLink}`}>
                            <span>{formatRole(data.author.role)}</span>
                            <FiExternalLink className={styles.authorProfileNameLinkIcon} aria-hidden="true" />
                          </span>
                        </Link>
                      ) : (
                        <>
                          <span className={styles.authorProfileName}>{data.author.name}</span>
                          <span className={styles.authorProfileRole}>{formatRole(data.author.role)}</span>
                        </>
                      )}
                    </div>
                    {canShowAuthorFollowButton ? (
                      <button
                        type="button"
                        className={`${styles.authorFollowButton} ${isAuthorFollowing ? styles.authorFollowButtonActive : ''}`}
                        disabled={isAuthorFollowLoading || !postAuthorId}
                        onMouseEnter={handleAuthorFollowMouseEnter}
                        onMouseLeave={handleAuthorFollowMouseLeave}
                        onClick={handleAuthorFollowToggle}
                      >
                        {isAuthorFollowing ? (isAuthorFollowHover ? '언팔로우' : '팔로잉') : '팔로우'}
                      </button>
                    ) : null}
                  </div>
                  {authorProfileBioPreview ? (
                    <p className={styles.authorProfileBio}>{authorProfileBioPreview}</p>
                  ) : null}
                  <span className={styles.authorProfileMeta}>
                    글 {authorPostCount.toLocaleString()} · 팔로워 {authorFollowerCount.toLocaleString()} · 팔로잉{' '}
                    {authorFollowingCount.toLocaleString()}
                  </span>
                </div>
              </div>
              {authorSocialLinks.length ? (
                <>
                  <div className={styles.authorProfileSocialDivider} aria-hidden="true" />
                  <div className={styles.authorProfileSocialRow} aria-label="작성자 소셜 링크">
                    {authorSocialLinks.map(({ href, label, icon: Icon, external }) => (
                      <a
                        key={label}
                        className={styles.authorProfileSocialLink}
                        href={href}
                        aria-label={label}
                        target={external ? '_blank' : undefined}
                        rel={external ? 'noreferrer' : undefined}
                      >
                        <Icon aria-hidden="true" />
                      </a>
                    ))}
                  </div>
                </>
              ) : null}
            </section>
          ) : null}

          <div className={styles.commentDivider} aria-hidden="true" />
          <PostDetailCommentsSection
            accessToken={accessToken}
            commentCount={commentCount}
            commentListRef={commentListRef}
            commentMentionQuery={commentMentionQuery}
            commentMentionSuggestions={commentMentionSuggestions}
            commentSort={commentSort}
            commentTextareaRef={commentTextareaRef}
            content={content}
            editingCommentId={editingCommentId}
            editingContent={editingContent}
            getFlattenedReplies={getFlattenedReplies}
            getReplyMentionSuggestions={getReplyMentionSuggestions}
            getReplyState={getReplyState}
            handleCommentBlur={handleCommentBlur}
            handleCommentBlock={handleCommentBlock}
            handleCommentChange={handleCommentChange}
            handleCommentLikeToggle={handleCommentLikeToggle}
            handleCommentMenuToggle={handleCommentMenuToggle}
            handleCommentMentionSelect={handleCommentMentionSelect}
            handleCommentReport={handleCommentReport}
            handleCommentShare={handleCommentShare}
            handleCommentSortToggle={handleCommentSortToggle}
            handleCommentSubmit={handleCommentSubmit}
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
            hasLengthError={hasLengthError}
            isCommentsLoading={isCommentsLoading}
            isSubmitting={isSubmitting}
            isUpdating={isUpdating}
            isAdmin={isAdmin}
            mentionRoleMap={mentionRoleMap}
            openCommentMenuId={openCommentMenuId}
            openRepliesIds={openRepliesIds}
            postAuthorId={postAuthorId}
            postId={postId}
            replyCountMap={replyCountMap}
            setReplyFormRef={setReplyFormRef}
            setReplyTextareaRef={setReplyTextareaRef}
            shouldShowCommentMentions={shouldShowCommentMentions}
            syncReplyMentionQuery={syncReplyMentionQuery}
            topLevelComments={topLevelComments}
          />
        </div>
      </div>
    </section>
  );
}
