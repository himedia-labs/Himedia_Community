'use client';

import { useEffect, useMemo, useState } from 'react';

import Image from 'next/image';
import Link from 'next/link';
import { useParams } from 'next/navigation';

import NumberFlow from '@number-flow/react';
import { FaHeart } from 'react-icons/fa';
import { FiClock, FiEye, FiHeart, FiShare2, FiTrendingUp } from 'react-icons/fi';
import Skeleton from 'react-loading-skeleton';

import { usePostCommentsQuery } from '@/app/api/comments/comments.queries';
import { usePostDetailQuery } from '@/app/api/posts/posts.queries';
import { useAuthStore } from '@/app/shared/store/authStore';
import { usePostCommentForm } from './postDetail.comments.hooks';
import { usePostDetailActions } from './postDetail.hooks';
import { formatDate, formatDateTime, formatRole } from './postDetail.utils';

import styles from './PostDetail.module.css';
import 'react-loading-skeleton/dist/skeleton.css';

import type { MouseEvent } from 'react';

/**
 * 게시물 상세 페이지
 * @description 게시물 상세 내용과 반응 정보를 표시
 */
export default function PostDetailPage() {
  // 라우트 데이터
  const params = useParams();
  const postId = typeof params?.postId === 'string' ? params.postId : '';
  const { data, isLoading, isError, refetch } = usePostDetailQuery(postId, { enabled: Boolean(postId) });
  const { data: comments, isLoading: isCommentsLoading } = usePostCommentsQuery(postId, { enabled: Boolean(postId) });
  const { content, handleSubmit, isSubmitting, setContent } = usePostCommentForm(postId);

  // 인증 상태
  const accessToken = useAuthStore(state => state.accessToken);
  const isInitialized = useAuthStore(state => state.isInitialized);

  // 파생 데이터
  const viewCount = data?.viewCount ?? 0;
  const likeCount = data?.likeCount ?? 0;
  const shareCount = data?.shareCount ?? 0;
  const commentCount = data?.commentCount ?? 0;
  const thumbnailUrl = data?.thumbnailUrl ?? null;
  const commentSkeletons = Array.from({ length: 3 });
  const [commentSort, setCommentSort] = useState<'popular' | 'latest'>('latest');
  const sortedComments = useMemo(() => {
    if (!comments?.length) return [];
    if (commentSort === 'popular') {
      return [...comments].sort((a, b) => {
        if (b.likeCount !== a.likeCount) return b.likeCount - a.likeCount;
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      });
    }
    return [...comments].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }, [commentSort, comments]);

  // 액션 핸들러
  const { handleShareCopy, handleLikeClick, previewContent, tocItems } = usePostDetailActions({ data, postId });
  const handleTocClick = (id: string) => (event: MouseEvent<HTMLAnchorElement>) => {
    event.preventDefault();
    const target = document.getElementById(id);
    if (!target) return;
    target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    window.history.replaceState(null, '', `#${id}`);
  };

  // 토큰 갱신
  useEffect(() => {
    if (!isInitialized || !accessToken) return;
    refetch().catch(() => null);
  }, [accessToken, isInitialized, refetch]);

  if (isLoading) {
    return (
      <section className={styles.container} aria-label="게시물 상세">
        <div className={styles.header}>
          <Skeleton width={120} height={12} />
          <Skeleton width="70%" height={42} />
          <Skeleton width={220} height={14} />
        </div>
        <div className={styles.body}>
          <aside className={styles.actions} aria-label="게시물 반응">
            <div className={styles.actionsInner}>
              <div className={styles.actionButton} aria-hidden="true">
                <Skeleton circle height={18} width={18} />
                <Skeleton height={10} width={24} />
              </div>
              <div className={styles.actionButton} aria-hidden="true">
                <Skeleton circle height={18} width={18} />
                <Skeleton height={10} width={24} />
              </div>
              <div className={styles.actionButton} aria-hidden="true">
                <Skeleton circle height={18} width={18} />
                <Skeleton height={10} width={24} />
              </div>
            </div>
          </aside>
          <div className={styles.mainContent}>
            <div className={styles.thumbnail}>
              <Skeleton height={700} borderRadius={16} />
            </div>
            <div className={styles.content}>
              <Skeleton height={16} />
              <Skeleton height={16} />
              <Skeleton height={16} />
              <Skeleton height={16} />
            </div>
          </div>
        </div>
      </section>
    );
  }

  if (isError || !data) {
    return (
      <section className={styles.container} aria-label="게시물 상세">
        <div className={styles.error}>게시물을 불러올 수 없습니다.</div>
        <Link className={styles.backLink} href="/">
          메인으로 돌아가기
        </Link>
      </section>
    );
  }

  return (
    <section className={styles.container} aria-label="게시물 상세">
      <div className={styles.header}>
        <div className={styles.category}>{data.category?.name ?? 'ALL'}</div>
        <h1 className={styles.title}>{data.title}</h1>
        <div className={styles.metaRow}>
          <span className={styles.metaItem}>{formatDate(data.publishedAt ?? data.createdAt)}</span>
          <span className={styles.metaDivider} aria-hidden="true">
            ·
          </span>
          <span className={styles.metaItem}>
            {data.author?.name ?? '익명'} {data.author?.role && `${formatRole(data.author.role)}`}
          </span>
        </div>
      </div>
      <div className={styles.headerDivider} aria-hidden="true" />

      <div className={styles.body}>
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
          {thumbnailUrl ? (
            <div className={styles.thumbnail}>
              <Image
                src={thumbnailUrl}
                alt={data.title}
                width={0}
                height={0}
                sizes="100vw"
                unoptimized
                priority
                style={{ width: '100%', height: 'auto' }}
              />
            </div>
          ) : null}

          <article className={styles.content}>{previewContent}</article>

          <div className={styles.commentDivider} aria-hidden="true" />
          <section aria-label="댓글 작성">
            <div className={styles.commentHeader}>
              <h2 className={styles.commentTitle}>
                댓글 <span className={styles.commentCount}>{commentCount}</span>
              </h2>
            </div>
            <form
              className={styles.commentForm}
              onSubmit={event => {
                event.preventDefault();
                handleSubmit().catch(() => null);
              }}
            >
              <textarea
                className={styles.commentTextarea}
                placeholder={
                  accessToken
                    ? '입력한 댓글은 수정하거나 삭제할 수 없어요. 또한 혐오시설, 욕설, 채팅 등 댓글은 통보없이 삭제될 수 있습니다.'
                    : '로그인 후 댓글을 작성할 수 있어요.'
                }
                value={content}
                onChange={event => setContent(event.target.value)}
                disabled={!accessToken}
              />
              <div className={styles.commentActions}>
                {!accessToken ? (
                  <span className={styles.commentHint}>
                    <Link href={`/login?reason=comment&redirect=/posts/${postId}`}>로그인</Link> 후 이용해주세요.
                  </span>
                ) : null}
                <button
                  type="submit"
                  className={
                    content.trim() ? `${styles.commentButton} ${styles.commentButtonActive}` : styles.commentButton
                  }
                  disabled={!accessToken || isSubmitting}
                >
                  댓글 남기기
                </button>
              </div>
            </form>
            <div className={styles.commentList} aria-live="polite">
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
              ) : sortedComments.length > 0 ? (
                <>
                  <div className={styles.commentListHeader}>
                    <div className={styles.commentSortGroup} role="tablist" aria-label="댓글 정렬">
                      <button
                        type="button"
                        role="tab"
                        aria-selected={commentSort === 'popular'}
                        className={
                          commentSort === 'popular'
                            ? `${styles.commentSortButton} ${styles.commentSortActive}`
                            : styles.commentSortButton
                        }
                        onClick={() => setCommentSort('popular')}
                      >
                        <FiTrendingUp className={styles.commentSortIcon} aria-hidden="true" />
                        인기순
                      </button>
                      <button
                        type="button"
                        role="tab"
                        aria-selected={commentSort === 'latest'}
                        className={
                          commentSort === 'latest'
                            ? `${styles.commentSortButton} ${styles.commentSortActive}`
                            : styles.commentSortButton
                        }
                        onClick={() => setCommentSort('latest')}
                      >
                        <FiClock className={styles.commentSortIcon} aria-hidden="true" />
                        최신순
                      </button>
                    </div>
                  </div>
                  {sortedComments.map(comment => (
                    <div key={comment.id} className={styles.commentItem}>
                      <div className={styles.commentHeaderRow}>
                        <div className={styles.commentProfile}>
                          <span className={styles.commentAvatar} aria-hidden="true" />
                          <div className={styles.commentMeta}>
                            <span className={styles.commentAuthor}>
                              {comment.author?.name ?? '익명'}{' '}
                              {comment.author?.role ? formatRole(comment.author.role) : ''}
                            </span>
                            <span className={styles.commentDate}>{formatDateTime(comment.createdAt)}</span>
                          </div>
                        </div>
                        <button type="button" className={styles.commentFollowButton}>
                          팔로우
                        </button>
                      </div>
                      <p className={styles.commentBody}>{comment.content}</p>
                    </div>
                  ))}
                </>
              ) : null}
            </div>
          </section>
        </div>
      </div>
    </section>
  );
}
