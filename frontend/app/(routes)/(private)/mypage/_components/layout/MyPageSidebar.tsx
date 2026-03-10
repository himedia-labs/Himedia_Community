import Link from 'next/link';

import { MYPAGE_TABS } from '@/app/shared/constants/config/mypage.config';

import styles from '@/app/(routes)/(private)/mypage/MyPage.module.css';

import type { MyPageSidebarProps } from '@/app/shared/types/mypage';

/**
 * 마이페이지 사이드바
 * @description 현재 탭 기준으로 좌측 메뉴를 렌더링합니다.
 */
export default function MyPageSidebar({ activeTab }: MyPageSidebarProps) {
  // 메뉴 그룹
  const activityTabs = MYPAGE_TABS.slice(1, 4);
  const reactionTabs = MYPAGE_TABS.slice(4, 6);
  const settingsTab = MYPAGE_TABS[6];
  const profileTab = MYPAGE_TABS[0];

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
          {activityTabs.map(tab => (
            <Link
              key={tab.key}
              className={activeTab === tab.key ? `${styles.listLink} ${styles.listLinkActive}` : styles.listLink}
              href={tab.href}
            >
              {tab.label}
            </Link>
          ))}
          <div className={styles.listDividerLine} aria-hidden="true" />
          <span className={styles.listGroupTitle}>반응</span>
          {reactionTabs.map(tab => (
            <Link
              key={tab.key}
              className={activeTab === tab.key ? `${styles.listLink} ${styles.listLinkActive}` : styles.listLink}
              href={tab.href}
            >
              {tab.label}
            </Link>
          ))}
          <div className={styles.listDividerLine} aria-hidden="true" />
          <span className={styles.listGroupTitle}>설정</span>
          <Link
            className={activeTab === settingsTab.key ? `${styles.listLink} ${styles.listLinkActive}` : styles.listLink}
            href={settingsTab.href}
          >
            {settingsTab.label}
          </Link>
        </div>
      </nav>
    </aside>
  );
}
