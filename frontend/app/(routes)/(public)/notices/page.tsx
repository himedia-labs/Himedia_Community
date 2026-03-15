import Link from 'next/link';

import NoticesAnnouncementsSection from '@/app/(routes)/(public)/notices/_components/NoticesAnnouncementsSection';
import NoticesUpdatesSection from '@/app/(routes)/(public)/notices/_components/NoticesUpdatesSection';
import { NOTICE_PAGE_TABS } from '@/app/(routes)/(public)/notices/_constants/noticesPage.constants';
import { fetchNoticesPageData } from '@/app/(routes)/(public)/notices/_utils';
import styles from '@/app/(routes)/(public)/notices/NoticesPage.module.css';

import type { Metadata } from 'next';
import type { NoticesPageProps } from '@/app/shared/types/notices';

export const metadata: Metadata = {
  title: '공지사항',
};

/**
 * 공지사항 페이지
 * @description 공지사항과 업데이트 내역 탭 중 현재 선택된 화면을 렌더링합니다.
 */
export default async function NoticesPage({ searchParams }: NoticesPageProps) {
  const noticesPageData = await fetchNoticesPageData();
  const resolvedSearchParams = searchParams ? await searchParams : undefined;
  const rawView = Array.isArray(resolvedSearchParams?.view)
    ? resolvedSearchParams?.view[0]
    : resolvedSearchParams?.view;
  const activeView = rawView === 'updates' ? 'updates' : 'announcements';

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
          <NoticesAnnouncementsSection notices={noticesPageData.announcements} />
        ) : (
          <NoticesUpdatesSection releases={noticesPageData.updates} />
        )}
      </section>
    </main>
  );
}
