import Link from 'next/link';

import { MYPAGE_TABS } from '@/app/shared/constants/config/mypage.config';

import styles from '@/app/(routes)/(private)/mypage/MyPage.module.css';

import type { MyPageSidebarProps } from '@/app/shared/types/mypage';

/**
 * 마이페이지 사이드바
 * @description 현재 탭 기준으로 좌측 메뉴를 렌더링합니다.
 */
export default function MyPageSidebar({ activeTab }: MyPageSidebarProps) {
  const profileTab = MYPAGE_TABS[0];
  const activityTab = MYPAGE_TABS[1];
  const accountTab = MYPAGE_TABS[2];

  return (
    <aside className={styles.leftPanel}>
      <nav className={styles.list} aria-label="마이페이지 메뉴">
        <div className={styles.listSection}>
          <Link
            className={activeTab === profileTab.key ? `${styles.listLink} ${styles.listLinkActive}` : styles.listLink}
            href={profileTab.href}
          >
            {profileTab.label}
          </Link>
          <div className={styles.listDividerLine} aria-hidden="true" />
          <span className={styles.listGroupTitle}>활동</span>
          <Link
            className={activeTab === activityTab.key ? `${styles.listLink} ${styles.listLinkActive}` : styles.listLink}
            href={activityTab.href}
          >
            {activityTab.label}
          </Link>
          <div className={styles.listDividerLine} aria-hidden="true" />
          <span className={styles.listGroupTitle}>설정</span>
          <Link
            className={activeTab === accountTab.key ? `${styles.listLink} ${styles.listLinkActive}` : styles.listLink}
            href={accountTab.href}
          >
            {accountTab.label}
          </Link>
        </div>
      </nav>
    </aside>
  );
}
