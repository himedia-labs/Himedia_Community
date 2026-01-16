'use client';

import { useMemo } from 'react';

import Image from 'next/image';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { FiEye, FiHeart } from 'react-icons/fi';

import { usePostDetailQuery } from '@/app/api/posts/posts.queries';
import { renderMarkdownPreview } from '@/app/shared/utils/markdownPreview';

import styles from './PostDetail.module.css';

const formatDate = (value?: string | null) => {
  if (!value) return '--';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return '--';
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}.${month}.${day}`;
};

export default function PostDetailPage() {
  const params = useParams();
  const postId = typeof params?.postId === 'string' ? params.postId : '';
  const { data, isLoading, isError } = usePostDetailQuery(postId, { enabled: Boolean(postId) });
  const previewContent = useMemo(() => renderMarkdownPreview(data?.content ?? ''), [data?.content]);

  if (isLoading) {
    return (
      <section className={styles.container} aria-label="게시물 상세">
        <div className={styles.loading}>게시물을 불러오는 중입니다...</div>
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
          <span className={styles.metaItem}>{data.author?.name ?? '익명'}</span>
        </div>
        <div className={styles.statsRow}>
          <span className={styles.statItem}>
            <FiEye aria-hidden="true" /> {data.viewCount.toLocaleString()}
          </span>
          <span className={styles.statItem}>
            <FiHeart aria-hidden="true" /> {data.likeCount.toLocaleString()}
          </span>
        </div>
      </div>

      {data.thumbnailUrl ? (
        <div className={styles.thumbnail}>
          <Image
            src={data.thumbnailUrl}
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
    </section>
  );
}
