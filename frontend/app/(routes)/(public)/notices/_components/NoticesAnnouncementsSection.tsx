import Link from 'next/link';

import EmptyState from '@/app/shared/components/empty/EmptyState';
import styles from '@/app/(routes)/(public)/notices/NoticesPage.module.css';

import type { NoticesAnnouncementsSectionProps } from '@/app/shared/types/notices';

/**
 * 공지사항 섹션
 * @description 레퍼런스의 리스트 구조를 기준으로 공지 목록을 세로 리스트로 렌더링합니다.
 */
export default function NoticesAnnouncementsSection({ notices }: NoticesAnnouncementsSectionProps) {
  if (notices.length === 0) {
    return <EmptyState title="등록된 공지사항이 없습니다." description="새로운 공지사항이 등록되면 여기에 표시됩니다." />;
  }

  return (
    <section className={styles.noticeBoard} aria-label="공지사항 목록">
      <ul className={styles.noticeList}>
        {notices.map(notice => (
          <li key={notice.id} className={styles.noticeItem}>
            <Link href={`/notices/${notice.id}`} className={styles.noticeItemLink}>
              <article className={styles.noticeItemCard}>
                <h3 className={styles.noticeItemTitle}>{notice.title}</h3>
                <p className={styles.noticeItemDate}>{notice.publishedAt}</p>
              </article>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
