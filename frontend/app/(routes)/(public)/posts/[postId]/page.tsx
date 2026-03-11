'use client';

import { useEffect } from 'react';

import { useParams } from 'next/navigation';

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
  getAuthorProfileBioPreview,
  getAuthorProfilePath,
  buildAuthorSocialLinks,
} from '@/app/(routes)/(public)/posts/[postId]/_utils';
import {
  PostDetailActionsSection,
  PostDetailAuthorSection,
  PostDetailCommentsSection,
  PostDetailError,
  PostDetailHeaderSection,
  PostDetailTocSection,
} from '@/app/(routes)/(public)/posts/[postId]/_components';
import { PostDetailSkeleton } from '@/app/(routes)/(public)/posts/[postId]/PostDetail.skeleton';

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
      <PostDetailHeaderSection
        canManagePost={canManagePost}
        data={data}
        isAdmin={isAdmin}
        isMyPost={isMyPost}
        isPostDeleting={isPostDeleting}
        isForcingPostDraft={isForcingPostDraft}
        isPostMenuOpen={isPostMenuOpen}
        handlePostDelete={handlePostDelete}
        handlePostEdit={handlePostEdit}
        handlePostMenuToggle={handlePostMenuToggle}
        handleForcePostDraft={handleForcePostDraft}
      />
      <div className={styles.headerDivider} aria-hidden="true" />

      <div className={styles.body}>
        {tocItems.length > 0 ? <PostDetailTocSection tocItems={tocItems} handleTocClick={handleTocClick} /> : null}

        <div className={styles.mainContent}>
          <article className={markdownStyles.markdown} data-scroll-progress-end="post-content">
            {previewContent}
          </article>
          <PostDetailActionsSection
            isLiked={data.liked}
            likeCount={likeCount}
            shareCount={shareCount}
            viewCount={viewCount}
            handleLikeClick={handleLikeClick}
            handleShareCopy={handleShareCopy}
          />

          {data.author ? (
            <PostDetailAuthorSection
              author={data.author}
              authorFollowerCount={authorFollowerCount}
              authorFollowingCount={authorFollowingCount}
              authorPostCount={authorPostCount}
              authorProfilePath={authorProfilePath}
              canShowAuthorFollowButton={canShowAuthorFollowButton}
              isAuthorFollowHover={isAuthorFollowHover}
              isAuthorFollowLoading={isAuthorFollowLoading}
              isAuthorFollowing={isAuthorFollowing}
              postAuthorId={postAuthorId}
              authorProfileBioPreview={authorProfileBioPreview}
              authorSocialLinks={authorSocialLinks}
              handleAuthorFollowToggle={handleAuthorFollowToggle}
              handleAuthorFollowMouseEnter={handleAuthorFollowMouseEnter}
              handleAuthorFollowMouseLeave={handleAuthorFollowMouseLeave}
            />
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
