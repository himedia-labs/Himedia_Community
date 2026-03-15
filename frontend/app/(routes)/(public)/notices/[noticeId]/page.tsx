'use client';

import Link from 'next/link';
import { useParams } from 'next/navigation';

import { formatNoticePublishedDate } from '@/app/(routes)/(public)/notices/_utils';
import { useNoticeDetailQuery } from '@/app/api/notices/notices.queries';
import { renderMarkdownPreview } from '@/app/shared/utils/markdown';
import EmptyState from '@/app/shared/components/empty/EmptyState';

import markdownStyles from '@/app/shared/components/markdown-editor/markdown.module.css';
import styles from '@/app/(routes)/(public)/notices/NoticeDetailPage.module.css';

/**
 * 공지사항 상세 페이지
 * @description 공지 상세 데이터를 조회하여 렌더링합니다.
 */
export default function NoticeDetailPage() {
  const params = useParams();
  const noticeId = typeof params?.noticeId === 'string' ? params.noticeId : '';

  const { data: notice, isLoading, isError } = useNoticeDetailQuery(noticeId);

  if (isLoading) {
    return null;
  }

  if (isError || !notice) {
    return (
      <main className={styles.page}>
        <EmptyState title="공지사항을 찾을 수 없습니다." description="존재하지 않거나 삭제된 공지사항입니다." />
      </main>
    );
  }

  return (
    <main className={styles.page}>
      <article className={styles.article}>
        <div className={styles.headerGroup}>
          <div className={styles.actions}>
            <Link href="/notices" className={styles.backButton}>
              목록으로 돌아가기
            </Link>
          </div>
          <header className={styles.header}>
            <h1 className={styles.title}>{notice.title}</h1>
            <p className={styles.date}>{formatNoticePublishedDate(notice.publishedAt)}</p>
          </header>
        </div>
        <section className={`${markdownStyles.markdown} ${styles.body}`}>
          {renderMarkdownPreview(notice.markdownContent ?? '')}
        </section>
      </article>
    </main>
  );
}
