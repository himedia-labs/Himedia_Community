import Link from 'next/link';
import { notFound } from 'next/navigation';

import { formatNoticePublishedDate } from '@/app/(routes)/(public)/notices/_utils';
import { renderMarkdownPreview } from '@/app/shared/utils/markdown';

import markdownStyles from '@/app/shared/components/markdown-editor/markdown.module.css';
import styles from '@/app/(routes)/(public)/notices/NoticeDetailPage.module.css';

import type { NoticeDetailPageProps, NoticeDetailResponse } from '@/app/shared/types/notices';

/**
 * 공지사항 상세 페이지
 * @description 백엔드 API에서 공지 상세 데이터를 조회하여 렌더링합니다.
 */
export default async function NoticeDetailPage({ params }: NoticeDetailPageProps) {
  const { noticeId } = await params;
  const baseUrl = process.env.NEXT_PUBLIC_HM_API_BASE_URL;

  if (!baseUrl) {
    notFound();
  }

  let notice: NoticeDetailResponse;

  try {
    const res = await fetch(`${baseUrl}/notices/${noticeId}`, {
      cache: 'no-store',
    });

    if (!res.ok) {
      notFound();
    }

    notice = (await res.json()) as NoticeDetailResponse;
  } catch {
    notFound();
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
