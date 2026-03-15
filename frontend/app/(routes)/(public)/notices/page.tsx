'use client';

import Link from 'next/link';
import { useSearchParams } from 'next/navigation';

import NoticesAnnouncementsSection from '@/app/(routes)/(public)/notices/_components/NoticesAnnouncementsSection';
import NoticesUpdatesSection from '@/app/(routes)/(public)/notices/_components/NoticesUpdatesSection';
import { NOTICE_PAGE_TABS } from '@/app/(routes)/(public)/notices/_constants/noticesPage.constants';
import { useNoticesQuery } from '@/app/api/notices/notices.queries';

import styles from '@/app/(routes)/(public)/notices/NoticesPage.module.css';

/**
 * 공지사항 페이지
 * @description 공지사항과 업데이트 내역 탭 중 현재 선택된 화면을 렌더링합니다.
 */
export default function NoticesPage() {
  const searchParams = useSearchParams();
  const rawView = searchParams.get('view');
  const activeView = rawView === 'updates' ? 'updates' : 'announcements';

  const { data } = useNoticesQuery();
  const announcements = data?.announcements ?? [];
  const updates = data?.updates ?? [];

  return (
    <main className={styles.page}>
      <section className={styles.shell} aria-label="공지사항">
        <header className={styles.hero}>
          <nav className={styles.tabs} aria-label="공지사항 탭">
            {NOTICE_PAGE_TABS.map(tab => (
              <Link
                key={tab.key}
                href={tab.href}
                className={activeView === tab.key ? `${styles.tabButton} ${styles.tabButtonActive}` : styles.tabButton}
                aria-current={activeView === tab.key ? 'page' : undefined}
              >
                {tab.label}
              </Link>
            ))}
          </nav>
        </header>

        {activeView === 'announcements' ? (
          <NoticesAnnouncementsSection notices={announcements} />
        ) : (
          <NoticesUpdatesSection releases={updates} />
        )}
      </section>
    </main>
  );
}
