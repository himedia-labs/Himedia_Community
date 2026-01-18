'use client';

import { useCallback, useEffect, useMemo, useRef } from 'react';

import { useQueryClient } from '@tanstack/react-query';
import Image from 'next/image';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { FiEye, FiHeart, FiShare2 } from 'react-icons/fi';
import Skeleton from 'react-loading-skeleton';

import { useSharePostMutation, useViewPostMutation } from '@/app/api/posts/posts.mutations';
import { usePostDetailQuery } from '@/app/api/posts/posts.queries';
import { postsKeys } from '@/app/api/posts/posts.keys';
import { useToast } from '@/app/shared/components/toast/toast';
import { POST_DETAIL_MESSAGES } from '@/app/shared/constants/messages/postDetail.message';
import { renderMarkdownPreview } from '@/app/shared/utils/markdownPreview';

import 'react-loading-skeleton/dist/skeleton.css';
import styles from './PostDetail.module.css';
import type { PostDetailResponse } from '@/app/shared/types/post';

const formatDate = (value?: string | null) => {
  if (!value) return '--';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return '--';
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}.${month}.${day}`;
};

const copyToClipboard = async (value: string) => {
  if (navigator?.clipboard?.writeText) {
    await navigator.clipboard.writeText(value);
    return;
  }

  const textarea = document.createElement('textarea');
  textarea.value = value;
  textarea.readOnly = true;
  textarea.style.position = 'fixed';
  textarea.style.opacity = '0';
  document.body.appendChild(textarea);
  textarea.select();

  const copied = document.execCommand('copy');
  document.body.removeChild(textarea);

  if (!copied) {
    throw new Error('COPY_FAILED');
  }
};

export default function PostDetailPage() {
  // shared hooks
  const { showToast } = useToast();
  const queryClient = useQueryClient();
  const viewTimerRef = useRef<number | null>(null);
  const viewedPostIdRef = useRef<string | null>(null);
  const { mutateAsync: viewPost } = useViewPostMutation();
  const { mutateAsync: sharePost } = useSharePostMutation();

  // route data
  const params = useParams();
  const postId = typeof params?.postId === 'string' ? params.postId : '';
  const { data, isLoading, isError } = usePostDetailQuery(postId, { enabled: Boolean(postId) });

  // derived data
  const shareCount = data?.shareCount ?? 0;
  const thumbnailUrl = data?.thumbnailUrl ?? null;
  const hasThumbnail = Boolean(thumbnailUrl);
  const previewContent = useMemo(() => renderMarkdownPreview(data?.content ?? ''), [data?.content]);

  const handleShareCopy = useCallback(async () => {
    if (!postId) return;
    const link = window.location.href;

    try {
      await copyToClipboard(link);
      showToast({ message: POST_DETAIL_MESSAGES.SHARE_COPY_SUCCESS, type: 'success' });
    } catch {
      showToast({ message: POST_DETAIL_MESSAGES.SHARE_COPY_FAILURE, type: 'error' });
      return;
    }

    try {
      const response = await sharePost(postId);
      queryClient.setQueryData<PostDetailResponse | undefined>(postsKeys.detail(postId), previous => {
        if (!previous) return previous;
        return { ...previous, shareCount: response.shareCount };
      });
    } catch {
      showToast({ message: POST_DETAIL_MESSAGES.SHARE_COUNT_FAILURE, type: 'warning' });
    }
  }, [postId, queryClient, sharePost, showToast]);

  useEffect(() => {
    if (!postId || !data) return;
    if (viewedPostIdRef.current === postId) return;

    if (viewTimerRef.current) {
      window.clearTimeout(viewTimerRef.current);
    }

    viewTimerRef.current = window.setTimeout(() => {
      if (viewedPostIdRef.current === postId) return;
      viewedPostIdRef.current = postId;

      viewPost(postId)
        .then(response => {
          queryClient.setQueryData<PostDetailResponse | undefined>(postsKeys.detail(postId), previous => {
            if (!previous) return previous;
            return { ...previous, viewCount: response.viewCount };
          });
        })
        .catch(() => null);
    }, 10000);

    return () => {
      if (viewTimerRef.current) {
        window.clearTimeout(viewTimerRef.current);
      }
    };
  }, [data, postId, queryClient, viewPost]);

  if (isLoading) {
    return (
      <section className={styles.container} aria-label="게시물 상세">
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
        <div className={styles.header}>
          <Skeleton width={120} height={12} />
          <Skeleton width="70%" height={42} />
          <Skeleton width={220} height={14} />
        </div>
        <div className={styles.body}>
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
      <aside className={styles.actions} aria-label="게시물 반응">
        <div className={`${styles.actionsInner} ${hasThumbnail ? '' : styles.actionsNoThumb}`}>
          <button type="button" className={styles.actionButton} aria-label="조회수">
            <FiEye aria-hidden="true" />
            <span className={styles.actionValue}>{data.viewCount.toLocaleString()}</span>
          </button>
          <button type="button" className={styles.actionButton} aria-label="좋아요">
            <FiHeart aria-hidden="true" />
            <span className={styles.actionValue}>{data.likeCount.toLocaleString()}</span>
          </button>
          <button type="button" className={styles.actionButton} onClick={handleShareCopy} aria-label="공유">
            <FiShare2 aria-hidden="true" />
            <span className={styles.actionValue}>{shareCount.toLocaleString()}</span>
          </button>
        </div>
      </aside>

      <div className={styles.header}>
        <div className={styles.category}>{data.category?.name ?? 'ALL'}</div>
        <h1 className={styles.title}>{data.title}</h1>
        <div className={styles.metaRow}>
          <span className={styles.metaItem}>{formatDate(data.publishedAt ?? data.createdAt)}</span>
          <span className={styles.metaDivider} aria-hidden="true">
            ·
          </span>
          <span className={styles.metaItem}>{data.author?.name ?? '익명'}</span>
        </div>
      </div>

      <div className={styles.body}>
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
        </div>
      </div>
    </section>
  );
}
