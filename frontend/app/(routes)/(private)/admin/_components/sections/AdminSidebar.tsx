import Link from 'next/link';
import Image from 'next/image';

import { ADMIN_SIDEBAR_SECTIONS } from '@/app/shared/constants/config/admin.config';

import styles from '@/app/(routes)/(private)/admin/AdminPage.module.css';

import type { AdminSidebarProps } from '@/app/shared/types/admin';

/**
 * 관리자 사이드바
 * @description 관리자 메뉴 이동과 브랜드 영역을 렌더링합니다.
 */
export default function AdminSidebar({ selectedMenu, handleMenuButtonClick }: AdminSidebarProps) {
  return (
    <aside className={styles.sidebar} aria-label="관리자 사이드바">
      <Link href="/" className={styles.sidebarBrand}>
        <span className={styles.brandMark}>
          <Image src="/icon/logo.png" alt="하이미디어 로고" fill sizes="40px" draggable={false} />
        </span>
        <span className={styles.brandText}>
          하이미디어커뮤니티
          <span className={styles.brandSub}>HIMEDIA COMMUNITY</span>
        </span>
      </Link>
      <nav className={styles.sidebarNav}>
        {ADMIN_SIDEBAR_SECTIONS.map(section => (
          <div key={section.label} className={styles.sidebarSection}>
            <p className={styles.sidebarSectionLabel}>{section.label}</p>
            {section.items.map(item => {
              const Icon = item.Icon;

              return (
                <button
                  key={item.menuLabel}
                  type="button"
                  className={`${styles.sidebarItem} ${selectedMenu === item.menuLabel ? styles.sidebarItemActive : ''}`}
                  data-menu-label={item.menuLabel}
                  onClick={handleMenuButtonClick}
                >
                  <Icon aria-hidden="true" />
                  {item.text}
                </button>
              );
            })}
          </div>
        ))}
      </nav>
    </aside>
  );
}
